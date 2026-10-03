# Foundation Agent Collaboration Contract

## Purpose

Foundation is an interactive, prerequisite-aware knowledge system for learning agent engineering from first principles. It is a content graph first and a website second.

## Start here

For any non-trivial change:

1. Read `Code.md`.
2. Read the relevant architecture document.
3. Read the relevant spec in `docs/specs/`.
4. Inspect the affected source, content, and tests.
5. Make the smallest coherent change that preserves the contracts below.

## Durable source of truth

- Concept prose lives at `content/concepts/<id>/index.mdx`.
- Concept graph metadata lives at `content/concepts/<id>/concept.json`.
- `prerequisites` is the canonical edge direction. Do not persist duplicate `unlocks` edges; derive them.
- `content/schema/concept.schema.json` defines the public content shape.
- Product/architecture contracts live in `docs/`; implementation details live in code.

Chat history, issue discussion, generated summaries, and UI state are context, not durable truth.

## Architectural rules

1. Content must remain independent of the web framework.
2. `@foundation/knowledge` owns graph semantics and validation.
3. `apps/web` projects the knowledge model into UI; it must not become the canonical curriculum database.
4. A concept dependency graph must remain acyclic.
5. Interactive components may enrich a concept but must not be required to understand its core metadata.
6. Derived views such as unlocks, learning order, readiness, and progress are computed from canonical metadata.
7. Do not introduce an AI provider dependency into the knowledge model. Future AI features belong behind explicit adapters.
8. Prefer typed boundaries and deterministic validation over prompt-only conventions.

## AI-native change workflow

For meaningful product changes use:

```text
Intent
  -> Spec / contract
  -> Implementation
  -> Tests / content validation
  -> Build evidence
  -> PR
```

Agents should leave artifacts that another agent can resume from without reconstructing hidden reasoning.

## Content change checklist

- Concept ID is stable, lowercase kebab-case.
- Prerequisites exist.
- No dependency cycle is introduced.
- Summary explains why the concept matters.
- Depth reflects the expected mastery level.
- Interaction metadata describes the intended learning interaction.
- Prose connects the concept back to agent engineering where applicable.

Run:

```bash
pnpm content:validate
```

## Completion checklist

Run all applicable checks:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Or run:

```bash
pnpm check
```

Never claim Green for a command that was not executed successfully. If validation cannot run, mark it pending.

Use Conventional Commit messages. For completed PRs, prefer squash merge once required checks are Green and there are no blocking review threads.
