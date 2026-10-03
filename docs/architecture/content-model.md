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

## concept.json

Important fields:

- `id` — stable kebab-case identity.
- `title` — localized display name.
- `summary` — localized one-sentence reason to care.
- `domain` — major curriculum area.
- `depth` — expected mastery level.
- `status` — authoring maturity.
- `prerequisites` — canonical incoming dependency edges.
- `interaction` — intended interactive teaching surface.
- `tags` — discovery vocabulary.

Do not store `unlocks`. It is derived by reversing prerequisite edges.

## Graph rules

1. IDs are globally unique.
2. Every prerequisite must exist.
3. A concept cannot depend on itself.
4. The prerequisite graph must be acyclic.
5. Both Chinese and English metadata must exist.
6. Both lesson files must exist.
7. UI ordering is derived, not encoded as a second source of truth.

These rules are enforced by `pnpm content:validate`.
