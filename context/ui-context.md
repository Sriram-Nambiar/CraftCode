# CraftCode — UI Design Context

> Token-optimised reference for AI coding assistants. Use this file when building any frontend component.

---

## Colors

### Tailwind config extensions (`tailwind.config.ts`)
```ts
colors: {
  brand:   { DEFAULT:'#5C3BFE', hover:'#4A2FD6', light:'#EDE9FF', muted:'#C9BEFF' },
  ink:     { DEFAULT:'#0F0A1E', 2:'#1A1433', 3:'#2A2145' },
  surface: { DEFAULT:'#F5F2ED', card:'#FFFFFF', dark:'#13101F' },
  mint:    { DEFAULT:'#D4F060', hover:'#C2E040', text:'#2A3A00' },
  coral:   { DEFAULT:'#FF6B6B', hover:'#E55555' },
  amber:   { DEFAULT:'#F5A623', light:'#FFF3D6' },
  slate:   { 1:'#6B7280', 2:'#9CA3AF', 3:'#D1D5DB', 4:'#F3F4F6' },
}
```

### Semantic usage map
| Token | Tailwind class | Use |
|-------|---------------|-----|
| Brand purple | `bg-brand text-white` | CTA buttons, active nav, progress fill, Run Tests btn |
| Brand light | `bg-brand-light text-brand` | Pill tags, selected filter state, hint box bg |
| Ink DEFAULT | `bg-ink text-white` | Navbar (dark mode), workspace bg |
| Surface DEFAULT | `bg-surface` | Page background (light mode), projects page |
| Surface card | `bg-white` | Cards, modals, panels |
| Mint DEFAULT | `bg-mint text-mint-text` | Streak banner, Next Step btn, pass indicators |
| Mint text | `text-mint-text` | Text on mint backgrounds |
| Coral | `bg-coral text-white` | Test fail dot, PRO badge, error states |
| Amber | `bg-amber text-white` | Intermediate difficulty badge, warning states |
| Slate 1 | `text-slate-1` | Body text secondary |
| Slate 2 | `text-slate-2` | Captions, meta text |
| Slate 3 | `border-slate-3` | Dividers, card borders |

### Difficulty badge colors
```
BEGINNER     → bg-green-100  text-green-700   (dot: bg-green-500)
INTERMEDIATE → bg-amber-100  text-amber-700   (dot: bg-amber-500)
ADVANCED     → bg-red-100    text-red-600     (dot: bg-red-500)
```

### Tier badge colors
```
FREE → bg-green-100 text-green-700 font-medium
PRO  → bg-brand-light text-brand font-semibold
```

---

## Typography

### Font stack
```ts
// tailwind.config.ts
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
}
```
Load via `next/font/google`: Inter (weights 400,500,600,700) + JetBrains Mono (400,500).

### Scale
| Role | Class | Specs |
|------|-------|-------|
| Page title | `text-4xl font-bold tracking-tight` | 36px, bold, tight |
| Section title | `text-2xl font-semibold` | 24px |
| Card title | `text-base font-semibold` | 16px |
| Body | `text-sm text-slate-1` | 14px |
| Caption / meta | `text-xs text-slate-2` | 12px |
| Code inline | `font-mono text-xs bg-brand-light text-brand px-1 rounded` | 12px mono |
| Nav link | `text-sm font-medium` | 14px |
| Logo | `text-lg font-bold tracking-tight` | 18px |
| Stat number | `text-3xl font-bold` | 30px |
| Timer | `text-sm font-mono font-medium` | 14px mono |

### Heading hierarchy in pages
- H1 (page title): `text-4xl font-bold text-ink` — only one per page
- H2 (section): `text-xl font-semibold text-ink`
- H3 (card title): `text-base font-semibold text-ink`

---

## Spacing & Layout

### Breakpoints (Tailwind defaults, used as-is)
```
sm: 640px | md: 768px | lg: 1024px | xl: 1280px
```

### Page container
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

### Grid patterns
```
Projects catalog  → grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
Dashboard cards   → grid-cols-2 lg:grid-cols-4 gap-4
Settings tabs     → grid-cols-1 lg:grid-cols-[220px_1fr] gap-6
```

### Standard spacing
```
Section gap:    mb-8 / space-y-8
Card padding:   p-4 (sm) | p-6 (md+)
Nav height:     h-14 (56px)
Sidebar width:  w-[220px]
```

---

