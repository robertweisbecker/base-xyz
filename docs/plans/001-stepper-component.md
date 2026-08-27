# Plan 001: Add an accessible responsive Stepper component

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan in
> `docs/plans/README.md` unless a reviewer dispatched you and told you they maintain
> the index.
>
> **Drift check (run first)**:
>
> ```sh
> git diff --stat 10e0c9f..HEAD -- \
>   src/components/stepper \
>   src/components/index.ts \
>   src/app/gallery-page.tsx \
>   src/foundations/style-props.type-test.ts \
>   tests/components/stepper.spec.ts
> ```
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding. Also run
> `git status --short` before editing: this checkout was already dirty when the
> plan was written, although none of the in-scope paths were dirty. If an
> in-scope path now has pre-existing changes, treat that as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: L
- **Risk**: MED
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `10e0c9f`, 2026-08-25

## Why this matters

The component system has accessible Tabs and a non-interactive
`WorkflowProgress` timeline, but it has no product-agnostic primitive for a
guided multi-panel workflow. Consumers would currently need to rebuild step
selection, locked/completed/invalid state, connector progress, responsive
orientation, Back/Next behavior, and focus management together.

Add a core `Stepper` that owns those reusable mechanics without owning product
validation or completion policy. It must support horizontal and vertical
layouts, number or icon markers, a title and description per step, one panel per
step, a connector filled through the current marker center, the common workflow
states, and keyboard-safe navigation. The public API must remain compound and
relatively closed.

## Product and interaction decisions

These decisions came from the completed design interview and are not open for
reinterpretation during implementation:

- Use a guided, reviewable workflow. `Previous` and `Next` are the primary
  progression controls; any enabled step header can reopen its panel. A locked
  step cannot be activated.
- Build on Base UI Tabs, not Accordion or Collapsible. Both orientations show
  exactly one selected panel.
- Horizontal layout places title and description below the marker. Vertical
  layout places them to the marker's right and the active panel beside the
  rail.
- A requested vertical Stepper becomes the normal horizontal rail-above-panel
  layout below the repository's `md` breakpoint (48rem). Its ARIA orientation
  and arrow-key mapping must change with the visual layout.
- Horizontal rails do not wrap. They scroll inline when the steps do not fit,
  and the active step is brought into view.
- Use manual activation and `loopFocus={false}`: arrow keys move focus without
  changing panels; Enter or Space activates the focused step; arrow focus stops
  at the first and last step.
- `Previous` and `Next` infer the immediately adjacent step. They disable at an
  endpoint or when that adjacent step is locked, and they never skip a lock.
- Successful Previous/Next navigation focuses the newly active panel. Direct
  activation leaves focus on the step header. Canceled navigation does not move
  focus.
- Stepper owns navigation only. Consumers own validation, completion, unlocking,
  pending states, and workflow persistence.
- Panels stay mounted by default to preserve uncontrolled fields and local
  state. A panel may opt out with `keepMounted={false}`.
- Marker content is stable: an empty `Marker` generates its ordinal; supplied
  children render as the marker icon/content. Completed, invalid, locked, and
  current states never replace marker content automatically.
- The connector fill ends at the center of the current marker.
- Ship one canonical size. Do not add `size` variants in v1.

## Current state

### Repository and validation

- React 19.2, TypeScript 6, Base UI 1.7, StyleX 0.19, Storybook 10.5, and
  Playwright 1.62 are already installed. Do not add or upgrade dependencies.
- `README.md` identifies `src/components/` as product-agnostic primitives,
  Storybook as the browsable inventory, and `src/components/index.ts` as the
  public source of truth.
- There is no `typecheck` script. The independent gates are:

  ```sh
  npx tsc -b --pretty false
  npm run lint
  npm run build
  npm run build-storybook
  ```

- Playwright discovers `tests/` and previews the built Storybook at
  `http://127.0.0.1:6106`. Interaction tests use one Chromium worker and capture
  screenshots/traces on failure.
