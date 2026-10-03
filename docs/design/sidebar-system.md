# Sidebar and Aside System

## Core principle

**A sidebar is a semantic role, not a fixed visual component.**

Supplemental information can appear in many forms depending on content, viewport, and interaction state.

The content author should express *what the aside means*. The renderer decides *how it is presented*.

## Semantic aside kinds

### Table of contents

Purpose:
- show chapter structure;
- support fast navigation;
- indicate current section.

Typical desktop presentation:
- sticky leading rail.

Mobile:
- disclosure, sheet, or compact chapter menu.

### Prerequisites

Purpose:
- show knowledge expected before the current concept;
- provide direct navigation to missing concepts.

Desktop:
- compact rail list near the chapter opening.

Mobile:
- inline list below the summary or inside a readiness disclosure.

### Definition / glossary

Purpose:
- explain a term without interrupting the main argument.

Desktop:
- margin note or contextual rail item.

Mobile:
- inline disclosure near first use.

### Context / history

Purpose:
- add historical background, related work, biography, or optional context.

Desktop:
- margin note.

Mobile:
- inline aside.

This is closest to the optional asides in Crafting Interpreters.

### Formula / derivation

Purpose:
- expose intermediate mathematical steps or notation.

Desktop:
- side derivation when short;
- expandable rail panel when longer.

Mobile:
- inline expandable derivation.

If the derivation is required to understand the next paragraph, it belongs in the main text instead.

### Source / reference

Purpose:
- cite a paper, documentation page, benchmark, or primary source.

Desktop:
- compact margin reference.

Mobile:
- inline citation or reference list.

### Tip / implementation note

Purpose:
- record a useful but nonessential implementation detail.

Desktop:
- margin note or small inline note.

Mobile:
- inline note.

### Warning / correctness constraint

Purpose:
- prevent a likely conceptual or implementation error.

Because it may be essential, it should normally be inline in the main reading flow rather than placed only in a sidebar.

### Interactive controls / state

Purpose:
- control or inspect an interactive lab.

Desktop:
- sticky inspector adjacent to the lab.

Mobile:
- controls above/below the visualization, or a deliberate sheet.

### Checkpoint / readiness

Purpose:
- let the learner verify understanding before continuing.

Desktop:
- end-of-section inline block or optional rail prompt.

Mobile:
- inline.

## Presentation primitives

The web runtime may render semantic asides as:

- `margin-note`;
- `rail-list`;
- `rail-panel`;
- `inline-aside`;
- `disclosure`;
- `popover`;
- `sticky-inspector`;
- `breakout-companion`.

These are presentation strategies, not content types.

Do not name content contracts after one viewport-specific presentation.

## Essential-information rule

Information required to understand the canonical lesson must not exist only in a sidebar.

A reader who consumes the main document in source order must still be able to understand the concept.

Sidebars may:

- reduce interruption;
- provide optional depth;
- improve navigation;
- expose related material;
- support interaction.

They may not carry hidden prerequisites for comprehension.

## Density rule

One rail region may contain multiple semantic items, but do not stack every available metadata type at once.

Prefer progressive disclosure:

1. show the highest-priority contextual item;
2. make secondary items easy to reveal;
3. avoid turning the rail into a second article.

## Scrolling behavior

Sticky rails should:

- remain aligned with the relevant chapter or lab;
- stop at their semantic section boundary when possible;
- never cover the footer or navigation;
- avoid independent scroll regions unless an interactive inspector genuinely needs one.

## Visual treatment

By default, asides use:

- whitespace;
- alignment;
- typography;
- a subtle separator.

A rounded card is not the default.

Use a container only when the content needs a bounded interactive region or clearly separate state.
