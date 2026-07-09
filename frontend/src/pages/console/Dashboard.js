import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Video, ShieldAlert, Users, ArrowRight, Radar, Fingerprint, ArrowUpRight, TrendingUp, Zap } from "lucide-react";
import CountUp from "../../components/CountUp";

function KPI({ icon: Icon, label, value, unit, delta, tone = "green" }) {
  const tones = {
    green: { text: "text-phasor-green", glow: "rgba(0,255,135,0.35)" },
    cyan: { text: "text-phasor-cyan", glow: "rgba(0,242,254,0.35)" },
    danger: { text: "text-red-400", glow: "rgba(255,59,48,0.35)" },
  };
  const t = tones[tone];
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="relative rounded-2xl glass p-5 overflow-hidden group"
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 blur-3xl opacity-30 group-hover:opacity-60 transition-opacity" style={{ background: `radial-gradient(circle, ${t.glow}, transparent 70%)` }} />
      <div className="relative flex items-center justify-between">
        <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">{label}</div>
        <Icon className={`w-4 h-4 ${t.text}`} />
      </div>
      <div className="relative mt-3 flex items-baseline gap-1">
        <span className={`font-display text-3xl font-semibold ${t.text}`} style={{ textShadow: `0 0 24px ${t.glow}` }}>
          {typeof value === "number" ? <CountUp value={value} /> : value}
        </span>
        {unit && <span className="text-xs text-phasor-mute font-mono">{unit}</span>}
      </div>
      {delta && (
        <div className="relative mt-1 text-[11px] font-mono text-phasor-mute">
          <span className="text-phasor-green">▲ {delta}</span> · vs last 7d
        </div>
      )}
    </motion.div>
  );
}

