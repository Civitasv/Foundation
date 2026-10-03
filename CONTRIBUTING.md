# Contributing to Foundation

Foundation welcomes improvements to concepts, interactions, graph semantics, accessibility, and the learning experience.

## Before opening a PR

Read:

- `AGENTS.md`
- `Code.md`
- the relevant document under `docs/architecture/`

For a non-trivial feature, add or update a contract in `docs/specs/` before implementation.

## Local validation

```bash
pnpm install
pnpm check
```

## Adding a concept

Use the helper:

```bash
pnpm concept:new -- concept-id "Concept title" foundations
```

Then edit the generated metadata and MDX. Run `pnpm content:validate` before opening a PR.

## Pull requests

Keep PRs scoped. Explain the user-facing change, the contract it implements, and the validation evidence. If a check could not be run, mark it pending instead of assuming success.

Use Conventional Commits for commit messages.
