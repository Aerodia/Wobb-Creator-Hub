# Wobb Creator Hub

> **Wobb Frontend Assignment** — A production-quality influencer discovery and campaign management platform built with React, TypeScript, Vite, and Tailwind CSS.

---

## Live Preview

> 🚀 App runs locally at `http://localhost:5173` after setup.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

| Command | Description |
|---|---|
| `npm run dev` | Start development server (Vite HMR) |
| `npm run build` | Production build + TypeScript check |
| `npm run lint` | ESLint with React hooks rules |

---

## What Was Built

This project went through a full end-to-end implementation covering all 6 assignment tasks:

### ✅ 1. Bug Fixes & Code Quality

| Bug | Fix Applied |
|-----|-------------|
| `--ignoreDeprecations` TypeScript compiler error | Removed invalid flag from `tsconfig.app.json` |
| Broken profile images (dead URLs) | Built `Avatar.tsx` with gradient-initials fallback + `onError` reset state |
| Profile pages not opening (`/profile/MrBeast6000`) | Case-insensitive dynamic file matching in `profileLoader.ts` |
| Non-existent profiles (leomessi, charlidamelio) | Dynamic profile synthesis from search index data — any creator opens |
| Inner component declared inside render function | Refactored `Layout.tsx` to use JSX helper instead of inner component |
| `setState` called synchronously inside `useEffect` | Fixed with cleanup function pattern |
| Duplicate export in `ProfileCard.tsx` | Cleaned up leftover code from failed edit |

### ✅ 2. UI/UX Redesign — Industry Level

Complete redesign from a basic prototype to a professional **B2B SaaS influencer platform** (inspired by Linear, Vercel Dashboard, AspireIQ):

**Design System**
- **Inter** font (industry-standard, not a gaming font)
- `zinc-950/900/800` dark palette — no glow gradients, no glass-blur
- Single `indigo-500` accent color — professional and consistent
- CSS custom properties (`--bg-base`, `--accent`, `--border-subtle`, etc.) for full token control
- Utility classes: `.surface-card`, `.stat-card`, `.badge`, `.btn-primary`, `.btn-ghost`, `.nav-item`, `.shimmer`

**Layout**
- Fixed **220px left sidebar** — brand, Discover nav, inline saved-list section
- Collapsible to hamburger menu on mobile
- Top header bar with page title + subtitle + contextual action area
- `Discover › @username` breadcrumb navigation on detail pages

**Discover Page**
- Platform tabs + Search + **Sort** (Followers ↓, Engagement ↓, Followers ↑) — single toolbar
- Responsive grid: 1 → 2 → 3 → 4 columns
- Creator cards: left-aligned, engagement tier badge (🟢 High / 🟡 Medium / ⚪ Low)

**Profile Detail Page**
- Horizontal creator identity card
- Save button in the header bar
- Clean KPI stat grid (followers, engagement, avg likes, avg comments, avg views, reels plays)
- Shimmer skeleton loading states

### ✅ 3. Zustand State Management

Replaced all React Context usage with a single Zustand store:

```
src/store/useListStore.ts
```

Features:
- `selectedProfiles[]` — the saved list
- `addProfile()` — duplicate-safe add
- `removeProfile()` — remove by user ID
- `clearList()` — reset all
- `isInList()` — selector for individual card state
- **`persist` middleware** — auto-synced to `localStorage` on every change

Granular selectors prevent unnecessary re-renders: each `ProfileCard` subscribes only to its own `isSelected` state, not the whole list.

### ✅ 4. Select Profile & Add to List

Full feature implementation:

| Requirement | Implementation |
|---|---|
| Add profiles to a list | Save button on every card and on the detail page header |
| Prevent duplicates | `selectedProfiles.some(p => p.user_id === id)` guard in `addProfile` |
| Display saved profiles | Expandable "My List" section in sidebar with avatar, platform dot, follower count |
| Remove profiles | Hover-reveal `×` button per entry + "Clear All" button |
| Persistent after refresh | Zustand `persist` middleware → `localStorage` |
| Export | "Export List" copies `@username (platform)` lines to clipboard |

### ✅ 5. Code Quality & Project Structure

