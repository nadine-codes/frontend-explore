---
title: Graphon friction log
summary: What was clear and what was confusing while setting up Graphon for Frontend Explore. Case study material.
last_checked: 2026-11-19
---

# Graphon friction log

One entry per step, written as it happens.

## 2026-11-19 · Connecting Claude Code (before Phase 2)

- **Clear:** the get-started page gives the exact sign-in command (`claude mcp login plugin:graphon:graphon`) and a ready-to-paste check prompt. The prompt is read-only and says so.
- **Confusing:** the consent screen preselects **Admin**, and the get-started page only says "Approve it". The docs (docs.graphon.ai/mcp) say to pick the lowest role the agent needs, and that the list "starts at your highest role". But that advice is not on the page you follow, so following the page step by step grants Admin. The owner approved Admin by accident and had to disconnect and reconnect.
- **Hard to find:** where to undo it. The docs name Settings → Security → Connected apps, but neither the consent screen nor the get-started page links there.
- **Good:** the consent screen is honest that API keys an app creates outlive the connection, and says the app never gets more than your own role.
- **Suggestion for Graphon:** default the role to Viewer (or no preselection), and add one line to the get-started page: "Pick Viewer to explore, Editor to upload."
