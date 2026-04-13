'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const COLORS = {
  primary: '#F59E0B', // Amber 500
  secondary: '#D97706', // Amber 600
  white: '#FFFFFF',
  eye: '#1F2937',
  pink: '#F472B6',
};

// Pixel Cat Frames as SVG
const CatSprite = ({ state, frame }: { state: 'idle' | 'walk', frame: number }) => {
  if (state === 'idle') {
    return (
      <svg width="40" height="40" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
        {/* Tail */}
        <rect x="1" y="10" width="3" height="2" fill={COLORS.primary} />
        <rect x="0" y="11" width="2" height="1" fill={COLORS.secondary} />
        {/* Body */}
        <rect x="4" y="9" width="8" height="5" fill={COLORS.primary} />
        <rect x="5" y="13" width="2" height="1" fill={COLORS.secondary} />
        <rect x="9" y="13" width="2" height="1" fill={COLORS.secondary} />
        {/* Head */}
        <rect x="7" y="3" width="7" height="7" fill={COLORS.primary} />
        {/* Stripes */}
        <rect x="9" y="3" width="3" height="1" fill={COLORS.secondary} />
        <rect x="10" y="4" width="2" height="1" fill={COLORS.secondary} />
        {/* Ears */}
        <rect x="7" y="1" width="2" height="2" fill={COLORS.primary} />
        <rect x="12" y="1" width="2" height="2" fill={COLORS.primary} />
        {/* Eyes */}
        <rect x="9" y="6" width="1" height="1" fill={COLORS.eye} />
        <rect x="12" y="6" width="1" height="1" fill={COLORS.eye} />
        {/* Nose */}
        <rect x="11" y="7" width="1" height="1" fill={COLORS.pink} />
      </svg>
    );
  }

  // Walk Animation (2 frames)
  return (
    <svg width="40" height="40" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      {/* Tail (Higher when walking) */}
      <rect x="0" y={frame === 0 ? "8" : "9"} width="1" height="3" fill={COLORS.primary} />
      <rect x="1" y={frame === 0 ? "7" : "8"} width="2" height="1" fill={COLORS.secondary} />
      {/* Body */}
      <rect x="3" y="8" width="8" height="5" fill={COLORS.primary} />
      {/* Legs (Frame 0) */}
      {frame === 0 ? (
        <>
          <rect x="3" y="13" width="2" height="1" fill={COLORS.secondary} />
          <rect x="9" y="13" width="2" height="1" fill={COLORS.secondary} />
        </>
      ) : (
        <>
          <rect x="4" y="13" width="2" height="1" fill={COLORS.secondary} />
          <rect x="8" y="13" width="2" height="1" fill={COLORS.secondary} />
        </>
      )}
      {/* Head */}
      <rect x="8" y="2" width="7" height="7" fill={COLORS.primary} />
      {/* Ears */}
      <rect x="8" y="0" width="2" height="2" fill={COLORS.primary} />
      <rect x="13" y="0" width="2" height="2" fill={COLORS.primary} />
      {/* Stripes */}
      <rect x="10" y="2" width="3" height="1" fill={COLORS.secondary} />
      {/* Eyes */}
      <rect x="10" y="5" width="1" height="1" fill={COLORS.eye} />
      <rect x="13" y="5" width="1" height="1" fill={COLORS.eye} />
      {/* Nose */}
      <rect x="12" y="6" width="1" height="1" fill={COLORS.pink} />
    </svg>
  );
};

const INITIAL_OUTPUT = [
  '🐱 Meow! I\'m Byte, your orange desktop protector.',
  'I was drawn from your reference images! I roam around this workspace looking for pixel-mice while you\'re busy.',
  '',
  'Type "help" to see what I can do. I can do tricks if you ask!',
  '',
];

