---
title: Refs over state
summary: Write values that change every frame straight to the DOM through a ref, instead of re-rendering React.
---

# Refs over state

React state re-renders a component every time it changes. For values that change 60 times a second, such as a rotation angle, that is wasted work.

Instead, keep a ref to the element and write the value directly, usually as a [[css-custom-properties]] value. React renders once; the animation loop ([[requestanimationframe]]) updates the DOM.

Used by: [[3d-tilt-hover]].