- The checkout had unrelated edits in app experiments, blocks, layout
  components, Avatar, Badge, Select, style-prop verification stories,
  `grid.stylex.ts`, `surface.stylex.ts`, and `tokens.stylex.ts`. Preserve all of
  them. In particular, do not use this work as permission to edit the already
  modified token file.

### Existing Tabs exemplar

`src/components/tabs/tabs.tsx:34-72` shows the required normal-flow Root and
StyleX precedence:

```tsx
export type TabsRootProps = Omit<BaseTabs.Root.Props, "className" | "style" | keyof MarginProps> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		size?: TabsSize;
	};

export function Root({ className, orientation = "horizontal", style, xstyle, ...props }: TabsRootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(tabsParts.root, rootOrientationStyles[orientation], marginStyles, xstyle);
	return (
		<BaseTabs.Root
			orientation={orientation}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...rest}
		/>
	);
}
```

Match this precedence on `Stepper.Root`: component styles, then resolved margin
styles, then caller `xstyle`; merge native `style` last. Compound parts receive
`className`, `style`, and `xstyle`, but no common margins.

`src/components/tabs/tabs.tsx:75-188` wraps Base UI `List`, `Tab`, `Content`,
and `Panel`. It preserves Base UI roles and state attributes, uses
`focusRing.offset` on tabs and `focusRing.inset` on panels, and spreads complete
StyleX output. `src/components/tabs/tabs.tsx:419-425` exports a frozen namespace
shape:

```tsx
export const Tabs = {
	Root,
	List,
	Tab,
	Content,
	Panel,
} as const;
```

Use the same family-export pattern, but import `Tabs as BaseTabs` directly from
`@base-ui/react/tabs`. Do not compose the styled public `Tabs` component: the
Stepper anatomy, connector, state chrome, registration, and pagination are
different enough to need their own owner.

### Existing Button and responsive exemplars

- `src/components/button/button.tsx:374-407` defines `ButtonProps` and the public
  `Button`. `Stepper.Previous` and `Stepper.Next` should compose this Button so
  they inherit repository sizing, variants, loading, focus, slots, and native
  button behavior. Previous defaults to `variant="secondary"`; Next defaults to
  `variant="primary"`; caller props may override those defaults.
- `src/styles/constants.stylex.ts:9-27` defines reduced-motion and the mobile-first
  `md` breakpoint as `@media (min-width: 48rem)`.
- `src/theme/theme-provider.tsx:87-104` is the local `useSyncExternalStore` plus
  `matchMedia` subscription pattern. Reuse that strategy for the effective
  Stepper orientation, with a private `MD_MEDIA_QUERY = "(min-width: 48rem)"`
  constant and a comment tying it to `breakpoints.md`. The server snapshot is
  mobile-first (`false`).

### Architecture constraints

- ADR 0004 (`docs/adr/0004-component-block-and-compound-ownership.md:12-18`):
  this belongs in `src/components/`; one Root owns coordinated state; the API
  uses semantic parts; Base UI semantics survive at the rendered boundary;
  public exports and Gallery consume the supported API.
- ADR 0009 (`docs/adr/0009-normalize-effective-values-without-unsolicited-callbacks.md:14-19`):
  derive one effective value when the registered step domain changes; a missing
  value falls back silently without firing `onValueChange`; disabled steps stay
  in the value domain.
- ADR 0011 (`docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md:33-70`):
  only Root gets scalar common margins; internal spacing and component geometry
  remain Stepper-owned; use only component-specific `data-*` attributes with a
  real behavior or selector purpose.
- StyleX authoring must also follow `.agents/resources/stylex-authoring.md`,
  ADR 0003, and `src/styles/README.md`. Read all three before editing Stepper
  styles.
- Do not set `cursor: pointer` on the native step buttons. Use semantic tokens,
  `focusRing`, `media.canHover`, and `media.reducedMotion` rather than raw theme
  values.

### Story, Gallery, and test exemplars

- `src/components/tabs/tabs.stories.tsx:28-85` shows `Components/Tabs`, a
  first-exported `Playground`, curated controls, and generic icon select mappings
  with `None`.
- `src/components/tabs/tabs.stories.tsx:109-146` consolidates orientation and
  state comparisons and disables controls when stories do not consume args.
