# CraftCode — Project Tracker

> Attach when asking "what should I build next" or referencing a specific phase. Update status as you complete tasks.

---

## Phase status legend
```
[ ] Not started   [~] In progress   [x] Complete   [!] Blocked
```

---

## Phase 1 — Monorepo Setup
**Goal**: Both servers running, packages linked, env documented.

- [x] pnpm workspace config (`pnpm-workspace.yaml`)
- [x] Root `package.json` with `dev` script (concurrently)
- [x] `apps/web` — Next.js 14, TypeScript, Tailwind, Inter + JetBrains Mono fonts
- [x] `apps/api` — Express, TypeScript, ts-node-dev, port 4000
- [x] `packages/db` — Prisma init, datasource only (no models yet)
- [x] `packages/types` — empty exports scaffold
- [x] `packages/test-runner` — placeholder `runHTMLTests` function
- [x] `tsconfig.base.json` shared config
- [x] `.env.example` at root with all variable names
- [x] `GET /health` route on api returns `{ status:'ok' }`
- [x] `README.md` with setup steps

**Estimate**: 2–3 hrs

---

## Phase 2 — Auth + Database Schema
**Goal**: Users can register, login, complete onboarding. All DB models exist.

- [x] Prisma schema: User, Project, Step, UserProjectProgress, StepAttempt, Leaderboard
- [x] All enums: AuthProvider, Tier, ExperienceLevel, ProgressStatus, SubscriptionStatus
- [x] Seed data: Todo App (6 steps) + Ecommerce Page (5 steps) with full step content
- [x] `POST /auth/register` — bcrypt, create user, return JWT
- [x] `POST /auth/login` — verify, return JWT + user object
- [x] `GET /api/users/me` — auth required
- [x] `PATCH /api/users/me` — update experienceLevel + onboardingDone
- [x] Auth middleware (`apps/api/src/middleware/auth.ts`)
- [x] NextAuth v5 — CredentialsProvider + GoogleProvider
- [x] NextAuth callbacks: attach tier, experienceLevel, onboardingDone to session
- [x] `/login` page — email/password form + Google button
- [x] `/register` page — name/email/password form
- [x] `/onboarding` page — 3-option card picker
- [x] Next.js middleware — protect `/dashboard/*`, `/workspace/*`; redirect `/onboarding` if `!onboardingDone`

**Estimate**: 4–5 hrs

---

## Phase 3 — Catalog + Dashboard
**Goal**: Users can browse projects, see their progress, and start/resume a project.

- [ ] `GET /api/projects` — list (no starterCode/solution/hints)
- [ ] `GET /api/projects/:slug` — detail + step titles only
- [ ] `GET /api/users/me/progress` — all UserProjectProgress with project join
- [ ] `GET /api/users/me/stats` — { projectsCompleted, totalTimeSeconds, currentRank }
- [ ] UI components: Button, Badge, Card, Modal, Skeleton, Spinner
- [ ] ProjectCard, ProjectGrid (filter + search), TierBadge, DifficultyBadge
- [ ] UpgradeModal (shown on FREE user clicking PRO project)
- [ ] Navbar (logo, links, streak badge, notification bell, avatar dropdown)
- [ ] `/dashboard` — in-progress section, recommended section, stats row
- [ ] `/projects` — filter bar (difficulty, tier), search, grid of ProjectCards
- [ ] `/projects/[slug]` — hero, step list (locked/current/complete), Start/Resume/Completed button
- [ ] `POST /api/progress` to create UserProjectProgress on Start
- [ ] Tier gating: isLocked check, UpgradeModal, 403 on API direct access

**Estimate**: 3–4 hrs

---

## Phase 4 — Workspace (Core Product)
**Goal**: Full coding environment — editor, tests, hints, timer, step progression.

- [x] `GET /api/workspace/:slug/:step` — step data (never solutionCode)
- [x] `POST /api/workspace/:slug/:step/hint` — reveal hint, increment hintsUsed
- [x] `POST /api/progress/:projectId/step/:step` — record attempt, advance/complete
- [x] WorkspaceContext (code, testResults, hints, timer, isRunning)
- [x] Timer: counts up, localStorage persist, pause on tab hidden
- [x] Code persistence: localStorage debounced 500ms
- [x] `CodeEditor.tsx` — Monaco wrapper (vs-dark, JetBrains Mono, no minimap)
- [x] `HintsPanel.tsx` — reveal one at a time, warning before first, disable when exhausted
- [x] `runHTMLTests()` in packages/test-runner — iframe sandbox implementation
- [x] `TestResultsPanel.tsx` — collapsible, pass/fail per test, green flash on all pass
- [x] `StepCompleteToast.tsx` — 1.5s then navigate to next step or /complete
- [x] Workspace layout: top bar (back, step dots, timer), left panel, Monaco, right panel (preview + tests), bottom bar (prev/next)
- [ ] `/workspace/[slug]/complete` — score breakdown, time, hints, share button

**Estimate**: 6–8 hrs

