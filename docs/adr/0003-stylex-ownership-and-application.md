# ADR 0003: StyleX ownership and application boundaries

- Status: Accepted. Amended by [ADR 0011](./0011-layout-primitives-common-margins-and-stylex-overrides.md) for component layout ownership and the `style` / `xstyle` split.
- Date: 2026-08-13

## Context

The component library needs one predictable source for theme values, shared behavior, component appearance, and caller overrides. Without explicit ownership, shared recipes become a second component layer, borrowers become dependencies of their owners, and CSS class order is mistaken for precedence.

StyleX also has two different boundaries: its build transform understands supported JSX syntax, while TypeScript checks React intrinsic attributes before that transform runs. The installed StyleX compiler can consume lowercase intrinsic `sx`, but React's intrinsic element types do not declare it. A global JSX augmentation would advertise `sx` beyond the guaranteed transform boundary, while line-level suppressions create permanent compiler comments. This repository prefers an explicit typed application boundary instead.

## Decision

Organize StyleX by ownership:

- `src/theme/tokens.stylex.ts` is the stable interface for themeable color, spacing, size, radius, shadow, typography, and motion values.
- `src/styles/constants.stylex.ts` owns fixed global selectors, environmental media conditions, and layer order.
- A component owns its canonical appearance and any styles shared only by its family. One-consumer styles remain beside that component.
- `src/styles/recipes/` is reserved for ownerless behavior with several real consumers, not generic component chrome.
- Borrowers import the owner they intentionally resemble. Menu owns selectable rows used by Menu, Select, and Combobox; Field owns text-input and trigger sizing; Popover owns anchored behavior; Dialog owns modal behavior; Text owns typography. Popup panel chrome remains component-local.

Apply and compose styles as follows:

- Import `.stylex.ts` bindings directly by named export. Do not barrel-re-export them or namespace-import component style modules.
- Use StyleX composition order for precedence. Component defaults and variants come first, named margin props follow on eligible normal-flow roots, and the caller's `xstyle?: StyleXStyles` comes last inside `stylex.props(...)`. Native `style?: CSSProperties` is merged after generated inline values.
- Spread the complete `{...stylex.props(...)}` result when a native, React, or Base UI recipient accepts both `className` and `style`. Extract `.className` only for a string-only adapter or an intentional manual merge that also preserves any generated inline style.
- Native JSX elements use the explicit `stylex.props(...)` spread. Do not add lowercase intrinsic `sx`, global React/JSX augmentation, a custom transform shim, or a TypeScript suppression to support the shorthand.
- Do not use class-token order or `tailwind-merge` to resolve StyleX conflicts.
- Prefer parent-local custom properties plus direct-child `[data-*]` selectors for interaction state. When inheritance cannot express the relationship, use a named component `defineMarker()` with `stylex.when.ancestor()`. Form controls never use `defaultMarker()`.
- Ordinary popup composites render children directly. A component renders a `Viewport` only for intentional current/previous payload swapping, and any bridge motion remains scoped to that viewport's component-specific class.

## Consequences

Native JSX is slightly more verbose, but TypeScript sees the actual `className` and `style` props and the repository needs no false global type promise or recurring suppression comments. A dedicated browser test is not required solely to prove this compiler boundary; behavior with semantic, visual, or interaction risk still receives focused browser coverage.

Canonical ownership makes shared changes flow from owner to borrower and keeps recipes small. Some components must deliberately merge generated StyleX output with external `className` or `style`; reviewers must verify that generated inline values are not discarded. The detailed current module and recipe map remains in `src/styles/README.md`.
