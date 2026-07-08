import React from "react";
import { PhoneCall, ShieldAlert, User } from "lucide-react";

export default function PhoneMock() {
  return (
    <div data-testid="mock-phone" className="flex justify-center perspective-[1400px]">
      <div
        className="relative w-[280px] sm:w-[300px] rounded-[42px] border border-white/10 bg-gradient-to-b from-[#0E1320] to-[#070A12] p-3 shadow-[0_40px_100px_-30px_rgba(0,255,135,0.35)]"
        style={{ transform: "rotateY(-14deg) rotateX(6deg)" }}
      >
        {/* Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20" />

        {/* Screen */}
        <div className="relative rounded-[32px] bg-[#0B0F19] h-[520px] overflow-hidden border border-white/5">
          {/* status bar */}
          <div className="flex justify-between items-center px-6 pt-3 pb-2 text-[10px] font-mono text-white/70">
            <span>9:41</span>
            <span>◌ Phasor · ARMED</span>
          </div>

          {/* incoming call ui */}
          <div className="flex flex-col items-center pt-4">
            <div className="text-[10px] tracking-[0.3em] uppercase text-phasor-mute">Incoming call</div>
            <div className="mt-2 w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
              <User className="w-8 h-8 text-white/70" />
              <span className="absolute inset-0 rounded-full border-2 border-phasor-green/60 animate-pulse-glow" />
            </div>
            <div className="mt-3 font-display text-xl font-semibold">Mom</div>
            <div className="text-xs text-phasor-mute">+1 (415) 555 · Mobile</div>
          </div>

          {/* Scanning waveform */}
          <div className="mx-6 mt-6 h-16 rounded-xl bg-white/[0.03] border border-white/5 flex items-end justify-center gap-[3px] px-3 overflow-hidden relative">
            {Array.from({ length: 36 }).map((_, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-phasor-green/80"
                style={{
                  height: `${20 + Math.abs(Math.sin(i * 0.6) * 32)}px`,
                  animation: `blink ${0.9 + (i % 5) * 0.15}s ease-in-out ${i * 0.03}s infinite`,
                }}
              />
            ))}
            <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-phasor-green/20 to-transparent animate-scanline pointer-events-none" />
          </div>

          {/* Alert */}
          <div className="mx-4 mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500/5 animate-blink" />
            <div className="relative flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-red-400">AI Voice Clone Detected</div>
                <div className="text-xs text-white/90 mt-1">Synthetic match <span className="text-red-300 font-semibold">99.4%</span> · Voiceprint mismatch on file.</div>
              </div>
            </div>
          </div>

          {/* Call actions */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-around px-6">
            <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_30px_rgba(255,59,48,0.55)]">
              <PhoneCall className="w-6 h-6 text-white rotate-[135deg]" />
            </div>
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
              <PhoneCall className="w-6 h-6 text-white/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
