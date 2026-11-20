---
title: Concepts
summary: The ideas behind Frontend Explore, in the order a newcomer needs them.
group: Get started
order: 2
last_checked: 2026-11-19
---

A pattern library is like a cookbook. A recipe (pattern) has ingredients you can adjust (controls), techniques it shares with other recipes (concepts), and notes on which dishes go together (mood and fit). The rest of the library helps you find the right recipe and cook it the same way every time.

## Pattern

A pattern is one interaction, built as a reusable React component, with the notes needed to use it well.

Each pattern has three parts in the repo: a record with its facts (`registry/patterns/<slug>.json`), a note in plain words (`registry/patterns/<slug>.md`), and the component source. The site page and the AI skill are built from these same files. The search index will be too (planned).

```text
 record (.json) ──┐
 note (.md) ──────┼──▶  site page
 component code ──┘     skill bundle
```

*One set of files feeds every place a pattern appears.*

Example: [[3d-tilt-hover]] is a record, a note, and the `TiltCard` folder.

## Controls

Controls are the settings a pattern exposes, listed in one file so any tool can build the same settings panel.

The controls manifest (`registry/controls/<slug>.json`) lists each slider, toggle and choice with its default, range and step, plus presets. The playground panel on every pattern page is drawn from this file alone.

```text
 controls.json ──▶  playground panel ──▶  live component
                    (sliders, toggles)     (props)
```

*Change the file and the panel changes with it.*

Example: the tilt card's "Max tilt" slider runs from 0° to 25° in steps of 1°, default 10°, because its manifest says so.

## Concepts and links

A concept is one front-end idea, explained once, that several patterns share.

Patterns and concepts link to each other with `[[slug]]` links, like notes in Obsidian. A pattern's record lists its concepts, and each concept note links back to every pattern that uses it. The build fails if a link points nowhere or if the two sides disagree.

```text
 3d-tilt-hover ──▶ reduced-motion ◀── orbit-animation
```

*A shared concept connects two patterns.*

Example: [[reduced-motion]] is used by both patterns, so it is written once and linked from both.

## Mood and fit

Mood and fit are the fields that say when a pattern belongs on a page.

Each record has `mood`, `best_sections`, `cost`, `use_when`, `avoid_when`, `pairs_with` and `clashes_with`. These are what an AI tool judges with when it picks patterns, and they keep a page to one signature interaction.

```text
 brief: "playful hero"  ──▶  mood + section match  ──▶  2 or 3 candidates
```

*Fit fields turn a brief into a short list.*

Example: [[orbit-animation]] is "calm" and best in a "hero", and should be avoided "next to other moving things".

## Skill

The skill teaches an AI coding tool to pick fitting patterns and build with their code (planned: the plugin install).

It reads a one-line-per-pattern index first, picks 2 or 3 patterns, says why, then opens only the chosen pattern notes and their drop-in code. It ends with a checklist for accessibility, reduced motion, mobile and performance.

```text
 index.md ──▶ pick 2–3 ──▶ open pattern notes ──▶ build ──▶ checklist
```

*The skill opens full files only after it has chosen.*

Example: the bundle lives in `plugin/skills/frontend-explore/`, generated from the registry.

## Selection file

Planned. A small file that says exactly which pattern and settings to build, so an AI tool builds what you chose on the site.

```text
 site: "Use this" ──▶ .frontend-explore/selection.json ──▶ AI tool builds it
```

*Planned: the file carries your choice from the site to your project.*

## Live endpoint

Planned. A read-only service AI tools can query for patterns, with the bundled files as a fallback.

## Constellation

The constellation is the map of patterns and concepts, drawn from the authored links.

The build writes `registry/constellation.json` from the links. The map on the site is planned until the library has at least 8 patterns.

## Citations

Planned. Answers in the Ask box will cite the pattern, concept or docs page each claim came from. No source, no answer.

Next: [Glossary →](/docs/glossary)
