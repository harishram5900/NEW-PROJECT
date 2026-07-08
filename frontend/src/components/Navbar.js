import React from "react";
import { Shield } from "lucide-react";

export default function Navbar() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <header
      data-testid="nav-root"
      className="sticky top-0 z-40 backdrop-blur-xl bg-phasor-bg/70 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5" data-testid="nav-logo">
          <div className="relative">
            <div className="absolute inset-0 blur-md bg-phasor-green/60 rounded" />
            <div className="relative w-7 h-7 rounded-md bg-black border border-phasor-green/50 flex items-center justify-center">
              <Shield className="w-4 h-4 text-phasor-green" strokeWidth={2.2} />
            </div>
          </div>
          <span className="font-display font-bold tracking-tight text-lg">Phasor</span>
          <span className="hidden sm:inline text-[10px] font-mono uppercase text-phasor-mute tracking-[0.2em] border border-white/10 rounded px-1.5 py-0.5 ml-1">
            v0 · beta
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-phasor-mute">
          <button data-testid="nav-channels" onClick={() => scrollTo("channels")} className="hover:text-white transition-colors">Channels</button>
          <button data-testid="nav-demos" onClick={() => scrollTo("demos")} className="hover:text-white transition-colors">Demos</button>
          <button data-testid="nav-arch" onClick={() => scrollTo("architecture")} className="hover:text-white transition-colors">Architecture</button>
        </nav>

        <button
          data-testid="nav-cta"
          onClick={() => scrollTo("waitlist")}
          className="btn-primary rounded-full px-4 py-2 text-sm"
        >
          Join Waitlist
        </button>
      </div>
    </header>
  );
}