## Border Radius

| Element | Class |
|---------|-------|
| Cards | `rounded-2xl` |
| Buttons (pill) | `rounded-full` |
| Buttons (rect) | `rounded-lg` |
| Badges / pills | `rounded-full` |
| Input fields | `rounded-xl` |
| Code blocks | `rounded-xl` |
| Modals | `rounded-2xl` |
| Hint boxes | `rounded-xl` |
| Avatars | `rounded-full` |
| Progress bar track | `rounded-full` |

---

## Shadows

```
Card:        shadow-sm border border-slate-3
Card hover:  shadow-md transition-shadow
Modal:       shadow-2xl
Navbar:      border-b border-slate-3 (light) | border-ink-3 (dark)
Tooltip:     shadow-lg
```

---

## Component Specs

### Button variants
```tsx
// Primary — brand purple
"bg-brand hover:bg-brand-hover text-white font-semibold rounded-lg px-4 py-2 transition-colors"

// Primary mint — used for Next Step / completion actions
"bg-mint hover:bg-mint-hover text-mint-text font-semibold rounded-lg px-4 py-2"

// Secondary — outline
"border border-slate-3 hover:bg-slate-4 text-ink font-medium rounded-lg px-4 py-2"

// Ghost — no border
"hover:bg-slate-4 text-ink font-medium rounded-lg px-4 py-2"

// Destructive
"bg-coral hover:bg-coral-hover text-white font-semibold rounded-lg px-4 py-2"

// Sizes: sm=px-3 py-1.5 text-xs | md=px-4 py-2 text-sm | lg=px-6 py-3 text-base
```

### Input fields
```tsx
"w-full border border-slate-3 rounded-xl px-4 py-2.5 text-sm
 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
 placeholder:text-slate-2 bg-white"
```

### Cards
```tsx
// Standard project card
"bg-white rounded-2xl border border-slate-3 overflow-hidden hover:shadow-md transition-shadow"

// Dark workspace card
"bg-ink-2 rounded-2xl border border-ink-3"

// Stat card (dashboard)
"bg-ink-2 rounded-2xl p-4 flex items-start gap-3"
```

### Progress bar
```tsx
// Track
"w-full bg-slate-4 rounded-full h-1.5"
// Fill
"bg-brand h-1.5 rounded-full transition-all duration-300"
```

### Badges / pills
```tsx
// Tier FREE
"inline-flex items-center bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full"
// Tier PRO
"inline-flex items-center bg-brand-light text-brand text-xs font-semibold px-2 py-0.5 rounded-full"
// Tech tag (HTML, CSS, JS)
"bg-slate-4 text-slate-1 text-xs px-2 py-0.5 rounded-full"
```

### Navbar structure
```
[Logo] [Nav links — center] [Streak badge | Notif bell | Avatar dropdown — right]
height: h-14, sticky top-0 z-50
Light mode: bg-white border-b border-slate-3
Dark mode:  bg-ink border-b border-ink-3
Active link: text-brand underline decoration-2 underline-offset-4
```

### Sidebar (dashboard)
```
w-[220px] bg-ink-2 border-r border-ink-3 p-4
Nav items: rounded-xl px-3 py-2 text-sm font-medium
Active:    bg-ink-3 text-white
Inactive:  text-slate-2 hover:text-white hover:bg-ink-3
```

### Workspace layout
```
Full screen: h-screen flex flex-col overflow-hidden
Top bar:     h-14 bg-ink border-b border-ink-3 flex items-center justify-between px-4
Main area:   flex flex-1 overflow-hidden
  Left panel:  w-[320px] border-r border-ink-3 flex flex-col overflow-y-auto p-5
  Editor:      flex-1 (Monaco fills this)
  Right panel: w-[360px] border-l border-ink-3 flex flex-col (Preview + Tests)
Bottom bar:  h-14 bg-ink border-t border-ink-3 flex items-center justify-between px-4
```

---

## Icons

Library: **Lucide React** (`lucide-react`) — consistent with UI screenshots.

### Icon size scale
```
xs: w-3 h-3   (inline code hints)
sm: w-4 h-4   (nav, badges, inline)
md: w-5 h-5   (buttons, cards)
lg: w-6 h-6   (stat cards, empty states)
xl: w-8 h-8   (feature sections)
```

