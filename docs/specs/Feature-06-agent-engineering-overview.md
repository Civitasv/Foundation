# Feature-06 — Agent Engineering Overview

## Purpose

Readers need a narrative index that connects individual concepts to a complete Agent engineering task. The chapter catalog remains the homepage; a visible overview entry supplies context before or between detailed chapters.

## Content contract

- Canonical bilingual prose and metadata live in `content/concepts/agent-engineering/`.
- The overview is an `awareness` concept in the `systems` domain, initially `ai-draft` with no prerequisites.
- Editorial links explain relationships; they do not create prerequisite edges merely to impose a reading order.
- A code-fixing task connects goal, model, tools, runtime, state, and feedback.
- The mathematical path connects vectors, matrices, dot products, probability, and Softmax to self-attention.
- Context, memory, retrieval, recovery, permissions, evaluation, and observability are situated in the system even before their detailed chapters exist.
- Every existing detailed chapter is linked in each locale. Missing chapters have no fabricated routes. Current outlines are identified honestly.
- The overview contains no standalone exercises and uses the existing continuous chapter layout.

## Navigation and acceptance

- Homepage opening includes a localized overview link; desktop navigation includes Overview and Chapters.
- All concept pages link to the overview in their own locale, including on mobile.
- The overview retains generated TOC and language switching, and closes with a link to the chapter catalog rather than an invented previous/next relationship.
- Both overview routes export statically; chapter links and TOC anchors resolve.
- Existing graph semantics remain unchanged and `pnpm check` passes.
