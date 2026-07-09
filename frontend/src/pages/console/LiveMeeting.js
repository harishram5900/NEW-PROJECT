import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Video as VideoIcon, MonitorUp, MessageSquare, PhoneOff, ShieldCheck,
  AlertTriangle, User, ChevronRight, Waves, Fingerprint, Sparkles
} from "lucide-react";

/** Simulated live participants */
const PARTICIPANTS = [
  { id: "sarah", name: "Sarah K.", initials: "SK", role: "PM", verified: true },
  { id: "michael", name: "Michael R.", initials: "MR", role: "CEO", verified: false, flag: true },
  { id: "jamal", name: "Jamal T.", initials: "JT", role: "Legal", verified: true },
  { id: "elena", name: "Elena V.", initials: "EV", role: "Design", verified: true },
  { id: "you", name: "You", initials: "YO", role: "Host", verified: true },
  { id: "andres", name: "Andres P.", initials: "AP", role: "Eng", verified: true },
];

const TRANSCRIPT_LINES = [
  { spk: "Sarah K.", text: "Everyone here? Great, let's kick off the Q4 review.", tone: "clean" },
  { spk: "Michael R.", text: "Hey team — a quick thing first, I need us to wire the vendor funds today.", tone: "clean" },
  { spk: "Michael R.", text: "Send it to the new account I DM'd earlier — urgently. Trust me on this.", tone: "flag" },
  { spk: "Michael R.", text: "Do NOT run this by legal, I'll cover with the board.", tone: "flag" },
  { spk: "Sarah K.", text: "Wait — that doesn't sound like you. Phasor is flagging this.", tone: "clean" },
];

