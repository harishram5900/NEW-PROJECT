# Phasor — Real-Time Synthetic Media Defense (Waitlist Landing)

## Original problem statement
Premium, conversion-focused 3D waitlist landing page for "Phasor" — an omni-channel, real-time AI security platform that instantly detects and blocks synthetic media / AI voice-clone scams across communications. Dark futuristic aesthetic: near-black background, neon green (#00FF87), cyan (#00F2FE) accents, glassmorphism. Sections: Hero + waitlist + 3D waveform, 4-channel product-in-action tabs (Phone / Zoom / Chrome / Email) with UI mockups, 3 simulated video demo cards, tech & compliance stats grid, footer.

## User personas
- **Concerned family member / consumer** — wants to protect elderly parents from voice-clone scams (primary).
- **Enterprise security lead** — evaluating deepfake protection for Zoom / email flows.
- **Chrome power user** — wants a browser-level filter for social feeds.

## User choices (confirmed)
- Waitlist storage: MongoDB with admin API.
- 3D approach: Mix — R3F for hero waveform, CSS-3D for all mockups.
- Colors: near-black + neon green primary, cyan secondary.
- User will provide logo later; main agent generated all other visuals.

## Architecture
- **Frontend**: React 19 + CRACO, Tailwind, framer-motion (installed), lucide-react icons, @react-three/fiber v9 + @react-three/drei + three.
- **Backend**: FastAPI + Motor (MongoDB), routes prefixed with `/api`.
- **DB**: MongoDB, collection `waitlist` — fields id (uuid), email (lowercased), source, created_at (ISO).
- **Env**: `REACT_APP_BACKEND_URL` (frontend), `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`, optional `ADMIN_TOKEN` (default `phasor-admin-dev`).

## API surface
- `GET /api/` — service ping.
- `POST /api/waitlist` — join waitlist, idempotent on email.
- `GET /api/waitlist/stats` — `{total, displayed_count}` (baseline 3127 + total for social proof).
- `GET /api/waitlist/admin?token=…` — protected list.

## Implemented (Dec 2025)
- Fully responsive dark landing page with sticky glass navbar.
- Interactive 3D wireframe audio waveform (R3F) with cursor-driven intensity + cyan→green color shift.
- Waitlist form with live count, idempotent submit, sonner toasts, "Secured" success state.
- 4-channel CSS-3D mockups: Phone (incoming call + AI clone alert), Zoom (sidebar Phasor widget + deepfake warning), Chrome (extension modal blocking synthetic clip), Email (verified scan header + blocked attachment).
- 3 glassmorphic video demo cards with play/pause toggle, seek bar, timers, Unsplash thumbnails.
- Stats & compliance grid: latency, live-updating artifact counter, false-positive rate, throughput; live threat stream sparkline; on-device model card; SOC2/GDPR/HIPAA/ISO/CCPA badges.
- Minimalist footer with social + status.
- IntersectionObserver reveal animations, grid backdrop, radial glows, glassmorphism, noise overlay.
- data-testid attributes on all interactive elements. Testing agent iteration 1 = 100% pass.

## Test credentials
- Admin API token: `phasor-admin-dev` (from env `ADMIN_TOKEN`, default).

## Backlog / Next
- P1: Wire user-provided logo into Navbar + Footer.
- P1: Email confirmation delivery (Resend/SendGrid) after waitlist join.
- P2: Add referral share link + position leaderboard for viral growth.
- P2: Replace static Unsplash thumbs with real product demo screen recordings.
- P2: Analytics (PostHog/Plausible) + UTM capture on waitlist row.
- P3: A11y audit + prefers-reduced-motion fallback for R3F canvas.
