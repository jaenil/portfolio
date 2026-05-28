# CLAUDE.md — portfolio

Project guide for Claude (and Jaenil). Read this first whenever a session starts.

## What this project is

Personal portfolio for **Jaenil Parekh** (B.Tech CSE, IIT Jodhpur, 2024–28).
Single long home page with a **bento-grid hero** + five scroll sections, plus
per-project deep-dive routes. Real Node/Express + Postgres backend doing
meaningful work: persists contact-form submissions, tracks per-project view
counts, and caches LeetCode / Codeforces / GitHub stats for the hero tiles.

Design inspiration: <https://shubham-404.vercel.app> for the **bento hero
layout only**. Aesthetic is strict **monochrome editorial** — no gradients,
no colored accent cards. Single accent = green `●` (availability dot).

Full milestone plan: `~/.claude/plans/users-jaenilparekh-downloads-resume-pdf-cozy-balloon.md`.

## Stack

- **Frontend** — React 19 + Vite + TypeScript + Tailwind CSS 4 + `react-router-dom` v7.
- **Backend** — Node + Express 5 + TypeScript + `pg` (node-postgres) + raw SQL migrations.
- **Database** — Postgres on Supabase free tier. Connected via direct `POSTGRES_URL` from `server/`. **No** Supabase JS client; no Supabase auth/storage features.
- **Email** — Nodemailer.
- **Repo shape** — `npm` workspaces monorepo: `client/`, `server/`, `shared/`.
- **Hosting target** — `client/` → Vercel · `server/` → Render · `db` → Supabase. Deployment is out of scope for v1.

## Repo layout (target)

```
portfolio/
├── client/                 # React + Vite app
├── server/                 # Express API + stats worker
├── shared/                 # cross-wire TS types (contact, views, stats)
├── package.json            # workspaces root (npm), orchestration scripts
├── .env.example
└── CLAUDE.md
```

Detailed file layout is in the plan file. Don't recreate it here.

## Commands

```sh
npm install                              # install all workspaces
npm run dev -w @portfolio/client         # Vite dev server (default :5173)
npm run dev -w @portfolio/server         # Express in watch mode (default :4000)
npm run dev                              # both, in parallel (via npm-run-all)
npm run build -w @portfolio/client       # production client bundle
npm run build -w @portfolio/server       # tsc → server/dist
npm run lint -w @portfolio/client        # eslint client/
npm run lint -w @portfolio/server        # eslint server/
npm run typecheck                        # tsc --noEmit across workspaces
```

## Required environment variables

All listed in `.env.example`. The server reads them from `server/.env`. Never
commit real values; `.env*` is gitignored except for the example.