export default function LiveMeeting() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const platform = state?.platform || "Zoom";
  const startedAt = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [lines, setLines] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  // Feed transcript lines progressively; alert modal appears on the second flag line.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (let i = 0; i < TRANSCRIPT_LINES.length; i++) {
        await new Promise((r) => setTimeout(r, 2400));
        if (cancelled) return;
        setLines((prev) => [...prev, { ...TRANSCRIPT_LINES[i], id: prev.length + 1 }]);
        if (TRANSCRIPT_LINES[i].tone === "flag" && i === 3) {
          setAlertOpen(true);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const mmss = useMemo(() => {
    const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const s = String(elapsed % 60).padStart(2, "0");
    return `${m}:${s}`;
  }, [elapsed]);

  const flagged = PARTICIPANTS.find((p) => p.flag);

  return (
    <div className="space-y-4" data-testid="console-live-meeting">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">
            {platform} · encrypted · {mmss}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
            Q4 Executive Sync
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-phasor-green border border-phasor-green/30 rounded-full px-3 py-1 bg-phasor-green/10 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" /> Shield armed
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 border border-red-500/30 rounded-full px-3 py-1 bg-red-500/10 inline-flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" /> 1 anomaly
          </span>
        </div>
      </div>

      {/* Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Video wall */}
        <div className="lg:col-span-8 rounded-2xl bg-black/60 border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/40">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="text-[11px] font-mono text-white/50">{platform} · Q4 Executive Sync</div>
            <div className="text-[10px] font-mono text-phasor-green">● REC</div>
          </div>

          <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PARTICIPANTS.map((p) => {
              const isFlagged = p.flag;
              return (
                <div
                  key={p.id}
                  className={`relative rounded-lg overflow-hidden border ${
                    isFlagged ? "border-red-500/60 shadow-[0_0_24px_-6px_rgba(255,59,48,0.6)]" : "border-white/10"
                  } bg-[#0F1524]`}
                >
                  <div className="aspect-video flex items-center justify-center relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/10 to-white/[0.02] flex items-center justify-center font-display font-bold text-lg text-white/90">
                      {p.initials}
                    </div>
                    {isFlagged && (
                      <div className="absolute inset-0 border-[3px] border-red-500/70 rounded-lg animate-pulse pointer-events-none" />
                    )}
                  </div>
                  <div className="absolute bottom-1.5 left-2 text-[10px] font-mono text-white/80 flex items-center gap-1.5">
                    {p.verified && !isFlagged && <ShieldCheck className="w-3 h-3 text-phasor-green" />}
                    {isFlagged && <AlertTriangle className="w-3 h-3 text-red-400" />}
                    {p.name}
                  </div>
                  {isFlagged && (
                    <div className="absolute top-2 right-2 text-[9px] font-mono uppercase tracking-widest text-red-300 bg-red-500/20 border border-red-500/40 rounded-full px-2 py-0.5">
                      voiceprint mismatch
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 py-3 border-t border-white/5 bg-black/40">
            <button
              onClick={() => setMuted((m) => !m)}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${muted ? "bg-red-500/15 border-red-500/40 text-red-300" : "bg-white/5 border-white/10 text-white/70"}`}
            >
              {muted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setCamera((c) => !c)}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${!camera ? "bg-red-500/15 border-red-500/40 text-red-300" : "bg-white/5 border-white/10 text-white/70"}`}
            >
              <VideoIcon className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
              <MonitorUp className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/console/meetings")}
              className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition-colors"
              data-testid="live-hangup"
            >
              <PhoneOff className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Phasor sidebar */}
        <aside className="lg:col-span-4 rounded-2xl glass p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-phasor-green" />
            <span className="font-display text-sm font-semibold">Phasor Shield</span>
            <span className="ml-auto text-[9px] font-mono text-phasor-green">ARMED</span>
          </div>

          {/* live waveform-ish equalizer */}
          <div className="h-16 rounded-lg bg-black/40 border border-white/5 flex items-end justify-center gap-[3px] px-3 overflow-hidden">
            {Array.from({ length: 44 }).map((_, i) => (
              <span
                key={i}
                className={`w-[3px] rounded-full ${flagged ? "bg-red-400" : "bg-phasor-green"}`}
                style={{
                  height: `${18 + Math.abs(Math.sin(i * 0.6) * 30)}px`,
                  animation: `blink ${0.9 + (i % 5) * 0.15}s ease-in-out ${i * 0.03}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Transcript */}
          <div className="rounded-lg bg-white/[0.02] border border-white/5 p-3 flex-1 min-h-[220px] max-h-[420px] overflow-y-auto">
            <div className="text-[9px] font-mono uppercase tracking-widest text-phasor-mute mb-2">Live transcript</div>
            <ul className="space-y-2.5" data-testid="live-transcript">
              <AnimatePresence>
                {lines.map((l) => (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[12px] leading-relaxed"
                  >
                    <span className={`font-mono text-[10px] uppercase tracking-widest mr-2 ${l.tone === "flag" ? "text-red-400" : "text-phasor-mute"}`}>
                      {l.spk}
                    </span>
                    <span className={l.tone === "flag" ? "text-red-200" : "text-white/85"}>{l.text}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          {/* Match panel */}
          <div className={`rounded-lg border p-3 ${flagged ? "border-red-500/40 bg-red-500/10" : "border-phasor-green/25 bg-phasor-green/[0.05]"}`}>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
              <Fingerprint className={`w-3.5 h-3.5 ${flagged ? "text-red-400" : "text-phasor-green"}`} />
              Biometric match
            </div>
            <div className={`mt-1 text-sm font-display font-semibold ${flagged ? "text-red-200" : "text-white"}`}>
              {flagged ? `Mismatch: ${flagged.name}` : "All voices verified"}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] font-mono">
              <div className="rounded-md border border-white/10 p-2">
                <div className="text-phasor-mute">Confidence</div>
                <div className={`text-sm mt-0.5 ${flagged ? "text-red-300" : "text-white"}`}>{flagged ? "96.1%" : "99.9%"}</div>
              </div>
              <div className="rounded-md border border-white/10 p-2">
                <div className="text-phasor-mute">Latency</div>
                <div className="text-phasor-green text-sm mt-0.5">118ms</div>
              </div>
              <div className="rounded-md border border-white/10 p-2">
                <div className="text-phasor-mute">Verdict</div>
                <div className={`text-sm mt-0.5 ${flagged ? "text-red-300" : "text-phasor-green"}`}>{flagged ? "flagged" : "clean"}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Alert modal */}
      <AnimatePresence>
        {alertOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="max-w-lg w-full rounded-2xl border border-red-500/40 bg-[#120507]/95 backdrop-blur-xl p-6 shadow-[0_30px_100px_-20px_rgba(255,59,48,0.55)]"
              data-testid="live-alert-modal"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-red-400">
                    Deepfake voice detected
                  </div>
                  <div className="font-display text-lg font-semibold mt-0.5">
                    "Michael R." voiceprint mismatched.
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/85 leading-relaxed">
                The last two utterances don't match your enrolled biometric for this participant. Their tone,
                prosody and acoustic signature indicate a synthetic voice clone with <span className="text-red-300 font-semibold">96.1% confidence</span>.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] font-mono">
                <div className="rounded-md border border-white/10 p-2 bg-black/40">
                  <div className="text-phasor-mute">Model</div>
                  <div className="text-white mt-0.5">Voice-DNA v2.4</div>
                </div>
                <div className="rounded-md border border-white/10 p-2 bg-black/40">
                  <div className="text-phasor-mute">Reference</div>
                  <div className="text-white mt-0.5">Michael R. · Zoom</div>
                </div>
                <div className="rounded-md border border-white/10 p-2 bg-black/40">
                  <div className="text-phasor-mute">Recommended</div>
                  <div className="text-red-300 mt-0.5">Verify out-of-band</div>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  onClick={() => setAlertOpen(false)}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                >
                  Keep listening
                </button>
                <button
                  onClick={() => setAlertOpen(false)}
                  className="rounded-full bg-red-500 hover:bg-red-400 px-4 py-2 text-sm text-white transition-colors inline-flex items-center gap-1.5"
                  data-testid="live-alert-mute"
                >
                  Mute speaker & alert host <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
