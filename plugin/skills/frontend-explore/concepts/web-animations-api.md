---
title: Web Animations API
summary: Control running CSS animations from JavaScript without restarting them.
---

# Web Animations API

`element.getAnimations()` returns the animations running on an element, including ones started by CSS. Each one has `currentTime` and `playbackRate`.

Changing `animation-duration` mid-flight makes things jump. Changing `playbackRate` changes speed smoothly, and a negative rate plays backwards. [[orbit-animation]] uses it for its speed and direction controls.
