# Orbit animation

Planets circle a center on spinning rings, each at its own speed, while their labels stay upright.

## Use when

One hero visual should show a set of things as one system: a tech stack, integrations around a product logo.

## Avoid when

Next to other moving things, where it competes for attention. Or as a loading indicator: a lap under 10 seconds reads as a spinner.

## Drop it in

Copy the `OrbitSystem/` folder (`OrbitSystem.tsx`, `OrbitSystem.css`, `usePrefersReducedMotion.ts`, `index.ts`).

```tsx
import { OrbitSystem, type Orbit } from './components/OrbitSystem';

const orbits: Orbit[] = [
  { size: 44, duration: 38, planets: [{ label: 'Components', color: '#5ee0f5', angle: 20 }] },
  { size: 70, duration: 60, planets: [{ label: 'React', color: '#61dafb', angle: 200 }] },
];

<OrbitSystem orbits={orbits} center={<Logo />} pauseOnHover label="Our stack orbiting the product" />
```

Props: `orbits` (size in % of the system, duration in seconds per lap, planets), `center`, `speed` (default 1), `direction`, `tilt` (deg, 0 to 80), `uprightLabels` (default true), `showPaths` (default true), `pauseOnHover`, `paused`, `label`, `ref`.

Size it with `width` on its class; it keeps a square aspect ratio. Planet dot size is `--dot-size`. Label color and font read `--ink` and `--font-mono`.

## Design notes

- Keep it slow. A lap of 40 to 90 seconds reads as calm.
- Give outer rings longer durations than inner ones.
- Keep labels upright with [[counter-rotation]]. Rotating text is hard to read.
- Use it once, as a hero visual.

## Accessibility

- It moves on its own for more than five seconds, so it needs a way to stop: respect reduced motion, and use `pauseOnHover` or a visible pause control (WCAG 2.2.2). See [[ambient-motion]].
- Reduced motion: every ring holds still. See [[reduced-motion]] and [[usesyncexternalstore-media-query]].
- With `label`, screen readers hear one image with that description. Without it, the whole system is `aria-hidden`. Do not leave important information only in the planets. See [[decorative-aria-hidden]].
- Not keyboard interactive. If planets become links, give each a real focusable element and pause while focus is inside.

## Links

Concepts: [[css-keyframes]], [[counter-rotation]], [[web-animations-api]], [[css-custom-properties]], [[reduced-motion]], [[usesyncexternalstore-media-query]], [[decorative-aria-hidden]], [[ambient-motion]].

Pairs with: [[3d-tilt-hover]].
