# CraftCode — Project Overview

> Token-optimised. One-line rule: attach this file to every conversation. Never repeat this content in prompts.

---

## What it is
"Learn by building" coding education platform. Users pick a real project, code it step-by-step in an in-browser IDE, pass automated test cases per step, and compete on a time-based leaderboard.

**Tagline**: Learn to code by actually building.

---

## Tiers
| Tier | Price | Access |
|------|-------|--------|
| Free | $0 | Beginner projects: Todo App, Calculator, Ecommerce Page, Weather App |
| Pro | $12/mo or $99/yr | Everything + Chat App, Snake Game, REST API, Full-Stack Blog |

---

## Core loop
1. Pick project → 2. Code step-by-step in Monaco editor → 3. Pass test cases to advance → 4. Get scored on time + hints → 5. Leaderboard rank

## Scoring
```
score = max(0, 1000 - floor(totalSeconds/60)*10 - hintsUsed*50)
```
Rank: score DESC, completedAt ASC (tiebreaker).

---

## Pages (frontend)
```
/                          Landing (light)
/login  /register          Auth
/onboarding                Pick experience level
/dashboard                 Home post-login (dark)
/projects                  Catalog with filters (light)
/projects/[slug]           Project detail + step list
/workspace/[slug]/[step]   Coding workspace (always dark)
/workspace/[slug]/complete Completion + score
/leaderboard               All projects ranking (dark)
/leaderboard/[slug]        Per-project top 50 + live updates
/profile/[userId]          Public profile
/settings                  Profile / Subscription / Account
/pricing                   Free vs Pro cards
/payment/success           Post-Stripe confirmation
/challenges                Weekly challenges list
/challenges/[weekNumber]   Challenge leaderboard
```

---

## API base routes (Express, port 4000)
```
POST /auth/register|login
GET|PATCH|DELETE /api/users/me
GET /api/users/me/progress|stats|streak|badges
GET /api/projects  GET /api/projects/:slug
GET|POST /api/workspace/:slug/:step
POST /api/workspace/:slug/:step/hint|ai-hint
POST /api/progress/:projectId/step/:step
GET /api/leaderboard  GET /api/leaderboard/:projectId
GET /api/profile/:userId  GET /api/profile/me
POST /api/billing/checkout|portal|webhook  GET /api/billing/status
GET /api/challenges/current  GET /api/challenges/:weekNumber
POST /api/challenges/:id/complete
POST /api/guest/convert
GET /api/og/completion
POST /api/internal/challenges/close  (cron, CRON_SECRET protected)
```

---

## Project content
| Project | Tier | Difficulty | Steps | Min |
|---------|------|-----------|-------|-----|
| Todo App | Free | Beginner | 6 | 45 |
| Ecommerce Page | Free | Beginner | 5 | 60 |
| Calculator | Free | Beginner | 4 | 30 |
| Weather App | Free | Intermediate | 7 | 75 |
| Real-time Chat | Pro | Advanced | 10 | 120 |
| Snake Game | Pro | Advanced | 8 | 90 |
| REST API | Pro | Intermediate | 8 | 90 |
| Full-Stack Blog | Pro | Intermediate | 9 | 110 |

---

## Growth features (Phase 7)
1. **Guest mode** — try step 1 without signup, convert on pass
2. **Shareable cards** — @vercel/og image on completion, Twitter/LinkedIn share
3. **Streaks** — daily step completion, streak freezes (Pro), Resend email at-risk alerts
4. **AI hints** — Pro only, Claude API via backend, never reveals solution, -50 score per message
5. **Weekly challenges** — Monday drop, 7-day window, top 3 win badge, resets weekly