function Sparkline() {
  const [pts, setPts] = useState(() => Array.from({ length: 40 }, () => Math.random()));
  useEffect(() => {
    const t = setInterval(() => setPts((p) => [...p.slice(1), Math.random()]), 900);
    return () => clearInterval(t);
  }, []);
  const w = 200;
  const h = 60;
  const path = pts.map((p, i) => `${(i / (pts.length - 1)) * w},${h - p * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id="dashgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00FF87" />
          <stop offset="100%" stopColor="#00FF87" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${path} ${w},${h}`} fill="url(#dashgrad)" opacity="0.35" />
      <polyline points={path} fill="none" stroke="#00FF87" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const upcomingMeetings = [
  { id: "m-9a2f", title: "Q4 board sync", platform: "Zoom", when: "Today · 3:00 PM", host: "Michael R.", participants: 7 },
  { id: "m-b41c", title: "Family Sunday call", platform: "Google Meet", when: "Sun · 6:30 PM", host: "Mom", participants: 4 },
  { id: "m-e05d", title: "Vendor payment review", platform: "Zoom", when: "Tue · 10:00 AM", host: "Finance ops", participants: 3 },
];

const feed = [
  { id: 1, t: "12:04:11", channel: "Phone", event: "Voice clone · Match 98%", verdict: "Blocked", tone: "danger" },
  { id: 2, t: "12:03:57", channel: "Zoom", event: "Voiceprint mismatch · CEO", verdict: "Flagged", tone: "danger" },
  { id: 3, t: "12:02:34", channel: "Chrome", event: "Deepfake audio on X.com", verdict: "Muted", tone: "cyan" },
  { id: 4, t: "12:01:12", channel: "Email", event: "Synthetic MP3 attachment", verdict: "Quarantined", tone: "green" },
  { id: 5, t: "11:58:41", channel: "Phone", event: "Clean · Family verified", verdict: "Allowed", tone: "green" },
];

const toneClass = { danger: "text-red-300 bg-red-500/10 border-red-500/30", cyan: "text-phasor-cyan bg-phasor-cyan/10 border-phasor-cyan/25", green: "text-phasor-green bg-phasor-green/10 border-phasor-green/25" };

export default function Dashboard() {
  return (
    <div className="space-y-6" data-testid="console-dashboard">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">
            Workspace · Global
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
            Good afternoon. Your comms are <span className="text-phasor-green">armed.</span>
          </h1>
        </div>
        <Link
          to="/console/meetings"
          data-testid="dashboard-connect-meeting"
          className="btn-primary rounded-full px-4 py-2.5 text-sm inline-flex items-center gap-2"
        >
          Connect a meeting <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI icon={Activity} label="Detection Latency" value={118} unit="ms p95" delta="12ms" tone="green" />
        <KPI icon={Radar} label="Threats · Last 24h" value={148231} tone="cyan" delta="8.4%" />
        <KPI icon={ShieldAlert} label="Clones Blocked" value={2417} delta="3.1%" tone="danger" />
        <KPI icon={Users} label="Protected Contacts" value={12} unit="voices" tone="green" delta="2" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live threat stream */}
        <div className="lg:col-span-2 rounded-2xl glass p-5 relative overflow-hidden noise">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">Live threat stream</div>
              <div className="font-display text-lg font-semibold mt-1">Global synthetic events</div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-phasor-green">
              <span className="w-1.5 h-1.5 rounded-full bg-phasor-green animate-blink" />
              streaming
            </div>
          </div>
          <Sparkline />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {feed.map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-[11px] font-mono ${toneClass[f.tone]}`}
              >
                <span className="text-phasor-mute">{f.t}</span>
                <span className="uppercase text-white/80">{f.channel}</span>
                <span className="truncate flex-1 text-white/70">{f.event}</span>
                <span className="uppercase">{f.verdict}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming meetings */}
        <div className="rounded-2xl glass p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">Upcoming meetings</div>
              <div className="font-display text-lg font-semibold mt-1">Next 24 hours</div>
            </div>
            <Video className="w-4 h-4 text-phasor-cyan" />
          </div>
          <ul className="mt-4 space-y-2">
            {upcomingMeetings.map((m) => (
              <li key={m.id}>
                <Link
                  to={`/console/meetings/${m.id}`}
                  className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-3 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center">
                    <Video className="w-4 h-4 text-white/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{m.title}</div>
                    <div className="text-[11px] text-phasor-mute font-mono">
                      {m.platform} · {m.when} · {m.participants}p
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-phasor-mute group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl glass p-5">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-phasor-mute">
            <Fingerprint className="w-3.5 h-3.5 text-phasor-green" />
            Voice DNA · Enrolled
          </div>
          <div className="mt-3 font-display text-lg font-semibold">4 trusted voices</div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {["Mom", "Dad", "Emma", "CEO"].map((n) => (
              <div key={n} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-phasor-green/40 to-phasor-cyan/30 border border-white/10 flex items-center justify-center font-display font-bold text-sm">
                  {n[0]}
                </div>
                <div className="mt-1.5 text-[11px] text-white/70">{n}</div>
              </div>
            ))}
          </div>
          <Link
            to="/console/fingerprints"
            className="mt-5 inline-flex items-center gap-1 text-xs text-phasor-green hover:underline"
          >
            Manage voices <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="rounded-2xl glass p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-phasor-mute">
              <TrendingUp className="w-3.5 h-3.5 text-phasor-cyan" />
              This week
            </div>
            <div className="text-[10px] font-mono text-phasor-mute">Rolling 7-day window</div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-4">
            <div>
              <div className="font-display text-2xl font-semibold"><CountUp value={182} /></div>
              <div className="text-[11px] text-phasor-mute font-mono uppercase tracking-widest">Calls scanned</div>
            </div>
            <div>
              <div className="font-display text-2xl font-semibold text-phasor-green"><CountUp value={11} /></div>
              <div className="text-[11px] text-phasor-mute font-mono uppercase tracking-widest">Clones blocked</div>
            </div>
            <div>
              <div className="font-display text-2xl font-semibold text-phasor-cyan"><CountUp value={7} /></div>
              <div className="text-[11px] text-phasor-mute font-mono uppercase tracking-widest">Meetings shielded</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono">
            {["Zoom", "Google Meet", "Phone", "Chrome", "Email"].map((c) => (
              <span key={c} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-white/70 inline-flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-phasor-green" /> {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
