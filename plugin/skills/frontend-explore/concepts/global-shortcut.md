---
title: Global keyboard shortcut
summary: A key combination that works anywhere on the page, such as Cmd+K.
---

# Global keyboard shortcut

A global shortcut listens on the window. Use a modifier (Cmd on Mac, Ctrl elsewhere) so it never fires while someone is typing, and call `preventDefault` so the browser's own action does not also run.

Avoid combinations the browser or screen readers already use, such as Cmd+P or Ctrl+Option. Always offer a visible button too: phones have no Cmd key, and shortcuts are hard to discover.

Used by: [[command-palette]].
