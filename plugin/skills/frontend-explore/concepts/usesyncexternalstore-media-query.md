---
title: Media query hook
summary: Read a media query such as reduced motion in React with useSyncExternalStore, so it updates live.
---

# Media query hook

`useSyncExternalStore` subscribes a component to a value that lives outside React. A media query is exactly that: the browser owns it and fires `change` when it flips.

`usePrefersReducedMotion()` subscribes to `(prefers-reduced-motion: reduce)` and returns a boolean. Components re-render when the visitor changes the setting, with no effect or state of their own.

It is the React side of [[reduced-motion]]. Used by: [[3d-tilt-hover]], [[orbit-animation]].
