# Base UI + StyleX
<sup> ([base-x](https://www.npmjs.com/package/base-x) was taken…)</sup>

An experimental React component library built with:

- [Base UI](https://base-ui.com/) for accessible, unstyled primitives
- [StyleX](https://stylexjs.com/) for typed design tokens and component styles
- Vite + Storybook

The project intentionally has no Tailwind or pre-styled component layer, and uses [Phosphor](https://phosphoricons.com/) for icons (temporarily). Includes demo font assets bundled separately from component styling.

## Setup

```sh
npm install
npm run storybook
```
Storybook is the browsable inventory and behavior reference. 
The demo app (a gallery grid) is available with:

```sh
npm run dev
```
### Structure

```text
.storybook/                 Storybook config and global theme toolbar
docs                        Planning / agent docs
src/
  components/               Base UI-backed components and colocated stories
  blocks/                   Opinionated compositions for recurring use cases
  experimental/             Experimental components or blocks for demo & testing in Storybook
  theme/
    tokens.stylex.ts        Unified themeable StyleX token contract
    themes.stylex.ts        Named partial token overrides
    theme-provider.tsx      Theme context, host, and root synchronization
    theme-props-*.stylex.ts Token-backed component prop compilers
  styles/
    constants.stylex.ts     Fixed breakpoints, z-index, keyframes, and style utilities (ie. selector aliases, truncation)
    recipes/                Shared cross-component styles and variables (ie. popups, input wrappers)
    reset.css               Modified Tailwind v4 reset with opinionated a11y and theme-specific tweaks
    global.css              Legacy design token config
    *.css                   Shared vendor or complex styles (ie. Base UI shared popup transitions)
  App.tsx                   Demo component gallery
```

## Theming & tokens

Tokens are currently<sup>*</sup> a single `defineVars` object using named CSS variables to allow page-level consumer overrides. 

Define colors with the mode-aware `light-dark()` syntax. Other tokens use standard CSS.
```ts
// tokens.stylex.ts
import * as stylex from '@stylexjs/stylex';

export const tokens = stylex.defineVars({
  "--canvas": "light-dark(#ffffff, #000000),
  "--space-1": "0.25rem",
});
```

Import tokens from `/src` with the alias `@/theme/tokens`, and use them in `styleX.create()`.
```tsx
// someComponent.tsx
import * as stylex from '@stylexjs/stylex';
import { tokens } from '@/theme/tokens';

const styles = stylex.create({
  button: {
    backgroundColor: tokens["--bg-primary"],
    color: tokens["--fg-primary-contrast"],
    paddingInline: tokens["--space-4"],
  },
});
```

### Themes
Named themes in `@/theme/themes` provide partial overrides to `tokens` and inherit everything else.

> [!NOTE]
> This is why `tokens` is a single object: it's easier (at this stage) to spin up a new theme in a single `defineVars` function containing everything.

`ThemeProvider` applies the selected theme and mode to a real host and mirrors the outermost provider onto the
document root so body-level portals inherit it. See:
- [`docs/adr/ADR-0001`](docs/adr/0001-token-backed-theme-props.md) for the token-backed theme-prop contract,
- [`docs/adr/ADR-0003`](docs/adr/0003-stylex-ownership-and-application.md) for StyleX ownership and application boundaries,
- and [`src/styles/README.md`](src/styles/README.md) for the current implementation map.

### Color modes
Light/dark mode is automatic based on system prefs but can be forced to one mode or the other. Storybook includes a light/dark toolbar control, and the gallery persists its theme choice in local storage while defaulting to the operating-system preference.

## Components vs. blocks

Components are product-agnostic primitives; blocks are repeatable, opinionated
patterns composed from those primitives. Both favor semi-compact compound APIs with
a state-owning root and semantic parts. See [ADR 0004](docs/adr/0004-component-block-and-compound-ownership.md) for details.

Several experimental components live under `src/experimental` and have a dedicated section in Storybook.

Components are imported internally with the alias `@/components/`. Public component exports are via `src/components/index.ts`; avoid duplicating a
manually maintained component catalog here.

## Agent / architecture decisions

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

Run these independently so one successful check does not hide a failure in
another. The repository has no `typecheck` script. Playwright discovers focused
browser regressions throughout `tests/`; run the relevant spec for interaction
changes after building Storybook.
