import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Phone, Video, Chrome, Mail, ShieldCheck, AlertTriangle, MoreHorizontal } from "lucide-react";

const rows = [
  { id: "T-42199", time: "12:04:11", channel: "Phone", target: "Mom (spoofed)", conf: 98, verdict: "Blocked", tone: "danger" },
  { id: "T-42198", time: "12:03:57", channel: "Zoom", target: "Michael R.", conf: 96, verdict: "Flagged", tone: "danger" },
  { id: "T-42197", time: "12:02:34", channel: "Chrome", target: "x.com/synthetic-clip", conf: 89, verdict: "Muted", tone: "cyan" },
  { id: "T-42196", time: "12:01:12", channel: "Email", target: "ceo-office@paxton.co", conf: 92, verdict: "Quarantined", tone: "green" },
  { id: "T-42195", time: "11:58:41", channel: "Phone", target: "Dad", conf: 12, verdict: "Allowed", tone: "green" },
  { id: "T-42194", time: "11:56:04", channel: "Zoom", target: "Elena V.", conf: 8, verdict: "Allowed", tone: "green" },
  { id: "T-42193", time: "11:52:22", channel: "Chrome", target: "youtube.com/watch?v=…", conf: 71, verdict: "Warned", tone: "cyan" },
  { id: "T-42192", time: "11:41:15", channel: "Email", target: "Vendor.mp3", conf: 84, verdict: "Quarantined", tone: "green" },
];

const iconFor = (c) => ({ Phone: Phone, Zoom: Video, Chrome: Chrome, Email: Mail })[c] || Phone;
const toneClass = { danger: "text-red-300", cyan: "text-phasor-cyan", green: "text-phasor-green" };
const verdictClass = {
  Blocked: "border-red-500/30 text-red-300 bg-red-500/10",
  Flagged: "border-red-500/30 text-red-300 bg-red-500/10",
  Muted: "border-phasor-cyan/30 text-phasor-cyan bg-phasor-cyan/10",
  Quarantined: "border-phasor-green/30 text-phasor-green bg-phasor-green/10",
  Allowed: "border-white/10 text-white/60 bg-white/[0.03]",
  Warned: "border-yellow-500/30 text-yellow-300 bg-yellow-500/10",
};

export default function ThreatLog() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = rows.filter((r) => {
    if (filter !== "all" && r.channel !== filter) return false;
    if (!q) return true;
    const s = `${r.id} ${r.channel} ${r.target} ${r.verdict}`.toLowerCase();
    return s.includes(q.toLowerCase());
  });

  return (
    <div className="space-y-6" data-testid="console-threats">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">Workspace · Threat Log</div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
          Every synthetic event, logged.
        </h1>
      </div>

      <div className="rounded-2xl glass p-4 sm:p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 rounded-full bg-black/40 border border-white/10 px-3 py-2 text-xs">
            <Search className="w-3.5 h-3.5 text-phasor-mute" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by ID, target, verdict…"
              className="flex-1 bg-transparent border-0 outline-none placeholder-white/30"
            />
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 p-1 text-xs">
            <Filter className="w-3.5 h-3.5 ml-2 text-phasor-mute" />
            {["all", "Phone", "Zoom", "Chrome", "Email"].map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1 rounded-full transition-colors ${
                  filter === c ? "bg-phasor-green text-black" : "text-white/60 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">
                <th className="text-left py-2 pr-3">ID</th>
                <th className="text-left py-2 pr-3">Time</th>
                <th className="text-left py-2 pr-3">Channel</th>
                <th className="text-left py-2 pr-3">Target</th>
                <th className="text-left py-2 pr-3">Confidence</th>
                <th className="text-left py-2 pr-3">Verdict</th>
                <th className="text-right py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((r) => {
                const Icon = iconFor(r.channel);
                return (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 pr-3 font-mono text-xs text-phasor-mute">{r.id}</td>
                    <td className="py-3 pr-3 font-mono text-xs text-white/70">{r.time}</td>
                    <td className="py-3 pr-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs ${toneClass[r.tone]}`}>
                        <Icon className="w-3.5 h-3.5" /> {r.channel}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-sm text-white/85">{r.target}</td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className={`h-full ${r.conf > 70 ? "bg-red-400" : r.conf > 40 ? "bg-yellow-400" : "bg-phasor-green"}`}
                            style={{ width: `${r.conf}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-white/70">{r.conf}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <span className={`text-[10px] font-mono uppercase tracking-widest rounded-full border px-2 py-1 inline-flex items-center gap-1 ${verdictClass[r.verdict]}`}>
                        {r.verdict === "Allowed" ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {r.verdict}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="w-7 h-7 rounded-full text-white/40 hover:text-white transition-colors inline-flex items-center justify-center">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-sm text-phasor-mute">No matching events.</div>
          )}
        </div>
      </div>
    </div>
  );
}
