import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Zap, Users } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const WINDOWS = [
  { id: "7d", label: "This week" },
  { id: "all", label: "All time" },
];

function RankBadge({ rank }) {
  const styles = {
    1: { bg: "bg-yellow-400", ring: "ring-yellow-300/60", label: "1", glow: "0 0 24px rgba(250,204,21,0.55)" },
    2: { bg: "bg-slate-300", ring: "ring-slate-200/50", label: "2", glow: "0 0 20px rgba(226,232,240,0.4)" },
    3: { bg: "bg-orange-400", ring: "ring-orange-300/50", label: "3", glow: "0 0 20px rgba(251,146,60,0.5)" },
  };
  const s = styles[rank];
  if (s) {
    return (
      <div
        className={`relative w-9 h-9 rounded-full ${s.bg} text-black font-display font-bold text-sm flex items-center justify-center ring-2 ${s.ring}`}
        style={{ boxShadow: s.glow }}
      >
        {s.label}
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 text-white/70 font-mono text-sm flex items-center justify-center">
      {rank}
    </div>
  );
}

function Row({ entry, isMe, index }) {
  return (
    <motion.div
      data-testid={`leaderboard-row-${entry.rank}`}
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -2 }}
      className={`group flex items-center gap-4 rounded-xl px-4 py-3 transition-colors border ${
        isMe
          ? "bg-phasor-green/[0.06] border-phasor-green/30"
          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
      }`}
    >
      <RankBadge rank={entry.rank} />
      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm text-white/90 truncate">{entry.handle}</div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute mt-0.5">
          {entry.beta_access ? (
            <span className="text-phasor-green inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Beta unlocked
            </span>
          ) : (
            <>referrer · +{entry.referrals} spots earned</>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-display text-2xl font-semibold text-white leading-none">
          {entry.referrals}
        </div>
        <div className="text-[9px] font-mono uppercase tracking-widest text-phasor-mute mt-1">
          referrals
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div
      data-testid="leaderboard-empty"
      className="text-center py-12 rounded-xl border border-dashed border-white/10 bg-white/[0.02]"
    >
      <div className="w-12 h-12 rounded-full bg-phasor-green/10 border border-phasor-green/30 flex items-center justify-center mx-auto">
        <Zap className="w-5 h-5 text-phasor-green" />
      </div>
      <div className="mt-4 font-display text-lg font-semibold">Be the first name on this board.</div>
      <div className="mt-1.5 text-sm text-phasor-mute max-w-sm mx-auto">
        Grab your referral link from the hero above — the top 10 referrers get their masked handle immortalized here.
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [window, setWindow] = useState("7d");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (w) => {
    try {
      const res = await axios.get(`${API}/waitlist/leaderboard`, { params: { window: w, limit: 10 } });
      setData(res.data);
    } catch (e) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData(window);
    const interval = setInterval(() => fetchData(window), 6000);
    // Refetch immediately when a signup happens in this tab
    const onSignup = () => fetchData(window);
    globalThis.addEventListener("phasor:waitlist-updated", onSignup);
    // Refetch when tab regains focus (e.g. after opening ?ref link in new tab)
    const onFocus = () => fetchData(window);
    globalThis.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      globalThis.removeEventListener("phasor:waitlist-updated", onSignup);
      globalThis.removeEventListener("focus", onFocus);
    };
  }, [window]);

  const entries = data?.entries || [];
  const totalRefs = entries.reduce((s, e) => s + e.referrals, 0);
  const betaCount = entries.filter((e) => e.beta_access).length;

  return (
    <section id="leaderboard" className="relative py-24 sm:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="reveal max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-4 h-4 text-phasor-green" />
            <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-phasor-green">
              / Live leaderboard
            </div>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
            Top referrers <span className="text-phasor-green">this week.</span>
          </h2>
          <p className="mt-4 text-phasor-mute leading-relaxed">
            The scoreboard updates in real time. Refer 3 friends to unlock Beta — first 100 only. Handles are privacy-masked.
          </p>
        </div>

        <div className="reveal mt-10 rounded-2xl glass p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 radial-glow-green blur-3xl opacity-30 pointer-events-none" />

          {/* Filter toggle */}
          <div className="relative flex items-center justify-between flex-wrap gap-3 mb-5">
            <div className="inline-flex rounded-full bg-black/40 border border-white/10 p-1" role="tablist" data-testid="leaderboard-window">
              {WINDOWS.map((w) => (
                <button
                  key={w.id}
                  data-testid={`leaderboard-window-${w.id}`}
                  onClick={() => setWindow(w.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    window === w.id
                      ? "bg-phasor-green text-black"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-widest text-phasor-mute">
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-phasor-cyan" /> {entries.length} on board
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-phasor-green" /> {totalRefs} referrals
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-phasor-green">
                <Sparkles className="w-3.5 h-3.5" /> {betaCount} beta
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-phasor-green animate-blink" />
                live
              </span>
            </div>
          </div>

          {/* List */}
          <div className="relative" data-testid="leaderboard-list">
            {loading && !data && (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse" />
                ))}
              </div>
            )}
            {!loading && entries.length === 0 && <EmptyState />}
            {entries.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <AnimatePresence mode="popLayout">
                  {entries.map((e, i) => (
                    <Row key={`${e.rank}-${e.handle}`} entry={e} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="relative mt-5 pt-5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-phasor-mute">
            <span>Emails masked · privacy first</span>
            <span data-testid="leaderboard-updated">
              {data?.updated_at
                ? `updated ${new Date(data.updated_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
