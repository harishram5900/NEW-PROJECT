/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        phasor: {
          bg: "#0B0F19",
          surface: "#111726",
          surface2: "#0E1320",
          green: "#00FF87",
          cyan: "#00F2FE",
          danger: "#FF3B30",
          mute: "#94A3B8",
        },
        border: "rgba(255,255,255,0.08)",
        input: "rgba(255,255,255,0.08)",
        ring: "#00FF87",
        background: "#0B0F19",
        foreground: "#FFFFFF",
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      keyframes: {
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 0px rgba(0,255,135,0.0)" },
          "50%": { boxShadow: "0 0 24px rgba(0,255,135,0.55)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        scanline: "scanline 2.4s linear infinite",
        floaty: "floaty 5s ease-in-out infinite",
        blink: "blink 1.4s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
