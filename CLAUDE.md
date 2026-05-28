# CLAUDE.md — portfolio

Project guide for Claude (and Jaenil). Read this first whenever a session starts.

## What this project is

Personal portfolio for **Jaenil Parekh** (B.Tech CSE, IIT Jodhpur, 2024–28).
Faithful aesthetic clone of <https://shubham-404.vercel.app/> with Jaenil's
content + projects + personality swapped in. Multi-page React SPA: home,
projects, connect, (optionally) lifestyle. Heavy use of scroll-triggered
animations.

**Today's scope:** front-end only, single-day push. Backend (Express +
Postgres for contact form, view counts, real stats fetch) is **deferred** —
plan for it but don't build it today.

## Reference site

Live target: <https://shubham-404.vercel.app/>. We replicate his:
- Section composition (hero → projects → stats → music/anime → experience →
  selected works → CTA → footer)
- Color palette (exact hex values — see below)
- Typography (Geist + Geist Mono + Dancing Script)
- Animation stack (motion + GSAP + ScrollTrigger)
- Dark-mode-only (no light toggle)
- Multi-page routes (`/`, `/projects`, `/connect`, `/lifestyle`)
- Marquee/ticker navbar
- Audio-capable music tile

We do **not** clone:
- His content, copy, projects, photos, social handles
- Fake stats ("1k+ users / -40% latency" without source) — see "Hard rules"
- His exact font weights / spacings where Jaenil prefers differently

## Stack

- **Framework** — React 19 + Vite 8 + TypeScript 6 + **React Compiler**
  (via `babel-plugin-react-compiler` through `@rolldown/plugin-babel`).
- **Routing** — `react-router-dom` v7, declarative `<BrowserRouter><Routes>`.
- **Styling** — Tailwind CSS 4 via `@tailwindcss/vite`. Custom CSS only for
  the navbar marquee `@keyframes` (the one thing the reference site does in
  raw CSS too).
- **Animation** — `motion` (the rebranded framer-motion package) for
  per-component reveals + hover + variants/stagger; `gsap` + `@gsap/react`
  (`useGSAP`) + `ScrollTrigger` for heavier scroll-driven sequences.
- **Fonts** — Geist Sans + Geist Mono + Dancing Script. Loaded via
  Fontsource (`@fontsource-variable/geist`, `@fontsource-variable/geist-mono`,
  `@fontsource/dancing-script`).
- **Backend (deferred)** — Node + Express 5 + TS + `pg` + Postgres on
  Supabase. Will live in sibling `backend/` folder. Not built today.
- **Hosting target** — Vercel for the SPA; backend → Render; DB → Supabase.
  Deployment out of scope today.

## Repo layout

```
portfolio/
├── frontend/                # the React SPA — only thing we touch today
│   ├── package.json
│   ├── vite.config.ts       # react + react-compiler-preset + tailwind plugin
│   ├── tsconfig.json
│   ├── index.html           # FOUC nothing needed; dark-only
│   ├── public/
│   │   ├── resume.pdf       # Jaenil drops the file
│   │   ├── icons.svg        # SVG sprite (already there from Vite template)
│   │   └── images/          # avatar, project thumbnails, lifestyle photos
│   └── src/
│       ├── main.tsx         # router root
│       ├── App.tsx          # route definitions
│       ├── styles/
│       │   ├── index.css    # tailwind + tokens + marquee keyframes
│       │   └── reset.css    # if needed beyond tailwind preflight
│       ├── routes/
│       │   ├── Home.tsx
│       │   ├── Projects.tsx
│       │   ├── Connect.tsx
│       │   ├── Lifestyle.tsx    # TBD — may be deferred
│       │   ├── Work.$slug.tsx   # /work/:slug — per-project deep dive
│       │   └── NotFound.tsx
│       ├── sections/
│       │   ├── Hero.tsx
│       │   ├── SkillChips.tsx
│       │   ├── ProjectsGrid.tsx
│       │   ├── Stats.tsx
│       │   ├── MusicTile.tsx
│       │   ├── Experience.tsx
│       │   ├── Achievements.tsx     # Jaenil-specific (not in Shubham)
│       │   ├── SelectedWorks.tsx
│       │   ├── CTA.tsx
│       │   └── Footer.tsx
│       ├── components/
│       │   ├── Navbar.tsx           # marquee/ticker
│       │   ├── ProjectCard.tsx
│       │   ├── StatBadge.tsx
│       │   ├── Reveal.tsx           # motion-based wrapper for whileInView
│       │   └── PageShell.tsx        # nav + footer wrapper for sub-routes
│       ├── content/
│       │   ├── profile.ts           # name, role, bio, socials, music card
│       │   ├── projects.ts          # the 4 projects, typed, used everywhere
│       │   ├── experience.ts
│       │   └── achievements.ts
│       ├── lib/
│       │   ├── motion.ts            # shared variants (fadeUp, stagger, etc.)
│       │   └── useReveal.ts         # IntersectionObserver helper if needed
│       └── assets/
│           └── ...                  # in-bundle imports (vite handles)
│
├── backend/                 # DEFERRED — see "Backend (future)" below
├── CLAUDE.md
├── .gitignore
└── package.json             # legacy from old M0; will be cleaned up later
```

