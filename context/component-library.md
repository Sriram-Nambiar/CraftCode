# CraftCode — Component Library Context

> Attach when building UI. Prevents AI from re-inventing components that already exist.

---

## UI primitives (`apps/web/src/components/ui/`)

### Button
```tsx
interface Props {
  variant?: 'primary'|'primary-mint'|'secondary'|'ghost'|'destructive'
  size?: 'sm'|'md'|'lg'
  loading?: boolean
  disabled?: boolean
  href?: string        // renders as Next.js Link
  icon?: React.ReactNode
  iconPosition?: 'left'|'right'
  onClick?: () => void
  children: React.ReactNode
  className?: string
}
// primary: bg-brand text-white | primary-mint: bg-mint text-mint-text
// secondary: border border-slate-3 | ghost: no border | destructive: bg-coral
// sm: px-3 py-1.5 text-xs | md: px-4 py-2 text-sm | lg: px-6 py-3 text-base
// loading: shows Spinner, disables click
```

### Badge
```tsx
interface Props {
  variant: 'free'|'pro'|'beginner'|'intermediate'|'advanced'|'default'
  label?: string  // overrides default label for variant
  dot?: boolean   // show colored dot before label
}
// free: bg-green-100 text-green-700
// pro: bg-brand-light text-brand font-semibold
// beginner: bg-green-100 text-green-700 dot=green-500
// intermediate: bg-amber-100 text-amber-700 dot=amber-500
// advanced: bg-red-100 text-red-600 dot=red-500
```

### Modal
```tsx
interface Props {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  size?: 'sm'|'md'|'lg'  // sm=max-w-sm md=max-w-md lg=max-w-lg
  children: React.ReactNode
  footer?: React.ReactNode
}
// Closes on backdrop click + Escape key
// Accessible: focus trap, aria-modal, aria-labelledby
```

### Skeleton
```tsx
interface Props { className: string }
// Renders: <div className={cn("animate-pulse bg-slate-200 rounded", className)} />
```

### Spinner
```tsx
interface Props { size?: 'sm'|'md'|'lg'; className?: string }
// sm=w-4 h-4 | md=w-5 h-5 | lg=w-6 h-6
// SVG animate-spin, border-brand
```

### Tooltip
```tsx
interface Props { content: string; children: React.ReactNode; side?: 'top'|'bottom'|'left'|'right' }
// Wraps children, shows tooltip on hover. Uses Radix UI Tooltip primitive.
```

---

## Project components (`apps/web/src/components/projects/`)

### ProjectCard
```tsx
interface Props {
  project: { id, slug, title, description, coverImageUrl?, tier, difficulty, estimatedMinutes, totalSteps, tags }
  progress?: { status, currentStep, score? } | null
  isLocked: boolean
  onClick: () => void  // either navigate or open UpgradeModal
}
// Card top: colored bg based on difficulty, SVG icon, tier badge top-right, FREE/PRO badge top-left
// If isLocked: dark overlay + lock icon + "Pro only" pill
// If IN_PROGRESS: progress bar (currentStep/totalSteps)
// Status button: "Start building" | "Resume step X →" | "Completed ✓"
// Hover: shadow-md transition
```

### ProjectCardSkeleton
```tsx
// No props. Matches ProjectCard dimensions with Skeleton placeholders.
// Render up to 8 in ProjectGrid while loading.
```

### ProjectGrid
```tsx
interface Props {
  projects: Project[]
  progressMap: Record<string, UserProjectProgress>
  userTier: 'FREE' | 'PRO'
}
// 'use client'
// State: difficulty filter (All|BEGINNER|INTERMEDIATE|ADVANCED), tierFilter, searchQuery
// Filter bar: pill buttons for difficulty, pill buttons for tier
// Search: input with Search icon, filters client-side on title + tags
// Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
// Each item: ProjectCard with isLocked and onClick logic
// onClick isLocked → setModalOpen(true) → UpgradeModal
```

