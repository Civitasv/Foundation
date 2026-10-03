# Architecture Overview

Foundation separates durable knowledge from its presentations.

```text
             content/concepts
                   |
                   v
          concept metadata + MDX
                   |
                   v
        @foundation/knowledge
       /         |           \
validation   graph rules    ordering
       \         |           /
                   v
                apps/web
        Learn / Explore / Build
                   |
                   v
            static export
                   |
                   v
             GitHub Pages
```

## Why this boundary exists

A linear website navigation is only one view of the curriculum. Foundation eventually needs guided paths, free graph exploration, progress-aware recommendations, interactive labs, search, and possible AI tutoring. None of those should redefine the underlying knowledge relationships.

The content graph therefore exists independently of React or Next.js.

## Runtime boundaries

### Content

Human-readable lessons plus machine-readable metadata.

### Knowledge

Deterministic graph semantics. This layer validates IDs, prerequisites, cycles, ordering, and future readiness/progress rules.

### Web

The first product surface. It can render any projection of the graph but does not own the graph.

The current hosting contract is a Next.js static export. Repository-backed content is compiled at build time and the generated `apps/web/out` artifact is deployed to GitHub Pages.

### Future adapters

AI tutors, search indexes, export tools, or alternate front ends should consume the same knowledge boundary rather than scraping UI code.

If a future capability genuinely requires request-time server execution, change the deployment contract explicitly instead of quietly introducing server-only behavior into the web layer.

## Non-goals for M0

- authentication;
- cloud persistence;
- LLM provider integration;
- a full MDX component runtime;
- personalized progress;
- hundreds of concepts.

M0 optimizes for a clean boundary that can grow safely.
