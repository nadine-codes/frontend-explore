---
name: frontend-explore
description: Use when building or restyling a website, landing page or UI and you want custom, well-crafted interaction design instead of generic defaults. Picks fitting patterns from a curated React and TypeScript library and builds with their drop-in code.
---

# Frontend Explore

A curated library of interaction patterns, each with drop-in React and TypeScript code and notes on when to use it. Your job: make a page that does not look like default AI output. One strong idea, built well, beats many effects.

Files in this skill:

- `index.md`: one line per pattern with its fit. Read this first.
- `patterns/<slug>/pattern.md`: the full note for one pattern. Open only after choosing it.
- `patterns/<slug>/code/`: the drop-in component. Copy the whole folder.
- `patterns/<slug>/controls.json`: every setting with its default and range.
- `concepts/<id>.md`: shared ideas the pattern notes link to with `[[id]]`.
- `rules/`: type, spacing, color and copy guides.
- `recipes/`: short plans by project type. Start with `recipes/landing-page.md` for a landing page.

## If a selection file exists

If `.frontend-explore/selection.json` exists in the project, the person already chose. Skip step 2. Build exactly that pattern, with exactly those settings, in that placement. Still do step 1 and step 4.

## Steps

Do these in order. Do not skip the brief or the check.

### 1. Write a brief

Before any code, write four lines and show them:

- **Purpose:** what the page is for, in one sentence.
- **Mood:** two or three words (for example calm, playful, techy, editorial).
- **Signature moment:** the one interaction a visitor should remember, and where it sits.
- **Design system:** does the project already have components, tokens or a brand? Look before you answer.

### 2. Pick patterns

Read `index.md`. Pick 2 or 3 candidates whose mood, sections and "use when" fit the brief. For each, say in one line why it fits. Name the ones you rejected and why.

Then choose. Only one may be the page's signature interaction. Open each chosen `pattern.md` and follow its links:

- "Pairs with" patterns can support it quietly.
- "Clashes with" patterns must not share the page.
- Concept links tell you what must come along, such as a reduced-motion version.

### 3. Build

Copy the pattern's `code/` folder into the project's components folder. Use the props from `pattern.md` and `controls.json`. Do not rewrite the component from memory.

**Blank page:** set type, spacing and color from `rules/` before adding the pattern, so the interaction does not land on a bland page.

**Existing product:** read the project's components, tokens and brand first. Map the pattern's CSS variables to the project's tokens. Never override the design system; adapt the pattern to it.

### 4. Check

If a browser tool is available, screenshot the page at desktop and phone width and look at it. Then run the checklist below and fix anything that fails. If the page still looks generic, change it: stronger type, a real layout idea, fewer effects.

## Rules

- **One signature interaction per page.** Everything else is quiet.
- **Every animation has a reduced-motion version.** Check `prefers-reduced-motion`.
- **Do not use these generic defaults:**
  - purple gradient hero
  - three identical feature cards in a row
  - fade-up on every section as you scroll
  - emoji as section icons
  - centered everything, with the same spacing between every block
  - stock copy such as "Unlock the power of", "Seamless", "Elevate your"

## Checklist

Run this before you say the page is done.

- [ ] Accessibility: every interactive element works with the keyboard and shows focus. Images and icons have text alternatives or `aria-hidden`. Text contrast is at least 4.5:1.
- [ ] Reduced motion: with reduced motion on, nothing moves on its own and nothing important is lost.
- [ ] Mobile: no sideways scroll at 390px wide. Touch targets are at least 44px. Hover-only effects have a touch plan.
- [ ] Performance: animations touch only `transform` and `opacity`. No layout shift when the pattern loads.
- [ ] Taste: one signature interaction. None of the banned defaults. The copy sounds like a person.
