import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Video, Link2, ArrowRight, Calendar, ShieldCheck, MoreHorizontal, Search } from "lucide-react";

const seedMeetings = [
  { id: "m-9a2f", title: "Q4 board sync", platform: "Zoom", when: "Today · 3:00 PM", host: "Michael R.", participants: 7, shield: "armed" },
  { id: "m-b41c", title: "Family Sunday call", platform: "Google Meet", when: "Sun · 6:30 PM", host: "Mom", participants: 4, shield: "armed" },
  { id: "m-e05d", title: "Vendor payment review", platform: "Zoom", when: "Tue · 10:00 AM", host: "Finance ops", participants: 3, shield: "armed" },
  { id: "m-3f8a", title: "AI safety roundtable", platform: "Google Meet", when: "Fri · 9:00 AM", host: "Elena V.", participants: 12, shield: "high" },
  { id: "m-71cc", title: "1:1 with Dad", platform: "Google Meet", when: "Sat · 4:00 PM", host: "Dad", participants: 2, shield: "armed" },
];

function detectPlatform(url) {
  const u = url.toLowerCase();
  if (u.includes("meet.google.com")) return "Google Meet";
  if (u.includes("zoom.us")) return "Zoom";
  if (u.includes("teams.microsoft.com")) return "Microsoft Teams";
  return null;
}

export default function Meetings() {
  const [url, setUrl] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const connect = async (e) => {
    e.preventDefault();
    const platform = detectPlatform(url);
    if (!platform) {
      toast.error("Paste a Google Meet or Zoom link to connect.");
      return;
    }
    setConnecting(true);
    // Simulate a quick handshake, then navigate to live meeting
    await new Promise((r) => setTimeout(r, 900));
    const id = `live-${Math.random().toString(36).slice(2, 8)}`;
    toast.success(`Shield armed for ${platform}. Joining…`);
    navigate(`/console/meetings/${id}`, {
      state: { fresh: true, url, platform },
    });
  };

  const list = seedMeetings.filter(
    (m) =>
      !query ||
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.host.toLowerCase().includes(query.toLowerCase()) ||
      m.platform.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6" data-testid="console-meetings">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">Workspace · Meetings</div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
          Shield any conversation.
        </h1>
        <p className="mt-2 text-sm text-phasor-mute max-w-xl">
          Paste a Google Meet or Zoom link. Phasor rides along, listens in real time, and flags any synthetic voice on the call.
        </p>
      </div>

      {/* Connect form */}
      <motion.form
        onSubmit={connect}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        data-testid="meeting-connect-form"
        className="rounded-2xl glass p-4 sm:p-5 relative overflow-hidden"
      >
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="relative flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[240px] flex items-center gap-3 rounded-full bg-black/40 border border-white/10 px-4 py-3">
            <Link2 className="w-4 h-4 text-phasor-cyan" />
            <input
              data-testid="meeting-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://meet.google.com/xyz-abcd-fgh   or   https://zoom.us/j/1234567890"
              className="flex-1 bg-transparent border-0 outline-none text-sm text-white placeholder-white/30"
            />
          </div>
          <button
            data-testid="meeting-connect"
            type="submit"
            disabled={connecting}
            className="btn-primary rounded-full px-5 py-3 text-sm inline-flex items-center gap-2 disabled:opacity-70"
          >
            {connecting ? "Arming shield…" : "Connect & shield"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="relative mt-3 flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-widest text-phasor-mute">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-phasor-green" /> On-device model</span>
          <span>·</span>
          <span>No raw audio uploaded</span>
          <span>·</span>
          <span>Sub-second detection</span>
        </div>
      </motion.form>

      {/* Meetings list */}
      <div className="rounded-2xl glass p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">Scheduled</div>
            <div className="font-display text-lg font-semibold mt-1">Upcoming meetings ({list.length})</div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-phasor-mute" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title, host or platform"
              className="flex-1 bg-transparent border-0 outline-none placeholder-white/30"
            />
          </div>
        </div>

        <div className="mt-4 divide-y divide-white/5">
          {list.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-3">
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${m.platform === "Zoom" ? "bg-blue-500/10 border-blue-500/30 text-blue-300" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"}`}>
                <Video className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium truncate">{m.title}</div>
                  <span className={`text-[10px] font-mono rounded-full px-2 py-0.5 border ${m.shield === "high" ? "border-red-500/30 text-red-300 bg-red-500/10" : "border-phasor-green/30 text-phasor-green bg-phasor-green/10"}`}>
                    {m.shield === "high" ? "High risk · shield" : "Shield armed"}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-phasor-mute">
                  <Calendar className="w-3 h-3 inline mr-1 -mt-0.5" /> {m.when} · {m.platform} · host {m.host} · {m.participants} participants
                </div>
              </div>
              <button
                onClick={() => navigate(`/console/meetings/${m.id}`)}
                data-testid={`meeting-open-${m.id}`}
                className="rounded-full border border-white/10 bg-white/[0.03] hover:border-phasor-green/30 hover:bg-phasor-green/[0.05] transition-colors text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
              >
                Open shield <ArrowRight className="w-3 h-3" />
              </button>
              <button className="w-8 h-8 rounded-full text-white/40 hover:text-white transition-colors flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
