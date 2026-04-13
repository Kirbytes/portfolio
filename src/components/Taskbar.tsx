'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useWindowManager, WindowId } from '@/context/window-context';
import { 
  User, 
  Briefcase, 
  Settings, 
  LayoutGrid,
  Terminal,
  BarChart3,
  Mail
} from 'lucide-react';

export function Taskbar() {
  const { windows, openWindow, activeWindowId } = useWindowManager();

  const dockItems: { id: WindowId; icon: React.ElementType; label: string }[] = [
    { id: 'about', icon: User, label: 'About' },
    { id: 'projects', icon: LayoutGrid, label: 'Assets' },
    { id: 'experience', icon: Briefcase, label: 'Logs' },
    { id: 'contact', icon: Mail, label: 'Contact' },
    { id: 'stats', icon: BarChart3, label: 'Stats' },
  ];

  return (
    <nav className="fixed left-2 right-2 bottom-2 z-[1000] border border-bg-fourth bg-primary px-3 py-2 md:left-1/2 md:right-auto md:-translate-x-1/2 rounded-xl shadow-lg transition-all dark:shadow-black/50">
      <ul className="flex items-center justify-center gap-2 md:justify-center">
        {dockItems.map((item) => {
          const isActive = activeWindowId === item.id;
          const isOpen = windows[item.id]?.isOpen;

          return (
            <li key={item.id} className="relative flex flex-col items-center gap-1 group">
              <div className="relative inline-flex">
                <button
                  type="button"
                  onClick={() => openWindow(item.id)}
                  aria-label={`Open ${item.label}`}
                  className={cn(
                    "inline-flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center border border-bg-fourth transition-all rounded-lg bg-button-secondary hover:brightness-105",
                    isActive && "ring-2 ring-blue-500 border-transparent",
                    isOpen && !isActive && "border-text-secondary"
                  )}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" strokeWidth={2} />
                </button>

                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-secondary text-primary border border-bg-fourth text-[10px] sm:text-[11px] px-2 py-1 rounded-md pointer-events-none whitespace-nowrap font-medium shadow-sm left-1/2 -translate-x-1/2">
                  {item.label}
                </div>
              </div>
              
              {/* Dot indicator for open apps */}
              {isOpen && (
                <span className="absolute -bottom-1.5 inline-block h-1 w-1 rounded-full bg-text-secondary" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
