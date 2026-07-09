import React from "react";
import { Link } from "react-router-dom";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_voice-guard-ai-3/artifacts/v7p21zyd_Gemini_Generated_Image_elo52gelo52gelo5.png";

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
          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-phasor-cyan/25 bg-black/60">
            <div className="absolute inset-0 blur-lg bg-phasor-cyan/30" />
            <img src={LOGO_URL} alt="Phasor logo" className="relative w-full h-full object-cover" />
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
          <button data-testid="nav-leaderboard" onClick={() => scrollTo("leaderboard")} className="hover:text-white transition-colors">Leaderboard</button>
        </nav>

        <button
          data-testid="nav-cta"
          onClick={() => scrollTo("waitlist")}
          className="hidden sm:inline-flex btn-primary rounded-full px-4 py-2 text-sm items-center gap-2"
        >
          Join Waitlist
        </button>
        <Link
          to="/console"
          data-testid="nav-launch-app"
          className="rounded-full border border-phasor-cyan/40 bg-phasor-cyan/[0.08] hover:bg-phasor-cyan/[0.15] hover:border-phasor-cyan/60 transition-colors text-phasor-cyan text-sm px-4 py-2 inline-flex items-center gap-2 ml-2"
          style={{ boxShadow: "0 0 24px -8px rgba(0,242,254,0.55)" }}
        >
          Launch Web App →
        </Link>
      </div>
    </header>
  );
}
