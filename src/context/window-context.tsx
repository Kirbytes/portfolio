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
  brightness: number;
  contrast: number;
  saturation: number;
  pixelSize: number;
  isDarkMode: boolean;
  setBackground: (bg: string) => void;
  setBrightness: (val: number) => void;
  setContrast: (val: number) => void;
  setSaturation: (val: number) => void;
  setPixelSize: (val: number) => void;
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
  const [background, setBackground] = useState('dither:{"bg":{"h":228,"s":89,"l":45},"orbs":[{"x":10,"y":10,"c":{"h":184,"s":100,"l":80},"in":30,"out":80},{"x":15,"y":85,"c":{"h":195,"s":100,"l":65},"in":20,"out":60},{"x":55,"y":85,"c":{"h":315,"s":35,"l":35},"in":20,"out":70},{"x":80,"y":40,"c":{"h":210,"s":100,"l":60},"in":10,"out":60},{"x":90,"y":90,"c":{"h":250,"s":45,"l":30},"in":10,"out":55}]}');
  const [brightness, setBrightness] = useState(0); // Offset from 100
  const [contrast, setContrast] = useState(0); // Offset from 100
  const [saturation, setSaturation] = useState(0); // Offset from 100
  const [pixelSize, setPixelSize] = useState(0);
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
        brightness,
        contrast,
        saturation,
        pixelSize,
        isDarkMode,
        setBackground,
        setBrightness,
        setContrast,
        setSaturation,
        setPixelSize,
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
