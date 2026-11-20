---
title: Pointer events
summary: One set of events that covers mouse, pen and touch.
---

# Pointer events

Pointer events (`pointermove`, `pointerdown`, `pointerleave`, `pointercancel`) fire for mouse, pen and touch alike, so one set of listeners covers every input.

`pointercancel` matters on touch: it fires when the browser takes over, for example to scroll. [[3d-tilt-hover]] listens for it and eases the card back to flat.

Touch has no hover. A pointer-driven effect needs a plan for touch, such as reacting only while a finger drags.
