# Base + StyleX Lab

An experimental React design-system workbench built with:

- [Base UI](https://base-ui.com/) for accessible, unstyled primitives
- [StyleX](https://stylexjs.com/) for typed design tokens and component styles
- [Storybook](https://storybook.js.org/) for isolated component development
- [Phosphor Icons](https://phosphoricons.com/) for iconography
- Vite and TypeScript for the gallery app and build pipeline

The project intentionally has no Tailwind, imported web fonts, or pre-styled component layer.

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

Components use the `@/` alias for imports from `src`. All themeable values come
through the direct `tokens` binding in `src/theme/tokens.stylex.ts`; fixed
constants and recipes retain their own direct named imports. Named themes
provide partial overrides of that unified StyleX variable group.
`ThemeProvider` applies the requested theme and mode to a real host and mirrors
the outermost provider onto the document root so body-level portals inherit it.

See [`src/styles/README.md`](src/styles/README.md) for the style ownership rules.

Storybook includes a light/dark toolbar control, and the gallery persists its theme choice in local storage while defaulting to the operating-system preference.

## Components and blocks

Components are the general-purpose building blocks of the system. They wrap
Base UI primitives with the shared StyleX tokens, interaction states, and
accessibility conventions while remaining reusable across product contexts.

Blocks compose multiple components into more-specific solutions for recurring
workflows. They intentionally bake in structure and behavior that should remain
consistent for that use case. When callers need to control the content or
actions within a structured region, blocks expose composable named parts
instead of adding a prop for every variation. Block stories appear in their
own `Blocks` section in Storybook.

The block collection includes:

- `ConfirmationDialog` for non-alert confirmation flows
- `AgentActionApproval` for reviewing and approving an agent's external action
- `WorkflowProgress` for queued, running, completed, and failed workflow steps
- `PromptComposer` for keyboard-aware AI prompt submission and cancellation
- `StreamingResponse` for generating, completed, stopped, and failed responses
- `AsyncJobProgress` for determinate or indeterminate background work
- `PasswordField` for password entry with coordinated visibility controls
- `CopyButton` for clipboard actions with anchored confirmation feedback
- `ModelSelector` for grouped AI model selection with provider context

### Starter components

- Button based on `@base-ui/react/button`
- Text field composed from Base UI Field and Input
- Input group for compound input, textarea, add-on, and action layouts
- Filterable combobox based on Base UI Combobox
- Collapsible, Toolbar, Progress, Meter, and Separator based on their Base UI primitives
- Switch based on Base UI Switch
- Scroll area based on Base UI Scroll Area
- Composable Card layout primitives

Each interactive component keeps Base UI's behavior and accessibility model while applying variants, spacing, color, radius, typography, and motion through StyleX.

## Validation

```sh
npm run lint
npm run build
npm run build-storybook
```
