# Repository guidance

## Execution

- Complete implementation requests through working code, relevant verification, and fixes for failures caused by the change. Honor planning-only or review-only requests.
- Follow a plan's prescribed steps, checks, and STOP conditions; efficiency guidance never relaxes them.
- Resolve routine choices from the request, source, and conventions. Ask only for material missing information or authorization; continue independent work meanwhile.
- Inspect the checkout, branch, and local changes before editing. Preserve unrelated work, including untracked files. Local edits, builds, and affected test reruns need no separate approval.
- Commit, push, merge, publish, or send messages only with user authorization. Existing authorization persists; prepare a concrete result before requesting missing approval.
- Follow YAGNI principles, and prefer one-liner solutions.
- Keep solutions readable and public contracts intact. Add abstractions or dependencies only for demonstrated needs.
- Use requested or materially helpful skills; user instructions prevail. If guidance causes a pause or scope change, link it, quote the instruction, and explain the conflict.

## Load guidance when it applies

Consult matching references when changing a contract, verifying work, or resolving ambiguity; reuse them until the task or source changes. Avoid blanket reading passes. Accepted repository decisions override generic skill and vendored examples. Archived ADRs are historical; papercut workarounds require a matching trigger.

| Work                                        | Reference                                                                                                        |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Domain vocabulary                           | [CONTEXT.md](CONTEXT.md)                                                                                         |
| Table/DataTable ownership                   | [ADR 0002](docs/adr/0002-semantic-table-primitives.md)                                                           |
| Component, block, and compound ownership    | [ADR 0004](docs/adr/0004-component-block-and-compound-ownership.md)                                              |
| Style ownership, imports, and JSX           | [ADR 0003](docs/adr/0003-stylex-ownership-and-application.md)                                                    |
| Layout, margins, `style`/`xstyle`           | [ADR 0011](docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md)                               |
| Style modules, recipes, and syntax          | [Style map](src/styles/README.md); [authoring guide](.agents/resources/stylex-authoring.md)                      |
| Async compound-action settlement            | [ADR 0005](docs/adr/0005-root-owned-async-confirmation-settlement.md)                                            |
| Document-level shortcuts                    | [ADR 0006](docs/adr/0006-global-keyboard-shortcut-arbitration.md)                                                |
| Decorative collections from numeric domains | [ADR 0007](docs/adr/0007-bound-derived-presentation-without-changing-semantics.md)                               |
| Identity-bound transient state              | [ADR 0008](docs/adr/0008-reset-identity-bound-state-before-first-render.md)                                      |
| Controlled values with changing options     | [ADR 0009](docs/adr/0009-normalize-effective-values-without-unsolicited-callbacks.md)                            |
| Storybook stories, controls, and Docs       | [Storybook](docs/agents/storybook.md)                                                                            |
| Verification and permanent tests            | [Validation](docs/agents/validation.md); [ADR 0012](docs/adr/0012-test-durable-behavior-not-incidental-fixes.md) |
| Issues, triage, and claiming work           | [Issue tracker](docs/agents/issue-tracker.md); [labels](docs/agents/triage-labels.md)                            |
| Plans and backlog lifecycle                 | [Planning](docs/agents/planning.md)                                                                              |
| Documentation and architectural decisions   | [Documentation ownership](docs/agents/domain.md)                                                                 |

## Public APIs and design

- `src/components/index.ts` defines public components. Gallery specimens use public exports; imports and specimen titles stay alphabetical.
- Keep public contracts compact and relatively closed; use repository terms such as `headingLevel`, not `titleLevel`.
- Controls own direct-icon sizing/alignment. When StyleX cannot express it, use a narrow component marker/direct-child CSS rule; never clone icons or add styling-only icon parts.
- Reserve `cursor: pointer` for navigation, never native-button controls.
- Metadata and explanatory labels use sentence case, regular weight, the smallest semantic type, and muted neutral. Avoid decorative all-caps and accent-colored eyebrows.
- Menu checkbox/radio items own indicators; consumers supply row content. `Menu.SwitchItem` remains a `menuitemcheckbox`.
- Limit visible UI without truncating state. Hidden selections read `N selected` when none are visible, `+N more` otherwise.

## Styles

- Tokens are stable API: never remove them or replace usages with literals unless explicitly asked. Themeable values: `src/theme/tokens.stylex.ts`; fixed globals: `src/styles/constants.stylex.ts`.
- Native JSX uses the complete `stylex.props(...)` result. No intrinsic `sx`, JSX augmentation, transform shims, or suppressions for that shorthand.
- `Box`, `Stack`, and `Grid` own broad layout. Eligible normal-flow roots resolve scalar `MarginProps` once, locally or through a delegated owner. Controllers/positioned surfaces are excluded; internal parts do not inherit that contract. Consult ADR 0011 for independently useful normal-flow parts.
- Atoms and created styles share `xstyle`, merged last in `stylex.props(...)`. Native `style` merges after generated inline values.

## Verification and completion

- Follow the validation guide: `npm run verify:quick` for code; `npm run verify:full` for app/Storybook integration, tooling, dependencies, or shared styling contracts; formatting, links, and consistency for prose.
- Interaction changes require focused browser checks with console-error capture. Selector, popup, responsive, and interaction changes also require live Storybook inspection after optimization.
- Test durable behavior under ADR 0012; keep one-off visual diagnostics in review evidence. Repeat passing checks only for changes, failures, or unresolved risk. During parallel work, designate one broad validator.
- Review the final diff and fix in-scope failures. Report outcome, validation, unrelated failures, and blockers concisely; distinguish observations from assumptions and incomplete work from completion.
- Keep [.agents/PAPERCUTS.md](.agents/PAPERCUTS.md) to unresolved friction and necessary workarounds: date, tool/version, trigger, and workaround. Update recurrences; remove resolved or irrelevant entries.