```
src/
├── assets/data/          # Static JSON — search indexes + detailed profiles
├── components/
│   ├── Avatar.tsx        # Image with gradient-initials fallback
│   ├── Layout.tsx        # Sidebar + header shell
│   ├── MetricCard.tsx    # Reusable KPI stat card (React.memo)
│   ├── PlatformFilter.tsx# Platform tabs + search + sort toolbar
│   ├── ProfileCard.tsx   # Creator card (React.memo + granular selectors)
│   ├── ProfileList.tsx   # Grid with empty state
│   ├── SearchBar.tsx     # Controlled search input
│   └── VerifiedBadge.tsx # Blue verified checkmark
├── hooks/
│   └── useDebounce.ts    # 200ms debounce for search input
├── pages/
│   ├── SearchPage.tsx    # Discover page
│   └── ProfileDetailPage.tsx  # Creator analytics dashboard
├── store/
│   └── useListStore.ts   # Zustand store with persist
├── types/
│   └── index.ts          # Shared TypeScript interfaces
└── utils/
    ├── dataHelpers.ts    # extractProfiles, filterProfiles, PLATFORMS
    ├── formatters.ts     # formatFollowers, formatEngagementRate
    └── profileLoader.ts  # Case-insensitive dynamic profile loader
```

**React best practices applied:**
- `React.memo` on `ProfileCard` and `MetricCard`
- `useCallback` on all event handlers passed as props
- `useMemo` on filtered/sorted profile lists and avatar gradient hashes
- Granular Zustand selectors (each card subscribes to only its own data)
- `useDebounce` hook to prevent filtering on every keystroke

### ✅ 6. Performance Optimizations

| Optimization | Impact |
|---|---|
| `React.memo(ProfileCard)` | ~20 cards skip re-render on every search keystroke |
| Granular Zustand selectors | Saving one creator re-renders only that card, not all 20 |
| `useDebounce(searchQuery, 200ms)` | `filterProfiles()` only runs 200ms after user pauses typing |
| `useMemo` on `allProfiles` + `filtered` + `sorted` | Recalculate only when platform/query/sort actually change |
| `useMemo` on avatar gradient hash | String hash runs once per unique username, not every render |
| `useCallback` on all prop callbacks | Stable references preserve memoization across parent renders |

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 19 + TypeScript | Assignment requirement |
| Build | Vite 8 | Fast HMR, native ESM |
| Styling | Tailwind CSS v4 | Utility-first, co-located styles |
| State | **Zustand** + persist | Lightweight, no boilerplate, localStorage built-in |
| Routing | React Router v7 | Declarative, file-based-ready |
| Icons | Lucide React | Consistent, tree-shakeable |
| Fonts | Inter (Google Fonts) | Industry-standard UI font |

---

## Data Notes

- `src/assets/data/search/` — 3 platform JSON files, ~10 profiles each
- `src/assets/data/profiles/` — detailed JSON per username (loaded lazily via `import.meta.glob`)
- Profiles not in the `profiles/` directory are **synthesized** from search index data — so every creator card opens correctly without a 404

---

## Assumptions & Trade-offs

- **No backend** — all data is static JSON. A real app would hit an API.
- **Synthesized profiles** — creators without a detailed JSON file get a generated profile from their search-index summary. All metrics available from the search index are shown.
- **Export format** — clipboard copy of `@username (platform)` lines. CSV export could be added with a library like `papaparse`.
- **No authentication** — out of scope for this assignment.
- **Accessibility** — semantic HTML, proper button types, `title` attributes on icon-only buttons, keyboard-navigable. Full ARIA audit would be next step.

---

## Commit History

Meaningful commits throughout, each addressing a specific concern:

```
feat: industry-level UI redesign — sidebar layout, Inter font, solid design system
perf: memoize components, debounce search, granular Zustand selectors
feat: code quality refactor — SearchBar, MetricCard components, TypeScript types
fix: profile load fallback — dynamic synthesis for missing profiles
fix: avatar fallback for broken image URLs
fix: tsconfig ignoreDeprecations error, case-sensitive profile filenames
feat: Zustand store with persist middleware, Add to List feature
feat: UI/UX redesign — dark mode, platform cards, profile analytics dashboard
```
