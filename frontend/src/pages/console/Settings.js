import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Bell, ShieldCheck, KeyRound, Trash2 } from "lucide-react";

function Toggle({ on, onChange, label, sub }) {
  return (
    <label className="flex items-center justify-between gap-4 py-3">
      <div>
        <div className="text-sm text-white/90">{label}</div>
        {sub && <div className="text-[11px] text-phasor-mute mt-0.5">{sub}</div>}
      </div>
      <button
        onClick={() => onChange(!on)}
        className={`relative w-11 h-6 rounded-full border transition-colors ${
          on ? "bg-phasor-green/80 border-phasor-green" : "bg-white/[0.05] border-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
            on ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}

export default function Settings() {
  const [sensitivity, setSensitivity] = useState(78);
  const [notifications, setNotifications] = useState({ push: true, email: true, slack: false });
  const [autoArm, setAutoArm] = useState(true);
  const [screenLock, setScreenLock] = useState(true);

  return (
    <div className="space-y-6" data-testid="console-settings">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">Workspace · Settings</div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mt-1">
          Tune your shield.
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sensitivity */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl glass p-5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">Detection sensitivity</div>
          <div className="mt-1 font-display text-lg font-semibold">How aggressive should Phasor be?</div>
          <div className="mt-5">
            <input
              type="range"
              min={30}
              max={98}
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full accent-phasor-green"
              data-testid="sensitivity-range"
            />
            <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-phasor-mute">
              <span>Gentle · fewer flags</span>
              <span className="text-phasor-green">{sensitivity}%</span>
              <span>Strict · flag anything suspicious</span>
            </div>
          </div>
          <div className="mt-4 text-xs text-phasor-mute">
            At {sensitivity}% Phasor will flag voice matches below <span className="text-white">{100 - sensitivity + 20}%</span> similarity threshold and any prosody outliers.
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl glass p-5">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-phasor-mute">
            <Bell className="w-3.5 h-3.5 text-phasor-green" /> Notifications
          </div>
          <div className="mt-1 font-display text-lg font-semibold">Where should we alert you?</div>
          <div className="mt-2 divide-y divide-white/5">
            <Toggle on={notifications.push} onChange={(v) => setNotifications({ ...notifications, push: v })} label="Push notifications" sub="Instant device alert on any Blocked/Flagged event" />
            <Toggle on={notifications.email} onChange={(v) => setNotifications({ ...notifications, email: v })} label="Email digest" sub="Daily 8 AM summary email · quiet by default" />
            <Toggle on={notifications.slack} onChange={(v) => setNotifications({ ...notifications, slack: v })} label="Slack channel" sub="Post alerts to a Slack channel (requires integration)" />
          </div>
        </motion.div>

        {/* Auto-arm */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl glass p-5">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-phasor-mute">
            <ShieldCheck className="w-3.5 h-3.5 text-phasor-green" /> Automation
          </div>
          <div className="mt-1 font-display text-lg font-semibold">Shield behavior</div>
          <div className="mt-2 divide-y divide-white/5">
            <Toggle on={autoArm} onChange={setAutoArm} label="Auto-arm before every meeting" sub="Shield turns on 60 seconds before any calendar event with a Meet/Zoom link" />
            <Toggle on={screenLock} onChange={setScreenLock} label="Lock screen on Blocked event" sub="If a synthetic media event is Blocked, immediately lock the workstation" />
          </div>
        </motion.div>

        {/* Data */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl glass p-5">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-phasor-mute">
            <KeyRound className="w-3.5 h-3.5 text-phasor-green" /> Data & privacy
          </div>
          <div className="mt-1 font-display text-lg font-semibold">Your voiceprints, your rules</div>
          <div className="mt-3 text-sm text-white/80 leading-relaxed">
            All biometric templates are stored on-device. Threat metadata is retained encrypted for 90 days by default.
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => toast.success("Export sent to your email.")}
              className="rounded-full border border-white/10 bg-white/[0.03] hover:border-phasor-green/30 hover:bg-phasor-green/[0.05] transition-colors text-xs px-4 py-2"
            >
              Export my data
            </button>
            <button
              onClick={() => toast.info("Retention window updated.")}
              className="rounded-full border border-white/10 bg-white/[0.03] hover:border-phasor-green/30 hover:bg-phasor-green/[0.05] transition-colors text-xs px-4 py-2"
            >
              Set retention to 30 days
            </button>
            <button
              onClick={() => toast.warning("This will wipe all local biometric templates.")}
              className="rounded-full border border-red-500/30 bg-red-500/[0.05] hover:bg-red-500/[0.08] text-xs px-4 py-2 text-red-300 inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3 h-3" /> Erase enrolled voices
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