### Icon → usage map
```
Code2          → Logo icon, project card (code projects)
Flame          → Streak badge in navbar + dashboard
Trophy         → Leaderboard, achievements
Timer          → Workspace top bar countdown
Lightbulb      → Hints panel header
CheckCircle2   → Test pass indicator (text-green-500)
XCircle        → Test fail indicator (text-coral)
Circle         → Test pending (text-slate-3)
Lock           → PRO locked card overlay
Sparkles       → AI hint panel header (Pro)
Zap            → Run Tests button
ChevronRight   → Resume / next step CTA
ArrowLeft      → Back navigation
Bell           → Notification icon (navbar)
Settings       → Settings nav item
BarChart2      → Stats / analytics
Users          → Team / leaderboard
BookOpen       → Projects nav
Award          → Badges / achievements
Crown          → Upgrade to Pro CTA
RefreshCw      → Reset code / autosave spinner
Maximize2      → Fullscreen editor
Sun/Moon       → Theme toggle
```

### Streak badge pattern
```tsx
<div className="flex items-center gap-1.5 text-amber font-semibold text-sm">
  <Flame className="w-4 h-4 text-amber fill-amber" />
  <span>{streak}</span>
  <span className="text-slate-2 font-normal">Day streak</span>
</div>
```

---

## Illustrations / Mascot

The CraftCode mascot is a **round purple blob character** with:
- Base color: `#5C3BFE` (brand purple)
- Companion blob: `#D4F060` (mint/lime — same as streak/action color)
- Eyes: white circles with dark pupils
- Expression: friendly smile
- Used in: hero section, empty states, completion screen, sidebar upsell card

Implementation: SVG inline or imported from `/public/mascot/`. Do NOT use `<img>` — SVG allows color theming.

Mascot placement rules:
- Always floats right in hero/section headers
- On empty states: centered, smaller (w-24 h-24)
- On completion screen: large centered (w-40 h-40) with mint companion

---

## Dark / Light Mode

The app uses **dual themes** — light for marketing pages, dark for the workspace and dashboard.

```ts
// tailwind.config.ts
darkMode: 'class' // toggled via class on <html>
```

| Page | Default theme |
|------|--------------|
| `/` landing | Light (`bg-surface`) |
| `/projects` | Light (`bg-surface`) |
| `/pricing` | Light (`bg-white`) |
| `/dashboard` | Dark (`bg-ink`) |
| `/workspace/*` | Dark (`bg-ink`) — always dark, no toggle |
| `/leaderboard` | Dark (`bg-ink`) |
| `/profile` | Dark (`bg-ink`) |
| `/settings` | Dark (`bg-ink`) |

Workspace is **always dark** — never toggled.

---

## Animation

```
Transition default:  transition-all duration-200 ease-in-out
Button hover:        transition-colors duration-150
Card hover:          transition-shadow duration-200
Progress fill:       transition-all duration-300
Toast enter:         animate-slide-up (custom: translateY 100% → 0)
Streak banner pulse: animate-pulse (Tailwind built-in) when atRisk=true
Test result flash:   animate-ping once on pass (green dot)
```

Custom keyframes to add in `tailwind.config.ts`:
```ts
keyframes: {
  'slide-up': { from:{ transform:'translateY(100%)', opacity:'0' }, to:{ transform:'translateY(0)', opacity:'1' } },
  'fade-in':  { from:{ opacity:'0' }, to:{ opacity:'1' } },
},
animation: {
  'slide-up': 'slide-up 0.25s ease-out',
  'fade-in':  'fade-in 0.2s ease-out',
}
```

---

## Code Editor (Monaco)

```ts
theme: 'vs-dark'
fontSize: 14
fontFamily: 'JetBrains Mono, monospace'
lineHeight: 1.6
minimap: { enabled: false }
lineNumbers: 'on'
wordWrap: 'on'
scrollBeyondLastLine: false
automaticLayout: true
padding: { top: 16, bottom: 16 }
renderLineHighlight: 'line'
cursorStyle: 'line'
```

Syntax highlight colors (Monaco token rules to override):
```
keywords:    #C9BEFF  (brand muted purple)
strings:     #D4F060  (mint)
comments:    #4A4070  (muted purple-gray)
functions:   #E8C4C4  (soft pink)
numbers:     #F5A623  (amber)
```

---

## Z-index scale

```
Base content:   z-0
Cards:          z-10
Sticky navbar:  z-50
Sidebar:        z-40
Modals:         z-50
Toast:          z-[60]
Tooltip:        z-[70]
```
