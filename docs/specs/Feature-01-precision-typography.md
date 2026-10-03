# Feature-01 — Precision typography and reading rhythm

## Reference

The reading experience takes inspiration from the discipline of Crafting Interpreters:

- narrow long-form measure;
- strong distinction between prose and UI typography;
- restrained heading scale;
- deliberate vertical rhythm;
- generous chapter-title spacing;
- secondary information placed outside the main prose flow.

This is a reference for information design, not a visual clone.

## Problem

M0 proves the knowledge graph but the visual language still reads like a product dashboard. Foundation is primarily a learning and reading surface. Long-form material needs a calmer, more precise typographic system before the concept runtime grows.

## Outcome

Establish a reading-first visual foundation that:

- uses a book-like serif role for long-form text and headings;
- keeps controls, labels, navigation, metadata, and graph UI in a neutral sans role;
- constrains prose to a readable measure;
- defines a reusable three-column reading shell for future concept pages;
- makes spacing follow a small explicit scale;
- keeps the graph explorer visually dense without contaminating prose layout.

## Typography contract

### Reading text

- target measure: 38–42rem;
- desktop body: 18px / 30px;
- mobile body: 17px / 28px;
- paragraph rhythm: one full text line between paragraphs.

### Display

- one large chapter/display tier;
- one section tier;
- one subsection tier;
- no arbitrary one-off font sizes.

### UI

- sans-serif;
- small metadata labels may use uppercase and tracking;
- UI copy must not use the prose serif simply for decoration.

## Layout contract

```text
wide viewport
┌──────────┬────────────────────────┬──────────┐
│ context  │       reading          │  notes   │
│  rail    │       measure          │  rail    │
└──────────┴────────────────────────┴──────────┘
```

The main reading column remains stable even when wide space is available.

Graph/exploration surfaces may intentionally break out to the wider application measure.

## Acceptance criteria

- home page demonstrates the reading typography and spacing system;
- graph explorer remains usable and visually distinct;
- responsive behavior preserves readable line length;
- no external font asset is required;
- `pnpm check` passes.
