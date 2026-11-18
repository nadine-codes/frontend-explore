# frontend/explore

**Explore the frontend universe.** Interaction patterns rebuilt as reusable React + TypeScript components. Each one has a live playground, its real source code, and notes on how it works.

| Pattern | Component | Concepts |
|---|---|---|
| 01 · 3D tilt hover | `<TiltCard>`, `<TiltLayer>`, `useTilt()` | Custom hook, typed props, refs over state, `requestAnimationFrame`, CSS custom properties, pointer events, reduced motion |
| 02 · Orbit animation | `<OrbitSystem>` | CSS keyframes, counter-rotation, Web Animations API (`playbackRate`), CSS trig functions, React 19 ref as a prop, data-driven typed props |

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
```

## Stack

React 19 · TypeScript (strict) · Vite · React Router. No UI or animation libraries: the motion is written by hand.

## How it's organized

```
src/
  components/
    TiltCard/          reusable component: TiltCard.tsx, useTilt.ts, TiltCard.css
    OrbitSystem/       reusable component: OrbitSystem.tsx, OrbitSystem.css
    Starfield.tsx      animated canvas background
    Layout.tsx         header, nav, footer
    CodeBlock.tsx      tabbed code viewer
  data/                shared data (the tech-stack orbits)
  hooks/               shared hooks (usePrefersReducedMotion)
  pages/               Home, Explore (gallery), PatternRoute, 404
  patterns/
    registry.ts        the list of patterns; the gallery and routes read from it
    tilt-hover/        the in-depth page, playground and thumbnail for pattern 01
    orbit-animation/   the same for pattern 02
```

## Adding a pattern

1. Build the reusable component in `src/components/YourPattern/` (typed props, reduced-motion and touch support).
2. Make `src/patterns/your-pattern/` with a `YourPatternPage.tsx` (default export) and a `YourPatternThumbnail.tsx`.
3. Add an entry to `src/patterns/registry.ts`. It appears in the gallery and at `/explore/your-pattern` automatically.

The written write-ups for each pattern live in the separate interaction design library; this repo is the front-end build of them.

## Deploy

Set up for Vercel: import the repo, and the defaults (Vite, `npm run build`, `dist`) just work. `vercel.json` sends every route to `index.html` so links like `/explore/3d-tilt-hover` load directly.
