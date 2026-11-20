---
title: Native dialog
summary: The <dialog> element with showModal() gives you a real modal: top layer, inert background, Esc to close.
---

# Native dialog

`<dialog>` is the browser's own dialog element. Opened with `showModal()`, it sits in the top layer above everything, draws a `::backdrop`, and makes the rest of the page inert: it cannot be clicked, focused or read by a screen reader until the dialog closes.

That replaces most hand-written focus-trap code. Esc fires a `cancel` event, so the app can decide whether to close. The browser still lets Tab reach its own toolbar. [[focus-trap-modal]] wraps Tab inside the dialog instead, so focus cycles through its controls; Esc is always the way out, so it is never a keyboard trap.

Used by: [[focus-trap-modal]], [[command-palette]]. See [[focus-management]] for where focus goes in and out.
