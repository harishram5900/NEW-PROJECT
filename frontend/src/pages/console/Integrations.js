import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, ExternalLink, Link2, PhoneCall, Mail, Slack, Calendar, Chrome, Zap, Video } from "lucide-react";

const integrations = [
  {
    id: "google-meet",
    name: "Google Meet",
    desc: "Ride along on every Meet call. Real-time transcript + voiceprint match.",
    scopes: ["Read active meeting audio stream", "Read Meet metadata (participants)", "Post shield alerts to chat"],
    tone: "cyan",
    icon: Video,
  },
  {
    id: "zoom",
    name: "Zoom",
    desc: "Enterprise-grade Zoom shield with in-meeting sidebar and post-meeting reports.",
    scopes: ["meeting:read", "user:read", "chat:write:app"],
    tone: "cyan",
    icon: Video,
  },
  {
    id: "gcal",
    name: "Google Calendar",
    desc: "Auto-arm the shield 60 seconds before any calendar event with a Meet/Zoom link.",
    scopes: ["calendar.events.readonly"],
    tone: "green",
    icon: Calendar,
  },
  {
    id: "chrome",
    name: "Chrome Extension",
    desc: "Block deepfake audio on Twitter/X, YouTube, TikTok and any embedded player.",
    scopes: ["activeTab", "storage"],
    tone: "green",
    icon: Chrome,
  },
  {
    id: "phone",
    name: "Phone (iOS · Android)",
    desc: "On-device call scanning. Scans mobile audio locally — nothing leaves the phone.",
    scopes: ["CallKit (iOS)", "TelecomManager (Android)"],
    tone: "green",
    icon: PhoneCall,
  },
  {
    id: "email",
    name: "Email (Gmail · Outlook)",
    desc: "Scan attached audio, video and links for synthetic media before you press play.",
    scopes: ["gmail.readonly", "gmail.modify"],
    tone: "cyan",
    icon: Mail,
  },
  {
    id: "slack",
    name: "Slack Alerts",
    desc: "Post shield alerts and threat digests to a chosen Slack channel.",
    scopes: ["incoming-webhook", "chat:write"],
    tone: "green",
    icon: Slack,
  },
];

const toneMap = {
  cyan: { text: "text-phasor-cyan", border: "hover:border-phasor-cyan/40", glow: "rgba(0,242,254,0.25)" },
  green: { text: "text-phasor-green", border: "hover:border-phasor-green/40", glow: "rgba(0,255,135,0.3)" },
};

export default function Integrations() {
  const [connected, setConnected] = useState({});
  const [busy, setBusy] = useState(null);

  const connect = async (id, name) => {
    setBusy(id);
    await new Promise((r) => setTimeout(r, 900));
    setBusy(null);
    setConnected((c) => ({ ...c, [id]: true }));
    toast.success(`${name} connected — shield extended.`);
  };
  const disconnect = (id, name) => {
    setConnected((c) => ({ ...c, [id]: false }));
    toast.info(`${name} disconnected.`);
  };

  return (
    <div className="space-y-6" data-testid="console-integrations">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">Workspace · Integrations</div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
          Extend the shield everywhere.
        </h1>
        <p className="mt-2 text-sm text-phasor-mute max-w-xl">
          One toggle to bring real-time synthetic-media defense into every conversation channel you use.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((it, i) => {
          const t = toneMap[it.tone];
          const isConnected = !!connected[it.id];
          const isBusy = busy === it.id;
          const Icon = it.icon;
          return (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              data-testid={`integration-${it.id}`}
              className={`relative rounded-2xl glass p-5 overflow-hidden border border-white/5 ${t.border} transition-colors`}
            >
              <div className="absolute -top-16 -right-16 w-40 h-40 blur-3xl opacity-25" style={{ background: `radial-gradient(circle, ${t.glow}, transparent 70%)` }} />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg border border-white/10 bg-black/40 flex items-center justify-center ${t.text}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display text-base font-semibold">{it.name}</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute mt-0.5">
                      {isConnected ? "Connected · OAuth active" : "Not connected"}
                    </div>
                  </div>
                </div>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-phasor-green border border-phasor-green/30 rounded-full px-2 py-1 bg-phasor-green/10">
                    <CheckCircle2 className="w-3 h-3" /> live
                  </span>
                ) : (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">idle</span>
                )}
              </div>

              <p className="relative mt-4 text-sm text-white/75 leading-relaxed">{it.desc}</p>

              <div className="relative mt-4 space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute mb-1">Scopes</div>
                {it.scopes.map((s) => (
                  <div key={s} className="text-[11px] font-mono text-white/70 flex items-start gap-2">
                    <Link2 className="w-3 h-3 mt-0.5 shrink-0 text-phasor-mute" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              <div className="relative mt-5 flex items-center justify-between gap-2">
                {isConnected ? (
                  <button
                    onClick={() => disconnect(it.id, it.name)}
                    data-testid={`integration-disconnect-${it.id}`}
                    className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/70 hover:text-red-300 hover:border-red-500/40 transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => connect(it.id, it.name)}
                    disabled={isBusy}
                    data-testid={`integration-connect-${it.id}`}
                    className="btn-primary rounded-full px-4 py-2 text-xs inline-flex items-center gap-1.5 disabled:opacity-70"
                  >
                    {isBusy ? "Connecting…" : "Connect"}
                    <Zap className="w-3 h-3" />
                  </button>
                )}
                <a
                  href="#"
                  className="text-[11px] text-phasor-mute hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
