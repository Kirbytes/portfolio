'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type WindowId = 'about' | 'experience' | 'projects' | 'blog' | 'contact' | 'terminal' | 'settings' | 'photos' | 'stats';

interface WindowState {
  id: WindowId;
  isOpen: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
}

interface WindowManagerContextType {
  windows: Record<WindowId, WindowState>;
  activeWindowId: WindowId | null;
  background: string;
  isDarkMode: boolean;
  setBackground: (bg: string) => void;
  toggleDarkMode: () => void;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

const INITIAL_WINDOWS_STATE: Record<WindowId, WindowState> = {
  about: { id: 'about', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
  experience: { id: 'experience', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
  projects: { id: 'projects', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
  blog: { id: 'blog', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
  contact: { id: 'contact', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
  terminal: { id: 'terminal', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
  settings: { id: 'settings', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
  photos: { id: 'photos', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
  stats: { id: 'stats', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 10 },
};

export const WindowProvider = ({ children }: { children: ReactNode }) => {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(INITIAL_WINDOWS_STATE);
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [background, setBackground] = useState('#f8fafc');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], zIndex: newZ, isMinimized: false },
    }));
    setActiveWindowId(id);
  }, [maxZIndex]);

  const openWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false },
    }));
    focusWindow(id);
  }, [focusWindow]);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
    setActiveWindowId(null);
  }, []);

  const maximizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
    }));
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeWindowId,
        background,
        isDarkMode,
        setBackground,
        toggleDarkMode,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowProvider');
  }
  return context;
};
