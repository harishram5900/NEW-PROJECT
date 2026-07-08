import React from "react";
import { Quote } from "lucide-react";

const outlets = [
  "CNN",
  "NBC News",
  "WSLS 10",
  "FBI · IC3",
  "Consumer Reports",
  "Deloitte",
  "The Wall Street Journal",
  "Reuters",
];

const reviews = [
  {
    id: "nbc",
    outlet: "NBC · WSLS",
    tone: "cyan",
    quote:
      "Answering the phone and hearing desperate pleas for help from someone who sounds just like a loved one, only to discover it was a terrifying AI hoax.",
    author: "Consumer Threat Report",
  },
  {
    id: "fbi",
    outlet: "FBI · IC3 2024 Report",
    tone: "green",
    quote:
      "Americans lost over $893 million to AI-fueled impersonation and social engineering schemes last year alone.",
    author: "Official Investigative Findings",
  },
  {
    id: "cnn",
    outlet: "CNN Family Case Study",
    tone: "danger",
    quote:
      "The voice sounded exactly like my crying daughter begging for a ransom transfer. Without an active detector, it's impossible for parents to tell the difference under panic.",
    author: "Parent, Ohio",
  },
];

const toneMap = {
  cyan: { text: "text-phasor-cyan", border: "border-phasor-cyan/25" },
  green: { text: "text-phasor-green", border: "border-phasor-green/25" },
  danger: { text: "text-red-400", border: "border-red-400/25" },
};

export default function MediaReviews() {
  const track = [...outlets, ...outlets];
  return (
    <section id="media" className="relative py-24 sm:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="reveal max-w-3xl">
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-phasor-cyan mb-4">
            / As seen in · Trusted reporting
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
            Every major network is <span className="text-phasor-cyan">covering the threat.</span>
          </h2>
        </div>

        {/* Infinite marquee */}
        <div
          data-testid="media-marquee"
          className="reveal mt-10 relative overflow-hidden py-6 rounded-2xl glass"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0B0F19] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0B0F19] to-transparent z-10" />
          <div className="flex gap-16 whitespace-nowrap animate-marquee">
            {track.map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="flex items-center gap-3 text-white/80 shrink-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-phasor-cyan/70" />
                <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight uppercase">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((r, i) => {
            const t = toneMap[r.tone];
            return (
              <blockquote
                data-testid={`review-${r.id}`}
                key={r.id}
                className={`reveal relative glass rounded-2xl p-6 sm:p-7 border ${t.border} flex flex-col`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <Quote className={`w-7 h-7 ${t.text} opacity-70`} />
                <p className="mt-4 text-sm sm:text-base text-white/85 leading-relaxed">
                  "{r.quote}"
                </p>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="text-xs text-phasor-mute font-mono uppercase tracking-widest">
                    {r.outlet}
                  </div>
                  <div className="text-xs text-white/60">— {r.author}</div>
                </div>
                <span className={`absolute -top-px left-6 right-6 h-px ${t.text.replace("text", "bg")} opacity-40`} />
              </blockquote>
            );
          })}
        </div>
      </div>
    </section>
  );
}
