# Feature-00 — AI-native Foundation bootstrap

## Problem

Foundation needs a repository structure that can grow from a few concepts into a large interactive curriculum without turning navigation, content, and UI code into competing sources of truth.

The repository must also be legible to coding agents so changes can be resumed and validated without depending on hidden conversation context.

## Outcome

Establish:

- a pnpm monorepo;
- a Next.js web surface;
- a framework-independent knowledge package;
- machine-readable concept metadata and schema;
- an acyclic prerequisite graph validator;
- seed concepts;
- an interactive graph projection;
- AI collaboration and code-map documents;
- GitHub issue/PR templates;
- GitHub Actions validation.

## Invariants

1. Concept metadata is independent of the UI.
2. Prerequisites are the canonical graph edges.
3. Broken references and cycles fail CI.
4. Agent instructions describe durable contracts, not model-specific prompting.
5. CI output is completion evidence.

## Acceptance criteria

- `pnpm content:validate` validates the seed graph.
- knowledge graph unit tests pass.
- TypeScript typechecks.
- lint passes.
- the web app builds.
- the home page derives its concept list from repository content metadata.
