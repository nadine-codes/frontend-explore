---
title: Custom hook
summary: Put reusable stateful logic in a function that starts with "use", so any component can share it.
---

# Custom hook

A custom hook is a function whose name starts with `use` and that calls other hooks. It lets several components share behavior without sharing markup.

`useTilt()` holds all the pointer math and the animation loop for [[3d-tilt-hover]], and returns a ref. Any element that takes the ref can tilt. It pairs with [[refs-over-state]] to stay fast.
