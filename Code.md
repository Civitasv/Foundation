# Foundation Code Map

| Area | Contract | Implementation |
| --- | --- | --- |
| Product vision | README / roadmap | `README.md`, `docs/roadmap.md` |
| Repository collaboration | Agent contract | `AGENTS.md` |
| System architecture | Architecture | `docs/architecture/` |
| Reading/design system | Design contracts | `docs/design/` |
| Concept-page implementation contract | Feature-05 | `docs/specs/Feature-05-concept-reading-architecture.md` |
| Content architecture | Content model | `docs/architecture/content-model.md` |
| Concept schema | JSON Schema | `content/schema/concept.schema.json` |
| Concept source | Content contract | `content/concepts/*` |
| Graph semantics | Knowledge architecture | `packages/knowledge/` |
| Web projection | UI architecture | `apps/web/` |
| Reading presentation | Future M1 boundary | `apps/web/components/reading/` |
| Content integrity | Validation | `scripts/validate-content.mjs` |
| Concept scaffolding | Authoring helper | `scripts/new-concept.mjs` |
| CI evidence | Completion gate | `.github/workflows/ci.yml` |
| Pages deployment | Static deployment | `.github/workflows/pages.yml` |
| Feature contracts | Specs | `docs/specs/` |

## Dependency direction

```text
content/concepts
      |
      v
@foundation/knowledge
      |
      +-------------------+
      |                   |
      v                   v
reading projection    explore projection
      |                   |
      +---------+---------+
                |
                v
             apps/web
```

The content graph must never depend on the UI.

## Design direction

```text
Reading structure   Crafting Interpreters
Visual language     Apple design principles
Product layer       Foundation knowledge graph + interactive labs
```

Do not use "Apple-like" as permission to redesign content structure.

## Change routing

- New concept: content schema -> bilingual concept metadata -> MDX -> content validation.
- Concept-page structure: design docs -> Feature-05 -> reading components -> static route.
- New graph behavior: knowledge package -> tests -> web projection if needed.
- New sidebar behavior: semantic aside contract -> responsive renderer; do not add viewport-specific meaning to content.
- New interactive lab: spec -> lab component -> concept interaction metadata -> tests.
- New AI feature: architecture/spec first; keep provider-specific code behind an adapter boundary.
