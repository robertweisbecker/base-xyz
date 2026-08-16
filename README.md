# Base + StyleX Lab

An experimental React design-system workbench built with:

- [Base UI](https://base-ui.com/) for accessible, unstyled primitives
- [StyleX](https://stylexjs.com/) for typed design tokens and component styles
- [Storybook](https://storybook.js.org/) for isolated component development
- [Phosphor Icons](https://phosphoricons.com/) for iconography
- Vite and TypeScript for the gallery app and build pipeline

The project intentionally has no Tailwind or pre-styled component layer. The demo registers its bundled font assets separately from component styling.

## Run it

```sh
npm install
npm run storybook
```

Storybook runs on `http://localhost:6006`. The demo app is available with:

```sh
npm run dev
```

## Project shape

```text
.storybook/                 Storybook config and global theme toolbar
docs/adr/                   Accepted architecture decisions and their consequences
src/
  components/               Base UI-backed components and colocated stories
  blocks/                   Opinionated compositions for recurring use cases
  theme/
    tokens.stylex.ts        Unified themeable StyleX token contract
    themes.stylex.ts        Named partial token overrides
    theme-provider.tsx      Theme context, host, and root synchronization
    theme-props-*.stylex.ts Token-backed component prop compilers
  styles/
    constants.stylex.ts     Fixed breakpoint/range selectors and stacking layers
    recipes/                Purpose-named cross-component styles and inherited variables
    reset.css               Tailwind v4-derived reset and accessibility defaults
    global.css              Fixed document-level styles
  App.tsx                   Integrated component gallery
```

## Theming model

Components use the `@/` alias for imports from `src`. Themeable values come
through the unified token contract, while named themes provide partial
overrides and inherit everything else. `ThemeProvider` applies the selected
theme and mode to a real host and mirrors the outermost provider onto the
document root so body-level portals inherit it.

See [ADR 0001](docs/adr/0001-token-backed-theme-props.md) for the token-backed
theme-prop contract, [ADR 0003](docs/adr/0003-stylex-ownership-and-application.md)
for StyleX ownership and application boundaries, and
[`src/styles/README.md`](src/styles/README.md) for the current implementation map.

Storybook includes a light/dark toolbar control, and the gallery persists its theme choice in local storage while defaulting to the operating-system preference.

## Components and blocks

Components are product-agnostic primitives; blocks are repeatable, opinionated
workflows composed from those primitives. Both favor compact compound APIs with
a state-owning root and semantic parts. [ADR 0004](docs/adr/0004-component-block-and-compound-ownership.md)
records that ownership boundary and its consequences.

Storybook is the browsable inventory and behavior reference. The public
component export surface is `src/components/index.ts`; avoid duplicating a
manually maintained component catalog here.

## Architecture decisions

- [ADR 0001: Token-backed theme props and layout primitives](docs/adr/0001-token-backed-theme-props.md)
- [ADR 0002: Explicit semantic table primitives](docs/adr/0002-semantic-table-primitives.md)
- [ADR 0003: StyleX ownership and application boundaries](docs/adr/0003-stylex-ownership-and-application.md)
- [ADR 0004: Component, block, and compound ownership](docs/adr/0004-component-block-and-compound-ownership.md)
- [ADR 0005: Root-owned asynchronous confirmation settlement](docs/adr/0005-root-owned-async-confirmation-settlement.md)
- [ADR 0006: Global keyboard shortcut arbitration](docs/adr/0006-global-keyboard-shortcut-arbitration.md)
- [ADR 0007: Bound derived presentation without changing semantics](docs/adr/0007-bound-derived-presentation-without-changing-semantics.md)
- [ADR 0008: Reset identity-bound state before first render](docs/adr/0008-reset-identity-bound-state-before-first-render.md)
- [ADR 0009: Normalize effective values without unsolicited callbacks](docs/adr/0009-normalize-effective-values-without-unsolicited-callbacks.md)

Repository terminology lives in [`CONTEXT.md`](CONTEXT.md). Agent-facing
working rules live in [`AGENTS.md`](AGENTS.md); durable architectural rationale
belongs in an ADR instead of either onboarding document.

## Validation

```sh
npx tsc -b --pretty false
npm run lint
npm run build
npm run build-storybook
```

Run these independently so one successful surface does not hide a failure in
another. The repository has no `typecheck` script. Playwright discovers focused
browser regressions throughout `tests/`; run the relevant spec for interaction
changes after building Storybook.
