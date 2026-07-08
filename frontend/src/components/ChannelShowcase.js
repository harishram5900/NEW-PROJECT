import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Video, Chrome, Mail } from "lucide-react";
import PhoneMock from "./mocks/PhoneMock";
import ZoomMock from "./mocks/ZoomMock";
import ChromeMock from "./mocks/ChromeMock";
import EmailMock from "./mocks/EmailMock";

const channels = [
  {
    id: "phone",
    icon: Phone,
    label: "Live Phone Calls",
    sub: "IRL Call Protection",
    caption: "Scans active mobile audio to isolate and flag cloned family voice scams within 2 seconds.",
    Mock: PhoneMock,
  },
  {
    id: "zoom",
    icon: Video,
    label: "Zoom & Web Apps",
    sub: "Virtual Meeting Shield",
    caption: "Live speech-to-text plus biometric voiceprint match, docked to your meeting UI.",
    Mock: ZoomMock,
  },
  {
    id: "chrome",
    icon: Chrome,
    label: "Chrome Extension",
    sub: "Browser Deepfake Filter",
    caption: "Blocks synthetic voice clones across social feeds, news sites, and audio players.",
    Mock: ChromeMock,
  },
  {
    id: "email",
    icon: Mail,
    label: "Email Protection",
    sub: "Phishing Voice/Media Filter",
    caption: "Scans attached audio, video and links for synthetic media before you press play.",
    Mock: EmailMock,
  },
];

export default function ChannelShowcase() {
  const [active, setActive] = useState("phone");
  const current = channels.find((c) => c.id === active);
  const Mock = current.Mock;

  return (
    <section id="channels" className="relative py-24 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="reveal max-w-2xl">
          <div className="font-mono text-[11px] tracking-[0.3em] uppercase text-phasor-green mb-4">
            / 01 &nbsp; Product in action
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
            Four channels. One shield.
          </h2>
          <p className="mt-4 text-phasor-mute leading-relaxed">
            Phasor plugs into every place a synthetic voice can reach you — phone, meetings, browser, inbox — and neutralises the clone before it can manipulate anyone in your life.
          </p>
        </div>

        {/* Tabs */}
        <div className="reveal mt-10 flex flex-wrap gap-2" role="tablist" data-testid="channels-tablist">
          {channels.map((c) => {
            const Icon = c.icon;
            const isActive = c.id === active;
            return (
              <motion.button
                key={c.id}
                data-testid={`channel-tab-${c.id}`}
                onClick={() => setActive(c.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`group flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm border transition-colors ${
                  isActive
                    ? "bg-phasor-green text-black border-phasor-green"
                    : "bg-white/[0.03] text-white/70 border-white/10 hover:text-white hover:border-white/25"
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
                <span className="font-medium">{c.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <div className="reveal mt-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Meta panel */}
          <div className="lg:col-span-2 relative glass rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-phasor-mute mb-4">
                CHANNEL / {current.sub}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
                {current.label}
              </h3>
              <p className="mt-4 text-sm text-white/70 leading-relaxed">{current.caption}</p>
            </div>

            <ul className="mt-8 space-y-3 text-sm">
              {[
                "On-device voiceprint analysis",
                "Sub-second neural artifact detection",
                "Zero raw audio leaves the device",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-white/80">
                  <span className="dot-accent" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-phasor-mute">
              <span>SYS_STATUS · <span className="text-phasor-green">ARMED</span></span>
              <span>LAT 118ms</span>
            </div>
          </div>

          {/* Mockup stage */}
          <div className="lg:col-span-3 relative rounded-2xl glass overflow-hidden noise min-h-[520px] flex items-center justify-center p-6 sm:p-10">
            <div className="absolute inset-0 grid-bg opacity-40" />
            <div className="absolute -top-24 -right-24 w-[420px] h-[420px] radial-glow-green blur-3xl opacity-50" />
            <div className="relative w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <Mock />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
