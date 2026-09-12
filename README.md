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

After `npm install`, if Playwright's matching Chromium browser is absent, run
`npx playwright install chromium` before browser checks or `npm run verify:full`.
On Linux systems missing browser dependencies, use
`npx playwright install --with-deps chromium` instead. This is standard
[Playwright browser setup](https://playwright.dev/docs/browsers), separate from
each verification run; a Playwright upgrade may require installing its matching
Chromium revision again.

Storybook is the browsable inventory and behavior reference.
The demo app (a gallery grid) is available with:

```sh
npm run dev
```

### Structure

```text
.storybook/                 Storybook config and global theme toolbar
docs/
  adr/                      Durable architectural decisions
  agents/                   Task-specific agent guides
  plans/                    Active implementation backlog
src/
  components/               Base UI-backed components and colocated stories
  blocks/                   Opinionated compositions for recurring use cases
  experimental/             Experimental components or blocks for demo & testing in Storybook
  theme/
    tokens.stylex.ts        Unified themeable StyleX token contract
    themes.stylex.ts        Named partial token overrides
    theme-provider.tsx      Theme context, host, and root synchronization
  styles/
    props/                  Layout maps plus the common-margin extraction boundary
    constants.stylex.ts     Fixed breakpoints, z-index, keyframes, and style utilities (ie. selector aliases, truncation)
    recipes/                Shared cross-component styles and variables (ie. popups, input wrappers)
    reset.css               Modified Tailwind v4 reset with opinionated a11y and theme-specific tweaks
    global.css              Global document and selection rules
    *.css                   Shared vendor or complex styles (ie. Base UI shared popup transitions)
  app/gallery-page.tsx      Demo component gallery
```

## Theming & tokens

[`src/theme/tokens.stylex.ts`](src/theme/tokens.stylex.ts) defines the stable,
independently themeable token contract. Import `tokens` directly and reference
its semantic values in StyleX. Named themes in
[`src/theme/themes.stylex.ts`](src/theme/themes.stylex.ts) override only the
values they change.

`ThemeProvider` applies the selected theme and color mode to its host and mirrors
the outermost provider onto the document root so body-level portals inherit it.
Light/dark mode follows the system unless explicitly selected. Storybook exposes
theme and mode controls; the gallery persists its theme choice locally.

See the [style implementation map](src/styles/README.md) for imports, recipes,
and examples; [ADR 0003](docs/adr/0003-stylex-ownership-and-application.md) for
ownership and application; and
[ADR 0011](docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md)
for layout primitives, common margins, and override precedence.

## Components vs. blocks

Components are product-agnostic primitives; blocks are repeatable, opinionated
patterns composed from those primitives. Both favor semi-compact compound APIs with
a state-owning root and semantic parts. See [ADR 0004](docs/adr/0004-component-block-and-compound-ownership.md) for details.

Several experimental components live under `src/experimental` and have a dedicated section in Storybook.

Components are imported internally with the alias `@/components/`. Public component exports are via `src/components/index.ts`; avoid duplicating a
manually maintained component catalog here.

## Agent / architecture decisions

- [ADR 0001: Token-backed theme props and layout primitives](docs/adr/archive/0001-token-backed-theme-props.md) (superseded)
- [ADR 0002: Explicit semantic table primitives](docs/adr/0002-semantic-table-primitives.md)
- [ADR 0003: StyleX ownership and application boundaries](docs/adr/0003-stylex-ownership-and-application.md)
- [ADR 0004: Component, block, and compound ownership](docs/adr/0004-component-block-and-compound-ownership.md)
- [ADR 0005: Root-owned asynchronous confirmation settlement](docs/adr/0005-root-owned-async-confirmation-settlement.md)
- [ADR 0006: Global keyboard shortcut arbitration](docs/adr/0006-global-keyboard-shortcut-arbitration.md)
- [ADR 0007: Bound derived presentation without changing semantics](docs/adr/0007-bound-derived-presentation-without-changing-semantics.md)
- [ADR 0008: Reset identity-bound state before first render](docs/adr/0008-reset-identity-bound-state-before-first-render.md)
- [ADR 0009: Normalize effective values without unsolicited callbacks](docs/adr/0009-normalize-effective-values-without-unsolicited-callbacks.md)
- [ADR 0010: Static style-prop maps, tiered component surfaces, and the xstyle escape hatch](docs/adr/archive/0010-static-style-prop-maps-tiered-surfaces-and-xstyle.md) (superseded by ADR 0011)
- [ADR 0011: Layout primitives, common margins, and StyleX overrides](docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md)
- [ADR 0012: Test durable behavior, not incidental fixes](docs/adr/0012-test-durable-behavior-not-incidental-fixes.md)

Repository terminology lives in [`CONTEXT.md`](CONTEXT.md). Agent-facing
working rules live in [`AGENTS.md`](AGENTS.md); durable architectural rationale
belongs in an ADR instead of either onboarding document.

## Agent guides

[AGENTS.md](AGENTS.md) contains the working rules and task-specific reference
map. Detailed guidance is loaded when the task calls for it:

- [Storybook conventions](docs/agents/storybook.md)
- [Validation and browser checks](docs/agents/validation.md)
- [Documentation ownership](docs/agents/domain.md)
- [Issues](docs/agents/issue-tracker.md) and [triage labels](docs/agents/triage-labels.md)
- [Implementation planning](docs/agents/planning.md) and the [active backlog](docs/plans/README.md)

## Validation

`npm run verify:quick` runs TypeScript, lint, and formatting. For changes spanning
app/Storybook, build tooling, dependencies, or shared styling contracts,
`npm run verify:full` includes that gate plus dev cold-start checks, app and
Storybook builds/browser tests, and the style-prop bundle boundary.

`npm run doctor` is an advisory React audit for substantial React work. Its
findings require source and behavior verification; it is not a blocking gate.

Prose-only changes use formatting, link, and consistency checks. See the
[validation guide](docs/agents/validation.md) for focused commands, browser
assertions, and port isolation. Active plans retain their prescribed validation.
