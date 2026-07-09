import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Video,
  Radar,
  Fingerprint,
  Puzzle,
  SlidersHorizontal,
  ArrowLeft,
  Shield,
  Search,
  Bell,
  Command,
} from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_voice-guard-ai-3/artifacts/v7p21zyd_Gemini_Generated_Image_elo52gelo52gelo5.png";

const NAV = [
  { to: "/console", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/console/meetings", label: "Meetings", icon: Video },
  { to: "/console/threats", label: "Threat Log", icon: Radar, badge: 4 },
  { to: "/console/fingerprints", label: "Voice DNA", icon: Fingerprint },
  { to: "/console/integrations", label: "Integrations", icon: Puzzle },
  { to: "/console/settings", label: "Settings", icon: SlidersHorizontal },
];

export default function ConsoleShell() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-phasor-bg text-white overflow-hidden">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none fixed -top-32 -left-32 w-[600px] h-[600px] radial-glow-green blur-3xl opacity-40" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[500px] radial-glow-cyan blur-3xl opacity-30" />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="px-5 py-5 flex items-center gap-2.5 border-b border-white/5">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-phasor-cyan/25 bg-black/60">
              <div className="absolute inset-0 blur-lg bg-phasor-cyan/30" />
              <img src={LOGO_URL} alt="" className="relative w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-display font-bold tracking-tight">Phasor</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-phasor-mute">Console · v0.9.2</div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            <div className="px-3 pt-2 pb-1 text-[10px] font-mono uppercase tracking-widest text-phasor-mute">Workspace</div>
            {NAV.map(({ to, label, icon: Icon, badge, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                data-testid={`console-nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-phasor-green/10 text-white border border-phasor-green/25"
                      : "text-white/60 hover:text-white hover:bg-white/[0.03] border border-transparent"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="text-[10px] font-mono rounded-full bg-red-500/15 border border-red-500/30 text-red-300 px-2 py-0.5">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-3 border-t border-white/5">
            <button
              onClick={() => navigate("/")}
              data-testid="console-back-landing"
              className="w-full flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white/70 hover:text-white hover:border-phasor-green/30 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to landing
            </button>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-phasor-green/[0.06] border border-phasor-green/25 px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-phasor-green to-phasor-cyan text-black font-display font-bold text-xs flex items-center justify-center">
                YP
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">You (Preview)</div>
                <div className="text-[10px] font-mono text-phasor-green flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Armed
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 backdrop-blur-xl bg-phasor-bg/70 border-b border-white/5">
            <div className="flex items-center gap-3 px-5 py-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/[0.03] border border-white/10 px-3 py-1.5 text-xs text-white/60 flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-phasor-mute" />
                <span className="truncate">Search meetings, participants, threats…</span>
                <span className="ml-auto flex items-center gap-1 text-[10px] font-mono text-phasor-mute">
                  <Command className="w-3 h-3" />K
                </span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button className="relative w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-phasor-green animate-blink" />
                </button>
                <div className="hidden sm:flex items-center gap-2 rounded-full bg-black/40 border border-white/10 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-phasor-green animate-blink" />
                  Live · Global edge
                </div>
              </div>
            </div>
          </header>

          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex-1 min-w-0 px-5 sm:px-8 py-6"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
}
