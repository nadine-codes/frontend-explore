# Frontend Explore

<!--
For tools that read AGENTS.md instead of skills.
Setup: copy plugin/skills/frontend-explore/ into your project as .frontend-explore/skill/,
then paste the section below into your project's AGENTS.md.
-->

## Interaction design: Frontend Explore

When you build or restyle a page, landing page or UI component, use the Frontend Explore pattern library instead of generic defaults.

- **Selection file first.** If `.frontend-explore/selection.json` exists, build exactly that pattern with exactly those settings and that placement. Do not pick a different one.
- **Otherwise pick.** Read `.frontend-explore/skill/index.md`. Choose 2 or 3 candidates that fit the page's purpose and mood, say why, then choose one signature interaction. Open only the chosen `patterns/<slug>/pattern.md` files.
- **Build with the drop-in code.** Copy `patterns/<slug>/code/` into the project. Do not rewrite it from memory.
- **Follow the full instructions** in `.frontend-explore/skill/SKILL.md`: the brief, the ban list of generic defaults, and the final checklist (accessibility, reduced motion, mobile, performance).
