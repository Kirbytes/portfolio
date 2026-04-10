'use client';

import React from 'react';
import { useWindowManager } from '@/context/window-context';
import { Sun, Moon } from 'lucide-react';
import { useClock } from '@/hooks/use-clock';

export function Headbar() {
  const { time, date } = useClock();
  const { isDarkMode, toggleDarkMode } = useWindowManager();

  return (
    <div className="fixed top-0 left-0 right-0 h-12 bg-transparent flex items-center justify-between px-6 z-[9999] select-none pointer-events-none">
      
      {/* Left items - Wrap in pointer-events-auto */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="brutalist-button px-3 py-1.5 flex items-center gap-2">
          <div className="w-4 h-4 bg-black dark:bg-[#05d9e8] rounded-none flex items-center justify-center text-white dark:text-[#0d0221] text-[10px] font-bold">V</div>
          <span className="text-[12px] font-bold uppercase tracking-wider">Vapor.OS</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-2">
          {['File', 'Edit', 'View'].map(item => (
            <button key={item} className="brutalist-button px-3 py-1 text-[11px] hover:bg-[#00f0ff] dark:hover:bg-[#ff2a6d] dark:hover:text-white transition-colors">
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Right items - Wrap in pointer-events-auto */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <button 
          onClick={toggleDarkMode}
          className="brutalist-button w-8 h-8 flex items-center justify-center"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        
        <div className="brutalist-button px-3 py-1.5 flex items-center gap-3 text-[11px]">
          <span>{date}</span>
          <span className="text-[#ff00ff] dark:text-[#05d9e8]">{time}</span>
        </div>
      </div>
    </div>
  );
}