- `src/components/index.ts:68-75` is the public export region. Add the Stepper
  namespace and type exports after `Slider` and before `Table`, preserving the
  local component-name order without reordering unrelated exports.
- `src/app/gallery-page.tsx` imports public components alphabetically and keeps
  specimen titles alphabetical. The new `Stepper` import belongs after `Stack`
  and before `Switch`; its specimen belongs in that same alphabetical location,
  not next to private source imports.
- `tests/components/slider.spec.ts:1-16` and
  `tests/components/combobox.spec.ts:1-16` show the focused Storybook URL plus
  per-test console-error capture that the new spec must copy.
- `src/foundations/style-props.type-test.ts:30-136` provides compile-time
  `HasKey`/`Not` assertions for root margins and part escape hatches.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Inspect scope | `git status --short` | Existing unrelated edits are preserved; no in-scope edit exists before work |
| TypeScript | `npx tsc -b --pretty false` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 from Oxlint and StyleX ESLint |
| App build | `npm run build` | exit 0; TypeScript and Vite app build succeed |
| Storybook build | `npm run build-storybook` | exit 0; `storybook-static/` generated |
| Focused browser test | `npx playwright test tests/components/stepper.spec.ts` | all Stepper tests pass in Chromium with no console errors |
| Live Storybook | `npm run storybook` | dev Storybook reaches ready state on port 6006 |

Do not run a formatter that writes the working tree. Do not install packages.

## Suggested executor toolkit

