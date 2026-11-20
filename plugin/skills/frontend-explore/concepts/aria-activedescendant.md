---
title: aria-activedescendant
summary: Keep focus in a text field while arrow keys move through a list, and still tell screen readers which item is active.
---

# aria-activedescendant

In a combobox, focus must stay in the input so people can keep typing. But arrow keys also move through the options. `aria-activedescendant` solves this: the input points at the id of the active option, and screen readers announce that option as if it had focus.

The active option needs a visible style too, and it should not rely on color alone.

Used by: [[combobox]], [[command-palette]]. Related: [[keyboard-navigation]], [[live-region]].
