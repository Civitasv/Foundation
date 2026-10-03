# Foundation Code Map

| Area | Contract | Implementation |
| --- | --- | --- |
| Product vision | README / roadmap | `README.md`, `docs/roadmap.md` |
| Repository collaboration | Agent contract | `AGENTS.md` |
| Content architecture | Content model | `docs/architecture/content-model.md` |
| Concept schema | JSON Schema | `content/schema/concept.schema.json` |
| Concept source | Content contract | `content/concepts/*` |
| Graph semantics | Knowledge architecture | `packages/knowledge/` |
| Web projection | UI architecture | `apps/web/` |
| Content integrity | Validation | `scripts/validate-content.mjs` |
| Concept scaffolding | Authoring helper | `scripts/new-concept.mjs` |
| CI evidence | Completion gate | `.github/workflows/ci.yml` |
| Feature contracts | Specs | `docs/specs/` |

## Dependency direction

```text
content/concepts
      |
      v
@foundation/knowledge
      |
      v
   apps/web
```

The content graph must never depend on the UI.

## Change routing

- New concept: content schema -> concept metadata -> MDX -> content validation.
- New graph behavior: knowledge package -> tests -> web projection if needed.
- New interactive lab: spec -> lab component -> concept interaction metadata -> tests.
- New AI feature: architecture/spec first; keep provider-specific code behind an adapter boundary.
