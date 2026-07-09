import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Fingerprint, Mic, Plus, ShieldCheck, Waves, Trash2 } from "lucide-react";

const seed = [
  { id: "mom", name: "Mom", relation: "Family", samples: 6, quality: 96, enrolledAt: "Sep 12, 2025", verified: true },
  { id: "dad", name: "Dad", relation: "Family", samples: 5, quality: 92, enrolledAt: "Sep 12, 2025", verified: true },
  { id: "emma", name: "Emma", relation: "Family · Child", samples: 4, quality: 88, enrolledAt: "Oct 03, 2025", verified: true },
  { id: "ceo", name: "Michael R.", relation: "Work · CEO", samples: 8, quality: 98, enrolledAt: "Jul 21, 2025", verified: true },
];

function WaveBars({ tone = "green" }) {
  return (
    <div className="flex items-end gap-[3px] h-10">
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full ${tone === "green" ? "bg-phasor-green/80" : "bg-phasor-cyan/80"}`}
          style={{
            height: `${14 + Math.abs(Math.sin(i * 0.6) * 24)}px`,
            animation: `blink ${0.9 + (i % 5) * 0.15}s ease-in-out ${i * 0.03}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function Fingerprints() {
  const [voices, setVoices] = useState(seed);
  const [recording, setRecording] = useState(false);
  const [name, setName] = useState("");

  const enroll = () => {
    if (!name.trim()) {
      toast.error("Add a name for the enrollment.");
      return;
    }
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setVoices((v) => [
        {
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name,
          relation: "Custom",
          samples: 3,
          quality: 74,
          enrolledAt: "Just now",
          verified: true,
        },
        ...v,
      ]);
      setName("");
      toast.success(`Voice DNA enrolled for ${name}.`);
    }, 1400);
  };

  const remove = (id, n) => {
    setVoices((v) => v.filter((x) => x.id !== id));
    toast.info(`${n} removed from trusted voices.`);
  };

  return (
    <div className="space-y-6" data-testid="console-fingerprints">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">Workspace · Voice DNA</div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
          Enroll the voices you trust.
        </h1>
        <p className="mt-2 text-sm text-phasor-mute max-w-xl">
          Phasor uses your enrolled biometric templates to catch impersonation. All analysis happens on-device — raw audio never leaves.
        </p>
      </div>

      {/* Enroll card */}
      <div className="rounded-2xl glass p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">Enroll a new voice</div>
            <div className="font-display text-lg font-semibold mt-1">Read the calibration line aloud (~10 s)</div>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contact name · e.g. Sister"
              className="rounded-full bg-black/40 border border-white/10 px-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-phasor-green/40 w-56"
              data-testid="enroll-name"
            />
            <button
              onClick={enroll}
              data-testid="enroll-start"
              className="btn-primary rounded-full px-4 py-2 text-sm inline-flex items-center gap-2"
            >
              {recording ? "Sampling…" : "Start enrollment"}
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-black/40 border border-white/5 p-4 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full border ${recording ? "bg-red-500/15 border-red-500/40 animate-pulse" : "bg-white/[0.03] border-white/10"} flex items-center justify-center`}>
            <Mic className={`w-5 h-5 ${recording ? "text-red-300" : "text-white/60"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white/85">
              "The quick brown fox jumps over the lazy dog. Seven silent submarines sailed past the shore."
            </div>
            <div className="text-[11px] font-mono text-phasor-mute mt-1">Reads well in under 10 seconds · used only for calibration</div>
          </div>
          <WaveBars tone={recording ? "cyan" : "green"} />
        </div>
      </div>

      {/* Enrolled */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {voices.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl glass p-5 relative overflow-hidden"
            data-testid={`voice-${v.id}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-phasor-green/50 to-phasor-cyan/40 border border-white/10 flex items-center justify-center font-display font-bold text-lg">
                {v.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-display text-base font-semibold truncate">{v.name}</div>
                  {v.verified && (
                    <ShieldCheck className="w-4 h-4 text-phasor-green" />
                  )}
                </div>
                <div className="text-[11px] font-mono text-phasor-mute">
                  {v.relation} · Enrolled {v.enrolledAt}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-mono">
                  <div className="rounded-md border border-white/10 p-2">
                    <div className="text-phasor-mute">Samples</div>
                    <div className="text-white mt-0.5">{v.samples}</div>
                  </div>
                  <div className="rounded-md border border-white/10 p-2">
                    <div className="text-phasor-mute">Quality</div>
                    <div className="text-phasor-green mt-0.5">{v.quality}%</div>
                  </div>
                  <div className="rounded-md border border-white/10 p-2">
                    <div className="text-phasor-mute">Status</div>
                    <div className="text-phasor-green mt-0.5">Armed</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <WaveBars />
              <button
                onClick={() => remove(v.id, v.name)}
                className="rounded-full border border-white/10 text-white/50 hover:text-red-300 hover:border-red-500/40 px-3 py-1.5 text-[11px] inline-flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
