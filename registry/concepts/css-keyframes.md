---
title: CSS keyframes
summary: Describe an animation's steps in CSS and let the browser run it.
---

# CSS keyframes

`@keyframes` names an animation and its steps. The `animation` property runs it on an element, with a duration, a timing function and a repeat count.

The browser runs it without JavaScript, often off the main thread. [[orbit-animation]] uses one `orbit-spin` keyframe for every ring, and [[counter-rotation]] runs the same keyframe in reverse.
