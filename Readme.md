<div align="center">

# 🛠️ CraftCode

### Learn to code by actually building.

A "learn by building" coding education platform — pick a real project, code it step-by-step in an in-browser IDE, pass automated tests to advance, and climb a live leaderboard.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791?logo=postgresql)](https://www.postgresql.org/)
[![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-black?logo=socket.io)](https://socket.io/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe)](https://stripe.com/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](#license)

</div>

---

## ✨ What is CraftCode?

Most tutorials teach you to *watch*. CraftCode teaches you to *ship*.

Instead of passive video lessons, users:

1. 🎯 **Pick a real project** — Todo App, Weather App, Snake Game, Full-Stack Blog, and more
2. 📋 **Follow guided steps** — clear instructions broken into small, buildable chunks
3. 💻 **Write real code** — in a full Monaco editor (the same one powering VS Code), right in the browser
4. ✅ **Pass automated tests** — to unlock the next step, no guesswork on "did I do it right?"
5. 🏆 **Get scored** — based on speed and hints used
6. 📊 **Compete** — on live, per-project leaderboards

No setup, no local environment, no "tutorial hell." Just you, the editor, and a project that actually works when you're done.

---

## 🚀 Features

| | |
|---|---|
| 🖥️ **In-browser IDE** | Monaco Editor with VS Code-like editing, syntax highlighting, and autosave |
| 🧪 **Automated test runner** | Sandboxed, client-side iframe test execution — instant feedback, zero server cost |
| ⏱️ **Time & hint-based scoring** | `1000 − (10 × minutes) − (50 × hints)` — speed and independence both count |
| 📈 **Real-time leaderboards** | Live rank updates via Socket.io as users complete projects |
| 🔐 **Flexible auth** | Email/password or Google OAuth via NextAuth.js |
| 💳 **Subscriptions** | Stripe-powered Free/Pro tiers with checkout, billing portal, and webhooks |
| 🔥 **Streaks** | Daily activity streaks with freezes, reminder emails, and at-risk nudges |
| 🤖 **AI Hint Assistant (Pro)** | A Claude-powered tutor that helps you debug and understand — without ever giving away the solution |
| 🏆 **Weekly Challenges** | A fresh timed project every Monday, with badges for the top 3 finishers |
| 👤 **Public profiles** | Showcase completed projects, scores, and earned badges |
| 🎮 **Guest mode** | Try a project before creating an account |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router) · TypeScript · Tailwind CSS |
| **Backend** | Node.js · Express · TypeScript |
| **Database** | PostgreSQL · Prisma ORM |
| **Auth** | NextAuth.js v5 (Credentials + Google OAuth) |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Test Execution** | Client-side sandboxed `<iframe>` |
| **Real-time** | Socket.io |
| **Payments** | Stripe (Checkout, Portal, Webhooks) |
| **AI** | Anthropic Claude API (contextual hints) |
| **Email** | Resend |
| **Monorepo** | pnpm workspaces |
| **Deployment** | Vercel (frontend) · Railway (backend + DB) |

---

## 📂 Repository Structure

```
craftcode/
├── apps/
│   ├── web/                    ← Next.js 14 frontend (port 3000)
│   └── api/                    ← Express backend (port 4000)
├── packages/
│   ├── db/                     ← Prisma schema + shared DB client
│   ├── types/                  ← Shared TypeScript types
│   └── test-runner/            ← iframe-based test execution logic
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.base.json
```

---

## 🖼️ The Workspace

The core of the product — a full-screen split-pane coding environment:

```
┌──────────────────────────────────────────────────┐
│  ← Todo App   |   Step 2 of 6   |   ⏱ 04:32     │
├──────────────────┬───────────────────────────────┤
│  INSTRUCTIONS    │   MONACO CODE EDITOR          │
│  Step title      │   (vs-dark theme)             │
│  Markdown text   │                               │
│  ──────────────  │                               │
│  Hints (2 left)  │                               │
│  [▶ Run Tests]   │                               │
├──────────────────┴───────────────────────────────┤
│  TEST RESULTS  ✓ 1/3 passing                     │
│  ✓ Page has an <input> element                   │
│  ✗ Input placeholder is "Add a todo"             │
└──────────────────────────────────────────────────┘
```

---

## 🏁 Scoring

```
score = max(0, 1000 − (minutes taken × 10) − (hints used × 50))
```

Ranked by score (descending), with earlier completion as the tiebreaker.

---

## 💳 Pricing

| Tier | Price | Access |
|------|-------|--------|
| **Free** | $0 | Beginner projects: Todo App, Calculator, Ecommerce Page, Weather App |
| **Pro** | $12/mo or $99/yr | Everything, plus advanced projects: Chat App, Snake Game, REST API, Full-Stack Blog, and the AI Hint Assistant |

---

## 🗺️ Getting Started

```bash
# Clone the repo
git clone https://github.com/<your-username>/craftcode.git
cd craftcode

# Install dependencies (pnpm workspaces)
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env

# Run database migrations
pnpm --filter db prisma migrate dev

# Start dev servers (web on :3000, api on :4000)
pnpm dev
```

### Required environment variables

```bash
# apps/api/.env
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
ANTHROPIC_API_KEY=sk-ant-...       # AI Hint Assistant
RESEND_API_KEY=re_...              # Streak reminder emails
CRON_SECRET=...                    # Internal cron auth
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues) or open a PR.

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">

**Built for people who learn by doing.**

</div>
