# Phasor — Real-Time Synthetic Media Defense (Waitlist Landing)

## Original problem statement
Premium 3D waitlist landing for "Phasor" — omni-channel real-time AI security platform that detects synthetic media / voice-clone scams. Dark futuristic aesthetic: #0B0F19 background, neon green (#00FF87) + cyan (#00F2FE), glassmorphism. Sections: Hero + waitlist + 3D waveform, 4-channel product-in-action tabs (Phone / Zoom / Chrome / Email), 3 simulated video demo cards, tech & compliance stats, footer. Added: floating social sidebar, "Threat is Real" bento stats, media reviews marquee. Latest: viral referral system + beta gate.

## User personas
- Concerned family member / consumer (primary)
- Enterprise security lead
- Chrome power user

## Architecture (Dec 2025)
- **Frontend**: React 19 + CRACO, Tailwind, lucide-react, @react-three/fiber v9 + drei + three, axios, sonner.
- **Backend**: FastAPI + SQLAlchemy 2 (async) + asyncpg. All routes prefixed `/api`. Alembic for migrations.
- **DB**: **Supabase Postgres** via Transaction Pooler (`aws-1-ca-central-1`, port 6543, statement_cache_size=0).
- **Env**: `DATABASE_URL` (backend), `REACT_APP_BACKEND_URL` (frontend), `ADMIN_TOKEN` default `phasor-admin-dev`, `CORS_ORIGINS`.

## Schema (`waitlist` table)
- `id` (uuid str, pk)
- `email` (str, unique, indexed)
- `source` (str)
- `created_at` (tz-aware, indexed)
- `referral_code` (str[8], unique, indexed) — user's own share code
- `referred_by_code` (str, FK → waitlist.referral_code, indexed)
- `referral_count` (int, default 0)
- `beta_access` (bool, default false, indexed)

## API surface
- `GET /api/` — status.
- `POST /api/waitlist` — join. Body: `{email, source?, ref?}`. Returns id, email, base_position, position, referral_code, referral_count, referrals_to_beta, beta_access, beta_slots_left, created_at, already_joined.
- `GET /api/waitlist/stats` — total, displayed_count (3127+total), beta_claimed, beta_slots_left.
- `GET /api/waitlist/lookup?code=` — fetch by referral_code (404 if missing).
- `GET /api/waitlist/admin?token=` — protected list (default token `phasor-admin-dev`).

## Business rules (implemented + tested)
- Each successful referral increments referrer's `referral_count` (atomic UPDATE ... RETURNING to avoid lost updates).
- Displayed position = `max(1, base_position - referral_count)`. Re-submitting the same email always returns the current adjusted position.
- Reaching 3 referrals grants `beta_access=true` iff there are beta slots left. Cap = **first 100** users to hit 3 referrals. Validated: after cap is full, 3+-referral users are NOT granted beta.
- Invalid/missing ref codes are silently ignored.

## Sections implemented
1. Sticky glass Navbar with real logo image (user-provided).
2. Hero: headline + subhead + waitlist form + 3D wireframe waveform (R3F, cyan→green intensity on cursor).
3. Post-signup SharePanel: position, referral code + share URL, copy button (with clipboard-API + textarea fallback), Twitter/Email/SMS share, 3-dot beta progress meter, "use different email" reset.
4. ThreatStats bento: 3 Seconds / $40B / 1 in 4 / 77%.
5. 4-channel CSS-3D mockups: Phone / Zoom / Chrome / Email with tabs.
6. VideoDemos: 3 glassmorphic player cards with play/pause toggle.
7. MediaReviews: infinite marquee (CNN, NBC, WSLS, FBI, Consumer Reports, Deloitte, WSJ, Reuters) + 3 quote cards.
8. StatsGrid: 4 KPIs + live sparkline + threat log + on-device model card + compliance badges.
9. Footer with real logo + LinkedIn/TikTok/Instagram/YouTube.
10. FloatingSocial: fixed vertical dock with 4 socials (hover cyan glow, tooltip).

## Test credentials
- Admin API token: `phasor-admin-dev`.
- Supabase Transaction Pooler URI in `/app/backend/.env` as `DATABASE_URL`.

## Test iterations
- Iter 1: MVP baseline — 100% pass.
- Iter 2: Logo + social + threat stats + media reviews — 100% pass, no regressions.
- Iter 3: Referral + beta unlock + 100-slot cap — 13/13 backend pass, all frontend flows pass. Clipboard bug fixed post-report.

## Backlog / Next
- P1: Email confirmation delivery (Resend) after waitlist join with the share link inline.
- P1: Public leaderboard section ("Top referrers this week") from `/api/waitlist/admin` filtered public view.
- P2: A11y audit + prefers-reduced-motion fallback for R3F canvas.
- P2: UTM capture + PostHog analytics on waitlist row.
- P3: Rate-limit POST /api/waitlist per IP.
- Optional cleanup: remove MONGO_URL/DB_NAME from backend/.env (unused since Supabase migration).
