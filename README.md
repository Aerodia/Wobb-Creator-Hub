<div align="center">

# Wobb Creator Hub

**A production-quality influencer discovery platform built for the Wobb Frontend Assignment.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-5-FF6B35?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![ESLint](https://img.shields.io/badge/ESLint-passing-4B32C3?style=flat-square&logo=eslint)](https://eslint.org/)
[![Build](https://img.shields.io/badge/build-passing-22c55e?style=flat-square)](#)

</div>

---

## Overview

Wobb Creator Hub is a fully redesigned influencer marketing tool that lets brand teams **discover**, **analyze**, and **curate** creators across Instagram, YouTube, and TikTok. It was built from a rough starter project, addressing all intentional bugs, replacing state management, and delivering an industry-level UI.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

| Script | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check + production bundle |
| `npm run lint` | ESLint with React hooks rules |

---

## Features

- 🔍 **Creator Discovery** — Search and filter across Instagram, YouTube, and TikTok
- 📊 **Analytics Dashboard** — Per-creator metrics: followers, engagement rate, avg likes, avg views, reels plays
- 📋 **Saved List** — Add creators to a persistent list; remove individually or clear all; export to clipboard
- 🏎️ **Performant** — Debounced search, `React.memo`, granular Zustand selectors, `useMemo` throughout
- 📱 **Responsive** — Sidebar collapses to a hamburger menu on mobile
- 🎨 **Industry-grade UI** — Inter font, zinc dark palette, single indigo accent, solid surface cards

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | React 19 + TypeScript | Type-safe component model |
| Build tool | Vite 8 | Fast HMR, native ESM, `import.meta.glob` for data loading |
| Styling | Tailwind CSS v4 | Utility-first, CSS custom property design tokens |
| State | **Zustand** + `persist` | Replaces React Context; zero boilerplate; built-in `localStorage` sync |
| Routing | React Router v7 | Declarative nested routes |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Font | Inter (Google Fonts) | Industry-standard UI typeface |

---

## Project Structure

```
src/
├── assets/data/
│   ├── search/            # Platform search indexes (Instagram, YouTube, TikTok)
│   └── profiles/          # Detailed per-creator JSON (lazy-loaded)
├── components/
│   ├── Avatar.tsx          # Image with gradient-initials fallback
│   ├── Layout.tsx          # Sidebar + header shell (responsive)
│   ├── MetricCard.tsx      # KPI stat card — React.memo
│   ├── PlatformFilter.tsx  # Platform tabs + search input + sort selector
│   ├── ProfileCard.tsx     # Creator card — React.memo + granular selectors
│   ├── ProfileList.tsx     # Responsive grid with empty state
│   ├── SearchBar.tsx       # Controlled search input
│   └── VerifiedBadge.tsx   # Verified creator checkmark
├── hooks/
│   └── useDebounce.ts      # 200ms input debounce
├── pages/
│   ├── SearchPage.tsx      # Discover page
│   └── ProfileDetailPage.tsx  # Creator analytics dashboard
├── store/
│   └── useListStore.ts     # Zustand store with localStorage persistence
├── types/
│   └── index.ts            # Shared TypeScript interfaces
└── utils/
    ├── dataHelpers.ts      # Profile extraction and filtering logic
    ├── formatters.ts       # Follower count and engagement rate formatting
    └── profileLoader.ts    # Case-insensitive dynamic profile loader
```

---

## Implementation Notes

### 1 — Bug Fixes

| Issue | Resolution |
|---|---|
| `--ignoreDeprecations` compiler flag | Removed invalid option from `tsconfig.app.json` |
| Broken avatar images | `Avatar.tsx` — `onError` resets state; renders gradient initial fallback |
| Case-sensitive profile filenames | `profileLoader.ts` maps filenames to lowercase before matching |
| Missing profile data (e.g. `leomessi`) | Dynamic synthesis from search index — every creator card opens |
| Component declared inside render | Refactored `Layout.tsx` to use a JSX helper function |
| `setState` called synchronously in `useEffect` | Replaced with cleanup function pattern |

### 2 — UI/UX Redesign

The interface was completely replaced with a professional dark-mode SaaS layout:

- **Sidebar navigation** — 220px fixed panel with brand, Discover link, and inline saved-list management
- **Design tokens** — CSS custom properties (`--bg-base`, `--accent`, `--border-subtle`) with no hardcoded values in components
- **Engagement badges** — color-coded High / Medium / Low tiers on each creator card
- **Sort controls** — sort by Most Followers, Best Engagement, or Fewest Followers
- **Breadcrumb** — `Discover › @username` on detail pages
- **Skeleton loaders** — shimmer placeholders during async data fetches

### 3 — Zustand State Management

React Context was removed entirely. A single Zustand store manages all list state:

```ts
// src/store/useListStore.ts
interface ListStore {
  selectedProfiles: SelectedProfile[];
  addProfile:    (profile, platform) => void;  // duplicate-safe
  removeProfile: (userId: string)   => void;
  clearList:     ()                 => void;
  isInList:      (userId: string)   => boolean;
}
```

The store is wrapped with the `persist` middleware — state survives page refreshes automatically via `localStorage`.

### 4 — Select Profile & Add to List

| Requirement | Implementation |
|---|---|
| Add to list | Save button on every creator card and on the detail page header |
| Prevent duplicates | `selectedProfiles.some(p => p.user_id === id)` guard inside `addProfile` |
| Display saved profiles | Expandable "My List" in the sidebar — avatar, platform indicator, creator handle |
| Remove profiles | Hover-reveal `×` button per entry; "Clear All" resets the full list |
| Persistent after refresh | Zustand `persist` middleware syncs to `localStorage` on every mutation |
| Export | "Export List" copies all handles + platforms to the clipboard |

### 5 — Performance Optimizations

| Optimization | Effect |
|---|---|
| `React.memo` on `ProfileCard` | ~20 cards skip re-render on every search keystroke |
| Granular Zustand selectors | Saving one creator re-renders only that card |
| `useDebounce(query, 200ms)` | Filter function runs only after the user stops typing |
| `useMemo` on profiles + filtered + sorted | Recomputes only when platform, query, or sort actually changes |
| `useMemo` on avatar gradient hash | String hash computed once per username, not on every render |
| `useCallback` on all prop callbacks | Stable references preserve memoization boundaries |

---

## Assumptions & Trade-offs

- **Static data only** — All data is local JSON. Production would replace `profileLoader.ts` with API calls.
- **Synthesized profiles** — Creators without a dedicated detail JSON are served a profile built from their search-index summary. All available metrics are displayed.
- **Clipboard export** — Simple `@handle (platform)` format. CSV export via `papaparse` would be a straightforward addition.
- **No authentication** — Out of scope for this assignment.

---

## Submission

- **GitHub:** [github.com/Aerodia/Wobb-Assignment](https://github.com/Aerodia/Wobb-Assignment)
- **Deadline:** 2 July 2026, 2:00 PM IST

> `npm run build` passes with zero TypeScript errors and zero ESLint warnings.
