'use client';

import React from 'react';
import { useWindowManager } from '@/context/window-context';
import { Sun, Moon, Settings } from 'lucide-react';
import { useClock } from '@/hooks/use-clock';

export function Headbar() {
  const { time, date } = useClock();
  const { isDarkMode, toggleDarkMode, openWindow } = useWindowManager();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-9 border-b border-bg-fourth bg-secondary">
      <div className="text-primary flex h-full items-center justify-between px-1.5 text-[12px] sm:px-2 sm:text-[13px]">
        {/* Left Side Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button title="Logo" className="bg-primary border-bg-fourth flex cursor-pointer items-center border px-1 py-0.5 transition hover:bg-primary/80 sm:px-1.5 rounded-sm">
            <div className="bg-[#ea580c] dark:bg-[#f59e0b] inline-flex h-3.5 w-3.5 items-center justify-center text-white text-[8px] font-bold rounded-sm sm:h-4 sm:w-4">
              V
            </div>
          </button>
          
          <div className="relative">
            <button className="cursor-pointer px-1.5 py-0.5 transition-colors font-semibold hover:bg-primary rounded-sm">
              Portfolio
            </button>
          </div>
          <div className="relative hidden sm:block">
            <button className="cursor-pointer px-1.5 py-0.5 transition-colors font-medium hover:bg-primary rounded-sm">
              File
            </button>
          </div>
          <div className="relative">
            <button className="cursor-pointer px-1.5 py-0.5 transition-colors font-medium hover:bg-primary rounded-sm">
              View
            </button>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.02em] sm:gap-3 sm:text-[12px]">
          <div className="relative flex h-full items-center">
            <button 
              onClick={() => openWindow('settings')}
              title="Settings" 
              className="inline-flex h-6 w-6 items-center justify-center px-1 py-0.5 transition-colors hover:bg-primary rounded-sm"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={toggleDarkMode}
              title="Toggle Theme" 
              className="inline-flex h-6 w-6 items-center justify-center px-1 py-0.5 transition-colors hover:bg-primary rounded-sm ml-1"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
          
          <time className="text-right tabular-nums sm:min-w-[132px] flex items-center justify-end">
            <span className="hidden sm:inline mr-2 opacity-70">
              {date}
            </span>
            {time}
          </time>
        </div>
      </div>
    </header>
  );
}
