# Content Blocks

Foundation chapters use semantic blocks inside a continuous reading flow.

The block system is inspired by the variety in Crafting Interpreters — prose, code snippets, asides, and design notes — but adapted for Agent engineering and interactive learning.

## Prose

Canonical explanation.

Default width:
- reading column.

Use for anything required to understand the concept.

## Equation

A mathematical expression with optional notation explanation.

Modes:
- inline;
- display;
- derivation.

A long derivation may use an aside presentation, but required steps remain accessible inline.

## Figure / diagram

Use when spatial or relational structure communicates more clearly than prose.

Every figure needs:
- purpose;
- accessible description;
- caption when context is not obvious.

## Code step

Code should be precise.

When a lesson builds an implementation incrementally, a code step can carry:

- language;
- file path;
- symbol/location;
- action: add / replace / remove / inspect;
- code;
- optional surrounding context;
- explanation immediately before or after.

This follows the structural precision of Crafting Interpreters' snippets without copying their visual styling.

## Interactive lab

An interactive lab must define:

1. **learning objective** — what should become intuitive;
2. **manipulation** — what the learner can change;
3. **observable** — what changes in response;
4. **explanation** — why the change happened;
5. **reset** — return to a known state;
6. **accessible fallback** — non-pointer and reduced-motion behavior.

Width:
- breakout or full content width when the mechanism needs space.

The lab must be connected to the surrounding prose. Do not embed a playground without explaining what to inspect.

## Aside

Supplemental information with a semantic kind.

See `sidebar-system.md`.

The author specifies meaning; responsive presentation is chosen by the runtime.

## Design note

A short essay about a tradeoff where there is no single mechanically correct answer.

Examples:

- ReAct loop versus explicit planner;
- graph execution versus sequential execution;
- semantic memory versus episodic memory;
- tool autonomy versus human approval;
- richer context versus context noise.

A design note is not a callout card. It is editorial content and may use normal article width.

## Reference list

Prefer primary sources:

- original papers;
- official documentation;
- standards;
- source repositories.

References belong at the end of a concept, while individual claims may cite sources inline.

## Agent connection

Every foundational concept should answer:

> Why does this matter when building an Agent?

This can be a dedicated section or a short recurring block, but it must add a concrete systems connection rather than merely repeat the concept summary.
