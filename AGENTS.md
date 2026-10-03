# Foundation Agent Collaboration Contract

## Purpose

Foundation is an interactive, prerequisite-aware knowledge system for learning agent engineering from first principles. It is a content graph first and a website second.

The product is Chinese-first. English is a first-class secondary language.

## Start here

For any non-trivial change:

1. Read `Code.md`.
2. Read the relevant architecture document.
3. For content or UI work, read `docs/design/README.md` and the relevant design documents.
4. Read the relevant spec in `docs/specs/`.
5. Inspect the affected source, content, and tests.
6. Make the smallest coherent change that preserves the contracts below.

## Durable source of truth

- Chinese concept prose lives at `content/concepts/<id>/index.mdx`.
- English concept prose lives at `content/concepts/<id>/index.en.mdx`.
- Concept graph metadata lives at `content/concepts/<id>/concept.json`.
- `prerequisites` is the canonical edge direction. Do not persist duplicate `unlocks` edges; derive them.
- `content/schema/concept.schema.json` defines the public content shape.
- Product/architecture/design contracts live in `docs/`; implementation details live in code.

Chat history, issue discussion, generated summaries, and UI state are context, not durable truth.

## Architectural rules

1. Content must remain independent of the web framework.
2. `@foundation/knowledge` owns graph semantics and validation.
3. `apps/web` projects the knowledge model into UI; it must not become the canonical curriculum database.
4. A concept dependency graph must remain acyclic.
5. Interactive components may enrich a concept but must not be required to understand its core metadata.
6. Derived views such as unlocks, learning order, readiness, progress, and previous/next are computed from canonical graph/curriculum data.
7. Do not introduce an AI provider dependency into the knowledge model. Future AI features belong behind explicit adapters.
8. Prefer typed boundaries and deterministic validation over prompt-only conventions.
9. Chinese is the primary locale; English must preserve conceptual parity.

## Reading and design rules

1. Concept-page **structure** follows `docs/design/reading-architecture.md`: long-form technical chapters, not dashboard cards.
2. Visual treatment follows `docs/design/visual-system.md`: hierarchy, alignment, whitespace, restrained color, progressive disclosure.
3. Crafting Interpreters is a structural reference; Apple is a visual/interaction reference. Do not clone either source.
4. Sidebar/aside content is semantic. Do not encode a permanent right-sidebar assumption into content.
5. Essential knowledge must remain understandable in canonical document order without sidebars.
6. On mobile, supplemental rails must linearize near their semantic anchors.
7. Do not add cards, pills, shadows, gradients, blur, or accent colors without a concrete information or interaction reason.
8. Interactive labs may break out wider than prose; ordinary paragraphs may not.
9. Motion must communicate state, causality, or continuity and must support reduced motion.
10. User-facing pages must not expose internal implementation names such as component class names.

## Learning and authoring policy

Concept maturity follows `seed → ai-draft → learning → author-rewrite → review → complete`.

1. AI-generated lesson prose may be created and improved up to `ai-draft`.
2. Do not infer that the author has learned a concept. Only the author may move it to `learning`.
3. Do not promote AI-written prose to `author-rewrite`. That state requires the author to rewrite the canonical Chinese chapter in their own words.
4. During `review`, act primarily as a factual, mathematical, code, logic, and editorial reviewer. Preserve the author's explanatory voice.
5. `complete` requires a reviewed author-written Chinese chapter, validated math/code where applicable, interaction aligned to the final explanation, adequate references, English synchronized from the final Chinese meaning, and green CI.
6. Engineering completion of a page or interactive lab does not by itself make the concept content `complete`.

See `docs/content/authoring-lifecycle.md`.

## Pull request completion policy

Unless the user explicitly asks to hold a pull request open, automatically squash-merge when all of the following are true:

1. all required CI checks have completed successfully;
2. the PR is mergeable and not a draft;
3. there are no blocking reviews or unresolved blocking review threads;
4. the requested scope and applicable acceptance criteria are complete.

Do not wait for a second approval message after these conditions are satisfied.

If any condition is not satisfied, keep the PR open and fix or report the blocker. Never merge based on an assumed or pending CI result.

## Completion checklist

Run:

```bash
pnpm check
```

Never claim Green for a command that was not executed successfully. If validation cannot run, mark it pending.

Use Conventional Commit messages.

After each completed change, run the required validation, commit the task's changes, and push to the remote without waiting for another confirmation. Preserve unrelated pre-existing changes outside the commit. If validation or pushing is blocked, report the blocker accurately.
