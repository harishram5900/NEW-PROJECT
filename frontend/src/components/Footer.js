import React from "react";
import { Shield, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <footer data-testid="footer" className="relative border-t border-white/5 mt-24 py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 blur-md bg-phasor-green/60 rounded" />
              <div className="relative w-7 h-7 rounded-md bg-black border border-phasor-green/50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-phasor-green" />
              </div>
            </div>
            <span className="font-display font-bold tracking-tight text-lg">Phasor</span>
          </div>
          <p className="mt-4 text-sm text-phasor-mute max-w-xs leading-relaxed">
            Real-time synthetic media defense — for every call, meeting, tab, and inbox.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-10 gap-y-3 text-xs font-mono uppercase tracking-widest text-phasor-mute">
          <button data-testid="footer-waitlist" onClick={scrollTop} className="hover:text-white transition-colors">
            Waitlist
          </button>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Security</a>
          <a href="mailto:hello@phasor.ai" className="hover:text-white transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-3">
          {[Twitter, Github, Linkedin].map((I, i) => (
            <a
              key={i}
              href="#"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-phasor-green/50 transition-colors"
            >
              <I className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] font-mono text-phasor-mute">
        <div>© {new Date().getFullYear()} Phasor Systems Inc. All rights reserved.</div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-phasor-green animate-blink" />
          Systems armed · v0.9.2-beta
        </div>
      </div>
    </footer>
  );
}
