import React, { useState } from "react";
import { Play, Pause, Volume2, Maximize2 } from "lucide-react";

const demos = [
  {
    id: "phone",
    title: "Real-Life Phone Scam Interception",
    subtitle: "A parent hangs up after a 2-second clone alert.",
    thumb:
      "https://images.unsplash.com/photo-1640622304233-7335e936f11b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwzfHxmYW1pbHklMjB2aWRlbyUyMGNhbGx8ZW58MHx8fHwxNzgzNTMwNTE3fDA&ixlib=rb-4.1.0&q=85",
    duration: "0:14",
    tag: "IRL",
  },
  {
    id: "zoom",
    title: "Zoom Deepfake Executive Impersonation Blocked",
    subtitle: "Enterprise security catches a synthetic voice clone request.",
    thumb:
      "https://images.unsplash.com/photo-1616531770192-6eaea74c2456?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMHZpZGVvJTIwY29uZmVyZW5jZXxlbnwwfHx8fDE3ODM1MzA1MTd8MA&ixlib=rb-4.1.0&q=85",
    duration: "0:22",
    tag: "ENT",
  },
  {
    id: "chrome",
    title: "Chrome Extension Isolating Social Engineering Audio",
    subtitle: "Muting and quarantining a malicious social clip in-browser.",
    thumb:
      "https://images.unsplash.com/photo-1612831455359-970e23a1e4e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHZpZGVvJTIwY29uZmVyZW5jZXxlbnwwfHx8fDE3ODM1MzA1MTd8MA&ixlib=rb-4.1.0&q=85",
    duration: "0:11",
    tag: "WEB",
  },
];

function DemoCard({ demo, index }) {
  const [playing, setPlaying] = useState(false);
  return (
    <article
      data-testid={`demo-card-${demo.id}`}
      className="reveal group relative rounded-2xl glass overflow-hidden noise flex flex-col"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={demo.thumb}
          alt={demo.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-30 mix-blend-overlay" />

        {/* corner tag */}
        <div className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest text-phasor-green border border-phasor-green/30 rounded-full px-2 py-0.5 bg-black/40">
          {demo.tag} · Case Study
        </div>
        <div className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-widest text-white/70 border border-white/10 rounded-full px-2 py-0.5 bg-black/40">
          {demo.duration}
        </div>

        {/* central play */}
        <button
          data-testid={`demo-play-${demo.id}`}
          onClick={() => setPlaying(!playing)}
          className="absolute inset-0 flex items-center justify-center"
          aria-label={`Play ${demo.title}`}
        >
          <span className="relative">
            <span className="absolute inset-0 rounded-full bg-phasor-green/40 blur-xl animate-pulse-glow" />
            <span className="relative w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center transition-transform group-hover:scale-110">
              {playing ? (
                <Pause className="w-6 h-6 text-white" fill="currentColor" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
              )}
            </span>
          </span>
        </button>
      </div>

      {/* controls */}
      <div className="px-5 pt-4 pb-3">
        <div className="seek" />
        <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-phasor-mute">
          <div className="flex items-center gap-3">
            <span>{playing ? "0:05" : "0:00"}</span>
            <span>/</span>
            <span>{demo.duration}</span>
          </div>
          <div className="flex items-center gap-3">
            <Volume2 className="w-3.5 h-3.5 hover:text-white transition-colors cursor-pointer" />
            <Maximize2 className="w-3.5 h-3.5 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </div>

      {/* meta */}
      <div className="px-5 pb-5">
        <h3 className="font-display font-semibold text-lg leading-tight">{demo.title}</h3>
        <p className="text-sm text-phasor-mute mt-1.5 leading-relaxed">{demo.subtitle}</p>
      </div>

      {/* bottom hairline */}
      <div className="hairline-x h-px absolute bottom-0 left-0 right-0" />
    </article>
  );
}

export default function VideoDemos() {
  return (
    <section id="demos" className="relative py-24 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="reveal max-w-3xl">
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-phasor-green mb-4">
            / 02 &nbsp; In-field footage
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
            See Phasor defend in <span className="text-phasor-green">3 seconds.</span>
          </h2>
          <p className="mt-4 text-phasor-mute leading-relaxed">
            Three simulated case files — captured from beta testers — showing how our detection layer stops synthetic media before it lands.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {demos.map((d, i) => (
            <DemoCard key={d.id} demo={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
