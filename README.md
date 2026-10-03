# Foundation

**Foundation** is an open-source, interactive map of the knowledge required to understand and build AI agents from first principles.

It is not a framework tutorial and not a linear book. The project treats agent engineering as a connected system of ideas spanning mathematics, neural networks, Transformers, LLM inference, agent architecture, systems engineering, security, and evaluation.

## Product idea

Foundation has three complementary learning modes:

- **Learn** — guided prerequisite-aware paths.
- **Explore** — a knowledge graph for moving between concepts freely.
- **Build** — interactive visualizers, simulators, and labs that turn abstractions into things you can manipulate.

Every concept is intended to answer four questions:

1. Why does this exist?
2. What is the intuition and mathematics behind it?
3. Can I manipulate or implement it myself?
4. How does it connect back to agent engineering?

## Architecture

```text
content/concepts/*
        |
        v
machine-readable concept metadata
        |
        v
@foundation/knowledge
  validation / graph / ordering
        |
        v
apps/web
  Learn / Explore / Build projections
```

Concept metadata is the source of truth for the learning graph. UI navigation and future curricula should be derived from it rather than maintained separately.

## AI-native repository

Foundation is designed to be developed by humans and coding agents together.

- `AGENTS.md` defines the collaboration contract.
- `Code.md` is the shortest route from intent to implementation.
- `docs/specs/` holds durable feature contracts.
- `content/schema/concept.schema.json` makes content structure machine-readable.
- `pnpm content:validate` rejects broken prerequisite graphs.
- CI is the evidence gate; an agent must not claim Green without running the applicable checks.

## Development

Requirements:

- Node.js `^22.19.0 || >=24.0.0`
- pnpm `11.7.0`

```bash
pnpm install
pnpm dev
```

Validation:

```bash
pnpm check
```

Create a concept seed:

```bash
pnpm concept:new -- vector-space "Vector Space" foundations
```

## Current status

M0 establishes the repository, knowledge model, integrity checks, CI, and a first interactive graph projection. Lesson rendering and the interactive lab registry are intentionally left for the next milestones.

See `docs/roadmap.md`.

## License

MIT.
