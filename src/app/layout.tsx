import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { WindowProvider } from "@/context/window-context";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-heading'
});

export const metadata: Metadata = {
  title: "Dev Portfolio | Modern Workspace",
  description: "A macOS-style portfolio built with Next.js and Framer Motion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased text-slate-900 dark:text-slate-100`}>
        <WindowProvider>
          {children}
        </WindowProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
