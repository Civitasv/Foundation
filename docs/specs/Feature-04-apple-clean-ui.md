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
- one hero headline, one supporting paragraph, and text links;
- a concise explanation of the learning philosophy;
- three learning modes;
- the knowledge map.

No hero eyebrow, numbered section label, stat strip, boxed logo, or filled CTA is required.

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
