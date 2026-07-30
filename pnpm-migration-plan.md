# pnpm Migration Plan

## Status

Planned. This document is an implementation handoff; the repository has not
yet been migrated.

## Goal

Migrate this single-package Vite, React, StyleX, and Storybook repository from
npm to pnpm while preserving the currently locked dependency graph, pinning the
package-manager version, and proving that development and production workflows
still work.

## Current repository findings

- The repository has one root `package.json` and is not a workspace.
- `package-lock.json` is the current dependency lockfile.
- There is no `.npmrc`, CI workflow, Dockerfile, or deployment configuration to
  migrate.
- All package scripts are package-manager-neutral:
  - `dev`
  - `build`
  - `lint`
  - `preview`
  - `storybook`
  - `build-storybook`
- npm commands appear in `README.md` and a few user-facing examples under
  `src/`.
- `.gitignore` already ignores `pnpm-debug.log*`.
- At planning time, Node.js was `v24.9.0` and Corepack was `0.34.0`. pnpm 11
  supports Node.js 22 and newer.
- The relevant repository files were untracked at planning time. Do not assume
  Git can restore the pre-migration state; inspect the current checkout again
  before implementing.

## Implementation plan

### 1. Confirm the checkout and establish a rollback point

Before editing:

1. Inspect `git status`, `git ls-files`, and the current package-manager files.
2. Confirm that this is the intended checkout.
3. Preserve copies of at least:
   - `package.json`
   - `package-lock.json`
   - `README.md`
4. Record the current environment and resolved top-level dependency versions:

   ```sh
   node --version
   npm --version
   corepack --version
   npm ls --depth=0
   ```

If the tree is still untracked, use a temporary snapshot outside the repository
instead of relying on Git for rollback.

### 2. Make pnpm 11 available through Corepack

Use Corepack rather than installing an unpinned global pnpm package. Select the
latest stable pnpm 11 patch available at implementation time:

```sh
corepack install --global pnpm@latest-11
corepack enable pnpm
pnpm --version
```

If Corepack reports an outdated-signature error, update Corepack first. Because
this machine has previously encountered npm-cache permission errors, use a
temporary writable npm cache if needed:

```sh
npm_config_cache=/tmp/stylex-npm-cache npm install --global corepack@latest
```

Do not use `sudo` for npm, Corepack, or pnpm.

### 3. Import the npm lockfile before removing it

Keep `package-lock.json` in place and run:

```sh
pnpm import
```

This should generate `pnpm-lock.yaml` from the existing npm lockfile. Inspect
the generated lockfile and compare the resolved top-level package versions with
the baseline from step 1.

After the import succeeds, pin the exact pnpm patch version in `package.json`.
Running the following after the lockfile import will write the resolved
`packageManager` value and perform an install:

```sh
corepack use pnpm@latest-11
```

The resulting field should contain an exact version, for example:

```json
{
  "packageManager": "pnpm@11.x.x"
}
```

Do not leave a floating tag such as `latest-11` in the committed
`packageManager` field.

Once `pnpm-lock.yaml` has been generated and checked, remove
`package-lock.json`. The repository should commit only one authoritative
lockfile.

### 4. Perform a clean, reproducible pnpm installation

Remove or temporarily move the npm-created `node_modules`, then install solely
from the pnpm lockfile:

```sh
pnpm install --frozen-lockfile
pnpm list --depth=0
```

Compare the top-level dependency versions with the npm baseline. Investigate
unexpected resolution changes or peer-dependency warnings rather than silencing
them.

pnpm may block dependency lifecycle scripts. Review the reported packages and
approve only scripts needed by this toolchain:

```sh
pnpm ignored-builds
pnpm approve-builds
```

Do not use `pnpm approve-builds --all`. If approvals are required, commit the
generated `allowBuilds` policy in `pnpm-workspace.yaml`. Do not otherwise add a
workspace file merely for possible future monorepo use.

### 5. Update repository commands

Replace repository-facing npm commands with pnpm equivalents in:

- `README.md`
- `src/foundations/foundation-pages.tsx`
- `src/components/code/code.stories.tsx`
- The illustrative command in `src/App.tsx`

Examples:

```sh
pnpm install
pnpm run dev
pnpm run storybook
pnpm run lint
pnpm run build
pnpm run build-storybook
```

Do not mechanically change package names, prose that discusses npm itself, or
generated files. `.gitignore` needs no pnpm-specific change unless the current
file has drifted since this plan was written.

### 6. Validate the migration

Run final validation serially:

```sh
pnpm exec tsc -b --pretty false
pnpm run lint
pnpm run build
pnpm run build-storybook
```

Then smoke-test:

```sh
pnpm run dev
pnpm run storybook
```

Confirm that:

- The Vite app starts and renders.
- Storybook reaches its ready state and representative component and block
  stories render.
- No module-resolution errors are caused by pnpm's stricter dependency layout.
- Existing warnings are distinguished from migration regressions.

Finally, remove `node_modules` once more and prove that a clean frozen install
works:

```sh
pnpm install --frozen-lockfile
```

Rerun the build after this final clean install.

## Expected changed files

- `package.json`
- `pnpm-lock.yaml` (new)
- `package-lock.json` (removed)
- `README.md`
- `src/foundations/foundation-pages.tsx`
- `src/components/code/code.stories.tsx`
- `src/App.tsx`
- `pnpm-workspace.yaml` only if explicit dependency build approvals are required

## Success criteria

- `package.json` pins an exact pnpm 11 version through `packageManager`.
- `pnpm-lock.yaml` is the only committed dependency lockfile.
- A clean `pnpm install --frozen-lockfile` succeeds.
- Top-level dependency versions remain consistent with the npm baseline unless
  a difference is understood and intentionally accepted.
- TypeScript, lint, the Vite production build, and the Storybook production
  build pass.
- The Vite development app and Storybook both start successfully.
- Documentation and visible command examples consistently use pnpm.

## Rollback

If the migration cannot be completed safely:

1. Restore the snapshotted `package.json`, `package-lock.json`, and
   documentation files.
2. Remove `pnpm-lock.yaml` and any migration-created `pnpm-workspace.yaml`.
3. Rebuild dependencies with npm:

   ```sh
   npm install
   ```

4. Rerun the original validation commands:

   ```sh
   npx tsc -b --pretty false
   npm run lint
   npm run build
   npm run build-storybook
   ```

5. Report the exact pnpm incompatibility or verification failure instead of
   leaving both package managers partially configured.

## References

- [pnpm installation and Corepack](https://pnpm.io/installation#using-corepack)
- [`pnpm import`](https://pnpm.io/cli/import)
- [`pnpm approve-builds`](https://pnpm.io/cli/approve-builds)
