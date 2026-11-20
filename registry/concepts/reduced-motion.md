---
title: Reduced motion
summary: Honor the operating system setting that asks for less movement, and ship a still version of every animation.
---

# Reduced motion

People who get dizzy or distracted by movement can ask their operating system for less of it. The browser exposes that as the `prefers-reduced-motion: reduce` media query.

Every animation in the library has a still version. In CSS, check the media query. In React, read it with a hook that subscribes to changes (see [[usesyncexternalstore-media-query]]), so the page updates if the setting changes while it is open.

The still version should keep the meaning, not just stop. A tilt card stays flat but keeps its subtle lift. An orbit holds its planets in place so the labels stay readable.

Used by: [[3d-tilt-hover]], [[orbit-animation]].