const CAT_COMMANDS: Record<string, string | (() => string)> = {
  help: '🐱 Commands: pet, feed, status, about, experience, projects, contact, mood, nap, tricks, whoami, date, clear',
  pet: () => {
    const responses = [
      '🐱 *purrrrrr* ...thank you, that feels nice!',
      '🐱 *nuzzles your hand* Mrrrow~',
      '🐱 *rolls over for belly rubs* ...wait, it\'s a trap! *bites gently*',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },
  feed: () => {
    const foods = [
      '🐱 *munches happily* 🐟 Thanks for the fish!',
      '🐱 *sniffs suspiciously* ...okay fine, I\'ll eat it. 🍖 Nom nom.',
      '🐱 *devours instantly* More? MORE? ...okay I\'m full. 😸',
    ];
    return foods[Math.floor(Math.random() * foods.length)];
  },
  status: '🐱 System Status: Glistening orange fur. Zero bugs detected (I swatted them). Nap level: Critical.',
  mood: () => {
    const moods = ['😸 Feeling orange-tastic!', '😺 Sunbathing in the grid', '😼 Feeling bitey', '😿 Need more attention'];
    return `🐱 Current mood: ${moods[Math.floor(Math.random() * moods.length)]}`;
  },
  nap: '🐱 *stretches* zzZ... zZz... *paws in the air* ...zzZ...',
  tricks: '🐱 *stands on two legs* *flips* *lands on the taskbar* Purrrfect execution. 🏆',
  about: '🐱 My owner is a Digital Architect. I help them debug the web, one paw at a time.',
  experience: '🐱 I\'ve seen them build things at Cyber-Corp, Neon Systems, and Legacy.NET. I mostly slept under their monitor.',
  projects: '🐱 Atlas, Beta, Core, Synth... I\'ve sat on the keyboards for all of them.',
  contact: '🐱 Send notes to hello@vaporlink.dev — I\'ll sit on the notification until they read it. 📭',
  whoami: '🐱 You\'re my guest! I\'m Byte, the pixel cat. Welcome to my screen.',
  date: () => `🐱 It is ${new Date().toLocaleString()}. Time for a recursive nap.`,
};

interface DesktopPetProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function DesktopPet({ containerRef }: DesktopPetProps) {
  const [pos, setPos] = useState({ x: 300, y: 400 });
  const [flip, setFlip] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>(INITIAL_OUTPUT);
  const [frame, setFrame] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const walkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll chat to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  // Random walking behavior
  const startWalking = useCallback(() => {
    if (isChatOpen) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const maxX = rect.width - 100;
    const maxY = rect.height - 200;

    const targetX = Math.max(100, Math.min(maxX, pos.x + (Math.random() - 0.5) * 400));
    const targetY = Math.max(100, Math.min(maxY, pos.y + (Math.random() - 0.5) * 300));

    setIsWalking(true);

    setFlip(targetX < pos.x); // Flip if moving left
    setPos({ x: targetX, y: targetY });

  }, [isChatOpen, pos, containerRef]);

  useEffect(() => {
    const scheduleWalk = () => {
      const delay = 4000 + Math.random() * 6000;
      walkTimeoutRef.current = setTimeout(() => {
        startWalking();
        scheduleWalk();
      }, delay);
    };

    scheduleWalk();
    return () => {
      if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current);
    };
  }, [startWalking]);

  // Animation Frame Toggle
  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(f => (f + 1) % 2);
    }, 200); // Faster animation for walking
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setIsWalking(false);
    setIsChatOpen(!isChatOpen);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();

    if (cmd === 'clear') {
      setOutput([]);
      setInput('');
      return;
    }

    let response = '';
    if (CAT_COMMANDS[cmd]) {
      const result = CAT_COMMANDS[cmd];
      response = typeof result === 'function' ? result() : result;
    } else {
      response = `🐱 *confused mrow* "${cmd}"? Never heard of it. Try "help"!`;
    }

    setOutput(prev => [...prev, `> ${input}`, response, '']);
    setInput('');
  };

  return (
    <>
      {/* The Pixel Cat Sprite */}
      <motion.div
        animate={{ x: pos.x, y: pos.y }}
        transition={{ 
          type: 'tween', 
          duration: isWalking ? Math.abs(pos.x - (pos.x)) * 0.01 + 3 : 0.3, 
          ease: 'linear' 
        }}
        onAnimationComplete={() => setIsWalking(false)}
        onClick={handleClick}
        className="absolute z-[5] cursor-pointer select-none"
      >
        <div className="relative group">
          <div
            className="transition-transform duration-300"
            style={{ transform: flip ? 'scaleX(-1)' : 'scaleX(1)' }}
          >
            <CatSprite state={isWalking ? 'walk' : 'idle'} frame={frame} />
          </div>

          {!isChatOpen && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-secondary text-primary text-[10px] px-2 py-1 rounded-md border border-bg-fourth whitespace-nowrap font-medium shadow-sm">
              Meow? 🐾
            </div>
          )}
        </div>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed z-[1000]"
            style={{
              left: Math.min(pos.x - 80, (containerRef.current?.getBoundingClientRect().width ?? 800) - 380),
              top: Math.max(50, pos.y - 320),
            }}
          >
            <div className="w-[440px] h-[320px] bg-[#1a1b26] border border-[#292e42] shadow-2xl rounded-xl flex flex-col overflow-hidden">
              <div className="h-10 bg-[#16161e] border-b border-[#292e42] flex items-center px-4 select-none cursor-move">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsChatOpen(false); }}
                    className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center group"
                  >
                    <X className="w-2 h-2 opacity-0 group-hover:opacity-100 text-[#1a1b26] transition-opacity" />
                  </button>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="flex-1 text-center pr-12">
                  <span className="text-xs font-mono text-zinc-400">user@workspace:~</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 text-[#c0caf5] font-mono text-[12px] leading-relaxed selection:bg-[#33467c] selection:text-white scrollbar-custom">
                {output.map((line, i) => (
                  <div key={i} className={line.startsWith('>') ? 'text-[#7aa2f7]' : line.startsWith('🐱') ? 'text-[#9ece6a]' : ''}>
                    {line || '\u00A0'}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={handleCommand} className="flex items-center gap-2 px-4 py-2 border-t border-[#292e42] bg-[#16161e]">
                <span className="text-[#bb9af7] text-xs font-mono font-bold">$</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="type a command (try 'help')..."
                  className="bg-transparent border-none outline-none flex-1 text-[#c0caf5] text-[12px] font-mono caret-[#bb9af7] placeholder:text-zinc-600"
                  autoFocus
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
