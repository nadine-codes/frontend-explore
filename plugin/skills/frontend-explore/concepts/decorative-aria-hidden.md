---
title: Decoration and aria-hidden
summary: Hide purely visual parts from screen readers, or describe the whole thing once.
---

# Decoration and aria-hidden

Some elements exist only to look good: a glare, a moving planet. A screen reader reading each of them adds noise.

Two options. Hide decoration with `aria-hidden="true"`. Or, when the visual carries meaning, give the whole thing one description with `role="img"` and an `aria-label`, and hide the parts.

[[3d-tilt-hover]] hides its glare. [[command-palette]] hides its key hints, which only repeat what the keyboard already does. [[orbit-animation]] is announced as one image when it has a label, and is hidden entirely when it does not.
