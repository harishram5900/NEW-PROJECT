import React, { useEffect, useState } from "react";
import { Activity, Cpu, ShieldCheck, Radar, Waves, LineChart } from "lucide-react";

function Sparkline() {
  const [pts, setPts] = useState(() => Array.from({ length: 32 }, () => Math.random()));
  useEffect(() => {
    const t = setInterval(() => {
      setPts((prev) => [...prev.slice(1), Math.random()]);
    }, 700);
    return () => clearInterval(t);
  }, []);
  const w = 100;
  const h = 30;
  const path = pts
    .map((p, i) => `${(i / (pts.length - 1)) * w},${h - p * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10 mt-3" preserveAspectRatio="none">
      <polyline
        points={path}
        fill="none"
        stroke="#00FF87"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <polyline
        points={`0,${h} ${path} ${w},${h}`}
        fill="url(#g)"
        opacity="0.25"
      />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00FF87" />
          <stop offset="100%" stopColor="#00FF87" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Stat({ label, value, unit, icon: Icon, footnote, testid }) {
  return (
    <div
      data-testid={testid}
      className="reveal relative rounded-2xl glass p-6 overflow-hidden group hover:border-phasor-green/30 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">{label}</div>
        <Icon className="w-4 h-4 text-phasor-green" />
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-mono text-3xl font-semibold text-white">{value}</span>
        {unit && <span className="font-mono text-sm text-phasor-mute">{unit}</span>}
      </div>
      {footnote && <div className="mt-1 text-[11px] text-phasor-mute">{footnote}</div>}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 radial-glow-green blur-3xl opacity-0 group-hover:opacity-60 transition-opacity" />
    </div>
  );
}

export default function StatsGrid() {
  const [flagged, setFlagged] = useState(148231);
  useEffect(() => {
    const t = setInterval(() => setFlagged((f) => f + Math.floor(Math.random() * 8) + 1), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="architecture" className="relative py-24 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="reveal max-w-3xl">
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-phasor-green mb-4">
            / 03 &nbsp; Architecture &amp; Compliance
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
            Built for milliseconds. <br className="hidden sm:block" />
            Audited for privacy.
          </h2>
          <p className="mt-4 text-phasor-mute leading-relaxed">
            Sub-second detection over encrypted streams — validated across NIST DeepFake test suites and SOC 2 controls.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat testid="stat-latency" label="Detection Latency" value="118" unit="ms p95" icon={Activity} footnote="Edge inference · on-device" />
          <Stat testid="stat-artifacts" label="Neural Artifacts Flagged" value={flagged.toLocaleString()} icon={Radar} footnote="Last 24h · Global" />
          <Stat testid="stat-fp" label="False Positive Rate" value="0.03" unit="%" icon={LineChart} footnote="ROC AUC 0.994" />
          <Stat testid="stat-throughput" label="Streams Analyzed" value="12.4" unit="M/day" icon={Waves} footnote="Rolling 7-day avg" />
        </div>

        {/* Bento row */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="reveal glass rounded-2xl p-6 md:col-span-2 relative overflow-hidden noise">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">Live Threat Stream</div>
                <div className="mt-1 font-display text-xl font-semibold">Synthetic events / min</div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-phasor-green">
                <span className="w-1.5 h-1.5 rounded-full bg-phasor-green animate-blink" /> streaming
              </div>
            </div>
            <Sparkline />

            {/* threat log */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              {[
                ["12:04:11", "phone", "clone_98%", "blocked"],
                ["12:04:07", "email", "attach_synthetic", "quarantined"],
                ["12:04:02", "chrome", "audio_deepfake", "muted"],
                ["12:03:58", "zoom", "voiceprint_mismatch", "flagged"],
              ].map(([time, ch, event, verdict], i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-md border border-white/5 bg-black/30 px-2.5 py-1.5"
                >
                  <span className="text-phasor-mute">{time}</span>
                  <span className="text-white/70 uppercase">{ch}</span>
                  <span className="text-white/50 truncate">{event}</span>
                  <span className="ml-auto text-phasor-green">{verdict}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal glass rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-phasor-mute">
                <Cpu className="w-3.5 h-3.5 text-phasor-green" /> On-device model
              </div>
              <div className="mt-3 font-display text-xl font-semibold">Voice-DNA · v2.4</div>
              <p className="mt-2 text-sm text-phasor-mute leading-relaxed">
                8-layer transformer with acoustic + prosodic biometrics. Zero raw audio leaves the device.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 text-[10px] font-mono">
              <div className="rounded-md border border-white/10 p-2">
                <div className="text-phasor-mute">Params</div>
                <div className="text-white">42M</div>
              </div>
              <div className="rounded-md border border-white/10 p-2">
                <div className="text-phasor-mute">RAM</div>
                <div className="text-white">148MB</div>
              </div>
              <div className="rounded-md border border-white/10 p-2">
                <div className="text-phasor-mute">Battery</div>
                <div className="text-phasor-green">1.2%/hr</div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance strip */}
        <div className="reveal mt-4 glass rounded-2xl p-5 flex flex-wrap items-center gap-x-6 gap-y-3 justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-phasor-green" />
            <div className="text-sm">
              <div className="font-display font-semibold">Biometric Compliance Testing</div>
              <div className="text-phasor-mute text-xs">NIST DeepFake Detection Challenge · Passed</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {["SOC 2 Type II", "GDPR", "HIPAA-ready", "ISO 27001", "CCPA"].map((b) => (
              <span
                key={b}
                className="text-[10px] font-mono uppercase tracking-widest text-white/70 border border-white/10 rounded-full px-2.5 py-1 bg-white/[0.03]"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
