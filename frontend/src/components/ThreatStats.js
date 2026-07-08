import React from "react";
import { motion } from "framer-motion";
import { Clock, DollarSign, Users, AlertOctagon } from "lucide-react";
import CountUp from "./CountUp";

const stats = [
  {
    id: "seconds",
    kicker: "SOURCE AUDIO REQUIRED",
    value: "3",
    numeric: 3,
    suffix: "",
    unit: "Seconds",
    icon: Clock,
    tone: "cyan",
    body: "The exact amount of source audio a scammer needs from a social media clip or voice note to create an 85% accurate clone of your or a loved one's voice.",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    id: "loss",
    kicker: "PROJECTED BY 2027",
    value: "$40B",
    numeric: 40,
    prefix: "$",
    suffix: "B",
    unit: "Annual fraud losses",
    icon: DollarSign,
    tone: "green",
    body: "Projected annual fraud losses facilitated strictly by generative AI deepfakes and voice clones by 2027, according to Deloitte estimates.",
    span: "lg:col-span-2",
  },
  {
    id: "targets",
    kicker: "PERSONAL EXPERIENCE",
    value: "1 in 4",
    literal: "1 in 4",
    unit: "Adults targeted",
    icon: Users,
    tone: "cyan",
    body: "Report having already personally experienced or known someone targeted by an AI voice cloning phone scam, according to global security data.",
    span: "lg:col-span-1",
  },
  {
    id: "success",
    kicker: "URGENCY HOOK SUCCESS",
    value: "77%",
    numeric: 77,
    suffix: "%",
    unit: "Financial loss rate",
    icon: AlertOctagon,
    tone: "danger",
    body: "The alarming success rate of criminals once an emotional urgency or family emergency hook is deployed using a synthetic voice clone.",
    span: "lg:col-span-1",
  },
];

const toneMap = {
  cyan: {
    text: "text-phasor-cyan",
    glow: "rgba(0,242,254,0.35)",
    border: "hover:border-phasor-cyan/40",
  },
  green: {
    text: "text-phasor-green",
    glow: "rgba(0,255,135,0.35)",
    border: "hover:border-phasor-green/40",
  },
  danger: {
    text: "text-red-400",
    glow: "rgba(255,59,48,0.35)",
    border: "hover:border-red-400/40",
  },
};

function StatCard({ s, big }) {
  const t = toneMap[s.tone];
  const Icon = s.icon;
  return (
    <motion.article
      data-testid={`threat-stat-${s.id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -4 }}
      className={`relative group glass rounded-2xl p-6 sm:p-8 border border-white/5 ${t.border} transition-colors ${s.span} overflow-hidden`}
    >
      <div
        className="absolute -top-16 -right-16 w-52 h-52 blur-3xl opacity-30 group-hover:opacity-60 transition-opacity"
        style={{ background: `radial-gradient(circle, ${t.glow} 0%, transparent 70%)` }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-phasor-mute">
          <Icon className={`w-3.5 h-3.5 ${t.text}`} />
          {s.kicker}
        </div>
        <div className="mt-6">
          <div
            className={`font-display font-extrabold tracking-tighter leading-none ${t.text} ${
              big ? "text-6xl sm:text-7xl lg:text-[128px]" : "text-4xl sm:text-5xl lg:text-6xl"
            }`}
            style={{ textShadow: `0 0 40px ${t.glow}` }}
          >
            {s.literal ? (
              s.literal
            ) : (
              <CountUp
                value={s.numeric}
                prefix={s.prefix || ""}
                suffix={s.suffix || ""}
                duration={2}
              />
            )}
          </div>
          <div className={`mt-1 font-display text-lg sm:text-xl text-white/85`}>{s.unit}</div>
        </div>
        <p className={`mt-5 text-sm text-white/70 leading-relaxed ${big ? "max-w-md" : ""}`}>
          {s.body}
        </p>

        {/* corner tick marks */}
        <span className="absolute top-0 left-0 w-3 h-3 border-l border-t border-white/20" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-white/20" />
      </div>
    </motion.article>
  );
}

export default function ThreatStats() {
  return (
    <section id="threat" className="relative py-24 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="reveal max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-blink" />
            <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-red-400">
              / 00 &nbsp; The threat is real
            </div>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
            Your voice is the new attack surface.
          </h2>
          <p className="mt-4 text-phasor-mute leading-relaxed">
            Four numbers that explain why Phasor exists — and why waiting is not an option.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4">
          <StatCard s={stats[0]} big />
          <StatCard s={stats[1]} />
          <StatCard s={stats[2]} />
          <StatCard s={stats[3]} />
        </div>
      </div>
    </section>
  );
}
