# Papercuts

Keep dated, versioned evidence of unresolved friction and necessary workarounds.
Update recurrences; remove resolved/irrelevant entries. Apply only matching
workarounds. Routine checks and port isolation belong in [validation](../docs/agents/validation.md).

## Retained workarounds

Source/configuration checked 2026-09-07; original failures were not all reproduced.

- 2026-08-20 — **Grid longhands.** `src/styles/props/grid.stylex.ts` retains `gridColumnStart`/`gridColumnEnd` and row equivalents under `@stylexjs/valid-shorthands`. The trigger was shorthand/longhand override precedence. Inspect both edges when changing spans; the caller-shorthand failure has not been reverified.
- 2026-08-20 — **Relational-selector lint exceptions.** With StyleX/plugin 0.19.0, components retain narrow `@stylexjs/valid-styles` suppressions for nested conditions. Computed `stylex.when.ancestor(...)` keys previously widened literal types. Reproduce the lint/type/compiler mismatch before adding casts or suppressions.
- 2026-08-26 — **Worktree lint traversal.** Bare Oxlint traversed `.worktrees`, loading anti-slop twice: `Plugin name 'anti-slop' is already registered`. Config ignores were too late. Use lint scripts or preserve `--ignore-pattern '.worktrees/**'` in focused runs.
- 2026-08-27 — **StyleX formatting ownership.** `prettier-plugin-stylex-key-sort` crashed on computed keys: `Cannot read properties of undefined (reading 'startsWith')`. Keep it removed: Prettier formats; Oxlint's `@stylexjs/sort-keys` orders StyleX keys.
- 2026-08-27 — **Compound selectors in development.** SegmentedControl hit `Invalid empty selector` in live StyleX despite a passing production build. It retains named selector constants. Inspect changed selectors in live Storybook after optimization; production builds do not prove dev-transform behavior.

## Recheck on recurrence

- 2026-09-02 — **Doctor host/cleanup findings.** React Doctor 0.9.13 misread headings supplied through Base UI `render` and React 19 callback-ref cleanup. Rules remain enabled; inspect `Heading`'s composed host and `useScrollFade`'s returned cleanup before accepting matching diagnostics.
- 2026-08-27 — **Storybook mocker request.** Storybook 10.5.6 dev's `/vite-inject-mocker-entry.js` returned 404, tripping console-error capture. Workaround: optimized Storybook tests plus live-transform inspection. Check current requests/server output before attributing recurrence to this report; preserve the console guard.
