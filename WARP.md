# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository overview

- Monorepo managed by pnpm (pnpm-workspace.yaml) with apps and packages.
- TypeScript throughout; root tsconfig.json references subprojects.
- CI uses Node 20 and pnpm 10; builds both apps and runs lint/tests per app matrix.

Tooling prerequisites

- Node 20+ (web enforces node 22.x via engines; CI runs Node 20).
- pnpm 10+
- Supabase CLI (for local DB and type generation) for apps/api
- Cloudflare Wrangler (for apps/router)

Install dependencies

- At repo root: pnpm install

Workspace basics

- Target a package: pnpm --filter <pkg> <script>
  - Package names:
    - @clayout/api
    - @clayout/web
    - @clayout/router
    - @clayout/interface
    - @clayout/kit

Common commands

- Build (root helpers):
  - pnpm build:api
  - pnpm build:web
  - pnpm build:interface
- Lint all (recursive): pnpm lint:all
- Test all (recursive): pnpm test:all

apps/api (NestJS + TypeORM + Supabase)

- Install (from root): pnpm install
- Dev server: pnpm --filter @clayout/api start:dev
- Build: pnpm --filter @clayout/api build
- Start prod (after build): pnpm --filter @clayout/api start:prod
- Lint: pnpm --filter @clayout/api lint
- Tests:
  - All: pnpm --filter @clayout/api test
  - Watch: pnpm --filter @clayout/api test:watch
  - Coverage: pnpm --filter @clayout/api test:cov
  - E2E: pnpm --filter @clayout/api test:e2e
  - Single test file: pnpm --filter @clayout/api test -- src/path/to/your.spec.ts
  - By test name pattern: pnpm --filter @clayout/api test -- -t "pattern"
- Supabase local workflow (from apps/api/README.md):
  - Start local stack: supabase start
  - Generate TS types from schema: pnpm --filter @clayout/api supabase:gentypes
  - Create a new migration: supabase migration new <name>
  - Reset and apply all migrations locally: supabase db reset
  - Push migrations to remote: supabase db push
  - Diff current schema: supabase db diff --schema public
- Sentry sourcemaps (used in build:prod): pnpm --filter @clayout/api build:prod

apps/web (React Router v7 + Vite + Tailwind)

- Dev: pnpm --filter @clayout/web dev
- Build (client+server SSR): pnpm --filter @clayout/web build
- Preview: pnpm --filter @clayout/web preview
- Lint: pnpm --filter @clayout/web lint
- Start (serve built server bundle): pnpm --filter @clayout/web start

apps/router (Cloudflare Worker)

- Dev: pnpm --filter @clayout/router dev
- Deploy: pnpm --filter @clayout/router deploy
- Type generation: pnpm --filter @clayout/router cf-typegen

packages/interface (shared types)

- Build: pnpm --filter @clayout/interface build
- Note: Many app builds run prebuild to ensure @clayout/interface is built first.

packages/kit (React component kit)

- Build: pnpm --filter @clayout/kit build
- Lint: pnpm --filter @clayout/kit lint

High-level architecture

- Monorepo layout
  - apps/api: NestJS HTTP API server
    - Uses TypeORM (PostgreSQL), class-validator/transformer, JWT auth, mailer, Sentry for error reporting, Supabase client utilities.
    - Jest unit/e2e setup with ts-jest; rootDir is src; setup at apps/api/test/jest-setup.ts.
    - Generates shared TypeScript types from the Supabase schema into packages/interface/src/types/supabase/supabase.type.ts via supabase:gentypes.
  - apps/web: React Router v7 app built with Vite
    - SSR build (vite build --ssr) and client build; served via react-router-serve.
    - Uses Tailwind CSS v4, TanStack Query, Sentry’s react-router SDK, and Supabase (SSR helpers).
  - apps/router: Cloudflare Worker router (wrangler)
    - Provides edge routing or proxying (see wrangler usage). Scripts include dev/deploy/types.
  - packages/interface: Shared interfaces/types built with tsup + tsc for d.ts output.
  - packages/kit: React component/renderer kit built with tsup, depends on interface; exposed as CJS/ESM with types.
- Build orchestration
  - Root tsconfig.json references apps/api, apps/web, packages/interface, packages/kit.
  - Many builds depend on @clayout/interface; web and api run prebuild to compile it first.
- CI pipeline (.github/workflows/ci.yml)
  - Matrix over apps: [api, web]; installs at workspace root; runs lint for web, test for api, then build for each.
- PR labeling workflow (.github/workflows/render-preview-api.yml)
  - Adds render-preview label on PRs into main when head branch matches release/_ or hotfix/_.

Notes for running a single package script

- Use pnpm filters, e.g. pnpm --filter @clayout/api <script>
- To pass args to a script, separate with --, e.g. pnpm --filter @clayout/api test -- -t "My test name"

References

- Root README.md is minimal.
- See apps/api/README.md for detailed Supabase migration and type generation steps.
