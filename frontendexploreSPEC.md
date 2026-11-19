# frontend-explore: build spec

Written for Claude Code. Read this whole file before changing anything. Where this spec says "verify", test it and report the result. Do not guess.

Date: 2026-11-19.

## What this is

frontend-explore is a library of hand-built, tested interaction patterns (React 19 + TypeScript) that designers and builders can use to ship better-looking interfaces fast. It has four faces:

1. **The site** (today: `frontendexplore.vercel.app`): browse patterns, play with live controls, read how each one is built, and ask questions with cited answers.
2. **A plugin for AI coding tools**: a skill, an AGENTS.md section, and a live pattern endpoint, installed the same way Graphon installs its own plugin. A tool like Claude Code picks fitting patterns for a project and builds with their drop-in code. The goal is pages that do not look like default AI output.
3. **A helper**: pick a pattern and its settings visually on the site, then have any AI tool build it exactly as chosen, through a small file in the project.
4. **A constellation map**: patterns and concepts as a connected graph.

Graphon (graphon.ai) is the backbone. The registry lives in a Graphon bucket. Search, answers, research, filtering and the install experience all use Graphon wherever it is the natural tool. Two limits on that:

- A bundled copy of the registry stays inside the skill, only so a Graphon outage or a missing sign-in never breaks a build. Do not design around Graphon being absent.
- Do not bolt Graphon onto things it adds nothing to. For example, the map is drawn from authored links, not from a Graphon graph (see "Connecting the dots").

Audience: designers and builders working on any kind of project. Two starting points: a blank page, or an existing product with its own design system.

## Principles

- Quality over count. Eight patterns with sharp "when to use" notes beat fifty without them.
- One signature interaction per page. The skill enforces this.
- Every animation ships with a reduced-motion version. Every pattern page has a keyboard and screen reader section.
- Patterns style themselves through CSS variables so a product's own colors, fonts and spacing can replace the defaults.
- Authored links between notes are the source of truth for the graph. Graphon suggestions are marked `suggested` until a human approves them.
- Least privilege with Graphon: the public site and endpoint use a `viewer` role key only. Never ship an `editor` or `admin` key to the site.
- Do not copy other sites' code or footage. Link and describe other people's interactions. Only show footage and code the owner made.
- Plain, short copy. No em dashes in any copy you write.

## What exists today

Checked in the browser on 2026-11-18.

- Routes: `/` (home), `/explore` (the star map), `/explore/<slug>` (one page per pattern).
- Patterns: `3d-tilt-hover` and `orbit-animation`. A teaser says the next pattern is coming.
- Stack: React 19 and TypeScript, hosted on Vercel. Inspect the repo for the build tool and framework. Do not assume.
- Each pattern page has: a live playground with sliders and presets, source files in tabs, a how-it's-built walkthrough, a concepts list, alternate names, design notes, and a seen-in-the-wild link back to Coverage Agent.
- Gaps: no search, no categories, no links between patterns, and accessibility notes are mixed into the design notes.
- The repo was renamed to `frontend-explore` (was `frontendexplore`). The site header may still show a `frontend/explore` logo and link to the old repo address.

## Build a new version, do not edit the current site

The owner likes the vibe of the current site and wants it kept. Build version 2 as a fresh project that recreates that look. Do not build on top of the current code, and do not change the live site until the owner says so.

### How

1. **Leave the current site alone.** `frontendexplore.vercel.app` stays live and untouched while v2 is built. Do not edit, redeploy or delete it.
2. **Start v2 in a separate place.** Make a new folder or branch with its own Vercel preview, not a change to the existing app. Ask the owner which they prefer: a new branch of the `frontend-explore` repo (for example `v2`), or a new repo. Default to a new branch with a preview deployment. The switch to the main domain is the owner's call.
3. **Study the current site, then recreate it.** Before writing anything, open the live site and the repo and write `docs/design-notes/v1-vibe.md`. Record:
   - colors, type, spacing, radius and shadows, as a token list
   - the star-map look and motion on `/explore`
   - the page layouts for home, `/explore`, and a pattern page
   - the feel of the copy and the controls panel
   Take screenshots of each page at desktop and mobile width and save them in the notes.
