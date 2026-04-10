'use client';

import { useRef } from "react";
import { Headbar } from "@/components/Headbar";
import { Taskbar } from "@/components/Taskbar";
import { Window } from "@/components/Window";
import { DesktopIcon } from "@/components/DesktopIcon";
import { DesktopPet } from "@/components/DesktopPet";
import { useWindowManager } from "@/context/window-context";
import { 
  User, 
  FolderIcon, 
  Mail, 
  History, 
  Settings as SettingsIcon,
  LayoutGrid,
  Code,
  BarChart3,
  ExternalLink
} from "lucide-react";

export default function Home() {
  const { openWindow } = useWindowManager();
  const desktopRef = useRef<HTMLDivElement>(null);

  return (
    <main 
      ref={desktopRef}
      className="relative h-screen w-screen overflow-hidden transition-all duration-700 bg-transparent" 
    >
      <Headbar />
      
      {/* Desktop Icons - Two columns, left aligned */}
      <div className="absolute top-20 left-6 grid grid-cols-2 gap-x-4 gap-y-4 z-10">
        {/* Column 1 */}
        <DesktopIcon label="profile.exe" icon={<User className="w-6 h-6" />} onClick={() => openWindow('about')} />
        <DesktopIcon label="contact.bat" icon={<Mail className="w-6 h-6" />} onClick={() => openWindow('contact')} />
        <DesktopIcon label="logs_dir" icon={<History className="w-6 h-6" />} onClick={() => openWindow('experience')} />
        
        {/* Column 2 */}
        <DesktopIcon label="assets_dir" icon={<FolderIcon className="w-6 h-6" />} onClick={() => openWindow('projects')} />
        <DesktopIcon label="config.sys" icon={<SettingsIcon className="w-6 h-6" />} onClick={() => openWindow('settings')} />
        <DesktopIcon label="stats.log" icon={<BarChart3 className="w-6 h-6" />} onClick={() => openWindow('stats')} />
      </div>

      {/* Desktop Pet - Byte the Cat */}
      <DesktopPet containerRef={desktopRef} />

      {/* About Window */}
      <Window id="about" title="Sys_Profile // John.Doe" icon={<User className="w-3.5 h-3.5" />}>
        <div className="px-8 py-10 max-w-2xl mx-auto">
          <header className="mb-10 border-b-4 border-black dark:border-[#05d9e8] pb-8">
            <h1 className="text-4xl md:text-6xl heading mb-4 font-black uppercase leading-none text-[#ff00ff] dark:text-[#ff2a6d] drop-shadow-[2px_2px_0_#1a1a1a] dark:drop-shadow-[2px_2px_0_#05d9e8]">
              DIGITAL<br/>ARCHITECT
            </h1>
            <p className="text-lg font-bold uppercase tracking-widest bg-black text-white dark:bg-[#05d9e8] dark:text-black inline-block px-2 py-1">v.2026.04</p>
          </header>
          
          <div className="space-y-8">
            <div className="bg-[#00f0ff] dark:bg-[#150833] p-6 border-4 border-black dark:border-[#05d9e8] shadow-[4px_4px_0_#1a1a1a] dark:shadow-[4px_4px_0_#ff2a6d]">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-2 border-b-2 border-black dark:border-[#05d9e8] pb-1">Core Directives</h2>
              <ul className="space-y-3 mt-4 text-sm font-bold">
                <li className="flex gap-2 items-start"><span className="text-[#ff00ff] dark:text-[#05d9e8]">{'>'}</span> Build fast, unbreakable web systems.</li>
                <li className="flex gap-2 items-start"><span className="text-[#ff00ff] dark:text-[#05d9e8]">{'>'}</span> Design brutalist, functional interfaces.</li>
                <li className="flex gap-2 items-start"><span className="text-[#ff00ff] dark:text-[#05d9e8]">{'>'}</span> Embrace the vaporwave aesthetic.</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button className="brutalist-button px-6 py-3 bg-white dark:bg-black">
                Download_CV.exe
              </button>
            </div>
          </div>
        </div>
      </Window>

      {/* Experience Window */}
      <Window id="experience" title="Directory // System_Logs" icon={<History className="w-3.5 h-3.5" />} className="w-[500px]">
        <div className="p-8">
          <h2 className="text-2xl font-black uppercase mb-8 border-l-8 border-[#ff2a6d] pl-4">Work_History</h2>
          <div className="space-y-8">
            {[
              { year: '2024 - PRESENT', role: 'STAFF ENGINEER', company: 'CYBER-CORP' },
              { year: '2022 - 2024', role: 'UI RESEARCHER', company: 'NEON SYSTEMS' },
              { year: '2019 - 2022', role: 'DEV INTERN', company: 'LEGACY.NET' },
            ].map((exp, i) => (
              <div key={i} className="border-2 border-black dark:border-[#05d9e8] p-4 bg-white dark:bg-black/40 hover:bg-[#00f0ff] dark:hover:bg-[#ff2a6d] hover:text-white transition-colors">
                <span className="text-[10px] font-bold opacity-60">[{exp.year}]</span>
                <h3 className="font-black text-lg uppercase leading-tight">{exp.role}</h3>
                <p className="font-bold text-sm tracking-tighter opacity-80">{exp.company}</p>
              </div>
            ))}
          </div>
        </div>
      </Window>

      {/* Projects Window */}
      <Window id="projects" title="Directory // Assets" icon={<LayoutGrid className="w-3.5 h-3.5" />}>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="group bg-white dark:bg-black border-4 border-black dark:border-[#05d9e8] shadow-[4px_4px_0_#ff00ff] dark:shadow-[4px_4px_0_#ff2a6d] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#ff00ff] transition-all cursor-pointer p-4">
                <div className="aspect-video bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjY2NjY2NjIj48L2NpcmNsZT4KPC9zdmc+')] border-2 border-dashed border-black dark:border-[#05d9e8] mb-4 flex items-center justify-center">
                  <Code className="w-8 h-8 text-black dark:text-[#ff2a6d]" />
                </div>
                <h3 className="text-sm font-bold uppercase">MODULE_{i}_BETA</h3>
              </div>
            ))}
          </div>
        </div>
      </Window>

      {/* Settings Window */}
      <Window id="settings" title="Sys_Config.exe" icon={<SettingsIcon className="w-3.5 h-3.5" />}>
         <div className="p-8">
          <h2 className="text-xl font-bold uppercase mb-6 bg-black text-white dark:bg-[#05d9e8] dark:text-black inline-block px-2">Display Module</h2>
          <p className="text-sm border-l-4 border-[#ff00ff] pl-4 mb-4 font-bold">Themes are synchronized with System Clock. Use Top_Headbar for manual Day/Night override.</p>
          <div className="mt-8 pt-8 border-t-2 border-dashed border-black dark:border-white/20">
            <p className="text-[10px] font-mono opacity-60 uppercase tracking-tighter">OS_Core_Status: Stable</p>
            <p className="text-[10px] font-mono opacity-60 uppercase tracking-tighter text-[#ff00ff]">Vapor_Engine: Active</p>
          </div>
         </div>
      </Window>

      {/* Stats Window */}
      <Window id="stats" title="Analytics // Vercel_Metrics" icon={<BarChart3 className="w-3.5 h-3.5" />} defaultWidth={540} defaultHeight={520}>
        <div className="p-8">
          <header className="mb-6 flex items-start justify-between border-b-4 border-black dark:border-[#05d9e8] pb-6">
            <div>
              <h2 className="text-3xl heading font-black uppercase mb-1 flex items-center gap-2">
                VERCEL<span className="text-[#05d9e8]">_</span>ANALYTICS
              </h2>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest text-[#ff00ff] dark:text-[#ff2a6d]">Project: vapor-portfolio-2026</p>
            </div>
            <div className="brutalist-button px-2 py-1 bg-black text-white dark:bg-[#05d9e8] dark:text-black text-[9px]">LIVE_MODE</div>
          </header>

          <div className="space-y-6">
             {/* Connection Checklist */}
             <div className="bg-[#00f0ff]/10 dark:bg-[#150833] border-2 border-dashed border-black dark:border-[#05d9e8] p-4">
                <h3 className="text-[10px] font-bold uppercase mb-3 text-[#ff00ff] dark:text-[#ff2a6d]">Integration Status</h3>
                <div className="space-y-2">
                  {[
                    { step: '1', label: 'Install @vercel/analytics', status: 'COMPLETE' },
                    { step: '2', label: 'Add <Analytics /> to layout', status: 'COMPLETE' },
                    { step: '3', label: 'Deploy & Visit Production', status: 'AWAITING_DEPLOY' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className={s.status === 'COMPLETE' ? "text-[#00ff00]" : "text-yellow-500"}>
                          {s.status === 'COMPLETE' ? '[✓]' : '[ ]'}
                        </span>
                        <span className="opacity-80">STEP_{s.step}: {s.label}</span>
                      </div>
                      <span className={s.status === 'COMPLETE' ? "text-blue-500 font-bold" : "text-slate-500 font-bold"}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
             </div>

             {/* Metrics Mock Grid */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-black border-2 border-black dark:border-[#05d9e8] p-4 shadow-[4px_4px_0_#ff00ff] dark:shadow-[4px_4px_0_#ff2a6d]">
                  <span className="text-[10px] font-bold uppercase opacity-60">Visitors (Global)</span>
                  <div className="text-3xl font-black tabular-nums mt-1 text-[#00f0ff] dark:text-[#05d9e8]">--</div>
                  <p className="text-[9px] mt-2 opacity-40 font-bold uppercase tracking-tighter">Syncing with production...</p>
                </div>
                <div className="bg-white dark:bg-black border-2 border-black dark:border-[#05d9e8] p-4 shadow-[4px_4px_0_#00f0ff] dark:shadow-[4px_4px_0_#05d9e8]">
                  <span className="text-[10px] font-bold uppercase opacity-60">Page Views</span>
                  <div className="text-3xl font-black tabular-nums mt-1 text-[#ff00ff] dark:text-[#ff2a6d]">--</div>
                  <p className="text-[9px] mt-2 opacity-40 font-bold uppercase tracking-tighter">Awaiting first hit...</p>
                </div>
             </div>

             <div className="border-2 border-black dark:border-[#05d9e8] p-4 bg-slate-50 dark:bg-white/5">
                <p className="text-[11px] leading-relaxed font-bold">
                  <span className="text-[#ff00ff] dark:text-[#ff2a6d]">NOTICE:</span> Vercel Web Analytics data is strictly accessible via your project dashboard. 
                  Once you deploy this build, visit your dashboard to see actual visitors, bounce rates, and top pages.
                </p>
                <div className="mt-4 flex gap-2">
                  <button className="brutalist-button flex-1 py-1.5 text-[9px] bg-black text-white hover:bg-[#ff00ff] transition-all">
                    GO TO DASHBOARD ↗
                  </button>
                  <button className="brutalist-button flex-1 py-1.5 text-[9px] bg-white dark:bg-black hover:bg-[#05d9e8] transition-all">
                    RE-SYNC API
                  </button>
                </div>
             </div>
          </div>

          <div className="mt-6 pt-6 border-t-2 border-dashed border-black dark:border-white/10 flex justify-between items-center text-[9px] font-mono opacity-40">
             <span>ENGINE: CLOUD_SYNC_V3</span>
             <span>ID: VERCEL_METRICS_00A</span>
          </div>
        </div>
      </Window>

      {/* Contact Window */}
      <Window id="contact" title="Contact // Send_Message" icon={<Mail className="w-3.5 h-3.5" />} className="w-[480px]">
        <div className="p-8">
          <header className="mb-8 border-b-4 border-black dark:border-[#05d9e8] pb-6">
            <h2 className="text-3xl heading font-black uppercase mb-3">Contact</h2>
            <p className="text-sm font-bold opacity-70 leading-relaxed">
              Send a message directly for project inquiries, collaborations, or just to say hello.
            </p>
          </header>

          <p className="text-xs font-bold uppercase tracking-widest text-[#ff00ff] dark:text-[#05d9e8] mb-6">
            Fill in your details and send your message directly.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: wire up to your email service
              alert('Message sent! (Demo mode — wire up your email address later.)');
            }}
            className="space-y-5"
          >
            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Name</label>
              <input
                type="text"
                placeholder="Your name"
                required
                className="w-full px-4 py-3 bg-white dark:bg-black border-2 border-black dark:border-[#05d9e8] text-sm font-bold outline-none focus:shadow-[3px_3px_0_#ff00ff] dark:focus:shadow-[3px_3px_0_#ff2a6d] transition-shadow placeholder:opacity-40"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-white dark:bg-black border-2 border-black dark:border-[#05d9e8] text-sm font-bold outline-none focus:shadow-[3px_3px_0_#ff00ff] dark:focus:shadow-[3px_3px_0_#ff2a6d] transition-shadow placeholder:opacity-40"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Subject</label>
              <input
                type="text"
                placeholder="Project inquiry"
                required
                className="w-full px-4 py-3 bg-white dark:bg-black border-2 border-black dark:border-[#05d9e8] text-sm font-bold outline-none focus:shadow-[3px_3px_0_#ff00ff] dark:focus:shadow-[3px_3px_0_#ff2a6d] transition-shadow placeholder:opacity-40"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Message</label>
              <textarea
                rows={5}
                placeholder="Write your message here..."
                required
                className="w-full px-4 py-3 bg-white dark:bg-black border-2 border-black dark:border-[#05d9e8] text-sm font-bold outline-none resize-none focus:shadow-[3px_3px_0_#ff00ff] dark:focus:shadow-[3px_3px_0_#ff2a6d] transition-shadow placeholder:opacity-40"
              />
            </div>

            <button
              type="submit"
              className="brutalist-button w-full px-6 py-4 bg-[#ff00ff] dark:bg-[#ff2a6d] text-white text-sm tracking-widest hover:bg-black dark:hover:bg-[#05d9e8] dark:hover:text-black transition-colors"
            >
              SEND MESSAGE →
            </button>
          </form>
        </div>
      </Window>

      <Taskbar />
    </main>
  );
}
