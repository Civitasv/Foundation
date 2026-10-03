# Architecture Overview

Foundation separates durable knowledge from its presentations.

```text
                    content/concepts
                          |
                          v
                 bilingual metadata + MDX
                          |
                          v
               @foundation/knowledge
              /          |            \
      validation      graph rules     ordering
              \          |            /
                          v
                   presentation layer
              /           |             \
             v            v              v
          Learn          Read          Explore
        pathways       chapters         graph
                          |
                     interactive
                        blocks
                          |
                          v
                       apps/web
                          |
                     static export
                          |
                          v
                    GitHub Pages
```

## Why this boundary exists

A linear chapter, a guided curriculum, and a free knowledge graph are different projections of the same underlying knowledge system.

None of them should redefine concept identity or dependency relationships.

## Runtime boundaries

### Content

Human-readable bilingual lessons plus machine-readable metadata.

Content owns meaning, not viewport presentation.

A lesson may express semantic blocks such as an aside, challenge, equation, code step, or interactive lab. It must not encode assumptions like "show this in the permanent right sidebar".

### Knowledge

Deterministic graph semantics.

This layer validates IDs, prerequisites, cycles, ordering, and future readiness/progress rules.

Relationships such as prerequisites, unlocks, and guided previous/next navigation are derived here or in a curriculum projection built on top of it.

### Presentation

Foundation has multiple presentation modes.

#### Read

Long-form concept chapters.

Structure follows the Foundation reading architecture:
- stable prose measure;
- headings and generated TOC;
- adaptive semantic asides;
- code, formula, diagrams, challenges, and labs;
- sequential navigation.

#### Explore

Knowledge graph or list/detail views for nonlinear discovery.

#### Learn

Prerequisite-aware guided paths.

### Web

The first product surface.

The web layer renders the projections above but does not own curriculum truth.

Current hosting is a Next.js static export deployed to GitHub Pages.

### Future adapters

AI tutors, search indexes, exports, or alternate clients should consume the same content/knowledge boundaries.

If a future capability genuinely requires request-time server execution, change the deployment contract explicitly instead of quietly introducing server-only behavior into the web layer.

## Design architecture

Design contracts live in `docs/design/`.

The key distinction is:

```text
structure      Crafting Interpreters-inspired technical reading
appearance     Apple-inspired visual hierarchy and restraint
capabilities   Foundation-specific graph and interaction system
```

These layers should stay conceptually separate.
