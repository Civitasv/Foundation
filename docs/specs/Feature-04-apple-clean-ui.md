# Feature-04 — Remove visual noise

## Intent

Foundation should feel quiet, precise, and content-first.

The previous iteration used Apple-like colors and system typography but still contained too many visible design devices: boxed branding, mono eyebrows, numbered section labels, button surfaces, statistics, nested cards, pills, shadows, and technical implementation labels.

This feature removes those devices rather than restyling them.

## Principles

1. Content outranks branding.
2. Typography, alignment, and whitespace carry hierarchy.
3. Blue is reserved for navigation and actionable relationships.
4. A container exists only when it clarifies grouping.
5. No shadow unless elevation has semantic meaning.
6. No technical implementation detail in learner-facing UI.
7. Progressive disclosure beats showing every piece of metadata at once.

## Homepage

The homepage contains only:

- a quiet navigation bar;
- the chapter catalog (章节 / Chapters) as the main content, with its title and supporting paragraph;
- a quiet footer with the Foundation name only.

No hero, learning-philosophy section, learning-mode section, numbered section label, stat strip, boxed logo, or filled CTA is required.

## Knowledge map

Use a navigation-detail pattern:

```text
Concept groups       Detail
-------------       ---------
基础                  向量
  向量        >        summary
  矩阵        >        requires
  点积        >        next
                      interaction
```

Concepts are rows, not cards. Detail is separated by a single rule rather than a floating inspector card.

The map uses a white canvas, a shared alignment grid, and responsive system typography. Hairline separators distinguish rows; a pale blue selection and a leading rule identify the current concept. Press feedback is immediate, keyboard focus is visible, and reduced-motion preferences disable transitions. On narrow screens, detail follows the selected row so readers can reach it without crossing the whole list. Identifying titles wrap in full, empty catalogs explain their state, and catalogs larger than 40 items paginate without redefining graph relationships.

Navigation remains available on mobile. Hover styles require a fine pointer with hover capability; taps provide immediate feedback. Safe-area insets and viewport metadata protect navigation and content while preserving zoom and document scrolling. Labs keep native sliders and allow page scrolling outside enlarged drag handles. See [interaction audit](../design/interaction-audit.md) for pressure fixtures, motion decisions, verification, and real-device limitations.

## Acceptance criteria

- no gradients;
- no decorative shadows;
- no nested card surfaces in the knowledge map;
- no developer component names shown to learners;
- primary actions use text links rather than filled buttons;
- visual hierarchy remains clear without numbered labels or stats;
- bilingual behavior remains unchanged;
- static export and GitHub Pages remain compatible;
- `pnpm check` passes.
