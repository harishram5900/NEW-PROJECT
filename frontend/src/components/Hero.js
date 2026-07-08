import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import WaveformCanvas from "./WaveformCanvas";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Hero() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [count, setCount] = useState(3127);

  React.useEffect(() => {
    axios
      .get(`${API}/waitlist/stats`)
      .then((r) => setCount(r.data.displayed_count))
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/waitlist`, { email, source: "landing_hero" });
      setJoined(true);
      toast.success(`Secured. You are #${res.data.position} in line.`);
      setCount((c) => c + 1);
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="hero" className="relative pt-20 pb-24 sm:pt-28 sm:pb-32 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* micro pill */}
        <div
          data-testid="hero-pill"
          className="reveal inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 mb-8 text-xs font-mono tracking-wider uppercase text-phasor-mute"
        >
          <span className="dot-accent animate-blink" />
          Real-time · Omni-channel · On-device
        </div>

        <h1
          data-testid="hero-headline"
          className="reveal font-display text-[42px] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[88px] font-extrabold tracking-[-0.03em]"
        >
          Real-Time Synthetic <br className="hidden sm:block" />
          Media <span className="text-gradient-green">Defense.</span>
        </h1>

        <p
          data-testid="hero-sub"
          className="reveal mt-6 max-w-2xl mx-auto text-base sm:text-lg text-phasor-mute leading-relaxed"
        >
          Phasor scans active phone calls, video streams, extensions, and emails in real time
          to spot AI clone scams instantly. Protect your family.
        </p>

        {/* Waitlist form */}
        <div id="waitlist" className="reveal mt-10 max-w-xl mx-auto">
          <form
            data-testid="waitlist-form"
            onSubmit={submit}
            className="glass-strong rounded-full p-1.5 pl-5 flex items-center gap-3 shadow-[0_0_60px_-20px_rgba(0,255,135,0.6)]"
          >
            <input
              data-testid="waitlist-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@family.com"
              className="input-ghost flex-1 bg-transparent border-0 rounded-full px-2 py-3 text-sm sm:text-base placeholder-white/35 focus:ring-0"
              style={{ background: "transparent", border: "none", boxShadow: "none" }}
              disabled={joined}
            />
            <button
              data-testid="waitlist-submit"
              type="submit"
              disabled={loading || joined}
              className="btn-primary rounded-full px-5 sm:px-6 py-3 text-sm sm:text-base flex items-center gap-2 disabled:opacity-70"
            >
              {joined ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Secured
                </>
              ) : (
                <>
                  {loading ? "Securing…" : "Secure Your Communications"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div data-testid="hero-social-proof" className="mt-4 flex items-center justify-center gap-3 text-xs sm:text-sm text-phasor-mute font-mono">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border border-phasor-bg"
                  style={{
                    background: `hsl(${140 + i * 12}, 80%, ${45 + i * 5}%)`,
                  }}
                />
              ))}
            </div>
            <span>
              Join <span className="text-white font-semibold">{count.toLocaleString()}+</span> early adopters securing their calls.
            </span>
          </div>
        </div>
      </div>

      {/* 3D Waveform */}
      <div className="reveal max-w-6xl mx-auto mt-16 relative">
        <div className="absolute -inset-6 radial-glow-green blur-3xl opacity-60 pointer-events-none" />
        <div className="relative glass rounded-3xl overflow-hidden noise">
          <WaveformCanvas />
        </div>
      </div>
    </section>
  );
}
