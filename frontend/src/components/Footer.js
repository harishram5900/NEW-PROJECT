import React from "react";
import { Linkedin, Instagram, Youtube } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_voice-guard-ai-3/artifacts/v7p21zyd_Gemini_Generated_Image_elo52gelo52gelo5.png";

const TikTokIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.6 6.32a5.55 5.55 0 0 1-3.55-1.29 5.55 5.55 0 0 1-2.14-4.03H10.4v13.36a2.9 2.9 0 1 1-2.05-2.78V8.28a5.99 5.99 0 1 0 5.63 5.99V8.85a8.66 8.66 0 0 0 5.62 2.03V7.35a5.6 5.6 0 0 1-1-.03Z" />
  </svg>
);

const SOCIALS = [
  { Icon: Linkedin, href: "https://www.linkedin.com/company/phasor-ai-detection/", label: "LinkedIn" },
  { Icon: TikTokIcon, href: "https://www.tiktok.com/@phasor.ai.detection", label: "TikTok" },
  { Icon: Instagram, href: "https://www.instagram.com/phasor.ai.detection", label: "Instagram" },
  { Icon: Youtube, href: "https://youtube.com/@phasor-d2t", label: "YouTube" },
];

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <footer data-testid="footer" className="relative border-t border-white/5 mt-24 py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-phasor-cyan/25 bg-black/60">
              <div className="absolute inset-0 blur-lg bg-phasor-cyan/30" />
              <img src={LOGO_URL} alt="Phasor logo" className="relative w-full h-full object-cover" />
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
          {SOCIALS.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              data-testid={`footer-social-${label.toLowerCase()}`}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-phasor-cyan hover:border-phasor-cyan/50 transition-colors"
            >
              <Icon className="w-4 h-4" />
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