### StepList
```tsx
interface Props {
  steps: { id, order, title }[]
  currentStep: number
  completedSteps: number[]  // step order numbers that are done
}
// Numbered list of steps
// Completed (order in completedSteps): green CheckCircle2 icon, text-slate-1
// Current (order === currentStep): purple left border, text-ink, font-semibold
// Future (order > currentStep): Lock icon, text-slate-3
// Future step titles: shown as-is (not hidden)
```

### TierBadge
```tsx
interface Props { tier: 'FREE' | 'PRO' }
// Renders Badge with variant='free' or variant='pro'
```

### DifficultyBadge
```tsx
interface Props { difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' }
// Renders Badge with matching variant, includes dot
```

### UpgradeModal
```tsx
interface Props { open: boolean; onClose: () => void }
// Title: "Unlock Pro Projects"
// Body: list of Pro benefits (advanced projects, Chat App, Snake Game, AI hints, unlimited hints)
// Footer: Button primary → /pricing, Button ghost → onClose
// Crown icon in header
```

---

## Dashboard components (`apps/web/src/components/dashboard/`)

### ProgressCard
```tsx
interface Props {
  project: { slug, title, coverImageUrl?, tier, difficulty }
  progress: { currentStep, totalSteps, status }
}
// Compact card: cover thumbnail left, title + step info right
// Progress bar fills based on currentStep/totalSteps
// "Continue" button → /workspace/[slug]/[currentStep]
```

### StatsRow
```tsx
interface Props {
  stats: { projectsCompleted: number; totalTimeSeconds: number; currentRank: number | null }
}
// 4 stat cards in a row (grid-cols-4)
// Cards: Projects Started | Hours Coded | Best Score | Current Streak
// Each: icon (Lucide, w-5 h-5 on dark rounded bg) + metric value + label + sub-label
// Dark card bg: bg-ink-2 rounded-2xl
```

---

## Layout components (`apps/web/src/components/layout/`)

### Navbar
```tsx
interface Props { theme?: 'light' | 'dark' }
// Sticky top-0 z-50 h-14
// Left: Logo ({} icon + "CRAFTCODE" text)
// Center: nav links (Dashboard, Projects, Leaderboard, Challenges, Pricing)
//   Active link: text-brand + underline decoration-2
// Right: StreakBadge | Bell (notification icon, badge count) | UserMenu
// UserMenu: Avatar circle (initials fallback) + dropdown (Profile, Settings, Sign out)
// light: bg-white border-b border-slate-3 text-ink
// dark:  bg-ink border-b border-ink-3 text-white
```

### Sidebar (dashboard layout only)
```tsx
// Not a shared component — co-located in app/dashboard/layout.tsx
// w-[220px] bg-ink-2 border-r border-ink-3 p-4
// Items: Overview, My Projects, Bookmarks, Achievements, Activity
// Bottom: Upgrade to Pro card (Crown icon, yellow bg-amber, only for FREE users)
```

---

## Workspace components (`apps/web/src/app/workspace/[slug]/[step]/_components/`)

### CodeEditor
```tsx
interface Props {
  value: string
  onChange: (val: string) => void
  language: 'html' | 'javascript' | 'typescript' | 'css'
}
// @monaco-editor/react, theme: vs-dark
// fontSize:14, fontFamily: JetBrains Mono, lineHeight:1.6
// minimap:false, wordWrap:on, scrollBeyondLastLine:false, automaticLayout:true
// padding: { top:16, bottom:16 }
// onChange: call debounced(500ms) saveToLocalStorage + context setCode
```

### HintsPanel
```tsx
interface Props {
  hints: string[]
  hintsRevealed: number
  onReveal: () => void
}
// Header: Lightbulb icon + "Hints" + badge showing remaining count
// Warning text before first reveal: "-50 points per hint"
// Revealed hints: <details> elements, animated slide-open, labeled "Hint 1", "Hint 2"
// "Reveal next hint" button: disabled when hintsRevealed >= hints.length
```

