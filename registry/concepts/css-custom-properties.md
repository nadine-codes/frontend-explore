---
title: CSS custom properties
summary: Variables in CSS. JavaScript sets the numbers, CSS decides how they look.
---

# CSS custom properties

Custom properties (`--name: value`) are variables that cascade like any CSS property. JavaScript can set them on an element, and CSS can use them anywhere below it.

This splits the work cleanly. In [[3d-tilt-hover]], JavaScript sets `--tilt-rx` and `--tilt-ry` and the stylesheet owns the transform. In [[orbit-animation]], one variable, `--orbit-play`, pauses every animation at once.

[[focus-trap-modal]], [[combobox]] and [[command-palette]] expose theme variables such as `--modal-bg` and `--combobox-accent`, each with a dark default.

Patterns in this library style themselves through custom properties, so a product's own colors and spacing can replace the defaults.