| Var | Used by | Notes |
|-----|---------|-------|
| `PORT` | server | default 4000 |
| `POSTGRES_URL` | server | Supabase "URI" connection string (not pooled, for migrations) |
| `CLIENT_ORIGIN` | server | locked CORS origin, e.g. `http://localhost:5173` in dev |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` | server | nodemailer transport |
| `MAIL_TO` `MAIL_FROM` | server | contact-form notification routing |
| `STATS_LEETCODE_HANDLE` | server | for `jobs/leetcode.ts` |
| `STATS_CODEFORCES_HANDLE` | server | for `jobs/codeforces.ts` |
| `STATS_GITHUB_HANDLE` | server | for `jobs/github.ts` |
| `GITHUB_TOKEN` | server | PAT with `read:user` for contributionsCollection |

## Hard rules — what NOT to do

- **No Next.js patterns.** No `app/` directory, no `next/*` imports, no
  `'use server'`, no API routes — Express owns the backend.
- **No `next-themes`, no styled-components.** Theme via a tiny React context
  in `client/src/lib/theme.tsx`. Style via Tailwind + small `@keyframes` in
  `index.css`.
- **No Three.js, no Beams, no 3D backgrounds.** Removed from the template.
- **No i18n / French copy.** English only, first person.
- **No gradients, no colored accent cards in the bento hero.** Monochrome
  surfaces only; differentiate cards by border + radius + subtle elevation.
- **No fabricated stats.** Numbers on the page must be real (LeetCode /
  Codeforces / GitHub APIs, or documented project metrics like "Ignus 6k+
  users / 99.99% uptime"). Skip a tile rather than fake a number.
- **No Supabase JS client.** Use `pg` against the direct Postgres URL.

## Style conventions

- **Type** — Geist Sans + Geist Mono via Fontsource (`@fontsource-variable/geist`).
  Mono for labels, numbers, tech tags. Display weight on the hero name only.
- **Theme** — dark default, light/dark toggle persisted in `localStorage`.
- **Voice** — first person ("I built…", not "Jaenil built…").
- **Motion** — minimal. `useReveal` (IntersectionObserver) fades in scroll
  sections. Hover transitions on cards (~150ms). Carousel auto-advances ~6s,
  pauses on hover.
- **A11y** — every bento tile has a semantic landmark or `aria-label`. The
  featured-project carousel: keyboard prev/next + `aria-live="polite"`.

## Bento hero composition

Eight tiles, all monochrome:

1. **ProfileTile** — avatar, name, role, socials, `Works →` anchor, green dot.
2. **WordmarkTile** — display-weight typographic block.
3. **FeaturedCarousel** — cycles all 4 projects (Ignus '26 default).
4. **StatTile (LeetCode)** — solved · rating · global rank.
5. **StatTile (Codeforces)** — current rating · max · rank title.
6. **MusicTile** — static now-playing card driven by `profile.nowPlaying`.
7. **GhContribTile** — last-12-weeks contributions mini-graph.
8. **SidebarLabels** — 4 rotated placeholder labels (Jaenil fills before launch).

## Backend endpoints

- `POST /api/contact` — zod-validated; rate-limited 5/h/IP; insert → fire
  email (non-blocking) → flip `email_sent` on success.
- `GET /api/views/:slug` — read-only count for project pages.
- `POST /api/views/:slug` — slug must be in `PROJECT_SLUGS`; debounced
  client-side per session.
- `GET /api/stats` — returns latest cached `{ leetcode, codeforces, github,
  refreshedAt }`. Never blocks on upstream APIs.
- `GET /api/health` — `SELECT 1` against Postgres.

A boot-time worker (`server/src/jobs/refreshStats.ts`) refreshes the stats
cache every 10 min via `Promise.allSettled` — one upstream failing never
breaks the others.

## Workflow

**Pair-programming, milestone by milestone.** For each milestone Claude
proposes the design + code shape, writes a first pass, Jaenil reviews and
modifies, iterate, then verification command, then commit + tag, move on.

Don't batch-implement multiple milestones in one go without check-in. Don't
add features outside the current milestone. Surface tradeoffs explicitly.

**Where Jaenil wants to be hands-on:** the **logic** — backend endpoints,
DB schema + queries, stats fetchers, validation, contact/views/stats wiring,
hooks and data flow on the client, theme context, router setup. For logic
milestones: walk through the approach first, let Jaenil write or co-write
key pieces, don't drop fully-finished code without breaking it down.

**Where Jaenil is less interested:** pure **UI / styling** work — bento
tile layouts, Tailwind class soup, motion polish, copy formatting. Claude
can produce these in larger drops; Jaenil will skim and call out changes.

**Ask, don't assume.** When something is ambiguous (naming, library
choice, API shape, scope boundary, env-var meaning, whether a file should
be deleted), ask Jaenil before guessing. Surfacing a small question costs
seconds; an assumption that turns out wrong costs a rewrite. Default to
asking even when the assumption "feels obvious" — Jaenil prefers being
looped in.

Current state: see `~/.claude/plans/users-jaenilparekh-downloads-resume-pdf-cozy-balloon.md`
for the active plan and the milestone we're on.

## Git

- Repo: <https://github.com/jaenil/portfolio>.
- `template-baseline` tag = untouched Valentin template (commit `a901b07`).
- One commit per logical step. Push after each verified milestone.
- Never amend pushed commits. Never `--no-verify`.
