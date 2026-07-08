import React from "react";
import { Shield, Mic, Video as VideoIcon, MonitorUp, MessageSquare, PhoneOff, AlertTriangle } from "lucide-react";

const Tile = ({ name, initials, speaking }) => (
  <div className={`relative rounded-lg overflow-hidden border ${speaking ? "border-red-500/60" : "border-white/10"} bg-[#0F1524]`}>
    <div className="aspect-video flex items-center justify-center">
      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center font-display font-bold text-lg">
        {initials}
      </div>
    </div>
    <div className="absolute bottom-1.5 left-2 text-[10px] font-mono text-white/80">{name}</div>
    {speaking && (
      <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-mono uppercase text-red-400">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-blink" /> speaking
      </div>
    )}
  </div>
);

export default function ZoomMock() {
  return (
    <div data-testid="mock-zoom" className="perspective-[1500px]">
      <div
        className="relative rounded-2xl bg-[#0B0F19] border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,242,254,0.35)] overflow-hidden"
        style={{ transform: "rotateY(-6deg) rotateX(4deg)" }}
      >
        {/* Titlebar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <div className="text-[11px] font-mono text-white/50">Q4 Executive Sync · Encrypted</div>
          <div className="text-[10px] font-mono text-phasor-green">● REC</div>
        </div>

        <div className="grid grid-cols-12 gap-3 p-3 min-h-[380px]">
          {/* Video grid */}
          <div className="col-span-9 grid grid-cols-3 gap-2.5">
            <Tile name="Sarah K." initials="SK" />
            <Tile name="CEO — Michael R." initials="MR" speaking />
            <Tile name="Jamal T." initials="JT" />
            <Tile name="Elena V." initials="EV" />
            <Tile name="You" initials="YO" />
            <Tile name="Andres P." initials="AP" />
          </div>

          {/* Phasor sidebar widget */}
          <aside className="col-span-3 rounded-xl border border-phasor-green/25 bg-black/60 backdrop-blur-md p-3 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-phasor-green" />
              <span className="font-display text-sm font-semibold">Phasor Shield</span>
              <span className="ml-auto text-[9px] font-mono text-phasor-green">ARMED</span>
            </div>

            <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5">
              <div className="text-[9px] font-mono uppercase tracking-widest text-phasor-mute mb-1">Live Transcript</div>
              <div className="text-[11px] text-white/80 leading-relaxed">
                "Hey team, we need to wire the vendor funds today — I'll send instructions{" "}
                <span className="text-red-400 bg-red-500/10 px-1 rounded">urgently</span>…"
              </div>
            </div>

            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-2.5 relative overflow-hidden">
              <div className="absolute inset-0 bg-red-500/5 animate-blink" />
              <div className="relative flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-red-300">Deepfake Audio</div>
                  <div className="text-[11px] text-white/90 mt-0.5">Biometric mismatched with profile metadata.</div>
                </div>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="rounded-md border border-white/10 p-2">
                <div className="text-phasor-mute uppercase">Confidence</div>
                <div className="text-red-300 text-sm mt-0.5">96.1%</div>
              </div>
              <div className="rounded-md border border-white/10 p-2">
                <div className="text-phasor-mute uppercase">Latency</div>
                <div className="text-phasor-green text-sm mt-0.5">118ms</div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-center gap-3 py-3 border-t border-white/5 bg-black/40">
          {[Mic, VideoIcon, MonitorUp, MessageSquare].map((I, i) => (
            <div key={i} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <I className="w-4 h-4 text-white/70" />
            </div>
          ))}
          <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center">
            <PhoneOff className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
