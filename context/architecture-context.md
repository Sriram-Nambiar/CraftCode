# CraftCode — Architecture Context

> Attach when working on: DB schema, API routes, auth, payments, real-time, or repo structure.

---

## Stack
| Layer | Tech | Notes |
|-------|------|-------|
| Frontend | Next.js 14 App Router + TypeScript + Tailwind | Vercel deploy |
| Backend | Express + TypeScript | Railway deploy, port 4000 |
| DB | PostgreSQL + Prisma ORM | Railway Postgres |
| Auth | NextAuth.js v5 | JWT, Credentials + Google |
| Editor | Monaco (`@monaco-editor/react`) | vs-dark, JetBrains Mono |
| Test runner | Client-side iframe sandbox | `srcdoc` + `contentWindow.eval()` |
| Real-time | Socket.io | Leaderboard rooms only |
| Payments | Stripe subscriptions | Checkout + Customer Portal |
| AI hints | Anthropic Claude API (server-side only) | Never client-direct |
| Email | Resend | Streak alerts, 3k free/mo |
| Monorepo | pnpm workspaces | |

---

## Repo structure
```
craftcode/
├── apps/web/          Next.js frontend
├── apps/api/          Express backend
├── packages/db/       Prisma schema + client (@craftcode/db)
├── packages/types/    Shared TS types (@craftcode/types)
├── packages/test-runner/  iframe sandbox (@craftcode/test-runner)
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

---

## Database schema (Prisma)

### Enums
```
AuthProvider:       CREDENTIALS | GOOGLE
Tier:               FREE | PRO
ExperienceLevel:    BEGINNER | INTERMEDIATE | ADVANCED
ProgressStatus:     NOT_STARTED | IN_PROGRESS | COMPLETED
SubscriptionStatus: ACTIVE | CANCELED | PAST_DUE | TRIALING
BadgeType:          WEEKLY_WINNER_GOLD | SILVER | BRONZE
```

### Models (fields only — no FK syntax, see schema.prisma for full)
```
User:                id email name avatarUrl? passwordHash? provider tier experienceLevel?
                     onboardingDone stripeCustomerId? stripeSubscriptionId? subscriptionStatus?
                     currentStreak longestStreak lastActivityDate? streakFreezes timezone
                     createdAt updatedAt

Project:             id slug title description coverImageUrl? tier difficulty
                     estimatedMinutes totalSteps tags[] createdAt

Step:                id projectId order title instructions starterCode solutionCode
                     hints[] testCases(Json) aiContext?
                     @@unique([projectId, order])

UserProjectProgress: id userId projectId status currentStep startedAt completedAt?
                     totalTimeSeconds hintsUsed score?
                     @@unique([userId, projectId])

StepAttempt:         id userId stepId passed submittedCode timeSpentSeconds
                     hintsUsedOnStep attemptedAt

Leaderboard:         id userId projectId score timeSeconds hintsUsed rank completedAt
                     @@unique([userId, projectId])

WeeklyChallenge:     id projectId weekNumber year startsAt endsAt isActive
                     @@unique([weekNumber, year])

ChallengeEntry:      id userId weeklyChallengeId score timeSeconds hintsUsed rank? completedAt
                     @@unique([userId, weeklyChallengeId])

Badge:               id userId type label awardedAt
```

---

## Auth flow
```
Register → bcrypt hash → User(CREDENTIALS) → JWT → /onboarding
Google   → NextAuth OAuth → auto-create User(GOOGLE) → JWT → /onboarding
Onboarding → PATCH /api/users/me { experienceLevel, onboardingDone:true } → /dashboard
Middleware: /dashboard/* /workspace/* → redirect /login if no session
           /login /register → redirect /dashboard if session exists
```

---

## Test runner (client-side)
```ts
// packages/test-runner/src/index.ts
async function runHTMLTests(userCode, testCases): Promise<TestResult[]>
  1. Create hidden iframe, append to body
  2. Set iframe.srcdoc = userCode
  3. Await load event
  4. For each testCase: iframe.contentWindow.eval(testCase.testFn)
  5. Remove iframe
  6. Return [{ id, description, passed, error? }]
// NEVER runs server-side. No Docker needed for HTML/JS projects.
```

---

## Step progression flow
```
User clicks Run Tests
  → runHTMLTests(code, step.testCases) [client]
  → all pass? → POST /api/progress/:projectId/step/:step { passed, code, time, hints }
    → create StepAttempt
    → if not last step: increment currentStep
    → if last step:
        calculate score
        upsert Leaderboard
        recalculateRanks(projectId) [transaction]
        emitLeaderboardUpdate(io, projectId) [Socket.io]
        set status=COMPLETED completedAt=now()
  → navigate /workspace/[slug]/[step+1] or /workspace/[slug]/complete
```

---

## Socket.io rooms
```
Room naming:  leaderboard:{projectId}
Join:         socket.on('join:leaderboard', projectId)
Leave:        socket.on('leave:leaderboard', projectId)
Emit event:   'leaderboard:updated' → { projectId, entries: top10[] }
Triggered by: POST /api/progress on project completion only
```

---

## Stripe flow
```
Checkout:  POST /api/billing/checkout → Stripe Session → redirect to Stripe
Success:   /payment/success?session_id=xxx → refresh NextAuth session
Webhook:   POST /api/billing/webhook (raw body, no auth middleware)
  checkout.session.completed  → tier=PRO, store stripeCustomerId/subscriptionId
  subscription.deleted        → tier=FREE, clear stripe fields
  subscription.updated        → sync subscriptionStatus
  invoice.payment_failed      → subscriptionStatus=PAST_DUE
Portal:    POST /api/billing/portal → Stripe Customer Portal session → redirect
```

---

## Tier gating
```ts
// Frontend
const isLocked = project.tier === 'PRO' && session.user.tier === 'FREE'
// Locked card → UpgradeModal → /pricing

// Backend (all workspace routes)
if (project.tier === 'PRO' && user.tier === 'FREE') return res.status(403).json(...)

// NEVER return solutionCode in any API response
```

---

## Streak logic (runs on every step pass)
```ts
today = new Date().toDateString()
if lastActivity === today         → no change
if lastActivity === yesterday     → currentStreak++, update longestStreak
if lastActivity === 2daysAgo && streakFreezes > 0 → currentStreak++, streakFreezes--
else                              → currentStreak = 1
lastActivityDate = today
```

---

## Environment variables
```bash
# apps/web/.env.local
NEXTAUTH_SECRET=     NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=    GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_API_URL=http://localhost:4000

# apps/api/.env
DATABASE_URL=postgresql://...
JWT_SECRET=          FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=   STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_MONTHLY_PRICE_ID=   STRIPE_PRO_ANNUAL_PRICE_ID=
ANTHROPIC_API_KEY=   RESEND_API_KEY=   CRON_SECRET=
```

---

## Key decisions
- **Client-side test runner**: safe, free, instant for HTML/JS. Server sandbox needed for Node.js (future).
- **Leaderboard denormalized**: rank pre-calculated on write, never computed on read.
- **AI hints server-side only**: ANTHROPIC_API_KEY never exposed to browser.
- **Monaco not CodeMirror**: beginners recognize VS Code UX, lowers intimidation barrier.
- **Prisma not Supabase**: type-safe complex queries, no vendor lock-in.
