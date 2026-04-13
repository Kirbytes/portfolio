import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { WindowProvider } from "@/context/window-context";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

const dmSans = DM_Sans({ subsets: ["latin"], variable: '--font-sans' });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });

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
      <body className={`${dmSans.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
        <WindowProvider>
          {children}
        </WindowProvider>
        <Analytics />
        <SpeedInsights />
        {/* Umami Analytics */}
        <Script 
          src="https://cloud.umami.is/script.js" 
          data-website-id="68a0413b-1279-4458-bd20-be613265bc5f"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
