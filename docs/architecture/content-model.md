# Content Model

Each concept is a directory:

```text
content/concepts/<concept-id>/
  concept.json
  index.mdx
```

## concept.json

This file is the canonical machine-readable node in the learning graph.

Important fields:

- `id` — stable kebab-case identity.
- `title` — display name.
- `summary` — one-sentence reason to care.
- `domain` — major curriculum area.
- `depth` — expected mastery level.
- `status` — authoring maturity.
- `prerequisites` — canonical incoming dependency edges.
- `interaction` — intended interactive teaching surface.
- `tags` — discovery vocabulary.

Do not store `unlocks`. It is derived by reversing prerequisite edges.

## index.mdx

The lesson body. M0 stores MDX without yet making it the runtime renderer.

A mature concept should converge on:

```text
Why it exists
Intuition
Interactive model
Mathematics
Derivation
Minimal implementation
Experiment
Misconceptions
Connection to LLMs
Connection to agents
References
```

Not every concept needs every section.

## Graph rules

1. IDs are globally unique.
2. Every prerequisite must exist.
3. A concept cannot depend on itself.
4. The prerequisite graph must be acyclic.
5. UI ordering is derived, not encoded as a second source of truth.

These rules are enforced by `pnpm content:validate`.
