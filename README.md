# Panca Nugraha Wicaksana — Portfolio

A minimal, performance-first personal portfolio built with **Vite + React 18 + TypeScript** and animated with **GSAP 3 + ScrollTrigger**.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server  (http://localhost:5173)
npm run dev

# 3. Production build
npm run build

# 4. Preview production build locally
npm run preview
```

---

## Editing content

All site copy lives in **`src/data/content.ts`** — no other file needs to change for text edits.

| Export | Purpose |
|---|---|
| `meta` | Page `<title>`, meta description, OG tags |
| `hero` | Name, title, tagline, CTA button |
| `about` | Bio paragraphs, highlight numbers |
| `experience` | Work history (reverse chronological) |
| `education` | Degree entries |
| `skills` | Grouped skill lists |
| `projects` | Project cards (**currently TODO placeholders**) |
| `achievements` | Certificates and competition results |
| `contact` | Email, LinkedIn |
| `footer` | Copyright line |

### Adding a project

Open `src/data/content.ts`, find the `projects` array and replace a TODO entry:

```ts
{
  title: "My Project",
  problem: "One-line description of the problem solved.",
  stack: ["Node.js", "PostgreSQL", "Docker"],
  role: "Sole engineer — architecture to deployment",
  link: "https://github.com/yourhandle/project",
  image: undefined, // optional: "/images/project-thumb.webp"
},
```

---

## Project structure

```
src/
├── animations/
│   ├── registerGsap.ts   — plugin registration, named ease/duration constants
│   ├── reveal.ts         — shared ScrollTrigger fade+rise factory
│   ├── splitLines.ts     — manual line-mask utility for Hero text
│   └── timeline.ts       — Experience timeline scrub helpers
├── components/
│   ├── Nav.tsx           — Fixed minimal nav with active-section indicator
│   ├── Preloader.tsx     — Short name-reveal preloader (<1.2s)
│   ├── Hero.tsx          — Full-viewport hero with line-mask text reveal
│   ├── About.tsx         — Bio, highlights (count-up numbers)
│   ├── Experience.tsx    — Vertical timeline, scrubbed progress line
│   ├── Projects.tsx      — Project grid (3 cards, degrades if fewer)
│   ├── Skills.tsx        — Grouped skill lists
│   ├── Achievements.tsx  — Certificate rows + external link
│   ├── Contact.tsx       — Email + LinkedIn links
│   └── Footer.tsx        — Minimal footer
├── data/
│   └── content.ts        — ALL site copy (single source of truth)
├── hooks/
│   ├── useActiveSection.ts  — IntersectionObserver → current section id
│   └── useReducedMotion.ts  — matchMedia prefers-reduced-motion
└── styles/
    ├── tokens.css        — CSS custom properties (colors, type, spacing)
    ├── base.css          — Reset, global defaults, skip-link, focus styles
    └── *.module.css      — Per-component scoped styles
```

---

## Design system at a glance

| Token | Value |
|---|---|
| `--ink` | `#111111` |
| `--ivory` | `#F6F5F1` |
| `--muted` | ink @ 55% opacity |
| `--accent` | `#B08D2E` (hairlines/hover only) |
| Font | Inter 400 / 500 (self-hosted via @fontsource) |
| Max width | 1200 px |

---

## Animation principles (GSAP)

- All animations use **transform + opacity only** (no layout properties).
- GSAP contexts are created with `useGSAP({ scope: containerRef })` and auto-cleaned on unmount.
- `ScrollTrigger.refresh()` is called after `document.fonts.ready` so all measurements are layout-stable.
- **`prefers-reduced-motion`** is respected via `gsap.matchMedia()`: scrub and count-up are disabled; elements simply fade in (`opacity`, 0.3 s).
- Magic numbers are forbidden — use the named constants from `registerGsap.ts`.

---

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub.
2. Import the repo in [vercel.com](https://vercel.com).
3. Framework preset: **Vite**. Root directory: `portfolio` (if deploying from a monorepo). Build command: `npm run build`. Output dir: `dist`.
4. Deploy — done.

### Netlify

1. Connect the GitHub repo in [netlify.com](https://netlify.com).
2. Build command: `npm run build`. Publish directory: `dist`.
3. Add a `public/_redirects` file with `/* /index.html 200` if you add client-side routing.

---

## TODO before launch

- [ ] Fill in `projects` array in `content.ts` (currently 3 placeholder entries).
- [ ] Fill in city-level AI competition date and issuer in `achievements`.
- [ ] Add a `public/og.png` (1200 × 630 px) for social sharing.
- [ ] Update `meta.siteUrl` in `content.ts` with the production URL.
- [ ] Uncomment OG `<meta>` tags in `index.html` once URL and image are ready.