## Style conventions

### Colors (exact Shubham palette)

Background bases (dark only):
- `#09090b` — page background (Tailwind `zinc-950`)
- `#18181b` — card surface (Tailwind `zinc-900`)
- `#27272a` — elevated / hover surface (Tailwind `zinc-800`)
- `#101828` — deeper slate variant
- `#364153` — borders / muted text

Accent colors (used sparingly, one per card group):
- `#00bb7f` / `#00c758` — vibrant green (availability, success metrics)
- `#00a5ef` / `#3080ff` — bright blue (info, links)
- `#1e1a4d` / `#312c85` — indigo card backgrounds
- `#05df72` — bright green for "online" indicators
- Color-with-alpha pattern: `#00bb7fcc` (80% opacity) for hover states

Tailwind 4 color tokens go in `@theme` block in `index.css`.

### Typography

- **Geist Sans** — body, headings (most of the site)
- **Geist Mono** — labels, stat numbers, tech tags, code-flavored UI
- **Dancing Script** — one decorative accent (likely a quote or section subtitle)
- Display weight (600+) on hero name + section headings
- All loaded via Fontsource, imported once in `main.tsx`

### Motion

Per-component (motion library):
- `whileInView={{ opacity: 1, y: 0 }}` `initial={{ opacity: 0, y: 24 }}` for
  section reveals. `viewport={{ once: true, amount: 0.2 }}` to avoid re-trigger.
- `whileHover` on cards (slight `scale` + `borderColor` shift).
- Shared `variants` in `lib/motion.ts` with `staggerChildren` for grids that
  cascade in.
- `<MotionConfig reducedMotion="user">` at root of `App.tsx` so reduced-motion
  is honored automatically.

Scroll-driven (GSAP):
- `useGSAP` from `@gsap/react`, wrap each animated section.
- `ScrollTrigger.registerPlugin(ScrollTrigger)` once at the lib level.
- Used for: pinned scroll, multi-element timelines, parallax, scaleX/Y
  effects (e.g. progress bars revealing on scroll).
- Default `ease: 'power2.out'`, no exotic eases unless the reference uses them.

### Voice

First person. "I built …", not "Jaenil built …". English only.

## Hard rules — what NOT to do

- **No fabricated stats.** Numbers on the page must be real (LeetCode /
  Codeforces / GitHub APIs, or documented project metrics like Ignus '26
  "6k+ users / 99.99% uptime"). When the backend is wired (future), stats
  pull from live APIs. **Today, hardcode them from values Jaenil provides —
  flag every number that isn't backed by a source.** Skip a tile rather than
  guess.
- **No Next.js patterns.** No `app/` dir, no `next/*` imports. Vite + React
  Router only.
- **No styled-components, no CSS-in-JS lib.** Tailwind + minimal raw CSS.
- **No light mode.** The reference is dark-only; we are too. No theme toggle
  in the navbar.
- **No i18n.** English only.
- **No 1-to-1 copy of Shubham's content.** Structure, palette, animations,
  fonts → yes. His copy, his project descriptions, his photos → no.

## Workflow

**Pair-programming, milestone by milestone.** For each milestone Claude
proposes the design + code shape, then Jaenil writes the code. Claude helps
by explaining options, providing small targeted snippets, and reviewing
changes. Only make direct code edits if Jaenil explicitly asks for them.

