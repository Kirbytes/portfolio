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
    <button 
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center cursor-pointer text-center w-[92px] gap-1 px-2 py-2 hover:bg-[var(--desktop-file-hover)] rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors",
        className
      )}
    >
      <div className="w-12 h-12 flex items-center justify-center text-white drop-shadow-md">
        {icon}
      </div>
      <span className="max-w-full break-words font-medium leading-tight text-white drop-shadow-md text-[12px] px-1 rounded-sm">
        {label}
      </span>
    </button>
  );
}
