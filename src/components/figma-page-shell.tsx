import { type ReactNode } from "react";

import { FigmaNavigation } from "@/components/figma-navigation";

export function FigmaFooter() {
  return (
    <footer className="figma-footer">
      <span>10 July 2027 — Corsica</span>
      <span>Spotify playlist coming soon ♫</span>
      <a href="#top">BACK TO THE TOP</a>
    </footer>
  );
}

export function FigmaPageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <main className={`figma-home figma-inner-page ${className}`} id="top">
      <FigmaNavigation />
      {children}
      <FigmaFooter />
    </main>
  );
}