Don't batch-implement multiple milestones in one go without check-in. Don't
add features outside the current milestone. Surface tradeoffs explicitly.

**Use this doc as the reference.** If there is a conflict between this file
and a suggestion, ask before proceeding.

**Explain suggestions.** When giving any code output or suggestions, always
explain the logic and high-level rationale behind it.

**Where Jaenil wants to be hands-on:** the **logic** — animation variants,
GSAP timelines, hooks, routing, data flow, theme context if any, contact
handling, content schemas. For logic: walk through the approach first,
let Jaenil write or co-write key pieces.

**Where Jaenil is less interested:** pure **UI / styling** work — Tailwind
class soup, color tweaks, copy formatting, gallery layouts. Claude can propose
these and provide snippets; Jaenil implements.

**Ask, don't assume.** When something is ambiguous (naming, library choice,
API shape, scope boundary, env-var meaning, whether a file should be
deleted), ask Jaenil before guessing. Surfacing a small question costs
seconds; an assumption that turns out wrong costs a rewrite. Default to
asking even when the assumption "feels obvious."

## 1-day milestone plan

Target: shippable front-end in one focused day (~7–8 productive hours).
Backend deferred to a separate session.

**M1 — Foundations** *(~60 min)*
- Wipe Vite default content (`App.tsx`, `App.css`, default assets).
- Install: `tailwindcss@4`, `@tailwindcss/vite`, `react-router-dom@7`,
  `motion`, `gsap`, `@gsap/react`, `@fontsource-variable/geist`,
  `@fontsource-variable/geist-mono`, `@fontsource/dancing-script`.
- Wire Tailwind 4 in `vite.config.ts`. Set up `src/styles/index.css` with
  `@import "tailwindcss"` + `@theme` block declaring all color tokens +
  font tokens.
- Set up router in `App.tsx` with `BrowserRouter` + routes for `/`,
  `/projects`, `/connect`, `/lifestyle`, `/work/:slug`, `*`.
- `<MotionConfig reducedMotion="user">` at the App root.
- `lib/motion.ts` — shared `variants`: `fadeUp`, `stagger`, `scaleIn`.
- Stub pages for all routes — just `<h1>Home</h1>` etc.
- ✅ Verify: `npm run dev` boots, all 5 routes navigate, dark zinc base
  paints, fonts load.

**M2 — Content layer** *(~30 min, Jaenil-led)*
- `content/profile.ts` — name, role, socials, music card (title/artist/
  tags), bio.
- `content/projects.ts` — 4 projects: ignus-26 (featured), finsage, oceas,
  iitj-library.
- `content/experience.ts`, `content/achievements.ts`.
- TS types co-located, strict.
- ✅ Verify: `npx tsc --noEmit` clean.

**M3 — Navbar + marquee** *(~45 min)*
- `components/Navbar.tsx` — links (Stats/Works/Connect/Lifestyle), wordmark.
- Marquee/ticker — two `@keyframes` (`scrollLeft`, `scrollRight`) in
  `index.css`, applied to a horizontal `<ul>` of repeated labels.
- Sticky on scroll, blur backdrop.
- Lives at the top of every route via `PageShell`.
- ✅ Verify: marquee scrolls smoothly, nav links route, sticky behavior
  works.

**M4 — Hero section** *(~75 min)*
- `sections/Hero.tsx` — avatar + name + role + skill chips + social icons
  + email link + Works → button + green availability dot.
- Reveal animation: stagger children in on mount (motion variants).
- Hover effects on socials.
- ✅ Verify: matches the Shubham hero composition with Jaenil's content.

**M5 — Projects grid + Stats + Music + Experience** *(~90 min)*
- All on Home page below hero.
- `sections/ProjectsGrid.tsx` — 3-card row (top 3 projects), each card
  reveals on scroll, hover-lifts. Routes to `/work/:slug`.
