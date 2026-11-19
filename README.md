# Frontend Explore (v2)

**Explore the frontend universe.** Interaction patterns rebuilt as reusable React + TypeScript components. Each one has a live playground, its real source code, and notes on how it works.

This is the `v2` branch: a fresh build that recreates the v1 look on a new architecture. v1 stays live on `main` until the owner decides to switch. The build plan is `frontendexploreSPEC.md`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
```

## How it's organized

```
registry/
  patterns/<slug>.json     pattern record (authored)
  controls/<slug>.json     controls manifest: presets, sliders, toggles, choices
src/
  styles/tokens.css        site tokens (--fe-*), from docs/design-notes/v1-vibe.md
  site/                    starfield, header, footer
  playground/              ControlsPanel (built from a manifest), CodeTabs
  pages/                   home, explore, pattern page building blocks, 404
  patterns/<slug>/         the component source, its playground stage, page and thumbnail
docs/design-notes/         v1 vibe notes and v1/v2 screenshots
```

## Adding a pattern

1. Add `registry/patterns/<slug>.json` and `registry/controls/<slug>.json`.
2. Build the component and its page in `src/patterns/<slug>/`.
3. Register the thumbnail and page in `src/patterns/index.ts`. The app refuses to start if a record has no manifest or no page.
