# CraftCode — AI Workflow Rules

> Rules for using Claude / Cursor / Copilot effectively on this codebase. Follow these to minimise wasted tokens and maximise output quality.

---

## Context file map

| File | When to attach | Tokens (approx) |
|------|---------------|-----------------|
| `project-overview.md` | Every session — always | ~600 |
| `architecture-context.md` | DB, API routes, auth, payments, real-time | ~900 |
| `ui-context.md` | Any frontend component or page | ~1,100 |
| `code-standards.md` | Writing new files or reviewing code | ~800 |
| `project-tracker.md` | Planning next task, checking progress | ~700 |
| `ai-workflow-rules.md` | Start of every session | ~400 |

**Minimum context for any session**: `project-overview.md` + `ai-workflow-rules.md`
**Full context for new file creation**: all 6 files (~4,500 tokens — well within limits)

---

## Session startup template

Paste this at the start of every new AI conversation:

```
I am building CraftCode, a "learn by building" coding education platform.
Attached context files define the full architecture, standards, and design system.
Do not ask me to clarify anything that is already answered in the context files.
Current task: [describe exactly what you want built]
Phase: [phase number from project-tracker.md]
Files I am working in: [list the files]
```

---

## Prompt rules

### DO
- Reference the phase number when asking to build something (`Phase 4, workspace`)
- Name the specific file you want created or edited (`apps/web/src/app/workspace/[slug]/[step]/page.tsx`)
- Ask for one file or one feature at a time — not multiple files in one prompt
- Say "extend" when adding to existing routes, not "rewrite"
- Include the current file content when asking for edits

### DON'T
- Never say "build the whole app" — always scope to one phase or one file
- Never ask the AI to pick the tech stack — it's already decided in architecture-context.md
- Never describe color values in prompts — say "use the brand color" or reference ui-context.md
- Never ask for auth logic from scratch — say "follow the auth pattern in architecture-context.md"
- Never include solutionCode in any prompt — treat it as secret

---

## Prompt templates by task type

### New page
```
Task: Build [page route] for CraftCode.
Context: project-overview.md + ui-context.md + architecture-context.md + code-standards.md
This is a [server|client] component.
It fetches from: [API route]
Components needed: [list from ui-context.md component specs]
Layout: [describe the layout briefly]
Do not create any new API routes — only consume existing ones from architecture-context.md.
```

### New API route
```
Task: Build [METHOD] [route] for CraftCode.
Context: project-overview.md + architecture-context.md + code-standards.md
File: apps/api/src/routes/[domain].ts
Auth required: [yes/no]
Tier required: [FREE/PRO/any]
Request body schema: [fields]
DB operations: [what to read/write]
Response shape: [what to return]
Never return: solutionCode
Follow the response format in code-standards.md.
```

### New component
```
Task: Build [ComponentName] for CraftCode.
Context: ui-context.md + code-standards.md
File: apps/web/src/components/[folder]/[ComponentName].tsx
Props: [list props and types]
Design: Use Tailwind classes from ui-context.md. Use Lucide icons from the icon map.
Behavior: [describe interactions]
```

### Editing existing code
```
Task: Edit [filename] to add [feature].
Here is the current file:
[paste file content]
Context: architecture-context.md + code-standards.md
Change needed: [describe exactly]
Do not change anything outside the scope of this change.
```

### Debugging
```
Task: Debug this error in CraftCode.
Error: [paste full error message + stack trace]
File: [filename]
Current code: [paste relevant section]
Context: architecture-context.md
Expected behavior: [describe]
```

---

## What AI assistants often get wrong — correct them

| Common mistake | Correct behaviour |
|---------------|------------------|
| Returns `solutionCode` in API response | Never include it — omit from all Prisma selects |
| Uses `useEffect` for data fetching | Use server components — see code-standards.md |
| Creates new Tailwind colors | Use only tokens from ui-context.md |
| Calls Anthropic API from frontend | AI hints go through `/api/workspace/:slug/:step/ai-hint` only |
| Uses `any` TypeScript type | Strict mode — define the type properly |
| Returns raw Prisma errors to client | Catch all errors, return `{ error: 'message' }` |
| Writes Socket.io client in SSR code | Socket.io client only inside `useEffect` |
| Stripe webhook without signature verify | Always use `stripe.webhooks.constructEvent()` |
| Uses gray backgrounds | Replace with `bg-surface` (light) or `bg-ink-2` (dark) |

---

## Per-phase context rules

### Phase 1–2 (setup, auth)
Attach: `project-overview.md` + `architecture-context.md` + `code-standards.md`
Do not attach: `ui-context.md` (no UI yet)

### Phase 3–4 (catalog, workspace)
Attach: all 5 files except `ai-workflow-rules.md`
Priority: `ui-context.md` is critical — workspace layout must match exactly

### Phase 5–6 (leaderboard, payments)
Attach: `project-overview.md` + `architecture-context.md` + `ui-context.md` + `code-standards.md`

### Phase 7 (growth features)
Each sub-feature is independent. Attach only:
- `project-overview.md` (always)
- `architecture-context.md` (for 7.3 streaks, 7.4 AI hints, 7.5 challenges)
- `ui-context.md` (for 7.1 guest mode, 7.2 share cards, 7.3 streak UI, 7.5 challenge UI)

---

## Token-saving rules

1. **Summarise, don't paste** — when referencing an existing file, say "as defined in architecture-context.md" rather than copying the content into the prompt.
2. **One task per conversation** — start a new chat for each task. Reusing a long conversation degrades quality.
3. **Attach only relevant context** — a component task does not need `architecture-context.md`.
4. **No chit-chat in task prompts** — start directly with "Task:".
5. **Copy error messages exactly** — don't paraphrase errors. Paste the full stack trace.
6. **Line numbers matter** — when asking for an edit, say "edit line 42–58" not "find the bit that does X".
