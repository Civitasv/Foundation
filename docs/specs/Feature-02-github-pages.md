# Feature-02 — GitHub Pages deployment

## Problem

Foundation is public and should have a continuously deployed website without introducing a separate hosting dependency during the early project stages.

## Outcome

Deploy the Next.js application to GitHub Pages from `master`.

Target project-site URL:

```text
https://civitasv.github.io/Foundation/
```

## Build contract

Foundation is statically exportable.

```text
pnpm check
  -> next build
  -> apps/web/out
  -> Pages artifact
  -> GitHub Pages
```

The Pages workflow runs the same content validation, typecheck, lint, tests, and production build required by normal CI before an artifact can be deployed.

## Base path

GitHub project sites are hosted below a repository path. The Pages setup action supplies the canonical base path through `PAGES_BASE_PATH`, and Next.js consumes it through `basePath`.

Local development leaves the base path unset.

## Static-hosting constraints

Until this deployment architecture is deliberately changed:

- routes must remain compatible with Next.js static export;
- dynamic routes must provide static params;
- server actions and request-time server features are not available;
- image optimization uses static-compatible unoptimized output.

These constraints are appropriate for Foundation because curriculum content is repository-backed and can be compiled at build time.

## Deployment workflow

`.github/workflows/pages.yml` runs on:

- pushes to `master`;
- manual `workflow_dispatch`.

The deploy job uses the protected `github-pages` environment and only runs after the build job succeeds.

## One-time repository setting

GitHub Pages must use **GitHub Actions** as its publishing source. Once enabled, subsequent `master` updates deploy automatically.

## Acceptance criteria

- `pnpm check` passes with static export enabled;
- Pages build uploads `apps/web/out`;
- deploy job publishes the artifact;
- the public project URL serves Foundation with working CSS and client-side interactions.
