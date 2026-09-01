# AGENTS.md

Angular 21 monorepo of reusable, published libraries. Ten distributable libs live under `projects/` (`ngx-opalbytes-*`): `core`, `shared`, `components`, `directives`, `services`, `utils`, `performance`, `feature-pdf`, `video`, `chart`. Each lib has its own `package.json`, `ng-package.json`, `src/public-api.ts`, and `.releaserc.js`.

## Library independence (no cross-lib dependencies)

- Each `ngx-opalbytes-*` lib is **self-contained**: it must NOT import from another opalbytes lib and must NOT list any `ngx-opalbytes-*` package in its `peerDependencies`/`dependencies`.
- This matches the current codebase — no lib imports a sibling lib (zero `from 'ngx-opalbytes-*'` source imports) and every `package.json` declares only external packages plus `tslib`.
- If a feature needs pieces spanning scopes (e.g. a component that needs its own service), co-locate them **inside that one lib** (components already ship their own services, e.g. `AlertService`/`DialogService` in `components`). If it genuinely has a distinct purpose, create a **new dedicated lib** instead of pulling a dependency from an existing one.

## Build

- `npm run build:all` builds only **8** libs — `video`, `chart`, and `feature-pdf` are NOT included. Build them individually: `build:video`, `build:chart`, `build:pdf`.
- Publish `components` with `npm run build:components:cli` (NOT plain `build:components`). It runs `scripts/copy-cli-assets.cjs`, which injects the `cao-comp` binary into the dist `package.json` and copies the CLI/templates into `dist/`.
- `tsconfig.json` maps each lib name to `./dist/<lib>` (with `preserveSymlinks`). Cross-lib imports only resolve after the dependency lib has been built — build first before typechecking cross-lib code.

## Tests (two runners — easy to get wrong)

- `ng test` (Angular `@angular/build:unit-test` builder) backs the per-lib scripts `test:<name>` (`--watch=false`).
- **Vitest** backs coverage: `test:coverage*`, `test:perf`. Configured in `vitest.config.ts` (jsdom env, v8 provider, coverage excludes `public-api.ts`). `vitest.setup.ts` bootstraps the Angular TestBed and mocks `ResizeObserver`.
- **`ngx-opalbytes-core` has NO spec files and NO `test` architect** (only build + lint). Do not run `test:core`; CI itself uses `echo "No tests for core"` for it.

## Commits and release (enforced by CI) — scope is mandatory

- Conventional Commits with a **required scope**: `feat(components): ...`. The scope drives which library semantic-release publishes. Valid scopes (see README): `components`, `core`, `directives`, `pdf`, `services`, `shared`, `performance`, `libs`, `utils`, `root`.
- A commit without a valid scope is rejected by commitlint (`.husky/commit-msg`). Commit type also matters: `feat`→minor, `fix`/`refactor`→patch, `docs`/`chore`/`test`/`style`→no release.
- **No direct commits or pushes to `main`** — all changes go through a PR. Versioning is fully automated via semantic-release on push to `main` (`.github/workflows/release.yml` + per-lib `.releaserc.js`). Do not manually bump versions.

## Husky / Git flow

- `.husky/pre-commit`: blocks direct commits to `main` and runs `npm run lint`.
- `.husky/pre-push`: blocks direct push to `main`, then runs `npm test` and `npm run metrics:report`.
- `.husky/commit-msg`: runs commitlint.
- The `semantic-release-bot` author is exempted from these rules.

## Lint / formatting

- `npm run lint` / `npm run lint:fix` use `@angular-eslint`.
- Interfaces **must be prefixed `I`** (e.g. `IHttpError`); types/enums/classes PascalCase; properties/methods camelCase.
- Template A11y rules (alt-text, labels, keyboard events, etc.) are errors — run lint before pushing.
- `no-console` only allows `warn`/`error`. Import ordering (`import/order`) is enforced with blank lines between groups.

### Selectors must use the `cao` prefix

Every lib's `projects/**/eslint.config.js` overrides the root selector rules to enforce the **`cao`** prefix (as `error`):
- Component selectors: element type, `cao` prefix, kebab-case — e.g. `<cao-base-button>`.
- Directive selectors: attribute type, `cao` prefix, camelCase — e.g. `caoMask`.
- Do NOT rely on the root default (`app`) or the `angular.json` `prefix: "lib"` (pdf/video/chart); ESLint is the enforced gate and requires `cao`.

### External packages are peer dependencies

- Components are built on **`@angular/material`** (see `src/lib/material.module.ts`, which re-exports the `Mat*Module`s), **`ngx-mask`** (`NgxMaskDirective`/`provideNgxMask`), **`@lucide/angular`** icons, and **`ngx-webstorage`**.
- These are declared as **`peerDependencies`** (not bundled deps) — consuming projects must install them. Keep them in `.depcheckrc.json` ignores.

### Barrel `index.ts` imports

- Convention: every library/feature folder exposes all of its pieces through an `index.ts` barrel file (e.g. `shared/components/index.ts`, `core/src/lib/config/index.ts`, `video/src/lib/index.ts`).
- Consumers must import from the barrel, not from deep file paths. Add a barrel when adding a new subfolder/export.

## `cao-comp` CLI binary (components)

- `ngx-opalbytes-components` publishes a CLI as its **`cao-comp`** npm bin (source: `projects/ngx-opalbytes-components/cli/cao-comp.cjs`). It's injected into the dist `package.json` by `build:components:cli` (`scripts/copy-cli-assets.cjs`), which also copies `shared/components` into `dist/ngx-opalbytes-components/templates`.
- Usage: `cao-comp <componente> <destino> [--force]` — copies a component folder from `shared/components` into an external project for customization. Flags: `-h/--help`, `-l/--list`, `-f/--force`, `-v/--version`.
- Local dev: `npm run cao-comp -- <args>`. New components placed under `shared/components/` become copyable automatically.

## Metrics

- `npm run metrics:report` (scripts/run-metrics.js) runs: build → size-limit → bundlesize → depcheck → tests → lint, then writes an HTML report to `metrics-reports/`. It runs on every pre-push and in CI; `metrics-reports/latest.html` is committed during release.
- Other quality tools: `npm run size` (size-limit), `npm run bundlesize`, `npm run deps:check` (depcheck), `npm run deps:update` (npm-check-updates).

The `dist/`, `metrics-reports/`, and `coverage/` outputs are large/derived — don't commit them manually; the release flow handles `metrics-reports/latest.html`.
