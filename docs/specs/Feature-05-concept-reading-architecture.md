# Feature-05 — Concept Reading Architecture

## Problem

Foundation has a knowledge graph and homepage, but the long-form concept runtime does not yet have a durable structural or visual contract.

Without one, each concept page risks becoming a custom layout, and "Apple design" risks being interpreted as surface styling instead of disciplined hierarchy.

## Direction

```text
Structure / reading flow  -> Crafting Interpreters
Visual / interaction      -> Apple design principles
Foundation capabilities   -> bilingual knowledge graph + interactive labs
```

## Outcome

M1 concept pages must implement a reusable chapter runtime with:

- bilingual static routes;
- stable reading measure;
- chapter opening;
- generated section TOC;
- semantic asides;
- responsive rail/inline presentation;
- code, equation, figure, challenge, and design-note blocks;
- breakout interactive labs;
- prerequisite navigation;
- previous/next navigation;
- reference section;
- static export compatibility.

## Invariants

1. Concept pages are continuous technical chapters, not card dashboards.
2. Canonical prose remains understandable without sidebars.
3. Sidebar semantics are independent of viewport presentation.
4. The prose measure remains stable on wide screens.
5. Wide labs may break out without widening ordinary body text.
6. Relationships such as prerequisites and previous/next are derived from the knowledge layer.
7. Chinese is primary; English has conceptual parity.
8. Apple-inspired styling means hierarchy, whitespace, alignment, restraint, and progressive disclosure — not decorative imitation.
9. Static export to GitHub Pages remains supported.

## M1 component boundaries

Suggested presentation layer:

```text
apps/web/components/reading/
  ChapterShell
  ChapterHeader
  ReadingColumn
  TableOfContents
  AsideRenderer
  Equation
  Figure
  CodeStep
  InteractiveBreakout
  Challenge
  DesignNote
  ReferenceList
  PrevNext
```

Names may change during implementation, but the semantic boundaries should remain.

## Responsive requirements

### Large

- prose centered in a stable reading column;
- optional TOC rail;
- optional contextual aside rail;
- labs may break out.

### Medium

- preserve prose width;
- reduce to one rail;
- other supplemental content becomes disclosure or inline.

### Mobile

- one canonical reading stream;
- TOC becomes disclosure/sheet;
- asides return near their anchor;
- lab controls remain usable without hover or precise pointer input.

## Acceptance criteria

The first real concept page, preferably `vector`, must demonstrate:

- Chinese-first chapter rendering;
- English switching;
- generated headings/anchors;
- at least three different aside semantics rendered adaptively;
- one equation or formal definition;
- one precise code/pseudocode block;
- one interactive-lab placeholder or real visualizer;
- challenge and references;
- prerequisite and previous/next navigation;
- mobile linearization;
- `pnpm check`;
- successful GitHub Pages static export.