- Read the official [Base UI Tabs documentation](https://base-ui.com/react/components/tabs)
  before implementing Root/List/Step/Panel behavior. Use only public exports.
- Use the [WAI-ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
  to verify manual activation and orientation-specific keys.
- Use the [WAI-ARIA 1.2 `aria-current` guidance](https://www.w3.org/TR/wai-aria/#aria-current):
  a tab already uses `aria-selected`; do not duplicate the same meaning with
  `aria-current="step"`.
- Use the browser verification skill available to the executor, if any, after
  Storybook is built. Source and production builds do not prove keyboard,
  responsive, or focus behavior.

## Target public API

Create `src/components/stepper/stepper.tsx` with these public types and parts.
Minor type-expression changes are allowed only when necessary to preserve the
same contract against the installed Base UI types.

```tsx
export type StepperOrientation = "horizontal" | "vertical";
export type StepperStatus = "incomplete" | "completed" | "invalid";
export type StepperValue = string;

type StepperSelectionProps =
	| { value: StepperValue; defaultValue?: never }
	| { value?: never; defaultValue: StepperValue };

export const Stepper = {
	Root,
	List,
	Step,
	Marker,
	Heading,
	Title,
	Description,
	Content,
	Panel,
	Previous,
	Next,
} as const;
```

The supported composition is:

```tsx
<Stepper.Root defaultValue="profile" orientation="vertical">
	<Stepper.List aria-label="Account setup progress">
		<Stepper.Step value="profile" status="completed">
			<Stepper.Marker />
			<Stepper.Heading>
				<Stepper.Title>Profile</Stepper.Title>
				<Stepper.Description>Add your personal details.</Stepper.Description>
			</Stepper.Heading>
		</Stepper.Step>

		<Stepper.Step value="security">
			<Stepper.Marker>
				<SecurityIcon aria-hidden />
			</Stepper.Marker>
			<Stepper.Heading>
				<Stepper.Title>Security</Stepper.Title>
				<Stepper.Description>Choose authentication options.</Stepper.Description>
			</Stepper.Heading>
		</Stepper.Step>
	</Stepper.List>

	<Stepper.Content>
		<Stepper.Panel value="profile">Profile form</Stepper.Panel>
		<Stepper.Panel value="security">
			Security form
			<Stepper.Previous>Back</Stepper.Previous>
			<Stepper.Next>Continue</Stepper.Next>
		</Stepper.Panel>
	</Stepper.Content>
</Stepper.Root>
```

Contract details:

- `Root` supports controlled `value` and uncontrolled `defaultValue`, both
  strings, plus Base UI's cancelable `onValueChange` details. Require callers to
  provide exactly one initial selection through the `StepperSelectionProps`
  union; do not invent an implicit first-step public contract. Root supports
  `orientation`, MarginProps, and BaseStyleProps.
- `List` wraps `BaseTabs.List`, fixes `activateOnFocus={false}` and
  `loopFocus={false}`, accepts an accessible label, and owns overflow plus the
  connector presentation. Omit `activateOnFocus` and `loopFocus` from the public
  List props so callers cannot opt back into automatic activation or wrapping.
- `Step` wraps `BaseTabs.Tab`; requires `value: string`; accepts
  `status?: StepperStatus` (default `"incomplete"`) and `disabled`; uses a native
  button by default. It registers its value, disabled state, trigger element,
  and DOM order with Root.
- `Marker`, `Heading`, `Title`, and `Description` are semantic composition parts
  backed by spans so the tab contains phrasing content. They consume Step
  context and throw a clear development error when used outside Step.
- `Marker` is always `aria-hidden`. When it has no meaningful children, render
  the one-based registered step index; otherwise render children unchanged.
- `Title` supplies the stable ID used by the tab's `aria-labelledby`.
  `Description` supplies the stable ID used by `aria-describedby`. Step also
  renders visually hidden status text and includes its ID in
  `aria-describedby` for completed and invalid states. Base UI owns selected and
  disabled announcements. Tests must prove the description is not duplicated
  into the accessible name.
- `Content` is the normal-flow wrapper for panels. It receives only part style
  props, not MarginProps.
- `Panel` wraps `BaseTabs.Panel`, defaults `keepMounted={true}`, keeps Base UI's
  `role="tabpanel"`, `aria-labelledby`, inactive `hidden`/`inert`, and active
  `tabIndex={0}`, and registers its element by value for paging focus.
- `Previous` and `Next` accept ButtonProps. They combine caller `disabled` with
  derived adjacency state. Invoke the caller's `onClick` first and stop when it
  calls `preventDefault`; otherwise request the adjacent registered Step through
  the same Root selection path used by Step activation. The Root
  `onValueChange` callback may also cancel Base UI's event details.
- Every part follows the local `className` + native `style` + `xstyle` merge
  convention. Only Root gets MarginProps. Do not add a public Track, Indicator,
  Actions, size, validation, or status-icon mapping part/prop.

## Scope

**In scope — these are the only implementation files to modify:**

- `src/components/stepper/stepper.tsx` — create component, state owner, parts,
  registration, pagination, styles, and private responsive hook.
- `src/components/stepper/index.ts` — create the family re-export.
- `src/components/stepper/stepper.stories.tsx` — create public contract stories.
- `src/components/index.ts` — add the public namespace and type exports.
- `src/app/gallery-page.tsx` — add one alphabetized public-export specimen.
- `src/foundations/style-props.type-test.ts` — assert Root margins and part
  escape-hatch boundaries.
- `tests/components/stepper.spec.ts` — create focused behavior and layout tests.
- `docs/plans/README.md` — update only this plan's status after implementation.

**Out of scope — do not touch even if related:**

- `src/components/tabs/` — Stepper is additive; do not change Tabs behavior or
  API.
- `src/components/collapsible/`, Accordion wrappers, or
  `src/blocks/workflow-progress/`.
- `src/theme/tokens.stylex.ts`, `src/styles/constants.stylex.ts`, or any shared
  recipe. Use the current semantic tokens and private Stepper styles. The token
  file already has unrelated local edits.
- `src/app/experiments/` and every currently dirty source path outside the
  explicit scope.
- `package.json`, lockfiles, README, CONTEXT, AGENTS, or ADR files.
- Automatic completion/unlocking, form validation, async validation, routing,
  URL persistence, analytics, animations between panel payloads, size variants,
  or state-driven icon substitution.

## Git workflow

- Do not create a branch, commit, push, or open a PR unless the operator
  explicitly requests it.
- If a branch is requested, use `codex/001-stepper-component`.
- If a commit is requested, use the repository/app convention:
  `[codex] Add Stepper component`.
- Never stage unrelated dirty-worktree files.

## Steps

### Step 1: Establish the component family and public type surface

1. Create `src/components/stepper/stepper.tsx` and
   `src/components/stepper/index.ts`.
2. Define the target public types and the `Stepper` namespace exactly as listed
   above.
3. Add private Root and Step contexts with explicit error messages:
   `Stepper parts must be rendered inside Stepper.Root.` and
   `Stepper marker and text parts must be rendered inside Stepper.Step.`
4. Wrap Base UI Root/List/Tab/Panel directly. Implement `Content` and the four
   text/marker parts as native spans/divs with the repository's StyleX merging
   pattern.
5. Implement Root margins with `extractMarginProps`. Do not expose margins on
   compound parts.
6. Add public exports in `src/components/index.ts` and compile-time assertions:
   Root has `m`, `ms`, `style`, and `xstyle`; List/Step/Marker/Heading/Title/
   Description/Content/Panel have `style` and `xstyle` but not `m`; Root and
   parts do not gain broad layout props such as `width`, `position`, or `p`.

**Verify**:

```sh
npx tsc -b --pretty false
```

Expected: exit 0 with the new public API and type assertions compiling.

### Step 2: Implement one Root-owned value and registration model

1. Keep a private requested value for uncontrolled Root and use the controlled
   prop when present. Pass one controlled effective value into Base UI Tabs so
   direct Step activation and paging cannot diverge.
2. Register every Step by string value with its disabled state and trigger ref.
   Sort registrations by actual DOM order (`compareDocumentPosition`) before
   deriving indices so conditional rendering and reordering stay correct.
   Duplicate values must produce a clear development warning and no ambiguous
   pagination.
3. Derive one `effectiveValue`:
   - use the requested/controlled value when it exists in the registered domain;
   - otherwise use the first registered value, including a disabled first step;
   - use `null` only when there are no registered steps.
4. A missing value or removed current step must not call `onValueChange` or
   write replacement uncontrolled state. A user activation after fallback emits
   exactly one real change.
5. If the current Step later becomes disabled, keep it selected and its panel
   visible. It becomes non-activatable; it does not force a fallback.
6. Generate stable Title, Description, and status IDs in Step. Apply
   `aria-labelledby` to Title only and `aria-describedby` to Description plus
   visually hidden status text. Do not apply `aria-current` or `aria-invalid` to
   the tab.

**Verify**:

```sh
npx tsc -b --pretty false
```

Expected: exit 0; no effect synchronizes props into state and no automatic
domain change invokes the public callback.

### Step 3: Implement responsive layout, states, markers, and connector

1. Add a private `useIsMdViewport` built with `useSyncExternalStore` and
   `matchMedia("(min-width: 48rem)")`. Subscribe/unsubscribe to the query's
   `change` event and return `false` on the server.
2. Derive `effectiveOrientation` as vertical only when Root requested vertical
   and the query matches; otherwise horizontal. Pass that exact value to Base UI
   Root and use the same context value for every StyleX orientation branch.
3. Horizontal layout:
   - Root stacks List above Content.
   - List is a single non-wrapping inline scroller with accessible focus rings
     unobscured by overflow.
   - Each Step gets the same readable minimum inline basis and places Marker,
     Title, then Description vertically.
4. Vertical layout:
   - Root uses a rail/content grid.
   - Steps stack in the rail; Marker is in the first column and Heading in the
     second.
   - Content occupies the second Root column and remains min-width safe.
5. Implement the connector without a new public part:
   - every non-final Step owns the segment from its marker center to the next
     marker center with a component-specific pseudo-element;
   - keep List gap at zero and include inter-step breathing room in each Step's
     owned box so segment length is exactly one Step advance in both axes;
   - set component-specific data state from registered index versus current
     index; segments whose index is lower than current use the accent fill;
   - the last filled segment therefore ends exactly at the current marker
     center;
   - connector segments are `aria-hidden` presentation, use
     `pointerEvents: "none"`, and remain behind the interactive marker/header so
     they cannot enlarge or block hit targets;
   - use logical properties; do not add RTL-specific fill or layout branches.
6. State treatment:
   - default incomplete + non-current is neutral/inactive;
   - current incomplete uses accent emphasis;
   - completed uses success marker chrome;
   - invalid uses error marker chrome;
   - disabled/locked uses muted disabled chrome and wins opacity/interactivity;
   - current emphasis/focus remains distinguishable when current is completed,
     invalid, or disabled.
7. `Marker` renders the registered one-based index only when children are null
   or boolean. Keep the wrapper `aria-hidden`; do not clone or resize consumer
   icons outside the marker's owned font-size box.
8. On every effective value change, bring the active Step into the List's inline
   viewport using `scrollIntoView({ inline: "nearest", block: "nearest" })`.
   Smooth scrolling may be used only outside `prefers-reduced-motion`; reduced
   motion must use immediate scrolling and remove connector transitions.

**Verify**:

```sh
npm run lint
npx tsc -b --pretty false
```

Expected: both exit 0; StyleX accepts every selector and responsive declaration.

### Step 4: Add order-aware paging and focus transfer

1. Register each Panel's element by value while preserving consumer refs.
2. Derive Previous and Next from the active registered index. Use only the
   immediately adjacent record. At a boundary or when that record is disabled,
   render the action disabled; never search farther for an enabled step.
3. Compose Button rather than copying Button styles. Preserve caller Button
   props, refs, slots, loading state, and `onClick`.
4. Call the consumer `onClick` first. If the click is default-prevented, do
   nothing else. Otherwise request the target through the same cancelable Root
   selection path as activating its Step.
5. Track that the change came from Previous/Next. After the effective value
   actually commits to the target, focus the active Panel. Do not focus it when:
   - Base UI event details were canceled;
   - a controlled consumer did not accept the new value;
   - the target disappeared before commit.
6. Clear pending focus intent after a canceled/rejected request so a later
   unrelated selection cannot steal focus. Direct marker/title activation must
   leave focus on the active Step.
7. Panel defaults `keepMounted` to true; caller false passes through unchanged.

**Verify**:

```sh
npx tsc -b --pretty false
npm run lint
```

Expected: both exit 0; no paging code reaches into private Base UI internals.

### Step 5: Document the complete contract in Storybook and Gallery

Create `src/components/stepper/stepper.stories.tsx` with this story order:

1. `Playground` — first export. Curated controls:
   - Root `defaultValue` and `orientation` keep their real names.
   - Step-specific story controls use `_status` and `_locked`.
   - Marker content uses `_marker` with a generic icon select containing `None`
     and at least two Phosphor icons; `None` exercises the generated number.
   - Omit `xstyle`, `style`, `className`, and layout escape hatches.
2. `Orientations` — fixed horizontal and vertical examples together, controls
   disabled. The vertical example must have enough panel content to make the
   two-column relationship obvious.
3. `States` — one clearly labeled Stepper showing completed, current,
   incomplete/inactive, invalid, and locked steps together. Controls disabled.
4. `Navigation` — a functional harness that demonstrates:
   - Previous/Next inside panels;
   - a second example with shared actions after `Content` but still inside Root;
   - an uncontrolled text field retaining its typed value after navigating away
     and back;
   - a panel with `keepMounted={false}`;
   - a cancelable navigation case used by the browser test;
   - buttons that toggle current-step disabled state and remove the current step
     so ADR 0009 behavior can be verified.

Use realistic copy, semantic sentence-case labels, existing `Stack`, `Text`,
`Separator`, `Button`, and field components, and no specimen cards/tinted wells.

Add one compact horizontal Stepper Gallery specimen, importing `Stepper` only
from `@/components`. Keep the import and specimen title alphabetical. The
Gallery specimen should have three numbered steps and one short panel; it is a
public API smoke test, not another exhaustive story.

**Verify**:

```sh
npm run build-storybook
npm run build
```

Expected: both exit 0; generated Storybook contains
`components-stepper--playground`, `--orientations`, `--states`, and
`--navigation`; the app Gallery compiles through the public export.

### Step 6: Add focused browser coverage

Create `tests/components/stepper.spec.ts`, using the Navigation, States, and
Orientations story iframe URLs. Copy the WeakMap console-error capture from the
Slider/Combobox specs.

Cover these cases with role-first locators; use component-specific data
attributes only for connector geometry that has no semantic locator:

1. **Accessible structure and state**
   - List is a tablist with an accessible name.
   - Every Step is a tab; only the active Step is selected.
   - Title is the exact accessible name; description and completed/invalid status
     are the accessible description and are not duplicated into the name.
   - Marker number/icon is absent from the accessible name.
   - Locked Step exposes disabled semantics and cannot activate.
   - `aria-current` and tab-level `aria-invalid` are absent.
   - Each active Panel is a named tabpanel controlled by its Step.
2. **Manual keyboard operation**
   - Horizontal ArrowRight/ArrowLeft moves focus without selection.
   - Enter/Space activates the focused Step.
   - Focus does not wrap at either endpoint; Home/End still reach endpoints if
     the installed Base UI Tabs supports them.
   - At width 768px and above, requested vertical reports vertical orientation
     and uses ArrowDown/ArrowUp.
   - Below 768px, the same requested vertical Stepper reports horizontal state,
     lays out as horizontal, and uses ArrowRight/ArrowLeft.
3. **Paging and focus**
   - Previous/Next target immediate neighbors, disable at endpoints/locks, and
     never skip a locked Step.
   - Accepted paging focuses the new Panel.
   - Direct Step activation leaves focus on the Step.
   - `preventDefault`/canceled Root change leaves value and focus unchanged.
4. **Panel lifecycle and domain drift**
   - Typing into a default-mounted panel survives away/back navigation.
   - A `keepMounted={false}` inactive panel is absent and resets on remount.
   - Disabling the current Step leaves its Panel selected and emits no change.
   - Removing the current Step silently shows the first registered fallback and
     emits no change until the next user action.
5. **Layout and connector**
   - Horizontal marker is above its Title; vertical marker is left of its Title.
   - Desktop vertical Content is beside List; mobile Content is below List.
   - A narrow horizontal viewport scrolls rather than wraps, and paging brings
     the active Step into view.
   - Connector begins at the first marker center, ends at the last marker center,
     and the filled/neutral boundary is within 1 CSS pixel of the active marker
     center in horizontal and vertical examples.
   - Focus rings are not clipped and the browser console has no errors.

If Home/End are not supported by the installed public Base UI Tabs behavior,
omit those two assertions; do not add a private keyboard implementation solely
for them. All other keyboard assertions are required.

**Verify**:

```sh
npx playwright test tests/components/stepper.spec.ts
```

Expected: all Stepper tests pass in Chromium; afterEach reports an empty console
error list.

### Step 7: Run full gates and live verification

Run each gate independently in this order:

```sh
npx tsc -b --pretty false
npm run lint
npm run build
npm run build-storybook
npx playwright test tests/components/stepper.spec.ts
```

Expected: every command exits 0. Do not treat one successful build as covering
another gate.

Then run `npm run storybook` and manually verify after optimization finishes:

- Playground controls update the intended Root/Step only.
- Hover, visible focus, Enter/Space, arrows, Previous/Next, locks, and
  cancellation work with no console errors.
- Horizontal and vertical connector segments meet marker centers at common and
  uneven description lengths.
- Requested vertical becomes horizontal below 48rem without a mismatch between
  visible direction and keyboard direction.
- Long horizontal steps scroll and the active step enters view.
- Light/dark and both repository themes retain readable inactive, current,
  completed, invalid, disabled, track, and fill contrast.

If live Storybook reports a transient missing story or `Invalid empty
selector`, restart once and reacquire browser references before changing valid
source, per repository guidance.

## Test plan

- New test file: `tests/components/stepper.spec.ts`.
- Structural patterns: console capture from
  `tests/components/slider.spec.ts`; story iframe navigation from all focused
  component specs.
- The new spec must cover semantics, exact accessible name/description,
  keyboard selection, responsive orientation, locked-step behavior,
  order-aware paging, focus transfer, panel mounting, dynamic-domain fallback,
  horizontal overflow, connector geometry, and console state.
- Storybook stories are intentional executable fixtures. Do not create a second
  private test-only component implementation.
- Focused verification:

  ```sh
  npm run build-storybook
  npx playwright test tests/components/stepper.spec.ts
  ```

  Expected: Storybook build exits 0 and all Stepper tests pass.

## Done criteria

All criteria must hold:

- [ ] `Stepper` and its public types export from `@/components`.
- [ ] Public parts are exactly Root, List, Step, Marker, Heading, Title,
  Description, Content, Panel, Previous, and Next; no v1 extras were added.
- [ ] Horizontal and responsive vertical layouts match the decided placement.
- [ ] Number and icon markers work without state-driven child replacement.
- [ ] Inactive/current/locked/completed/invalid states are visible and
  accessible.
- [ ] Connector track spans marker centers and fill ends at current center in
  horizontal and vertical layouts.
- [ ] Direct Step selection is manual and non-looping; paging is adjacent,
  lock-aware, cancelable, and focuses the accepted Panel.
- [ ] Panels preserve state by default and opt out with `keepMounted={false}`.
- [ ] Missing/removed values normalize silently; disabling current does not
  select another step.
- [ ] Playground is the first story and all required stories build.
- [ ] Gallery uses the public export and remains alphabetized.
- [ ] `npx tsc -b --pretty false` exits 0.
- [ ] `npm run lint` exits 0.
- [ ] `npm run build` exits 0.
- [ ] `npm run build-storybook` exits 0.
- [ ] `npx playwright test tests/components/stepper.spec.ts` exits 0 with no
  console errors.
- [ ] `git status --short` shows no out-of-scope modifications introduced by
  this plan; all pre-existing unrelated edits remain intact.
- [ ] `docs/plans/README.md` marks Plan 001 DONE, or BLOCKED with a one-line reason.

## STOP conditions

Stop and report back; do not improvise if any occurs:

- Any in-scope path has pre-existing changes when implementation begins.
- Live source no longer matches the cited Root/part style ownership, public
  export, Storybook, or test conventions.
- The implementation requires changing `tokens.stylex.ts`, shared breakpoints,
  a shared recipe, existing Tabs, WorkflowProgress, package dependencies, or any
  currently dirty out-of-scope source file.
- Base UI Tabs 1.7 public APIs cannot preserve manual selection, cancelable
  changes, disabled tabs, mounted panels, or controlled value behavior without
  importing a private/transitive internal.
- The selected tab's accessible name cannot be kept to Title while Description
  and status remain a separate accessible description with the chosen compound
  DOM. Report the browser/accessibility-tree evidence rather than flattening the
  API into props or silently dropping description semantics.
- Responsive visual orientation and Base UI keyboard/ARIA orientation cannot be
  driven by the same effective value without hydration errors.
- Connector geometry cannot meet marker centers for variable descriptions using
  the specified per-Step segment model. Report measurements before replacing it
  with a JS measurement engine or public Track API.
- A verification command fails twice after one reasonable, scoped correction.
- Storybook's transient missing-story/empty-selector problem remains after one
  clean restart and reference reacquisition.

## Maintenance notes

- The private JS `MD_MEDIA_QUERY` duplicates the value represented by
  `breakpoints.md`; update both if the repository breakpoint changes. Do not
  expose responsive orientation as a new public breakpoint prop until another
  use case proves it necessary.
- Registration order is a behavior contract for paging and generated numbers.
  Review future conditional/reordered Step changes against the DOM-order tests.
- Status is orthogonal to selection: a completed or invalid Step may also be
  current; disabled remains part of the value domain. Avoid collapsing these
  into one mutually exclusive visual state enum.
- Keep workflow validation and completion policy in consumers or opinionated
  blocks. If multiple products later need a standard validation lifecycle,
  design it separately rather than expanding this primitive opportunistically.
- Reviewers should scrutinize accessible name/description output, cancellation,
  rejected controlled changes, hidden-panel focus, responsive key mapping,
  connector endpoints, and preservation of unrelated dirty-worktree edits.
- Defer size variants and automatic status icons until real consumers establish
  stable requirements.
