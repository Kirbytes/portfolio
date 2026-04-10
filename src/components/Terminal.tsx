'use client';

import React, { useState, useRef, useEffect } from 'react';

const INITIAL_OUTPUT = [
  'Vapor.OS [Version 2026.4.10]',
  '(c) 2026 Digital Architect. All rights reserved.',
  '',
  'Welcome to the system terminal. Type "help" for a list of commands.',
  '',
];

const COMMANDS: Record<string, string | (() => string)> = {
  help: 'Available commands: about, experience, projects, contact, clear, date, whoami',
  about: 'John Doe: Digital Architect & Design Engineer. Specialist in minimalist vaporwave systems.',
  experience: 'Log 01: Cyber-Corp (Staff Engineer). Log 02: Neon Systems (UI Research). Log 03: Legacy.net (Intern).',
  projects: 'Asset List: Project_Atlas, Module_Beta, Core_Drive, Synth_Shell.',
  contact: 'Initialize link: john.doe@vaporlink.net',
  whoami: 'visitor@vapor_os',
  date: () => new Date().toString(),
};

export function Terminal() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>(INITIAL_OUTPUT);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    let response = '';

    if (cmd === 'clear') {
      setOutput([]);
      setInput('');
      return;
    }

    if (COMMANDS[cmd]) {
      const result = COMMANDS[cmd];
      response = typeof result === 'function' ? result() : result;
    } else {
      response = `Command not found: ${cmd}. Type "help" for options.`;
    }

    setOutput([...output, `> ${input}`, response, '']);
    setInput('');
  };

  return (
    <div className="bg-black text-[#00ff00] font-mono text-xs p-6 h-full overflow-y-auto selection:bg-[#ff00ff] selection:text-white">
      <div className="mb-4">
        {output.map((line, i) => (
          <div key={i} className={line.startsWith('>') ? 'text-[#ff00ff]' : ''}>
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex gap-2">
        <span className="text-[#05d9e8] font-bold">root@vapor_os:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none outline-none flex-1 text-[#00ff00] caret-[#ff00ff]"
          autoFocus
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
}
