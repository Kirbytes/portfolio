'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWindowManager, WindowId } from '@/context/window-context';

interface WindowProps {
  id: WindowId;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  initialX?: number;
  initialY?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

export function Window({
  id,
  title,
  children,
  icon,
  className,
  initialX = 100,
  initialY = 100,
  defaultWidth = 500,
  defaultHeight = 400,
}: WindowProps) {
  const { windows, activeWindowId, closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useWindowManager();
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const state = windows[id];

  if (!state.isOpen) return null;

  return (
    <AnimatePresence>
      {!state.isMinimized && (
        <motion.div
          drag
          dragMomentum={false}
          initial={{ opacity: 0, scale: 0.98, x: initialX, y: initialY }}
          animate={{
            opacity: 1,
            scale: 1,
            x: state.isMaximized ? 0 : undefined,
            y: state.isMaximized ? 48 : undefined,
            width: state.isMaximized ? '100vw' : size.width,
            height: state.isMaximized ? 'calc(100vh - 48px - 80px)' : size.height,
          }}
          exit={{ opacity: 0, scale: 0.98 }}
          onPointerDown={() => focusWindow(id)}
          style={{ zIndex: state.zIndex }}
          className={cn(
            "fixed window-glass flex flex-col min-w-[320px] min-h-[240px]",
            activeWindowId === id ? "" : "opacity-95",
            className
          )}
        >
          {/* Neo-brutalist Title Bar */}
          <div className="h-10 flex items-center justify-between px-3 gap-4 border-b-3 border-[var(--window-border)] bg-[var(--window-border)] text-[var(--card)] select-none">
            <div className="flex items-center gap-3">
              {icon && <div>{icon}</div>}
              <span className="text-[12px] font-bold tracking-widest uppercase">{title}</span>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                className="w-6 h-6 flex items-center justify-center bg-[var(--card)] text-[var(--window-border)] border-2 border-[var(--window-border)] hover:bg-[var(--accent-cyan)] transition-colors"
              >
                <Minus className="w-3 h-3 font-bold" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }}
                className="w-6 h-6 flex items-center justify-center bg-[var(--card)] text-[var(--window-border)] border-2 border-[var(--window-border)] hover:bg-[var(--accent-cyan)] transition-colors"
              >
                <Square className="w-2.5 h-2.5 font-bold" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
                className="w-6 h-6 flex items-center justify-center bg-[var(--accent-magenta)] text-white border-2 border-[var(--window-border)] hover:bg-black transition-colors"
              >
                <X className="w-3 h-3 font-bold" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-[var(--card)] p-0 relative">
            <div className="min-h-full pb-6">
              {children}
            </div>
            
            {/* Resize Handle */}
            {!state.isMaximized && (
              <motion.div
                drag
                dragConstraints={{ left: 0, top: 0, right: 0, bottom: 0 }}
                dragElastic={0}
                dragMomentum={false}
                onDrag={(event, info) => {
                  setSize(prev => ({
                    width: Math.max(320, prev.width + info.delta.x),
                    height: Math.max(240, prev.height + info.delta.y)
                  }));
                }}
                className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-[100] flex items-end justify-end p-1 group"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="w-3 h-3 border-r-2 border-b-2 border-black dark:border-[#05d9e8] opacity-30 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
