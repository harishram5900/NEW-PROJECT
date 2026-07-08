import React from "react";
import { Linkedin, Instagram, Youtube } from "lucide-react";

// TikTok custom icon (not in lucide-react)
const TikTokIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.6 6.32a5.55 5.55 0 0 1-3.55-1.29 5.55 5.55 0 0 1-2.14-4.03H10.4v13.36a2.9 2.9 0 1 1-2.05-2.78V8.28a5.99 5.99 0 1 0 5.63 5.99V8.85a8.66 8.66 0 0 0 5.62 2.03V7.35a5.6 5.6 0 0 1-1-.03Z" />
  </svg>
);

const socials = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/phasor-ai-detection/",
    Icon: Linkedin,
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@phasor.ai.detection",
    Icon: TikTokIcon,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/phasor.ai.detection",
    Icon: Instagram,
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://youtube.com/@phasor-d2t",
    Icon: Youtube,
  },
];

export default function FloatingSocial() {
  return (
    <aside
      data-testid="floating-social"
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-2"
    >
      <div className="glass rounded-full py-3 px-1.5 flex flex-col gap-1.5 shadow-[0_10px_40px_-15px_rgba(0,242,254,0.35)]">
        {socials.map(({ id, label, href, Icon }) => (
          <a
            key={id}
            data-testid={`social-${id}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group relative flex items-center justify-center w-9 h-9 rounded-full text-white/70 hover:text-phasor-cyan transition-all duration-200 hover:-translate-x-1"
          >
            <span className="absolute inset-0 rounded-full bg-phasor-cyan/0 group-hover:bg-phasor-cyan/10 transition-colors" />
            <span className="absolute inset-0 rounded-full blur-md bg-phasor-cyan/0 group-hover:bg-phasor-cyan/40 transition-colors" />
            <Icon className="relative w-4 h-4" />
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap text-[10px] font-mono uppercase tracking-widest bg-black/80 border border-white/10 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {label}
            </span>
          </a>
        ))}
      </div>
      <div className="w-px h-8 hairline-y" />
      <div className="rotate-90 origin-center text-[9px] font-mono uppercase tracking-[0.3em] text-phasor-mute mt-4">
        Follow
      </div>
    </aside>
  );
}
