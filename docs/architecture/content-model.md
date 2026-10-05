# Content Model

Foundation is Chinese-first and bilingual.

Each concept is a directory:

```text
content/concepts/<concept-id>/
  concept.json
  index.mdx
  index.en.mdx
```

## Language policy

- `zh-CN` is the primary product and authoring language.
- English is the secondary language and should preserve the same conceptual meaning rather than mechanically mirror sentence structure.
- `index.mdx` is the canonical Chinese lesson.
- `index.en.mdx` is the English lesson.
- Titles and summaries in `concept.json` are localized objects with both `zh-CN` and `en`.

The knowledge graph itself is language-neutral: IDs, dependency edges, tags, domains, depth, status, and interaction metadata do not change by locale.

## Authoring lifecycle

Content maturity follows:

```text
seed → ai-draft → learning → author-rewrite → review → complete
```

The lifecycle intentionally separates engineering completeness from intellectual authorship.

An AI-generated chapter, even with working code and a finished interactive lab, is at most `ai-draft` until the human author studies and rewrites the canonical Chinese lesson.

See `docs/content/authoring-lifecycle.md` for promotion rules.

## concept.json

Important fields:

- `id` — stable kebab-case identity.
- `title` — localized display name.
- `summary` — localized one-sentence reason to care.
- `domain` — major curriculum area.
- `depth` — expected mastery level.
- `status` — authoring/learning maturity, not implementation completeness.
- `prerequisites` — canonical incoming dependency edges.
- `interaction` — intended interactive teaching surface.
- `tags` — discovery vocabulary.

Do not store `unlocks`. It is derived by reversing prerequisite edges.

## Lesson structure

Concept lessons are continuous technical chapters.

The baseline authoring structure is defined in:
- `docs/design/reading-architecture.md`;
- `docs/design/content-blocks.md`;
- `docs/design/concept-page-template.md`.

A concept may include semantic blocks such as:

- equation;
- figure;
- code step;
- aside;
- interactive lab;
- design note;
- references.

Semantic meaning belongs in content. Responsive placement belongs in the renderer.

For example, content may define a `definition` aside. It must not define "right sidebar box at 280px width".

## Sidebar rule

Supplemental content can be rendered as a margin note, rail item, disclosure, popover, sticky inspector, or inline block.

The source expresses the semantic role. The reading runtime selects the presentation based on viewport and context.

Essential knowledge must remain understandable in canonical document order.

See `docs/design/sidebar-system.md`.

## Graph rules

1. IDs are globally unique.
2. Every prerequisite must exist.
3. A concept cannot depend on itself.
4. The prerequisite graph must be acyclic.
5. Both Chinese and English metadata must exist.
6. Both lesson files must exist.
7. UI ordering is derived, not encoded as a second source of truth.

These rules are enforced by `pnpm content:validate`.

## Course presentations

Course catalogs live at `content/courses/<course-id>/course.json`, separately from the concept graph. They preserve bilingual titles and descriptions. A presentation course adds a bilingual subtitle, its authoring `status`, `presentationLocale`, and a `presentationTrace` identifying its Python source and generated trace. An ordered `sections` array describes the flow of its discussion with stable IDs, bilingual titles/summaries, and source weeks. This directory does not impose a fixed chapter count or separate lesson boundaries.

The catalog is the source of truth for the section directory and presentation identity. The web directory and presentation build consume it; neither keeps a second presentation manifest. Sections belong to one continuous presentation, not separate player routes. `@foundation/knowledge` validates this presentation metadata when rendering, and its tests check the catalog against the Python source. Existing learning journals without presentations keep their current metadata shape.

AI-assisted presentations remain `ai-draft`. Generating a working player does not record learning progress, imply a video recording, or promote the maturity of any concept chapter. The machine-learning presentation is Chinese; its English course directory identifies that language explicitly.

The Python source and deterministic numerical experiments live alongside the catalog and do not depend on Next.js. The web layer presents the directory; the build generates its independent static player. See [Feature-07](../specs/Feature-07-machine-learning-edtrace.md).
