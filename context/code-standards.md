# CraftCode — Code Standards

> Attach when writing any new file. These rules are non-negotiable across the entire codebase.

---

## General rules
- TypeScript strict mode everywhere — no `any`, no `// @ts-ignore`
- All functions must have explicit return types
- No `console.log` in committed code — use a logger util or `console.error` only
- Max file length: 200 lines. Split into smaller files if exceeded.
- No inline styles — Tailwind classes only on frontend
- All API responses must use consistent shape (see Response format below)

---

## Frontend (Next.js 14 App Router)

### File naming
```
page.tsx          → route page (server component by default)
layout.tsx        → route layout
_components/      → co-located components (not globally shared)
components/       → shared components
hooks/            → custom hooks (use*.ts)
lib/              → utilities, API clients
types/            → TS types (use @craftcode/types for shared)
```

### Server vs client components
```
Default: server component (no 'use client')
Add 'use client' only when:
  - useState / useEffect / useRef needed
  - Browser API access (localStorage, window)
  - Event handlers directly on element
  - Third-party client libs (Monaco, Socket.io)

NEVER fetch in client components — use server components + pass as props
NEVER use useEffect for data fetching — use server components
```

### Data fetching pattern
```ts
// ✅ Correct — server component
export default async function Page() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/...`, {
    headers: { Authorization: `Bearer ${await getServerToken()}` },
    cache: 'no-store', // or next: { revalidate: 60 }
  })
  return <ClientComponent initialData={data} />
}

// ❌ Wrong — never do this
useEffect(() => { fetch('/api/...').then(...) }, [])
```

### Component structure template
```tsx
// Always this order:
'use client' // if needed

import { ... } from 'react'          // React imports
import { ... } from 'next/...'       // Next.js imports
import { ... } from 'lucide-react'   // Icons
import { ... } from '@/components/ui' // UI components
import { ... } from '@/lib/...'      // Utils/types

interface Props { ... }              // Props interface always named Props

export function ComponentName({ prop1, prop2 }: Props) {
  // hooks first
  // derived state
  // handlers
  // return JSX
}
```

### Tailwind class order (always follow this)
```
Layout:    flex/grid/block/hidden
Position:  relative/absolute, top/left/inset
Size:      w-/h-/max-w-/min-h-
Spacing:   p-/m-/gap-/space-
Typography: text-/font-/leading-/tracking-
Colors:    bg-/text-/border-
Borders:   border/rounded-
Effects:   shadow-/opacity-/transition-
States:    hover:/focus:/active: (at end)
```

### Forbidden patterns
```tsx
// ❌ No inline styles
<div style={{ color: 'red' }}>

// ❌ No arbitrary Tailwind unless no standard value exists
<div className="w-[347px]">  // use w-80 or w-96 instead

// ❌ No nested ternaries in JSX
{ a ? (b ? x : y) : z }  // extract to variable

// ❌ No direct DOM manipulation in React
document.getElementById(...)  // only allowed in test-runner package

// ✅ Correct conditional rendering
const content = condition ? <A /> : <B />
return <div>{content}</div>
```

---

## Backend (Express + TypeScript)

### Route file structure
```ts
// apps/api/src/routes/[domain].ts
import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { db } from '@craftcode/db'
import { authMiddleware } from '../middleware/auth'

const router = Router()

// Schema at top of file
const CreateFooSchema = z.object({ name: z.string().min(1) })

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const parsed = CreateFooSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  // handler logic
})

export default router
```

### Validation — always Zod
```ts
// Every POST/PATCH route must validate with Zod before touching the DB
// Use safeParse, not parse (safeParse doesn't throw)
const result = Schema.safeParse(req.body)
if (!result.success) return res.status(400).json({ error: result.error.flatten() })
```

### Response format (all routes must follow this)
```ts
// Success
res.json({ data: { ... } })

// Error
res.status(4xx|5xx).json({ error: 'Human readable message', code?: 'MACHINE_CODE' })

// List
res.json({ data: [...], total?: number, page?: number })
```

### Auth middleware usage
```ts
// Protected route
router.get('/me', authMiddleware, handler)

// Tier-gated route
router.get('/pro-thing', authMiddleware, proOnlyMiddleware, handler)

// Public route — explicitly comment it
router.get('/public', handler) // public — no auth required
```

### Error handling
```ts
// Wrap all async handlers
router.get('/', authMiddleware, async (req, res) => {
  try {
    // ...
  } catch (err) {
    console.error('[route] error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})
```

### Prisma usage rules
```ts
// ✅ Always select only needed fields
const user = await db.user.findUnique({
  where: { id },
  select: { id: true, name: true, tier: true } // not findUnique without select
})

// ✅ Use transactions for multi-step writes
await db.$transaction([
  db.leaderboard.upsert(...),
  db.userProjectProgress.update(...),
])

// ❌ NEVER return solutionCode
const step = await db.step.findUnique({
  select: { id:true, title:true, instructions:true, starterCode:true, hints:true, testCases:true }
  // solutionCode intentionally omitted
})
```

---

## Shared packages

### @craftcode/types — usage
```ts
// Define all shared types here, import everywhere
export type UserTier = 'FREE' | 'PRO'
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export interface TestCase { id: string; description: string; testFn: string }
export interface TestResult { id: string; description: string; passed: boolean; error?: string }
```

### @craftcode/test-runner — usage
```ts
import { runHTMLTests } from '@craftcode/test-runner'
const results = await runHTMLTests(userCode, step.testCases)
// Only call from browser context — will throw in Node.js
```

---

## Git conventions

### Branch naming
```
feature/[short-description]   e.g. feature/ai-hints-panel
fix/[short-description]       e.g. fix/streak-timezone-bug
chore/[short-description]     e.g. chore/update-prisma
```

### Commit messages (conventional commits)
```
feat: add AI hint panel to workspace
fix: streak not resetting when freeze expires
chore: upgrade Next.js to 14.2
refactor: extract scoring logic to lib/scoring.ts
test: add test cases for leaderboard rank calculation
```

### PR rules
- Every PR must reference a phase or feature from project-tracker.md
- No PR merges without passing type check (`tsc --noEmit`)
- Max 400 lines changed per PR — split larger changes

---

## Testing
- Unit tests: Vitest (packages/test-runner, packages/db utilities)
- API tests: Supertest on Express routes (critical paths only)
- No frontend unit tests at this stage — manual + visual QA

Test file naming: `[filename].test.ts` co-located with the file being tested.

---

## Security checklist (every route)
- [ ] Auth middleware applied on all non-public routes
- [ ] Zod validation on all POST/PATCH bodies
- [ ] solutionCode never returned in any Step query
- [ ] Stripe webhook uses `stripe.webhooks.constructEvent()` signature verification
- [ ] ANTHROPIC_API_KEY only in `apps/api` — never `apps/web`
- [ ] Rate limiting applied: auth routes (10/15min), API routes (100/min)
