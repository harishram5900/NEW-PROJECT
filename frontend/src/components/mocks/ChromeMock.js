import React from "react";
import { Shield, Lock, ArrowLeft, ArrowRight, RotateCw, Play } from "lucide-react";

export default function ChromeMock() {
  return (
    <div data-testid="mock-chrome" className="perspective-[1500px]">
      <div
        className="relative rounded-2xl bg-[#0B0F19] border border-white/10 shadow-[0_40px_80px_-30px_rgba(0,255,135,0.35)] overflow-hidden"
        style={{ transform: "rotateY(-4deg) rotateX(3deg)" }}
      >
        {/* Chrome tabs */}
        <div className="flex items-end gap-1 px-3 pt-2 bg-black/60 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <div className="ml-3 flex items-end gap-1">
            <div className="rounded-t-md bg-[#0B0F19] px-3 py-1.5 text-[11px] text-white/80 border border-b-0 border-white/10">
              @creator_official — Post
            </div>
            <div className="rounded-t-md bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/40">
              Threat Analytics
            </div>
          </div>
        </div>

        {/* URL bar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-black/40 border-b border-white/5">
          <ArrowLeft className="w-3.5 h-3.5 text-white/40" />
          <ArrowRight className="w-3.5 h-3.5 text-white/40" />
          <RotateCw className="w-3.5 h-3.5 text-white/40" />
          <div className="flex-1 flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-white/10 px-3 py-1 text-[11px] font-mono text-white/60">
            <Lock className="w-3 h-3 text-phasor-green" />
            https://social.example.com/p/9e42
          </div>
          {/* Phasor extension icon glowing red */}
          <div className="relative">
            <div className="absolute inset-0 rounded-md bg-red-500/60 blur-md animate-blink" />
            <div className="relative w-7 h-7 rounded-md bg-black border border-red-500/50 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-red-400" />
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="relative p-4 min-h-[340px]">
          {/* fake video post */}
          <div className="relative max-w-md mx-auto rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="flex items-center gap-2 p-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400" />
              <div className="text-xs">
                <div className="text-white font-medium">@creator_official</div>
                <div className="text-phasor-mute text-[10px]">Sponsored · 2h</div>
              </div>
            </div>
            <div className="relative aspect-video bg-black">
              {/* fake video thumbnail */}
              <div className="absolute inset-0 opacity-40 grid-bg" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-emerald-500/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" fill="currentColor" />
                </div>
              </div>
            </div>
            <div className="p-3 text-[11px] text-white/70">
              "Send crypto now to double your funds — trust me it's really me…"
            </div>
          </div>

          {/* Phor-Scan Blocked modal overlay */}
          <div className="absolute inset-x-6 top-6 rounded-xl border border-phasor-green/40 bg-[#0B0F19]/90 backdrop-blur-md p-4 shadow-[0_20px_60px_-10px_rgba(0,255,135,0.35)]">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-phasor-green" />
              <div className="font-display font-semibold">Phor-Scan Blocked</div>
              <span className="ml-auto text-[10px] font-mono uppercase text-phasor-green">
                v2.4.1
              </span>
            </div>
            <p className="mt-1.5 text-xs text-white/80">
              Synthetic voice clone detected on this page. Media has been muted and quarantined.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-mono">
              <div className="rounded-md border border-white/10 px-2 py-1.5">
                <div className="text-phasor-mute">Clone Match</div>
                <div className="text-red-300">97.8%</div>
              </div>
              <div className="rounded-md border border-white/10 px-2 py-1.5">
                <div className="text-phasor-mute">Artifacts</div>
                <div className="text-white">14</div>
              </div>
              <div className="rounded-md border border-white/10 px-2 py-1.5">
                <div className="text-phasor-mute">Verdict</div>
                <div className="text-phasor-green">BLOCKED</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
