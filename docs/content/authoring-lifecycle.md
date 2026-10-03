# Concept Authoring Lifecycle

Foundation is a learning project before it is a publishing project.

The Chinese chapter is expected to become the author's own explanation after real study, derivation, implementation, and reflection. AI-generated prose is scaffolding, not the final intellectual artifact.

## Lifecycle

```text
seed
  ↓
ai-draft
  ↓
learning
  ↓
author-rewrite
  ↓
review
  ↓
complete
```

### `seed`

The concept exists in the graph, but the lesson is only a placeholder or outline.

### `ai-draft`

A structurally useful first draft exists. It may include explanations, equations, code, references, and an interactive lab.

An AI assistant may create and improve this stage.

**Important:** engineering completeness does not promote a concept beyond `ai-draft`.

### `learning`

The author is actively studying the concept.

Typical work:
- read the AI draft critically;
- ask questions about unclear steps;
- derive the mathematics independently;
- run or rewrite the code;
- manipulate the interactive lab;
- explain the mechanism without relying on the draft.

This status is set by the author, not inferred automatically by an AI assistant.

### `author-rewrite`

The author has rewritten the canonical Chinese chapter in their own words after learning the concept.

The rewrite should reflect the author's real explanatory model, including the examples and interactive emphasis that actually produced understanding.

An AI assistant must not promote its own prose to this state.

### `review`

The author rewrite is being checked for:
- factual correctness;
- mathematical correctness;
- missing assumptions;
- logical jumps;
- misleading intuition;
- code correctness;
- reference quality;
- whether the interaction matches the final explanation.

The assistant is primarily a reviewer here, not the canonical author.

### `complete`

A concept is complete only when all of the following are true:

1. the author has learned and rewritten the canonical Chinese chapter;
2. the Chinese chapter has passed review;
3. mathematics and code have been validated where applicable;
4. the interaction matches the final teaching model;
5. references are adequate;
6. the English chapter has been rewritten or synchronized from the final Chinese meaning, not merely preserved from the original AI draft;
7. CI passes.

## Language order

The expected order is:

```text
AI Chinese draft
  → author learns
  → author rewrites Chinese
  → review
  → final Chinese
  → rewrite/synchronize English
  → complete
```

English conceptual parity matters, but English must not become a second canonical source that pulls the Chinese lesson away from the author's understanding.

## Interaction order

Interactive labs are provisional while a concept is `ai-draft` or `learning`.

After the author rewrite, the lab should be reviewed again:
- what produced the actual insight?
- what variable should be manipulated?
- what should the learner observe?
- what visual detail is unnecessary?

The interaction follows the final explanation. The explanation does not bend around an early demo.

## Assistant role by stage

| Stage | Primary assistant role |
| --- | --- |
| seed | researcher / curriculum planner |
| ai-draft | first-draft author / engineer |
| learning | tutor / Socratic partner |
| author-rewrite | reviewer on request; do not replace author voice |
| review | technical and editorial reviewer |
| complete | maintenance / regression reviewer |
