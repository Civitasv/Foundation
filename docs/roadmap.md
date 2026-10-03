# Roadmap

## M0 — Foundation

Repository contracts, content schema, graph validation, bilingual seed concepts, CI/Pages deployment, and a first Explore projection.

## M1 — Concept reading runtime

Implement Feature-05 and the design contracts in `docs/design/`:

- static `/concepts/[id]/` routes;
- bilingual MDX rendering;
- chapter shell and stable prose measure;
- generated heading TOC;
- semantic aside system with responsive rail/inline presentation;
- equation, figure, code-step, design-note, and reference blocks;
- typed interactive component registry;
- breakout interactive labs;
- prerequisite navigation;
- previous/next navigation;
- static generation compatible with GitHub Pages.

The first acceptance concept should be `vector`.

## M2 — Learn / Explore

- full knowledge graph view;
- prerequisite-aware learning paths;
- search;
- curriculum progress model;
- concept completion semantics;
- transition between Learn / Read / Explore without duplicating knowledge state.

## M3 — Interactive foundations

Initial first-principles visualizers:

- vector and matrix transformations;
- dot product;
- probability distributions;
- softmax and temperature;
- attention/QKV.

## M4 — Agent labs

Interactive simulations:

- autoregressive generation;
- tool calling;
- ReAct / agent loop;
- context compilation;
- memory and retrieval;
- graph execution.

## M5 — Production agent engineering

Labs and content for runtime state, sandboxing, concurrency, distributed-systems failure modes, security, observability, and evaluation.

## M6 — Optional AI layer

Only after the deterministic learning system is strong:

- concept-aware tutor;
- Socratic checks;
- explanation adaptation;
- prerequisite diagnosis.

AI features must consume the canonical content/knowledge layer rather than becoming a second knowledge source.