---

## Phase 5 — Leaderboard + Profiles
**Goal**: Rankings visible, live updates working, user profiles public.

- [ ] `GET /api/leaderboard` — all projects + top scorer + user rank
- [ ] `GET /api/leaderboard/:projectId` — top 50 + user's entry if outside top 50
- [ ] `GET /api/profile/:userId` + `GET /api/profile/me`
- [ ] `recalculateRanks(projectId)` — Prisma transaction
- [ ] Socket.io server setup (attach to HTTP server, rooms)
- [ ] `emitLeaderboardUpdate(io, projectId)` helper
- [ ] `useLeaderboardSocket(projectId)` hook — join room, listen, cleanup
- [ ] `/leaderboard` page — overview of all projects
- [ ] `/leaderboard/[slug]` — LeaderboardTable (client), live dot, flash animation on update
- [ ] `/profile/[userId]` — ProfileHeader, CompletedProjectsGrid, stats
- [ ] Wire up: project completion triggers Socket.io emit

**Estimate**: 3–4 hrs

---

## Phase 6 — Subscriptions + Polish
**Goal**: Stripe working, pricing page live, production-ready error handling.

- [ ] Prisma migration: add stripeCustomerId, stripeSubscriptionId, subscriptionStatus to User
- [ ] `POST /api/billing/checkout` — Stripe Checkout Session
- [ ] `POST /api/billing/portal` — Stripe Customer Portal
- [ ] `POST /api/billing/webhook` — raw body, signature verify, handle 4 events
- [ ] `GET /api/billing/status`
- [ ] `/pricing` page — monthly/annual toggle, Free/Pro/Team cards, comparison table
- [ ] `/payment/success` — confetti, session refresh
- [ ] `/settings` page — Profile tab, Subscription tab (plan + portal link + PAST_DUE banner), Account tab
- [ ] `PATCH /api/users/me/profile` — name + avatarUrl
- [ ] Rate limiting: `express-rate-limit` (10/15min auth, 100/min api)
- [ ] Helmet.js security headers
- [ ] Zod validation on all routes
- [ ] `apps/web/src/app/error.tsx` — error boundary
- [ ] `apps/web/src/app/not-found.tsx`
- [ ] `Skeleton.tsx` + `ProjectCardSkeleton.tsx`

**Estimate**: 4–5 hrs

---

## Phase 7 — Growth Features
**Goal**: Increase signups, retention, and Pro conversion.

### 7.1 Guest mode
- [ ] Skip auth on `/workspace/[slug]/1?guest=true`
- [ ] GuestBanner component
- [ ] GuestConvertModal on step 1 pass
- [ ] `POST /api/guest/convert`

### 7.2 Shareable completion cards
- [ ] `apps/web/src/app/api/og/completion/route.tsx` — Next.js ImageResponse
- [ ] CompletionCard component (mirrors OG image)
- [ ] ShareButton (Twitter intent URL + LinkedIn clipboard copy)
- [ ] OG meta tags on `/workspace/[slug]/complete`

### 7.3 Streaks
- [ ] Prisma migration: add currentStreak, longestStreak, lastActivityDate, streakFreezes, timezone to User
- [ ] Streak update logic in POST /api/progress step handler
- [ ] `GET /api/users/me/streak`
- [ ] Resend email integration — streak at-risk alert at 6 PM user timezone
- [ ] StreakBadge (navbar), StreakCard (dashboard), StreakAtRiskBanner

### 7.4 AI hints
- [ ] `POST /api/workspace/:slug/:step/ai-hint` — Pro tier check, Claude API call
- [ ] System prompt: tutor mode, never reveal solution, <150 words
- [ ] AiHintPanel (chat UI, conversation history in state)
- [ ] AiHintLocked (shown to Free users)
- [ ] Prisma migration: add aiContext to Step

### 7.5 Weekly challenges
- [ ] Prisma migration: WeeklyChallenge, ChallengeEntry, Badge models + BadgeType enum
- [ ] `GET /api/challenges/current`
- [ ] `GET /api/challenges/:weekNumber`
- [ ] `POST /api/challenges/:id/complete`
- [ ] `GET /api/users/me/badges`
- [ ] `POST /api/internal/challenges/close` — cron endpoint
- [ ] `/challenges` + `/challenges/[weekNumber]` pages
- [ ] ChallengeBanner, ChallengeCard, CountdownTimer, BadgeRow components
- [ ] Railway cron or GitHub Actions: call close endpoint Sunday 23:59 UTC

**Estimate**: 10–14 hrs total for phase 7

---

## Total estimate
| Phase | Hours |
|-------|-------|
| 1 Monorepo | 2–3 |
| 2 Auth + Schema | 4–5 |
| 3 Catalog + Dashboard | 3–4 |
| 4 Workspace | 6–8 |
| 5 Leaderboard | 3–4 |
| 6 Subscriptions | 4–5 |
| 7 Growth | 10–14 |
| **Total** | **32–43 hrs** |
