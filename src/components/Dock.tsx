'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useWindowManager, WindowId } from '@/context/window-context';
import { 
  User, 
  Terminal, 
  FolderOpen, 
  Mail, 
  Settings, 
  Image as ImageIcon,
  Briefcase,
  BookOpen
} from 'lucide-react';

const DOCK_ITEMS: { id: WindowId; icon: any; label: string; color: string }[] = [
  { id: 'about', icon: User, label: 'About', color: 'bg-blue-500' },
  { id: 'experience', icon: Briefcase, label: 'Experience', color: 'bg-gray-700' },
  { id: 'projects', icon: FolderOpen, label: 'Projects', color: 'bg-yellow-500' },
  { id: 'blog', icon: BookOpen, label: 'Blog', color: 'bg-orange-500' },
  { id: 'contact', icon: Mail, label: 'Contact', color: 'bg-green-500' },
  { id: 'terminal', icon: Terminal, label: 'Terminal', color: 'bg-black' },
  { id: 'photos', icon: ImageIcon, label: 'Photos', color: 'bg-purple-500' },
  { id: 'settings', icon: Settings, label: 'Settings', color: 'bg-gray-400' },
];

export function Dock() {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[10000]">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end h-16 gap-3 px-4 pb-2 bg-white/20 dark:bg-black/20 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl"
      >
        {DOCK_ITEMS.map((item) => (
          <DockIcon key={item.id} mouseX={mouseX} {...item} />
        ))}
      </motion.div>
    </div>
  );
}

function DockIcon({ mouseX, id, icon: Icon, label, color }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const { openWindow, windows } = useWindowManager();

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onClick={() => openWindow(id)}
      className={cn(
        "relative aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-95 group",
        color
      )}
    >
      <Icon className="w-1/2 h-1/2 text-white" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
        {label}
      </div>
      {windows[id as WindowId].isOpen && (
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/50 rounded-full" />
      )}
    </motion.div>
  );
}