### AiHintPanel (Pro only)
```tsx
interface Props {
  stepSlug: string
  stepNumber: number
  userCode: string
}
// 'use client'
// Sparkles icon header + "AI Tutor" label + "Pro" badge
// Chat messages: user right (bg-brand-light text-brand), AI left (bg-ink-3 text-white)
// Input + Send button at bottom
// On send: POST /api/workspace/:slug/:step/ai-hint, show "Thinking..." state
// Conversation history in useState, cleared on step change
// Footer: "Each message costs 50 score points"
```

### AiHintLocked
```tsx
// No props. Shown to FREE users in place of AiHintPanel.
// Lock icon + "AI Tutor is a Pro feature" + Button → /pricing
```

### TestResultsPanel
```tsx
interface Props {
  testCases: TestCase[]
  results: TestResult[]
  isRunning: boolean
}
// Collapsible panel
// Collapsed: "Tests — X/Y passing" status bar + ChevronDown
// Expanded: each test row = icon + description
//   pass: CheckCircle2 text-green-500 | fail: XCircle text-coral | pending: Circle text-slate-3
// All pass: panel flashes green bg once (animate-pulse 1 cycle)
// "Run Tests" secondary button in panel
```

### StepCompleteToast
```tsx
interface Props {
  nextStep: number | null  // null = project complete
  projectSlug: string
  score?: number  // only on project complete
}
// Appears on all tests passing
// Not last step: CheckCircle2 + "Step X complete!" + "Moving to step X+1..." → navigate after 1.5s
// Last step: Trophy + "Project complete!" + score display → navigate to /workspace/[slug]/complete after 2s
// Fixed bottom-center, slide-up animation
```

### StreakBadge (used in Navbar)
```tsx
interface Props { streak: number; atRisk?: boolean }
// Flame icon (fill-amber text-amber) + streak number + "Day streak"
// atRisk=true: animate-pulse, add "!" warning
```

---

## Growth feature components

### GuestBanner
```tsx
// Shown at top of workspace when ?guest=true
// Yellow/amber bg, Lock icon, "You're in guest mode. Sign up to save your progress."
// "Sign up free" Button → /register?redirect=/workspace/[slug]/1
// Sticky below navbar
```

### GuestConvertModal
```tsx
interface Props { open: boolean; onClose: () => void; projectSlug: string }
// Shows on step 1 test pass in guest mode
// "You passed! 🎉" heading, "Create a free account to continue to step 2"
// Lists what they unlock (score tracking, leaderboard, streaks)
// CTA: Button → /register?redirect=/workspace/[slug]/2
```

### ChallengeBanner
```tsx
interface Props { challenge: { title: string; endsAt: Date; weekNumber: number } }
// Full-width amber/mint banner on dashboard + /projects
// Trophy icon + challenge title + countdown (CountdownTimer) + "Join challenge" button
```

### CountdownTimer
```tsx
interface Props { endsAt: Date }
// 'use client' — useEffect interval every second
// Displays: "2d 14h 22m" format
// When expired: "Ended"
```

### CompletionCard
```tsx
interface Props { projectTitle: string; score: number; timeSeconds: number; hintsUsed: number; username: string }
// Visual card shown on /workspace/[slug]/complete
// Mirrors the OG image layout (for consistency)
// CraftCode logo, project name, score (large), time, hints, "craftcode.app"
// Below card: ShareButton component
```

### ShareButton
```tsx
interface Props { projectTitle: string; score: number; timeFormatted: string; username: string }
// Two buttons: "Share on Twitter/X" (opens intent URL) + "Copy for LinkedIn" (clipboard)
// Twitter URL: pre-filled tweet with score and craftcode.app link
// Clipboard: formatted text snippet
// Shows "Copied!" confirmation for 2s after LinkedIn copy
```