4. **Rebuild from tokens, not by copying files.** Create a fresh set of CSS variables from the notes and build the layout and components new, with the new architecture (registry, controls manifest, linked notes). Pattern code for `3d-tilt-hover` and `orbit-animation` may be ported over as source, since the patterns are the product, but port them one at a time, add their registry files and controls manifests, and check each against the old playground.
5. **Match, then improve.** v2 must first look and feel like v1 on the same three pages. Compare screenshots side by side. Only after that, add the new features (search, concepts, links, Ask, docs, the map).
6. **Do not carry over** the gaps listed above: mixed accessibility notes, missing links between patterns, no search.

### Done when

The owner opens v1 and v2 side by side and agrees v2 has the same vibe, and every v1 page has a v2 equivalent. Then, and only then, the owner decides whether to point the main domain at v2.

## Layout and conventions

Follow v1's code style and tooling where it is sound, such as TypeScript settings and naming. The file layout below is a proposal for v2. Adapt it to the new project where it conflicts.

## Naming

Use one name everywhere, with no slash. A slash already means a path, a GitHub owner and repo, or an npm scope.

| Where | Name |
| --- | --- |
| Prose and the LinkedIn page | Frontend Explore |
| Site header logo | `frontend-explore`, or plain "Frontend Explore" (owner's choice, ask) |
| GitHub repo and npm package | `frontend-explore` |
| Plugin name | `frontend-explore` |
| Skill name | `frontend-explore` |
| Project folder | `.frontend-explore/` |

Both `frontend-explore` and `frontendexplore` showed as free on npm on 2026-11-19 (`npm view` returned 404 for each). Use the dashed name. Do not publish anything without the owner's go-ahead.

## Using Graphon

Facts below come from Graphon's public docs and plugin repo, read on 2026-11-19. Docs: https://docs.graphon.ai/ and https://github.com/GraphonAI/graphon-plugin. Verify anything you rely on.

### How Graphon's own install works (the model to copy)

Graphon's onboarding is five steps: install the Graphon plugin, sign in, add some data, add search, answer and research to your app "with a simple prompt", invite your team. The plugin is one install that gives a coding agent three things:

- **MCP server** (`https://api.graphon.ai/mcp`): the agent signs in with OAuth on its first call. 71 tools in 11 toolsets, limited by the role you grant (Viewer, Editor, Admin).
- **`graphon` CLI**: uploads, folder syncs, API keys, and `graphon search`, `graphon ask`, `graphon chat`, `graphon research`.
- **Skills**: teach the agent to add storage and search to an app, answer questions from your files, move data in, and fix failed calls.

Install commands from their docs:

| Tool | Status | Commands |
| --- | --- | --- |
| Claude Code | Verified | `claude plugin marketplace add GraphonAI/graphon-plugin` then `claude plugin install graphon@graphon --scope user` |
| Codex | Verified | `codex plugin marketplace add GraphonAI/graphon-plugin` then `codex plugin add graphon@graphon` |
| Cursor | Verified | `npx plugins add GraphonAI/graphon-plugin --target cursor` (marketplace listing pending review) |
| Antigravity IDE | Verified | `npx skills add GraphonAI/graphon-plugin`, copy `mcp/antigravity.json` to `~/.codeium/antigravity/mcp_config.json`, restart, sign in from the MCP panel |
| Copilot CLI | Verified | `copilot plugin marketplace add GraphonAI/graphon-plugin` then `copilot plugin install graphon@graphon` |
| Other agents | Should work | `npx plugins add GraphonAI/graphon-plugin` then `npx add-mcp https://api.graphon.ai/mcp -g --name graphon` |
| Claude Desktop | UI only | Settings, Plugins, add the marketplace, Sync, add the plugin |
| Gemini CLI | Blocked upstream | Installs but cannot connect; skills still work via `npx skills add` |

Sign-in: start a new agent session, ask the agent to connect to Graphon, and approve the browser sign-in (one for the MCP server, one for the CLI). No API key is pasted. In Claude Code, `/mcp` shows the server. If Copilot CLI shows no MCP tools, an organization may block third-party MCP servers, and the skills still work. The docs give no update or uninstall steps, so check those in the plugin repo.

Their plugin page marks each tool Verified, Should work or Blocked. Use the same three labels for ours, and only after testing. The plugin repo contains `.claude-plugin/`, `.cursor-plugin/`, `skills/`, `hooks/`, `mcp/`, `AGENTS.md`, `plugin.json`, `.mcp.json` and more. That layout is the template for ours.

### What each Graphon piece is used for

| Graphon piece | Our use |
| --- | --- |
| Bucket plus CLI (`graphon objects put`, `graphon objects sync`) | The registry (pattern notes, concept notes, controls manifests, reference docs, recordings) is synced into a bucket. The repo stays the source of truth. The bucket is the searchable copy. |
| Filterable metadata fields (`get_metadata_fields`, `update_metadata_fields`) | Pattern record fields (category, mood, best sections, WCAG criteria, cost) become metadata, so searches can filter, such as mood is playful and section is hero. Changes may take about 30 minutes to index. |
| `search_objects` then `read_spans` | Finding patterns. Search returns matching spans with no text. `read_spans` fetches the passages. Used by the Ask route, the live endpoint and the skill. |
| `answer_question` | Ask the universe. Answers carry `[[SRC:0001]]` markers that match a source ref. Turn them into citation chips. Handle the `sources_trimmed` warning. |
| `start_research` (premium) | The gap finder and link suggestions across the reference shelf. Run as an owner batch, not per visit. Runs expire 7 days after they end, so save results into the repo. |
| API keys and roles | The Vercel route and the live endpoint use a workspace API key with the `viewer` role, stored as `GRAPHON_API_KEY` (the name Graphon's own plugin uses). Create it with `graphon api-keys create --name "frontend-explore-site" --owner workspace --role viewer`. |
| Plugin, MCP and skills | Our own plugin mirrors theirs (below). |

### Build the site with Graphon's own plugin (dogfood)

Install the Graphon plugin in Claude Code, sign in, and prompt it to add search and answer to the site, the way Graphon's onboarding suggests. Keep a short friction log: what was clear, what was confusing, how long each step took. The owner uses it as the case study for the Graphon relationship, so write it down as you go.

### Our plugin

Publish a plugin that mirrors Graphon's layout:

- `.claude-plugin/` and `.cursor-plugin/` manifests, and a `plugin.json` (read Graphon's repo for any Codex, Copilot and Antigravity files such as `mcp/antigravity.json`)
- `skills/frontend-explore/` with `SKILL.md`, the index, rules, and the bundled pattern and concept files
- an `AGENTS.md` for tools that read it
- an MCP config that points at our live endpoint (below)

Target install commands, once it works:

```
claude plugin marketplace add <owner>/<plugin-repo>
claude plugin install frontend-explore@frontend-explore --scope user
codex plugin marketplace add <owner>/<plugin-repo>
codex plugin add frontend-explore@frontend-explore
npx plugins add <owner>/<plugin-repo> --target cursor
npx skills add <owner>/<plugin-repo>
```

Ship Claude Code first. Add each other tool only after testing it, and label it Verified, Should work or Blocked on the install docs page.

Verify first: read `GraphonAI/graphon-plugin` for the exact manifest files. If the manifests must sit at the repo root, publish the plugin from its own small repo (proposed name `frontend-explore-plugin`) so the site repo stays clean. Test the install in Claude Code and in one other tool before claiming support.

### Live pattern endpoint

An end user cannot query our bucket with their own Graphon login, so the site hosts a read-only endpoint (MCP over HTTP, with a plain HTTP version of the same calls) backed by Graphon through the `viewer` key.

Tools:
- `search_patterns(query, mood?, section?, wcag?, category?)`
- `get_pattern(slug)`
- `get_related(slug)`: authored links first
- `ask(question)`: cited answer

Rules: read-only, rate limited, a daily spend limit, responses include citations. The skill prefers the live endpoint and falls back to its bundled files if the endpoint is slow, rate limited or down. Verify how to host an MCP endpoint on Vercel.

## Proposed layout

```
registry/
  patterns/<slug>.json          pattern record (authored)
  patterns/<slug>.md            notes and code reference for the skill, with [[links]]
  concepts/<name>.md            one note per shared concept, with [[links]] back
  controls/<slug>.json          controls manifest (sliders, toggles, defaults)
  reference/                    reference shelf for the gap finder (WCAG, MDN, library docs)
docs/                           docs site pages (markdown), served at /docs, synced to the bucket
plugin/ (or its own repo)
  .claude-plugin/ .cursor-plugin/ plugin.json
  skills/frontend-explore/
    SKILL.md                    taste rules, selection steps, recipes, checklist
    index.md                    one line per pattern (generated)
    rules/                      type pairing, spacing, color, copy tone
    patterns/ concepts/         bundled copy of the registry (generated)
  AGENTS.md
  mcp config                    points at the live endpoint
scripts/
  build-registry.ts             validate links, generate constellation.json, index.md, bundle
  sync-graphon.ts               sync the registry to the bucket and set metadata fields
api/ (server routes)
  ask, mcp                      the Ask route and the live endpoint
cli/
  init                          optional thin helper (selection file only)
```

## Data shapes

### Pattern record: `registry/patterns/<slug>.json`

Authored by hand. The values below are examples for the tilt card.

```json
{
  "slug": "3d-tilt-hover",
  "title": "3D tilt hover",
  "category": "motion",
  "concepts": ["custom-hook", "requestanimationframe", "reduced-motion"],
  "wcag": ["2.3.3", "2.5.1"],
  "aliases": ["tilt card", "parallax tilt"],
  "sources": [{ "title": "MDN: perspective", "url": "..." }],
  "mood": ["playful", "techy"],
  "best_sections": ["hero"],
  "cost": { "weight": "light", "mobile_risk": "low" },
  "use_when": "One hero element should feel physical",
  "avoid_when": "Every card on a page, or touch screens without drag",
  "pairs_with": ["orbit-animation"],
  "clashes_with": []
}
```

Selection fields (`mood`, `best_sections`, `cost`, `use_when`, `avoid_when`, `pairs_with`, `clashes_with`) are what the skill judges with. Take `avoid_when` and design notes from what each pattern page already says. Do not invent claims. `concepts`, `pairs_with` and `clashes_with` are the authored links. `category`, `mood`, `best_sections`, `wcag` and `cost.weight` are also set as filterable Graphon metadata.

### Linked notes

Pattern notes and concept notes are markdown files that link with `[[slug]]` (Obsidian style). Example: the tilt card links to `[[reduced-motion]]`, `[[requestanimationframe]]` and `[[orbit-animation]]`. A concept note explains one idea once and lists every pattern that uses it.

Build checks (the build fails if any is violated):
- Every `[[link]]` resolves to a real pattern or concept.
- Every pattern links to at least one concept.
- Every `pairs_with` and `clashes_with` slug exists.

### Constellation file: `constellation.json`

Generated by `scripts/build-registry.ts` from the authored links. Committed. The site reads it as static JSON, so the map never waits on Graphon.

```json
{
  "nodes": [
    { "id": "3d-tilt-hover", "type": "pattern" },
    { "id": "orbit-animation", "type": "pattern" },
    { "id": "reduced-motion", "type": "concept" }
  ],
  "edges": [
    { "from": "3d-tilt-hover", "to": "reduced-motion", "type": "concept", "status": "authored" },
    { "from": "3d-tilt-hover", "to": "orbit-animation", "type": "pairs_with", "status": "authored" },
    { "from": "orbit-animation", "to": "reduced-motion", "type": "concept", "status": "suggested" }
  ],
  "gaps": [{ "title": "Command palette", "reason": "Appears in 4 reference sources", "sources": ["..."] }]
}
```

`gaps` come from the gap finder. The `reason` shown is an example. Only render `authored` edges by default. Show `suggested` edges only in a review view for the owner.

The WCAG field is a first-class filter, so the accessibility lens on the map is a lookup, not a search.

### Controls manifest: `registry/controls/<slug>.json`

Each pattern lists its sliders and options. The playground on the site is built from this file, so the same file can drive any later window. Extract it from the existing playground code. Take ranges, steps and units from the current sliders. Do not invent them.

```json
{
  "pattern": "3d-tilt-hover",
  "controls": [
    { "id": "maxTilt", "type": "range", "label": "Max tilt", "default": 10, "unit": "deg" },
    { "id": "perspective", "type": "range", "label": "Perspective", "default": 900, "unit": "px" },
    { "id": "smoothing", "type": "range", "label": "Smoothing", "default": 0.14 },
    { "id": "lift", "type": "range", "label": "Lift on hover", "default": 1.02 },
    { "id": "glare", "type": "toggle", "label": "Glare", "default": false },
    { "id": "depth", "type": "toggle", "label": "Depth", "default": false },
    { "id": "invert", "type": "toggle", "label": "Invert", "default": false }
  ]
}
```

Add `min`, `max` and `step` to each range from the real sliders. The defaults above are the values the tilt page showed on 2026-11-18, except the toggles, which depend on the active preset. Check the code.

## Connecting the dots

Every pattern and every shared concept is a linked note, like notes in Obsidian. The links are the graph, and one graph serves the AI, Graphon and the site.

- The AI follows the links. After choosing a pattern, the skill opens its linked notes to find what must come with it (a reduced-motion version), what pairs well, and what clashes.
- Graphon reads the same notes. Its public tool list has no graph or edge tools, so do not expect a graph export. Instead, run Research or Answer prompts such as "which concepts do these two patterns share that are not linked?" and save the results as `suggested` edges for the owner to approve.
- The site draws the constellation from the approved links. Click a concept and every pattern that uses it glows.

## The skill

One skill, not one per pattern. It loads in stages, so a full pattern file is only opened once chosen.

`SKILL.md` frontmatter:

```yaml
---
name: frontend-explore
description: Use when building or restyling a website, landing page or UI and you want custom, well-crafted interaction design instead of generic defaults. Picks fitting patterns from a curated React and TypeScript library and builds with their drop-in code.
---
```

Steps the skill forces:

1. Write a brief: the page's purpose, its mood, the one signature moment, and whether an existing design system applies.
2. Find candidates: query the live endpoint (`search_patterns`) if available, otherwise read `index.md`. Pick 2 or 3 patterns. Say why each fits and name the ones rejected. Follow each chosen pattern's links to see what pairs well and what clashes.
3. Build with the drop-in code from each chosen pattern file.
4. Check the result: screenshot the page if a browser tool is available, run the checklist, and fix anything that looks generic.

If `.frontend-explore/selection.json` exists, skip the picking and build from it exactly. Still run steps 1 and 4.

Two starting points:
- **Blank page.** The skill picks patterns and sets type, spacing and color from `rules/`.
- **Existing product.** The skill first reads the project's components, tokens and brand, then adapts each pattern to use them. It never overrides the design system.

Rules to put in `SKILL.md`:
- One signature interaction per page.
- Every animation has a reduced-motion version.
- A ban list of generic AI defaults. Starter list: purple gradient hero, three identical feature cards, fade-up on every section.
- A short final checklist covering accessibility, reduced motion, mobile and performance.

`rules/` holds short guides on type pairing, spacing, color and copy tone. Without them, good interactions still land on a bland page.

Recipes: short plans by project type, starting with the landing page. Write the first recipe after the first 5 patterns exist, so it names real patterns.

### Formats

The content is the same everywhere. Only the instruction file changes.

- **Plugin (primary):** the layout above, installed with the commands in "Our plugin".
- **Claude skill alone:** `SKILL.md` plus the index and pattern files.
- **AGENTS.md:** a short section that tells any tool reading it where the index and endpoint are and how to use them, including the selection file rule. Verify how each tool reads this file before claiming support.
- **Others:** Cursor rules and Copilot instructions, added on request.

## The helper

Lets a person pick a pattern visually and have any AI tool build it exactly as chosen, through a file. There is no live connection between the website and the AI tool.

**Selection file:** `.frontend-explore/selection.json` in the person's project.

```json
{
  "pattern": "3d-tilt-hover",
  "placement": "hero card",
  "settings": { "maxTilt": 8, "glare": true, "depth": false },
  "related": ["reduced-motion"]
}
```

Build in two steps:

1. **Copy button.** On each pattern page, "Use this" copies the current selection (pattern, settings, related concepts) as text, to paste into the AI tool or save as the file. No extra software.
2. **Thin init command (optional).** `npx frontend-explore init` only receives a selection from the site and saves the selection file. Tool detection and instruction files now come from the plugin install, so skip tool detection unless the plugin route fails. It runs only on the person's machine, listens on localhost, and is protected by a token. It never edits source files. The AI does that.

Not yet: a browser extension or a dev-server overlay. Decide after seeing whether people use the helper.

## Ask the universe

A search box on the site. An answer is shown only if it carries at least one citation. No source, no answer.

Runtime path: browser, then a Vercel server route that holds `GRAPHON_API_KEY` (viewer role), then Graphon `answer_question`. Build-time work (sync, metadata, research batches) runs from the owner's machine.

```
build time:  registry -> graphon sync -> bucket + metadata fields
             research batches -> suggested links and gaps -> committed
per visit:   browser <-> Vercel route (key, rate limits) <-> Graphon search + answer
per agent:   AI tool <-> live endpoint (read-only) <-> Graphon search + answer
```

Rules:
- The Graphon key lives only in a server-side environment variable. The browser never sees it.
- Limit questions to 200 characters and each visitor to 10 questions a minute. Add a daily spend limit.
- Parse `[[SRC:0001]]` markers into numbered citation chips that link to the pattern page, the source file, or the reference page they came from. If Graphon returns `sources_trimmed`, say so rather than hiding it.
- Cmd+K (Ctrl+K on Windows) opens the box, Esc closes it, focus is trapped while it is open, and the answer sits in a polite live region.
- Respect reduced motion: no pulsing, no star animation.
- Cache answers to the 3 example questions and show cached results first.

States:

| State | What the visitor sees |
| --- | --- |
| Idle | Input with 3 example questions, such as "something that reacts to my pointer" |
| Loading | Skeleton answer and a pulsing star; the map stays usable |
| Answer | 2 to 4 sentences, a numbered citation chip per claim, matching stars lit on the map |
| No source found | "Nothing in the library covers that yet" plus a link to the uncharted territory and a vote button |
| Error or timeout | Plain message after 8 seconds, with a retry button |
| Rate limited | Message saying to try again in a minute |

The answer box itself becomes pattern 03 (source-cited answer), with a playground.

## Constellation map

The star map at `/explore` becomes a map of connected patterns and concepts, drawn from `constellation.json`. Click a concept and every pattern that uses it glows. Related patterns show next to a selection. An accessibility lens filters the map by WCAG criterion. Uncharted territory shows dark regions for patterns the library lacks, each with a sourced reason from the Research batch, plus a vote button. Hold the map launch until at least 8 patterns exist.

## Docs

A docs site for Frontend Explore, modeled on Graphon's Concepts page (https://docs.graphon.ai/concepts). Docs serve three readers: a person learning the library, an AI tool reading it, and the Ask box citing it.

### Where it lives

Put docs at `/docs` on the same site, so they share the design and the pattern pages. Write each page as markdown in `docs/`. The build turns them into routes. The same files are synced into the Graphon bucket, so Ask can cite them. Check the repo for an existing markdown setup before adding a new one.

### What to copy from Graphon's page

- A header with a breadcrumb, an H1, and a one-line summary of the page.
- A short plain analogy at the top, before any terms.
- One H2 per concept, in the order a newcomer needs them.
- Each concept opens with a one-sentence definition, then 1 to 3 short paragraphs.
- A small labeled diagram per concept (boxes and arrows), with an italic one-line caption under it.
- One concrete example per concept, using real names from our library.
- A link ending in an arrow to the next guide or reference page.
- A left sidebar with grouped pages, and a "Was this page helpful?" prompt at the bottom.
- "Copy for LLM" and "View as Markdown" buttons on every page. This matters for us, because AI tools are readers.

### Pages

Group 1, Get started:
- Overview: what Frontend Explore is, who it is for, the two starting points.
- Browse and play: how to use the site, controls, and "Use this".
- Concepts (see below).
- Glossary: short definitions, one line each, linking to concept notes.

Group 2, Build with AI tools:
- Install the plugin: the install commands per tool, and what was tested.
- The skill: how it picks patterns, the brief, the checklist, the ban list.
- The selection file and helper: `.frontend-explore/selection.json`, the copy button, `init`.
- The live endpoint (MCP): tools, rate limits, fallback to bundled files.

Group 3, Use cases:
- Landing page, hackathon project, existing design system. Each shows a before and after from the with-and-without test.

Group 4, Reference:
- Pattern index (generated), controls manifest format, pattern record fields, the `[[link]]` note format, `constellation.json`.
- Accessibility guide: reduced motion, keyboard, screen reader.

### Concepts page

Sections, in order: Pattern, Controls, Concepts and links, Mood and fit (the selection fields), Skill, Selection file, Live endpoint, Constellation, Citations (how Ask answers). Each follows the pattern above: one-line definition, short body, diagram, caption, example, arrow link. Draw the diagrams as inline SVG or text figures that work in light and dark and under reduced motion.

### Rules

- Plain, short sentences. No em dashes. Concrete examples over abstraction.
- Do not document anything not built or tested. Mark unverified items "planned".
- Every code sample is copied from a file that runs. Do not write snippets by hand.
- Generate the pattern index and reference pages from the registry, so docs cannot drift. The build fails if a docs page links to a missing pattern.
- Every docs page has `title`, `summary` and `order` in its frontmatter, and a "last checked" date.
- Docs go in the bucket too. Ask can cite a docs page like any other source.
- Add `/docs/llms.txt` that lists every page with its summary and markdown link.

## Phases and acceptance

Do one phase at a time. Stop at the end of each phase and report.

### Phase 0: v2 shell that matches v1 (about 1 weekend)

- Set up the v2 branch or repo with its own preview URL (see "Build a new version").
- Write `docs/design-notes/v1-vibe.md` with tokens and screenshots.
- Rebuild home, `/explore` and one pattern page in the v2 shell, matching v1.

Done when: side-by-side screenshots of v1 and v2 match on all three pages, and the owner approves the look.

### Phase 1: registry, linked notes, skill, AGENTS.md (about 2 weekends)

- Registry fields and linked notes for the 2 existing patterns.
- Controls manifest on the 2 existing patterns, with the playgrounds rebuilt from it.
- The skill (bundled files only for now) and the AGENTS.md section.
- Accessibility section (keyboard and screen reader) on every pattern page, split out from the design notes.
- 3 new patterns, for 5 total. First candidates: command palette, combobox, focus-trapped modal. They share keyboard and focus concepts, so the links are real from day one.
- The landing page recipe, and the with-and-without test (below).
- Docs skeleton at `/docs`: Overview, Concepts, Glossary, with "Copy for LLM" and "View as Markdown" buttons. Fill the other pages as each feature ships.

Done when: both formats work in a real project, the test shows a clear difference on one landing page prompt, and the Concepts page reads well to someone new.

### Phase 2: Graphon backbone (about 1 weekend)

- Install the Graphon plugin in Claude Code, sign in, create the bucket.
- `sync-graphon.ts`: sync the registry, set the filterable metadata fields.
- Test searches with metadata filters, `read_spans`, and `answer_question` over the registry.
- Keep the friction log from the dogfood step.

Done when: 5 test questions return cited answers, and a filter such as mood and section returns the right patterns.

### Phase 3: Ask route, box and live endpoint (about 1 weekend)

- The Ask route and box with citation chips, and pattern 03.
- The live read-only endpoint, with the `viewer` key, rate limits and spend limit.
- The skill prefers the endpoint and falls back to bundled files.

Done when: the box and the endpoint both return cited answers, a call from Claude Code to the endpoint works, and the fallback works when the endpoint is blocked.

### Phase 4: plugin and helper (about 1 weekend)

- Package the plugin from Graphon's layout and test the install in Claude Code and one other tool.
- "Use this" copy button, the selection file, and the thin init command if still needed.

Done when: `claude plugin install` works, and a pattern chosen on the site is built exactly as chosen in Claude Code and in one other tool.

### Phase 5: the map and link suggestions (about 2 weekends)

- Constellation map from approved links, accessibility lens.
- Research batches for suggested links and uncharted territory, saved into the repo. A second recipe.

Done when: the map shows at least 8 patterns with edges, 3 suggested links were reviewed by the owner, and 3 gaps are listed with sources.

### Phase 6: later

Clip timestamps on seen-in-the-wild, `llms.txt`, and an extension or overlay only if the helper is used.

## How to test the skill

Give Claude Code the same landing page prompt twice, once with the skill and once without, and compare the pages side by side. If they look alike, rewrite the selection notes before adding more patterns. Save both outputs with screenshots. They are also material for the owner's portfolio write-up.

## Verify before relying on it

- [ ] Does the skill make Claude Code pick fitting patterns? (the with-and-without test)
- [ ] Can a plugin published from our repo install the same way Graphon's does, in Claude Code and one other tool? Where must the manifests sit?
- [ ] Do the skill and AGENTS.md reliably make different tools read the selection file before building?
- [ ] Can a local helper receive a selection from a website safely, or is copy and paste the only reliable path?
- [ ] Can an MCP endpoint be hosted on Vercel with rate limits, and do AI tools connect to it with `npx add-mcp <url>`?
- [ ] Do metadata filters in `search_objects` work on our pattern fields, and how long does indexing take?
- [ ] Do code files and screen recordings ingest, and are video moments returned with timestamps?
- [ ] Is there any way to read connections between files as data? The public tool list shows none. Ask Graphon.
- [ ] Do Research-suggested links add anything beyond the links written by hand?
- [ ] What are the rate limits, latency per Answer call, and pricing past the free tier? Research is premium. What does it cost?
- [ ] Does the repo already have a markdown or docs setup to reuse for `/docs`?
- [ ] Do "Copy for LLM" and `llms.txt` get used by AI tools in practice?
- [ ] Can the public library be shared through a curated dataset, so that users could query it directly with their own Graphon login?

If Graphon cannot do something, report it and use the authored links or the bundled files. Do not silently work around it.

## Risks and fallbacks

| Risk | Fallback |
| --- | --- |
| The AI ignores the skill and builds its usual page | Required brief step and final checklist; test with and without the skill |
| Pages still look basic even with good interactions | Add type, spacing, color and copy rules to the skill, not only interaction patterns |
| The skill goes stale as patterns are added | Sync the bucket on every release, and release the bundle in batches |
| Patterns clash with a product's existing design system | Style through CSS variables, and have the skill read the project's tokens before it applies anything |
| Each AI tool reads AGENTS.md or skills differently | Test in at least two tools; ship what works and list the supported tools |
| A website cannot write files into a project | Copy button first; the helper runs only on the person's machine and never edits source files |
| Authored links go stale as patterns change | Build check that fails on a broken link or a pattern with no concept links |
| Graphon's suggested links add little | Authored links already drive the map, so drop suggestions and lose nothing |
| Graphon is slow, down, or the user is not signed in | The skill falls back to its bundled files; the site shows cached answers |
| Answers or endpoint calls cost too much | Cache, rate limit, a daily spend limit, and run Research only as owner batches |
| The public endpoint gets abused | Read-only `viewer` key, per-IP limits, a character cap, and a kill switch |
| A bad or wrong citation goes live | Owner checks every generated line before publishing. Drafts and the gap list are suggestions, not final copy |
| Copying other sites | Link and describe; only show footage and code the owner made |
| Library too small for the map to matter | Hold the map launch until 8 patterns exist; ship the skill and Ask first |

## Do not

- Do not put the Graphon key, or any secret, in client code or in the repo. Never give the site or endpoint a key above the `viewer` role.
- Do not let the helper edit source files, or listen on anything but localhost.
- Do not edit, redeploy or delete the current live site (v1), or point the main domain at v2, without the owner's go-ahead.
- Do not publish to npm or a plugin marketplace, change the repo's visibility, or rename anything outside the repo without the owner's go-ahead.
- Do not delete Graphon buckets or objects unless the owner asks.
- Do not add patterns without a use-when, avoid-when, links and an accessibility section.
- Do not claim support for an AI tool you have not tested.
