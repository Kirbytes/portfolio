'use client';

import { useRef, useState, useEffect } from "react";
import { Headbar } from "@/components/Headbar";
import { Taskbar } from "@/components/Taskbar";
import { Window } from "@/components/Window";
import { DesktopIcon } from "@/components/DesktopIcon";
import { DesktopPet } from "@/components/DesktopPet";
import { useWindowManager } from "@/context/window-context";
import { cn } from "@/lib/utils";
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
  const { 
    openWindow, 
    brightness, setBrightness, 
    contrast, setContrast,
    saturation, setSaturation,
    pixelSize, setPixelSize,
    background, setBackground 
  } = useWindowManager();
  const desktopRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({ visitors: 0, pageviews: 0, loading: true });

  const backgrounds = [
    { name: 'Orange', value: '#ea580c', type: 'color' },
    { name: 'Blue', value: '#2563eb', type: 'color' },
    { name: 'Fields', value: '/wallpapers/green_wheat_fields_auvers_2013.122.1.jpg', type: 'image' },
    { name: 'Starry', value: '/wallpapers/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg', type: 'image' },
    { name: 'Blossom', value: '/wallpapers/vangoghmuseum-s0176V1962-800.jpg', type: 'image' },
    { name: 'Ocean', value: '/wallpapers/vangoghmuseum-s0117V1962-800.jpg', type: 'image' },
  ];

  const handleBgChange = (bg: typeof backgrounds[0]) => {
    setBackground(bg.value);
    if (bg.type === 'image') {
      setPixelSize(5);
    } else {
      setPixelSize(0);
    }
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        setMetrics({ 
          visitors: data.visitors ?? 0, 
          pageviews: data.pageviews ?? 0, 
          loading: false 
        });
      } catch (err) {
        console.error(err);
        setMetrics(prev => ({ ...prev, loading: false }));
      }
    }
    fetchStats();
  }, []);

  const isImage = background.startsWith('/') || background.startsWith('http');

  return (
    <main 
      ref={desktopRef}
      className="relative h-screen w-screen overflow-hidden transition-all duration-700" 
    >
      {/* SVG Pixelation Filter Definition */}
      <svg className="hidden">
        <filter id="pixelate" x="0" y="0">
          <feFlood x="0" y="0" height={pixelSize} width={pixelSize} />
          <feComposite width={pixelSize} height={pixelSize} />
          <feTile result="a" />
          <feComposite in="SourceGraphic" in2="a" operator="in" />
          <feMorphology operator="dilate" radius={pixelSize / 2} />
        </filter>
      </svg>

      {/* Structured Wallpaper Layer */}
      <div 
        className="absolute inset-0 transition-all duration-700"
        style={{ 
          backgroundColor: isImage ? 'transparent' : background,
          backgroundImage: isImage ? `url(${background})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: `brightness(${100 + brightness}%) contrast(${100 + contrast}%) saturate(${100 + saturation}%) ${pixelSize > 0 ? 'url(#pixelate)' : ''}`
        }}
      />

      <Headbar />
      
      {/* Desktop Icons - Single column, left aligned like macOS */}
      <div className="absolute top-12 left-4 flex flex-col gap-4 z-10 p-2">
        <DesktopIcon label="about.txt" icon={<FolderIcon className="w-8 h-8 fill-zinc-100/20 stroke-white opacity-90 shadow-sm" />} onClick={() => openWindow('about')} />
        <DesktopIcon label="Contact" icon={<Mail className="w-8 h-8 fill-zinc-100/20 stroke-white opacity-90 shadow-sm" />} onClick={() => openWindow('contact')} />
        <DesktopIcon label="History" icon={<FolderIcon className="w-8 h-8 fill-zinc-100/20 stroke-white opacity-90 shadow-sm" />} onClick={() => openWindow('experience')} />
        <DesktopIcon label="Projects" icon={<FolderIcon className="w-8 h-8 fill-zinc-100/20 stroke-white opacity-90 shadow-sm" />} onClick={() => openWindow('projects')} />
        <DesktopIcon label="Stats" icon={<FolderIcon className="w-8 h-8 fill-zinc-100/20 stroke-white opacity-90 shadow-sm" />} onClick={() => openWindow('stats')} />
      </div>

      {/* Desktop Pet - Byte the Cat */}
      <DesktopPet containerRef={desktopRef} />

      {/* About Window */}
      <Window id="about" title="about.txt" icon={<User className="w-3.5 h-3.5" />}>
        <div className="px-8 py-10 max-w-2xl mx-auto">
          <header className="mb-10 pb-8 border-b border-bg-fourth">
            <h1 className="text-3xl md:text-5xl heading mb-4 font-bold leading-tight">
              Software Engineer
            </h1>
            <p className="text-sm font-medium text-text-secondary">Version 2026.04</p>
          </header>
          
          <div className="space-y-8 text-sm">
            <div className="bg-secondary p-6 rounded-xl border border-bg-fourth">
              <h2 className="font-semibold mb-2">Core Directives</h2>
              <ul className="space-y-3 mt-4 text-text-secondary leading-relaxed">
                <li className="flex gap-2 items-start"><span className="text-blue-500">•</span> Build fast, unbreakable web systems.</li>
                <li className="flex gap-2 items-start"><span className="text-blue-500">•</span> Design clean, functional interfaces.</li>
                <li className="flex gap-2 items-start"><span className="text-blue-500">•</span> Embrace minimal aesthetics and smooth user experiences.</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm">
                Download CV
              </button>
            </div>
          </div>
        </div>
      </Window>

      {/* Experience Window */}
      <Window id="experience" title="Work History" icon={<History className="w-3.5 h-3.5" />} className="w-[500px]">
        <div className="p-8">
          <h2 className="text-xl font-semibold mb-6">Experience</h2>
          <div className="space-y-4">
            {[
              { year: '2024 - PRESENT', role: 'Staff Engineer', company: 'Cyber-Corp' },
              { year: '2022 - 2024', role: 'UI Researcher', company: 'Neon Systems' },
              { year: '2019 - 2022', role: 'Dev Intern', company: 'Legacy.net' },
            ].map((exp, i) => (
              <div key={i} className="flex justify-between items-center border border-bg-fourth p-4 bg-secondary rounded-lg hover:border-text-secondary transition-colors cursor-default">
                <div>
                  <h3 className="font-semibold text-base">{exp.role}</h3>
                  <p className="text-sm text-text-secondary mt-1">{exp.company}</p>
                </div>
                <span className="text-xs font-mono text-text-secondary bg-bg-third px-2 py-1 rounded-md">{exp.year}</span>
              </div>
            ))}
          </div>
        </div>
      </Window>

      {/* Projects Window */}
      <Window id="projects" title="Projects.dir" icon={<LayoutGrid className="w-3.5 h-3.5" />}>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="group bg-secondary border border-bg-fourth rounded-xl hover:shadow-md transition-all cursor-pointer p-1 overflow-hidden">
                <div className="aspect-video bg-bg-third rounded-lg mb-0 flex items-center justify-center">
                  <Code className="w-6 h-6 text-text-secondary" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold">Module {i} Beta</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Window>

      {/* Settings Window */}
      <Window id="settings" title="System Settings" icon={<SettingsIcon className="w-3.5 h-3.5" />}>
         <div className="p-8 space-y-8">
          <section>
            <h2 className="text-sm font-semibold mb-4 uppercase tracking-wider text-text-secondary">Wallpaper Selection</h2>
            <div className="grid grid-cols-3 gap-3">
              {backgrounds.map((bg) => (
                <button
                  key={bg.value}
                  onClick={() => handleBgChange(bg)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-2 rounded-lg border transition-all",
                    background === bg.value ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-bg-fourth hover:border-text-secondary"
                  )}
                >
                  <div 
                    className="w-full aspect-video rounded-md" 
                    style={{ 
                      backgroundColor: bg.type === 'color' ? bg.value : 'transparent',
                      backgroundImage: bg.type === 'image' ? `url(${bg.value})` : 'none',
                      backgroundSize: 'cover'
                    }} 
                  />
                  <span className="text-[10px] font-medium">{bg.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Pixel Size</h2>
                <span className="text-[10px] font-mono">{pixelSize}px</span>
              </div>
              <input 
                type="range" min="0" max="50" step="1" 
                value={pixelSize} 
                onChange={(e) => setPixelSize(parseInt(e.target.value))}
                className="w-full h-1.5 bg-bg-third rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Brightness</h2>
                <span className="text-[10px] font-mono">{brightness}</span>
              </div>
              <input 
                type="range" min="-100" max="100" 
                value={brightness} 
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full h-1.5 bg-bg-third rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Contrast</h2>
                <span className="text-[10px] font-mono">{contrast}</span>
              </div>
              <input 
                type="range" min="-100" max="100" 
                value={contrast} 
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="w-full h-1.5 bg-bg-third rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Saturation</h2>
                <span className="text-[10px] font-mono">{saturation}</span>
              </div>
              <input 
                type="range" min="-100" max="100" 
                value={saturation} 
                onChange={(e) => setSaturation(parseInt(e.target.value))}
                className="w-full h-1.5 bg-bg-third rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </section>

          <div className="pt-4 border-t border-bg-fourth text-center">
            <p className="text-[10px] font-mono text-text-secondary">VAPOR_OS 4.5 // VISUALS_ENGINE_ACTIVE</p>
          </div>
         </div>
      </Window>

      {/* Stats Window */}
      <Window id="stats" title="Umami Analytics" icon={<BarChart3 className="w-3.5 h-3.5" />} defaultWidth={540} defaultHeight={420}>
        <div className="p-8">
          <header className="mb-6 pb-6 border-b border-bg-fourth">
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
              Site Analytics
            </h2>
            <p className="text-xs text-text-secondary font-mono">Site_ID: 68a0413b-1279-4458-bd20-be613265bc5f</p>
          </header>

          <div className="space-y-6">
             {/* Metrics Grid */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary border border-bg-fourth rounded-xl p-6">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Unique Visitors</span>
                  <div className="text-4xl font-bold tabular-nums mt-2">
                    {metrics.loading ? '--' : (metrics.visitors ?? 0).toLocaleString()}
                  </div>
                  <p className="text-xs mt-2 text-text-secondary">Last 30 Days</p>
                </div>
                <div className="bg-secondary border border-bg-fourth rounded-xl p-6">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Page Views</span>
                  <div className="text-4xl font-bold tabular-nums mt-2">
                    {metrics.loading ? '--' : (metrics.pageviews ?? 0).toLocaleString()}
                  </div>
                  <p className="text-xs mt-2 text-text-secondary">Total Awareness</p>
                </div>
             </div>

             <div className="border border-bg-fourth rounded-xl p-4 bg-secondary">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-secondary">
                    <span className="font-semibold text-primary">System Status:</span> Securely proxied via /api/stats. 
                  </p>
                  <a 
                    href="https://cloud.umami.is" 
                    target="_blank" 
                    className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    Dashboard <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
             </div>
          </div>
        </div>
      </Window>

      {/* Contact Window */}
      <Window id="contact" title="Contact Form" icon={<Mail className="w-3.5 h-3.5" />} className="w-[480px]">
        <div className="p-8">
          <header className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Get in touch</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Send a message directly for project inquiries, collaborations, or just to say hello.
            </p>
          </header>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Message sent! (Demo mode)');
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 cursor-pointer">Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                required
                className="w-full px-3 py-2 bg-secondary border border-bg-fourth rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-text-secondary/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 cursor-pointer">Email</label>
              <input
                type="email"
                placeholder="jane@example.com"
                required
                className="w-full px-3 py-2 bg-secondary border border-bg-fourth rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-text-secondary/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5 cursor-pointer">Message</label>
              <textarea
                rows={4}
                placeholder="How can we work together?"
                required
                className="w-full px-3 py-2 bg-secondary border border-bg-fourth rounded-md text-sm outline-none resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-text-secondary/50"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2.5 mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </Window>

      <Taskbar />
    </main>
  );
}
