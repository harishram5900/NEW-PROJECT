import React from "react";
import { Inbox, Send, Star, Archive, Trash2, Paperclip, ShieldCheck, Play } from "lucide-react";

export default function EmailMock() {
  return (
    <div data-testid="mock-email" className="perspective-[1500px]">
      <div
        className="relative rounded-2xl bg-[#0B0F19] border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,242,254,0.3)] overflow-hidden"
        style={{ transform: "rotateY(-4deg) rotateX(2deg)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-phasor-green/20 border border-phasor-green/40 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-phasor-green" />
            </div>
            <div className="font-display text-sm font-semibold">Phasor Mail</div>
          </div>
          <div className="text-[11px] font-mono text-white/40">inbox · 47 unread</div>
        </div>

        <div className="grid grid-cols-12 min-h-[380px]">
          {/* Sidebar */}
          <div className="col-span-3 border-r border-white/5 p-3 space-y-1">
            {[
              { I: Inbox, label: "Inbox", active: true, count: 47 },
              { I: Send, label: "Sent" },
              { I: Star, label: "Starred" },
              { I: Archive, label: "Archive" },
              { I: Trash2, label: "Trash" },
            ].map(({ I, label, active, count }) => (
              <div
                key={label}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs ${
                  active ? "bg-phasor-green/10 text-white border border-phasor-green/30" : "text-white/60"
                }`}
              >
                <I className="w-3.5 h-3.5" />
                <span>{label}</span>
                {count && <span className="ml-auto text-[10px] text-phasor-green">{count}</span>}
              </div>
            ))}
          </div>

          {/* Message */}
          <div className="col-span-9 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-display text-lg font-semibold">URGENT: Wire authorization — voice note attached</h4>
                <div className="text-xs text-phasor-mute mt-1">
                  from <span className="text-white/80">ceo-office@paxton-holdings.co</span> · to you · 2 min ago
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 border border-red-500/30 rounded-full px-2 py-1">
                High risk
              </span>
            </div>

            {/* Phasor verified protection header */}
            <div className="mt-4 rounded-xl border border-phasor-green/40 bg-phasor-green/[0.06] p-3 relative overflow-hidden">
              <div className="absolute -left-10 top-0 h-full w-10 bg-phasor-green/20 animate-scanline" />
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-phasor-green/20 border border-phasor-green/40 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-phasor-green" />
                </div>
                <div className="text-xs">
                  <div className="font-display font-semibold text-white">Phasor Threat Scan</div>
                  <div className="text-white/70 mt-0.5">
                    Found attached synthetic audio link. <span className="text-phasor-green">Malicious clone spoof blocked.</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-mono uppercase">
                    <span className="px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-phasor-mute">Voice clone · 98.2%</span>
                    <span className="px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-phasor-mute">Impersonation attempt</span>
                    <span className="px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-phasor-mute">Verdict: quarantined</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-white/80 leading-relaxed">
              Hi — please listen to the attached voice note. I need you to authorise a wire transfer to a new vendor account by end of day. Details are in the recording…
            </p>

            {/* Blocked attachment */}
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/[0.06] p-3">
              <div className="w-10 h-10 rounded-md bg-black/50 border border-white/10 flex items-center justify-center">
                <Paperclip className="w-4 h-4 text-white/60" />
              </div>
              <div className="text-xs flex-1">
                <div className="text-white line-through">ceo_voice_note.mp3</div>
                <div className="text-red-400 text-[11px]">Blocked · synthetic audio detected</div>
              </div>
              <button
                disabled
                className="rounded-full bg-white/5 border border-white/10 w-9 h-9 flex items-center justify-center text-white/30 cursor-not-allowed"
              >
                <Play className="w-3.5 h-3.5" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
