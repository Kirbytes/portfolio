'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export function DesktopIcon({ label, icon, onClick, className }: DesktopIconProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 cursor-pointer group w-24 p-2 transition-all active:scale-95",
        className
      )}
    >
      <div className="w-14 h-14 flex items-center justify-center bg-white dark:bg-[#150833] border-2 border-black dark:border-[#05d9e8] shadow-[4px_4px_0_#1a1a1a] dark:shadow-[4px_4px_0_#ff2a6d] group-hover:shadow-[2px_2px_0_#1a1a1a] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
        <div className="text-black dark:text-white">
          {icon}
        </div>
      </div>
      <span className="text-[10px] font-bold text-black dark:text-white bg-white dark:bg-[#150833] border-2 border-transparent group-hover:border-black dark:group-hover:border-[#05d9e8] px-1 text-center leading-tight uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}
