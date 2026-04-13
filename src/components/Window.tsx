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

  if (!state?.isOpen) return null;

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
            "fixed window-glass flex flex-col min-w-[320px] min-h-[240px] transition-shadow",
            activeWindowId === id ? "shadow-2xl" : "shadow-md opacity-95",
            className
          )}
        >
          {/* OS-like Title Bar */}
          <div 
            className="h-10 flex flex-row-reverse md:flex-row items-center justify-between px-3 gap-4 border-b border-bg-fourth bg-secondary text-primary select-none cursor-move"
          >
            {/* Window Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
                className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-red-400 hover:bg-red-500 shadow-sm transition-colors text-black/0 hover:text-black/60"
              >
                <X className="w-2.5 h-2.5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 shadow-sm transition-colors text-black/0 hover:text-black/60"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }}
                className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-green-400 hover:bg-green-500 shadow-sm transition-colors text-black/0 hover:text-black/60"
              >
                <Square className="w-2 h-2" />
              </button>
            </div>

            {/* Title */}
            <div className="flex items-center gap-2 font-medium text-xs justify-center absolute left-1/2 -translate-x-1/2">
              {icon && <div className="text-text-secondary w-3.5 h-3.5">{icon}</div>}
              <span className="opacity-80 truncate max-w-[200px]">{title}</span>
            </div>
            
            {/* Empty space to balance flex layout on desktop if needed */}
            <div className="hidden md:block w-16"></div>
          </div>

          <div className="flex-1 overflow-auto bg-primary relative">
            <div className="min-h-full">
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
                className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-[100] flex items-end justify-end p-0.5 group"
                onPointerDown={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