- `sections/Stats.tsx` — real LC / CF / GH numbers (hardcoded today from
  Jaenil's actual handles; backend wires these later).
- `sections/MusicTile.tsx` — static now-playing card, audio-ready markup
  (a real `<audio>` element with `controls={false}` but `ref`-able later).
- `sections/Experience.tsx` — single item (IITJ Library full-stack role).
- ✅ Verify: scroll Home top to bottom, every section reveals on enter,
  no layout shift between routes.

**M6 — Achievements + Selected Works + CTA + Footer** *(~75 min)*
- `sections/Achievements.tsx` — two columns (Achievements / Leadership).
- `sections/SelectedWorks.tsx` — 3 more project cards (deeper preview than
  the grid above).
- `sections/CTA.tsx` — "Let's build something" with email CTA.
- `sections/Footer.tsx` — resume link, last-updated, email, mini nav.
- ✅ Verify: full Home scrolls top to bottom with all sections.

**M7 — Sub-pages** *(~60 min)*
- `/projects` — full project list with deeper descriptions.
- `/connect` — contact form (static today; submits to a `mailto:` or
  Formspree fallback — backend integration deferred).
- `/work/:slug` — per-project deep dive (header / overview / features /
  tech / metrics).
- `/lifestyle` — defer decision; either stub or fold into Home.
- ✅ Verify: all sub-routes render, deep-dive picks up the right project,
  prev/next nav works.

**M8 — Polish + GSAP scroll sequences** *(~60 min)*
- Add 1–2 GSAP `useGSAP` sequences for the heavier scroll moments (pinned
  hero on Home, or the Selected Works section reveal). Use sparingly —
  motion library handles most of the reveals.
- 404 page styled to match.
- Meta tags / OG / favicon.
- Mobile pass (375px reflow check for every section).
- ✅ Verify: Lighthouse on `/` (Performance ≥85, Accessibility ≥95).

**Total estimate:** ~7 hrs of focused work. Buffer for content-iteration is
inside each section's time budget.

## Backend (future, NOT today)

When we revisit:
- `backend/` as sibling folder, npm workspace or standalone.
- Express 5 + `pg` + raw SQL migrations.
- Tables: `contact_submissions`, `page_views`, `stats_cache`.
- Endpoints: `POST /api/contact`, `GET|POST /api/views/:slug`, `GET /api/stats`,
  `GET /api/health`.
- Stats refresh worker: LeetCode + Codeforces + GitHub via `Promise.allSettled`,
  cached in Postgres, refreshed every 10 min.
- Frontend swaps hardcoded stats / static contact form for live API calls.

Required env vars (server-side, for future):

| Var | Notes |
|-----|-------|
| `PORT` | default 4000 |
| `POSTGRES_URL` | Supabase direct URI |
| `CLIENT_ORIGIN` | locked CORS, e.g. `http://localhost:5173` |
| `SMTP_HOST/PORT/USER/PASS` | nodemailer |
| `MAIL_TO`, `MAIL_FROM` | contact notification routing |
| `STATS_LEETCODE_HANDLE`, `STATS_CODEFORCES_HANDLE`, `STATS_GITHUB_HANDLE` | for stats fetchers |
| `GITHUB_TOKEN` | PAT with `read:user` |

## Commands

```sh
cd frontend
npm install                  # install deps
npm run dev                  # Vite dev server :5173
npm run build                # production bundle
npm run lint                 # eslint
npx tsc --noEmit             # typecheck
```

## Git

- Repo: <https://github.com/jaenil/portfolio>.
- `template-baseline` tag = untouched Valentin template (commit `a901b07`).
- `m0-skeleton` tag = the old monorepo skeleton (commit `e83e55d`) — now
  obsolete; left for history.
- **Jaenil owns all git operations.** Claude does NOT run `git add`,
  `git commit`, `git tag`, `git push`, branch ops, or anything that mutates
  git state. Read-only inspection (`git status`, `git log`, `git diff`,
  `git show <tag>:<path>`) is fine when needed for context.
- One commit per logical step. Push after each verified milestone — Jaenil's
  call on when/how.
- Never amend pushed commits. Never `--no-verify`.

## Open items / TBD

- **Lifestyle section** — full route with photo gallery, scoped down to
  4–6 photos as a Home section, or dropped entirely. Decide before M7.
- **Achievements section design** — two-column or list? Decide during M6.
- **Real stats numbers** — Jaenil provides LC/CF/GH stats during M5.
- **Resume PDF** — Jaenil drops `frontend/public/resume.pdf` before M6.
- **Music card content** — title/artist/vibe tags from Jaenil during M5.
- **Backend port** — when wiring later, decide if frontend should restructure
  into npm workspaces or backend stays a sibling project.
