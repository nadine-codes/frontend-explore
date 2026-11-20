# Recipe: landing page

A plan for a single landing page. Uses only patterns in this library.

## Shape

1. **Hero.** Headline, one line of support, one primary button. This is where the signature interaction lives.
2. **Proof.** What it does, shown, not listed: a screenshot, a short demo, or two or three concrete facts. Avoid three identical feature cards.
3. **Detail.** One section that goes deeper on the main idea, with a real layout idea (a split, an offset image, a numbered sequence).
4. **Call to action.** Repeat the primary button with a sentence that answers "why now".
5. **Footer.** Small and quiet.

## Pick the signature (one only)

- The product is a thing people hold or own (a card, a ticket, a device): `3d-tilt-hover` on the hero object.
- The product connects many things (integrations, a stack, a network): `orbit-animation` as the hero visual, slow, with `pauseOnHover`.
- Neither fits: no motion signature. Put the craft into type and layout instead (see `rules/type.md`).

Never use both on one page. They pair as hero and supporting piece only if the second is small and still.

## Supporting patterns (quiet)

- A signup form with a long list (country, role, timezone): `combobox` for that field.
- A short task that must not lose the page (book a demo with two fields, confirm an unsubscribe): `focus-trap-modal`.
- Skip `command-palette` on a landing page. It belongs in apps and docs.

## Before you call it done

- Run the checklist in `SKILL.md`.
- With reduced motion on, the hero still reads well standing still.
- On a 390px phone, the hero headline fits in three lines or fewer and the button is visible without scrolling.
