'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useWindowManager, WindowId } from '@/context/window-context';
import { 
  User, 
  Briefcase, 
  Settings, 
  LayoutGrid,
  Terminal
} from 'lucide-react';

export function Taskbar() {
  const { windows, openWindow, activeWindowId } = useWindowManager();

  const dockItems: { id: WindowId; icon: React.ElementType; label: string }[] = [
    { id: 'about', icon: User, label: 'About' },
    { id: 'terminal', icon: Terminal, label: 'System' },
    { id: 'projects', icon: LayoutGrid, label: 'Assets' },
    { id: 'experience', icon: Briefcase, label: 'Logs' },
    { id: 'settings', icon: Settings, label: 'Config' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000]">
      <div className="taskbar-glass px-3 py-2 flex items-center gap-2">
        {dockItems.map((item) => {
          const isActive = activeWindowId === item.id;
          const isOpen = windows[item.id].isOpen;

          return (
            <button
              key={item.id}
              onClick={() => openWindow(item.id)}
              className={cn(
                "relative group w-12 h-12 flex items-center justify-center transition-all bg-white dark:bg-[#150833] border-2 border-transparent hover:border-black dark:hover:border-[#05d9e8]",
                isActive && "border-black dark:border-[#05d9e8] shadow-[2px_2px_0_#1a1a1a] dark:shadow-[2px_2px_0_#ff2a6d] -translate-y-1"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-[#ff00ff] dark:text-[#05d9e8]" : "text-black dark:text-white"
              )} />
              
              {isOpen && (
                <div className="absolute -bottom-2 w-full h-1 bg-[#00f0ff] dark:bg-[#ff2a6d]" />
              )}
              
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] px-2 py-1 pointer-events-none whitespace-nowrap font-bold uppercase tracking-wider shadow-[2px_2px_0_#ff00ff] dark:shadow-[2px_2px_0_#05d9e8]">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
