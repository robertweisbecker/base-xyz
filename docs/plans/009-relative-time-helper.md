# Plan 009: Add a RelativeTime helper component

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report; do not improvise. When done, update the status row for this plan in
> `docs/plans/README.md`, unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 87251bf..HEAD -- package.json package-lock.json src/components/index.ts src/app/gallery-page.tsx src/components/relative-time CONTEXT.md docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md tests/components/relative-time.spec.ts docs/plans/009-relative-time-helper.md docs/plans/README.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding. On a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `87251bf`, 2026-09-03
- **Issue**: none (plan-only; do not open a GitHub issue unless an operator
  explicitly authorizes it)
- **Status**: TODO

## Why this matters

Product surfaces already show relative timestamps as hardcoded copy:
gallery DataTable cells (`"2m ago"`), Item descriptions (`"Last active 2 hours
ago"`), Table stories, and experiment pages. Those strings do not localize,
do not update as time passes, and are not tied to a machine-readable instant.

GitHub's [`relative-time-element`](https://github.com/github/relative-time-element)
(`@github/relative-time-element`) is a small custom element on
`Intl.DateTimeFormat` and `Intl.RelativeTimeFormat`. It auto-updates in the
browser, localizes from `lang`/`time-zone`, and keeps fallback text in light
DOM for no-JS. This repository has no time helper, no custom-element wrapper
pattern, and no public primitive for that job.

Add a product-agnostic `RelativeTime` helper under `src/components/`. Keep the
public contract compact: wrap the GitHub element, own StyleX/margin seams, and
leave typography, tooltips, and layout to existing primitives.

## Research and selected implementation

### External behavior to preserve

- Package: `@github/relative-time-element` **5.3.1** (latest 5.x at planning).
  Docs: <https://github.com/github/relative-time-element>.
- The host is the autonomous custom element `<relative-time>`, not a
  customized built-in `<time>`. Formatted text is rendered in an open Shadow
  DOM `span` with `part="root"`; light-DOM children remain the no-JS fallback
  and are not slotted into the formatted output.
- Required data: an ISO 8601 `datetime` string, or the element's `date`
  property (`Date | null`). Setting one updates the other.
- Supported formats: `'relative' | 'datetime' | 'duration'`. Deprecated
  aliases `'auto' | 'micro' | 'elapsed'` exist on the element; `'auto'` is
  the element's current default and aliases `'relative'`.
- Relative formatting uses `threshold` (default `'P30D'`) to switch to an
  absolute date prefixed by `prefix` (default `'on'`). `tense` can force
  past/future phrasing (`tense="past"` on a future instant displays `"now"`).
- `noTitle` removes the element's `title` tooltip. GitHub documents that
  `title` is inaccessible to keyboard and screen-reader users.
- React usage in upstream docs globally augments `JSX.IntrinsicElements`. This
  repository must not do that (ADR 0003).

### Methods considered

| Method                                              | Decision        | Reason                                                                                                                                                          |
| --------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thin React wrapper around the GitHub custom element | **Use**         | Matches the requested library, keeps localization/auto-update owned by a maintained element, and gives the design system one public helper.                     |
| Reimplement with `Intl.*` in React                  | Reject          | Duplicates threshold, tense, duration, and update scheduling already solved upstream.                                                                           |
| Public utility function only                        | Reject          | Callers still need a host, fallback text, and registration; it would not be a reusable UI primitive.                                                            |
| Render native `<time>` wrapping `<relative-time>`   | Reject for v1   | Doubles `datetime`, fights the library's host, and is not GitHub's production pattern. Native `<time>` can be a later follow-up if AT evidence requires it.     |
| Global `JSX.IntrinsicElements` augmentation         | Reject          | ADR 0003 forbids global JSX augmentation. Render the tag through `createElement("relative-time", …)` from the wrapper only.                                     |
| Expose deprecated `auto` / `micro` / `elapsed`      | Reject          | Upstream tells callers to migrate. Public `format` is `'relative' \| 'datetime' \| 'duration'` with default `'relative'`.                                       |
| Expose every `Intl.DateTimeFormat` field option     | Reject for v1   | `weekday` / `month` / `year` / `hourCycle` / etc. bloat a helper. Absolute formatting uses the element's defaults until a second consumer needs those knobs.    |
| Built-in `Tooltip` around the host                  | Reject          | Callers who want an accessible extra description compose `Tooltip` and pass `noTitle`.                                                                          |
| Own typography / color / tabular-nums variants      | Reject          | Helper inherits from parent `Text` / table cells. No second type scale.                                                                                         |

### Chosen ownership boundary

This is a presentation helper, not a compound and not a block. It owns:

- custom-element registration (side-effect of importing the component module);
- React `datetime: Date | string` → ISO `datetime` attribute;
- forwarding of the compact format/tense/precision/threshold/prefix/formatStyle/timeZone/noTitle contract;
- the StyleX + common-margin seam on the `<relative-time>` host;
- fallback `children` in light DOM.

It does not own localization data, update timers, tooltip content, or parent
typography. Shadow-DOM formatted text remains the GitHub element's job.

Implement and export exactly this initial surface:

```tsx
export type RelativeTimeFormat = "relative" | "datetime" | "duration";
export type RelativeTimeTense = "auto" | "past" | "future";
export type RelativeTimePrecision =
	| "year"
	| "month"
	| "day"
	| "hour"
	| "minute"
	| "second";
export type RelativeTimeFormatStyle = "long" | "short" | "narrow";

export type RelativeTimeProps = Omit<
	HTMLAttributes<RelativeTimeElement>,
	"className" | "color" | "style" | "title" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		children?: ReactNode;
		datetime: Date | string;
		format?: RelativeTimeFormat;
		formatStyle?: RelativeTimeFormatStyle;
		noTitle?: boolean;
		precision?: RelativeTimePrecision;
		prefix?: string;
		ref?: Ref<RelativeTimeElement>;
		tense?: RelativeTimeTense;
		threshold?: string;
		timeZone?: string;
	};

export function RelativeTime(props: RelativeTimeProps): ReactElement;
```

Also export the host instance type for refs:

```tsx
export type { default as RelativeTimeElement } from "@github/relative-time-element";
```

Supported composition:

```tsx
<Text color="muted" size="1">
	Updated{" "}
	<RelativeTime datetime="2026-09-03T17:55:00.000Z">
		September 3, 2026 at 17:55 UTC
	</RelativeTime>
</Text>

<Item
	label="Deploy"
	description={
		<RelativeTime datetime={finishedAt} tense="past">
			Deploy finished
		</RelativeTime>
	}
/>
```

### Required public props and defaults

| Prop          | Default in this wrapper | Notes                                                                                          |
| ------------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| `datetime`    | required                | `Date` is serialized with `toISOString()`. Invalid `Date` becomes `""`. Strings pass through.  |
| `format`      | `"relative"`            | Pass through even though the element defaults to deprecated `"auto"`.                          |
| `tense`       | omit (`"auto"`)         | Pass only when the caller sets it.                                                             |
| `precision`   | omit (`"second"`)       | Public union omits element's `week` / `millisecond` units.                                     |
| `threshold`   | omit (`"P30D"`)         | ISO 8601 duration string.                                                                      |
| `prefix`      | omit (`"on"`)           | Used when relative format crosses `threshold`.                                                 |
| `formatStyle` | omit                    | Element default depends on format.                                                             |
| `timeZone`    | omit                    | IANA name; element walks ancestors when unset.                                                 |
| `noTitle`     | omit / `false`          | Pass the boolean property only when `true`.                                                    |
| `children`    | omit                    | Light-DOM fallback. Do not synthesize fallback text.                                           |

Do not expose `date` as a second public input. Do not expose
`onRelativeTimeUpdated` in v1. Do not add `render` / `as` — the host must stay
`<relative-time>`.

Pass remaining HTML attributes (`id`, `lang`, `hidden`, …) through to the host
after `extractMarginProps`. Do not forward `title`; callers who need an
accessible description compose `Tooltip` with `noTitle`.

### Styling and layout

- Eligible normal-flow root: yes. Resolve `MarginProps` once with
  `extractMarginProps`. Compose `stylex.props(styles.root, ...marginStyles, xstyle)`
  and `mergeStyle` native `style` last.
- Component styles stay colocated in `relative-time.tsx` (same as `Code` /
  `Kbd`). Keep them minimal:

```tsx
const styles = stylex.create({
	root: {
		display: "inline",
		color: "inherit",
		font: "inherit",
		verticalAlign: "baseline",
	},
});
```

- Do not set `cursor: pointer`. Do not add chrome, badges, tabular-nums, or
  nowrap. Do not add `::part(root)` unless live review shows the shadow span
  does not inherit host `color` / `font`. If `::part` is required and StyleX
  rejects it, that is a STOP condition — do not add a global CSS rule.
- Do not add `data-component` / `data-slot`.
- Storybook title: `"Components/Relative time"`.

## Constraints (must follow)

- Read ADR 0003, ADR 0004, ADR 0011, ADR 0012, and `src/styles/README.md`
  before editing.
- `src/components/index.ts` is the public source of truth. Gallery specimens
  import `RelativeTime` from `@/components`.
- Native JSX uses the explicit `stylex.props(...)` boundary. Do not add
  lowercase intrinsic `sx`, a global `JSX.IntrinsicElements` merge, a
  transform shim, or a `@ts-expect-error` on the host.
- Register the custom element only by importing
  `@github/relative-time-element` from the component module. Do not register
  it from `main.tsx`, Storybook preview, or a global CSS/JS entry.
- Pin `@github/relative-time-element@5.3.1` unless a newer **5.x** release
  still matches the attribute surface below. Do not install v6 in this plan.
- Do not add theme tokens, global selectors, shared recipes, or Intl
  polyfills. Target browsers already match the element's support matrix
  (Chromium in Playwright; modern Safari/Firefox/Chrome).
- Do not retrofit hardcoded `"… ago"` showcase copy in Item, Table,
  DataTable, or experiment pages.
- Do not create or close a GitHub issue unless an operator explicitly asks.

## In scope / out of scope

**In scope** (only these files should appear in the implementation diff):

- `package.json`
- `package-lock.json`
- `src/components/relative-time/relative-time.tsx`
- `src/components/relative-time/relative-time.stories.tsx`
- `src/components/index.ts`
- `src/app/gallery-page.tsx`
- `CONTEXT.md`
- `docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md`
- `tests/components/relative-time.spec.ts`
- `docs/plans/009-relative-time-helper.md`
- `docs/plans/README.md`

**Out of scope** (do not touch, even if related):

- Native `<time>` semantics, a `formatRelativeTime` utility, or a duration
  formatter exported from `src/utils/`.
- `Tooltip` integration, `InfoTip`, or replacing the element's `title`.
- `Intl.DateTimeFormat` field options (`weekday`, `month`, `year`, `hour`,
  `minute`, `second`, `timeZoneName`, `hourCycle`).
- Deprecated element formats `auto`, `micro`, `elapsed`.
- Replacing hardcoded relative timestamps in existing stories, blocks, or
  gallery DataTable rows.
- Theme tokens, global CSS, `src/styles/README.md` recipe tables, README
  component inventory, or a new ADR.
- `List`, `Table`, `DataTable`, `Item`, `Text`, or layout-primitive public APIs.
- Plan 008's pnpm migration files beyond sharing `package.json` /
  `package-lock.json` (reconcile; do not convert the repo to pnpm here).

## Current state

### No time helper exists

`rg -n "relative-time|RelativeTime|formatDistance" src tests` at `87251bf`
returns no matches. `src/components/index.ts` has no time export. Showcase
copy uses frozen strings, for example
`src/app/gallery-page.tsx:110-111` (`"2m ago"` / `"18m ago"`) and
`src/components/item/item.stories.tsx:175` (`"Last active 2 hours ago"`).

### Public export and gallery insertion points

`src/components/index.ts:140-147` currently goes from Radio to ScrollArea:

```tsx
export {
	Radio,
	RadioGroup,
	type RadioGroupProps,
	type RadioProps,
	type RadioSize,
} from "./radio/radio";
export { ScrollArea, type ScrollAreaProps } from "./scroll-area/scroll-area";
```

`src/app/gallery-page.tsx:25-79` imports public components alphabetically and
omits `RelativeTime`. Specimens at `:538-548` go from `"RadioGroup"` to
`"ScrollArea"`.

### Style and margin exemplars

`src/components/code/code.tsx` is the inline helper exemplar: colocated
StyleX, `extractMarginProps`, `attrJoin` + `mergeStyle`, no `render` prop, no
folder-level public API (the public export points at `./code/code`). Copy that
ownership, not Code's mono chrome.

`src/components/visually-hidden/visually-hidden.tsx` is the other helper, but
it uses `useRender` and is **not** margin-eligible (ADR 0011). Do not copy
`useRender`; `RelativeTime` cannot change tag.

ADR 0011 table row for inline hosts (`:77`) lists `Code`, `Kbd`, `Link`,
`Loader`, and similar. It does not yet name `RelativeTime`.

### Custom-element typing

`tsconfig.app.json` uses `"jsx": "react-jsx"` with no `IntrinsicElements`
augmentation anywhere in `src`. `@types/react`'s `createElement(type: string, props)`
accepts a tag name string. Unknown property names on that props object may
need a narrow assertion to a host-props type local to the module — not a
global JSX merge and not a line suppression comment.

### Dependency boundary

`package.json:30-44` has no `@github/*` packages. Plan 008 also edits
`package.json` / `package-lock.json`. If Plan 008 is IN PROGRESS, stop rather
than fighting the lockfile. npm remains the installer for this plan
(`npm install @github/relative-time-element@5.3.1`).

### Test harness

`tests/playwright.ts` auto-collects console errors and page errors.
`tests/components/list.spec.ts` is the Storybook iframe + `data-testid`
pattern. Playwright 1.62 is available; this plan does **not** freeze
`page.clock`, because Examples uses live offsets so Storybook stays honest.

## Git workflow

- Start from the operator's intended checkout after running the drift check.
- Suggested branch: `codex/009-relative-time`.
- Use one logical commit after all gates pass. Match recent history with a
  message such as `[codex] Add RelativeTime helper component`.
- Do not push, open a PR, or merge unless the operator explicitly requests it.
- Plans 003, 004, 005, and 008 also touch `src/components/index.ts`,
  `src/app/gallery-page.tsx`, `package.json`, and `docs/plans/README.md`. If
  any of those land or are executing concurrently, rebase/reconcile those
  files and preserve every component and plan row; do not overwrite another
  plan's work.

## Steps

### Step 1: Add the dependency

From the repository root:

```bash
npm install @github/relative-time-element@5.3.1
```

Confirm `package.json` lists `"@github/relative-time-element": "^5.3.1"`
under `dependencies` (not `devDependencies`). Confirm `package-lock.json`
records that exact version.

**Verify**: `node -e "import('@github/relative-time-element').then(m => console.log(typeof m.default, m.default.name))"`
-> prints `function RelativeTimeElement`.

### Step 2: Implement the helper

Create `src/components/relative-time/relative-time.tsx`. Do not add a second
folder barrel; the public export will point at this file.

Implementation requirements:

1. Import the package for registration and the instance type as two statements
   (`verbatimModuleSyntax` plus `noUnusedLocals` forbid a value import used
   only as a type):

```tsx
import { createElement, type HTMLAttributes, type ReactElement, type ReactNode, type Ref } from "react";
import * as stylex from "@stylexjs/stylex";
import "@github/relative-time-element";
import type RelativeTimeElement from "@github/relative-time-element";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { attrJoin } from "@/utils/attr-join";

export type { default as RelativeTimeElement } from "@github/relative-time-element";
```

   The side-effect import must be the defining module (package root /
   `./define`) so `customElements.define("relative-time", …)` runs when any
   consumer imports `RelativeTime`. Do not import
   `@github/relative-time-element/relative-time` without `/define` — that
   module does not register the tag.

2. Add the public unions and `RelativeTimeProps` exactly as specified above.
   `HTMLAttributes<RelativeTimeElement>` is the rest-attribute baseline; omit
   `className`, `color`, `style`, `title`, and `MarginProps` keys so those
   cannot collide with the helper contract.

3. Serialize `datetime` locally; do not export the helper:

```tsx
function serializeDatetime(value: Date | string): string {
	if (typeof value === "string") return value;
	if (Number.isNaN(value.getTime())) return "";
	return value.toISOString();
}
```

4. Render with `createElement("relative-time", hostProps)` so TypeScript never
   needs a global custom-element declaration. Build `hostProps` as a local
   typed object (not an `any` cast of the whole call):

```tsx
type RelativeTimeHostProps = {
	ref?: RelativeTimeProps["ref"];
	className?: string;
	style?: RelativeTimeProps["style"];
	datetime: string;
	format?: RelativeTimeFormat;
	formatStyle?: RelativeTimeFormatStyle;
	noTitle?: boolean;
	precision?: RelativeTimePrecision;
	prefix?: string;
	tense?: RelativeTimeTense;
	threshold?: string;
	timeZone?: string;
	children?: ReactNode;
} & Record<string, unknown>;

export function RelativeTime({
	ref,
	className,
	style,
	xstyle,
	children,
	datetime,
	format = "relative",
	formatStyle,
	noTitle = false,
	precision,
	prefix,
	tense,
	threshold,
	timeZone,
	...props
}: RelativeTimeProps): ReactElement {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(styles.root, ...marginStyles, xstyle);
	const hostProps: RelativeTimeHostProps = {
		...rest,
		ref,
		datetime: serializeDatetime(datetime),
		format,
		className: attrJoin(sx.className, className),
		style: mergeStyle(sx.style, style),
		children,
	};
	if (formatStyle !== undefined) hostProps.formatStyle = formatStyle;
	if (noTitle) hostProps.noTitle = true;
	if (precision !== undefined) hostProps.precision = precision;
	if (prefix !== undefined) hostProps.prefix = prefix;
	if (tense !== undefined) hostProps.tense = tense;
	if (threshold !== undefined) hostProps.threshold = threshold;
	if (timeZone !== undefined) hostProps.timeZone = timeZone;

	return createElement("relative-time", hostProps);
}
```

   React 19 sets matching custom-element **properties** (`formatStyle`,
   `noTitle`, `timeZone`, …) after upgrade. Do not kebab-case those names
   yourself. Do not pass `false` / `undefined` `noTitle` as an attribute.

5. Colocate the minimal `styles.root` map specified above. Do not put styles
   in a sibling `.stylex.ts` file.

6. Do not pass `datetime`, `format`, `formatStyle`, `noTitle`, `precision`,
   `prefix`, `tense`, `threshold`, or `timeZone` through `rest` after
   destructuring — the explicit host fields are the only copies.

**Verify**: `npm run typecheck` -> exit 0 with no TypeScript errors in the new
module.

### Step 3: Publish the component and record its ownership

Update `src/components/index.ts` to export `RelativeTime` and the public types
between the Radio block and `ScrollArea`:

```tsx
export {
	Radio,
	RadioGroup,
	type RadioGroupProps,
	type RadioProps,
	type RadioSize,
} from "./radio/radio";
export {
	RelativeTime,
	type RelativeTimeElement,
	type RelativeTimeFormat,
	type RelativeTimeFormatStyle,
	type RelativeTimePrecision,
	type RelativeTimeProps,
	type RelativeTimeTense,
} from "./relative-time/relative-time";
export { ScrollArea, type ScrollAreaProps } from "./scroll-area/scroll-area";
```

Do not add a `./relative-time` folder barrel as a second public path.

In ADR 0011's inline-host row (the row that already lists `Code`, `Kbd`,
`Link`, `Loader`, …), add `` `RelativeTime` `` in alphabetical order among
those names (`…, `Radio`, `RelativeTime`, `Separator`, `Switch`` — keep the
row's existing members; only insert `RelativeTime` where it belongs
alphabetically in that cell). Do not add a new table row.

Add one `CONTEXT.md` glossary bullet after the math-expression-field bullet:

```markdown
- **Relative time** — Inline helper that localizes a timestamp as relative,
  absolute, or duration text. The public host is GitHub's `<relative-time>`
  custom element; formatted text lives in that element's shadow tree, and
  `children` are the no-JS fallback. Typography is inherited. Accessible extra
  description is caller-owned (`noTitle` plus `Tooltip` when needed).
```

**Verify**: `npm run typecheck && npm run lint` -> both commands exit 0.

### Step 4: Document the public contract in Storybook and the gallery

Create `src/components/relative-time/relative-time.stories.tsx` with
`title: "Components/Relative time"` and `component: RelativeTime`.

Stories:

1. `Playground` is the first export. Controls include `datetime`, `format`,
   `tense`, `precision`, `formatStyle`, `threshold`, `prefix`, `noTitle`,
   `timeZone`, and `children`. Omit `className`, native `style`, `xstyle`, and
   margin controls. Use a date control for `datetime` (Storybook may supply a
   `Date`; the component accepts that). Default args: a recent past ISO
   string, `format: "relative"`, `children` as a human fallback such as
   `"September 3, 2026"`. Put `data-testid="relative-time-playground"` on the
   host.

2. `Examples` is one long, unlabeled-chrome story with sentence-case muted
   `Text` size `"1"` labels and `Separator` between sections. Disable
   controls. Use **offsets from `Date.now()`** so live Storybook keeps reading
   as relative; do not freeze historical ISO instants that will rot into
   absolute dates. Sections and test ids:

   - Relative past — `data-testid="relative-time-past"` with
     `datetime={new Date(Date.now() - 5 * 60 * 1000)}` and fallback children.
   - Relative future — `data-testid="relative-time-future"` with a datetime
     three hours ahead.
   - Datetime format — `data-testid="relative-time-datetime"` with
     `format="datetime"`.
   - Duration format — `data-testid="relative-time-duration"` with
     `format="duration"` and a datetime a few hours ahead.
   - Forced past tense — `data-testid="relative-time-tense-past"` with a
     **future** datetime and `tense="past"` (documented `"now"` behavior).
   - Minute precision — `data-testid="relative-time-precision"` with
     `precision="minute"` and a datetime a few seconds ago.
   - Beyond threshold — `data-testid="relative-time-threshold"` with
     `threshold="P0S"` so the relative format shows an absolute date with the
     default `on` prefix.
   - Inside `Text` — muted supporting copy composing the helper.
   - Inside `Item` description — `data-testid="relative-time-item"`.
   - `noTitle` — `data-testid="relative-time-no-title"` with `noTitle`.
   - Margin seam — `data-testid="relative-time-margin"` with `m={2}` so the
     browser spec can assert named margin props are not leaked as attributes.
     Keep this fixture in Examples; do not expose margin controls on
     Playground.

   Do not wrap sections in decorative wells or specimen cards.

Add a gallery specimen titled `"RelativeTime"` between `"RadioGroup"` and
`"ScrollArea"`. Import `RelativeTime` from `@/components` (add it to the
existing alphabetical import list). Keep the specimen small:

```tsx
{
	title: "RelativeTime",
	content: (
		<Text color="muted" size="2">
			Updated{" "}
			<RelativeTime datetime={new Date(Date.now() - 2 * 60 * 1000)}>
				a few minutes ago
			</RelativeTime>
		</Text>
	),
},
```

**Verify**: `npm run build-storybook` -> exit 0, and the output includes
`components-relative-time` stories.

### Step 5: Add focused browser coverage

Create `tests/components/relative-time.spec.ts`, using the console-error
guard from `tests/playwright.ts` (already auto). Target the Examples and
Playground iframe URLs:

- `/iframe.html?id=components-relative-time--examples&viewMode=story`
- `/iframe.html?id=components-relative-time--playground&viewMode=story`

Cover these durable contracts only:

1. `window.customElements.get("relative-time")` is defined after the Examples
   story loads.
2. Each named fixture renders a host whose `tagName` is `"RELATIVE-TIME"` and
   whose `datetime` attribute is a non-empty string. For the past fixture,
   `new Date(datetime).getTime()` is less than `Date.now()`. For the future
   fixture, it is greater.
3. `relative-time-datetime` has `format="datetime"`;
   `relative-time-duration` has `format="duration"`;
   `relative-time-tense-past` has `tense="past"`;
   `relative-time-precision` has `precision="minute"`;
   `relative-time-threshold` has `threshold="P0S"`.
4. Visible text on `relative-time-past`, `relative-time-future`,
   `relative-time-datetime`, and `relative-time-duration` is non-empty (shadow
   formatted text). Do **not** assert exact `"5 minutes ago"` copy, locale
   strings, or colors.
5. `relative-time-tense-past` visible text matches `/now/i` (GitHub's
   documented forced-past mechanic).
6. `relative-time-no-title` has no `title` attribute.
7. `relative-time-margin` does not leak `m`, `mx`, `my`, `mt`, `mb`, `ms`, or
   `me` as attributes. Do not add margin controls to Playground. Do not
   assert computed margin pixels or `xstyle` / `style` precedence in this
   spec.
8. No browser console errors.

Build Storybook before the focused run.

**Verify**:
`npm run build-storybook && npx playwright test tests/components/relative-time.spec.ts --workers=1`
-> all focused tests pass and the console-error collector is empty.

### Step 6: Run the repository gates and perform live review

Run `npm run verify:quick`, then `npm run doctor` and vet any new
diagnostics against this helper (preserve the `only-export-components` waiver;
the type re-export is allowed). Then run `npm run verify:full`. If another
checkout owns the default preview port, rerun the affected Playwright command
with an unused `PLAYWRIGHT_STORYBOOK_PORT` or `PLAYWRIGHT_APP_PORT`; do not
terminate or reuse another checkout's server.

After optimized Storybook finishes, inspect the live stories in Chromium:

- confirm the host is `<relative-time>` and `datetime` is ISO;
- confirm past/future/datetime/duration/tense/precision/threshold examples;
- confirm the helper inherits `Text` color and size in the composition
  section;
- confirm the default `title` tooltip appears when `noTitle` is unset, and
  does not appear on the `noTitle` example;
- switch Storybook theme controls and confirm inherited text remains
  legible;
- confirm no browser console errors.

Also start a clean Storybook development server and load Relative time once
to confirm the custom element upgrades in the StyleX dev transform (not only
the production build). If port 6006 belongs to another checkout, launch
Storybook on an unused port.

Finally, inspect `git diff --check` and `git status --short`. Update this
plan's status row only after all required gates pass.

**Verify**: `npm run verify:full && git diff --check` -> both exit 0;
`git status --short` lists only the files permitted by this plan plus any
pre-existing operator-owned changes.

## Test plan

- New file: `tests/components/relative-time.spec.ts`.
- Structural pattern: `tests/components/list.spec.ts` for Storybook iframe
  fixtures and native tag assertions; `tests/playwright.ts` for console
  capture.
- Required cases: custom element defined; host tag and `datetime` attribute;
  format/tense/precision/threshold forwarding; non-empty visible text; forced
  `tense="past"` displays `/now/i`; `noTitle` omits `title`; margin props do
  not leak; empty console-error collector.
- Manual Storybook review remains the visual gate for inheritance, theme
  contrast, and the inaccessible default `title`. Do not add screenshots or
  exact color/spacing/copy assertions.

## Done criteria

- [ ] Public `RelativeTime` is a single helper (no compound namespace) exported
      from `src/components/index.ts` with the types listed in this plan.
- [ ] Importing the component registers `<relative-time>` via
      `@github/relative-time-element@5.3.1` (or a compatible 5.x pin).
- [ ] The rendered host is `<relative-time>`; there is no global JSX
      augmentation and no `render` / `as` escape hatch.
- [ ] Public `format` is `'relative' | 'datetime' | 'duration'` and defaults to
      `'relative'`. Deprecated `auto` / `micro` / `elapsed` are not part of the
      public union.
- [ ] `datetime` accepts `Date | string`; `Date` values serialize with
      `toISOString()`.
- [ ] Only the helper host accepts common margins; component defaults, margins,
      `xstyle`, and native `style` follow repository precedence without DOM
      prop leakage.
- [ ] The helper has no typography/color variant API and inherits from its
      parent.
- [ ] Storybook `Playground` is first, `Examples` covers the listed states, and
      the gallery specimen is alphabetical and uses the public export.
- [ ] ADR 0011 names `RelativeTime` on the inline-host margin row; `CONTEXT.md`
      records the helper; README gains no component inventory.
- [ ] Hardcoded `"… ago"` copy elsewhere is unchanged.
- [ ] The focused browser spec passes with no console errors.
- [ ] `npm run verify:quick`, `npm run verify:full`, and `git diff --check`
      all exit 0.
- [ ] `docs/plans/README.md` status row is updated when implementation is
      complete.

## STOP conditions

Stop and report back; do not improvise if:

- Any current-state excerpt or in-scope file has materially drifted from
  commit `87251bf`, including a concurrent RelativeTime or time-utility
  implementation.
- `@github/relative-time-element@5.3.1` cannot be installed, or the installed
  5.x API no longer exposes `datetime`, `format`, `tense`, `precision`,
  `threshold`, `prefix`, `formatStyle`, `timeZone`, or `noTitle` as
  properties on `RelativeTimeElement`.
- A newer 5.x (or any 6.x) release would be required to make the element
  work, and it changes the tag name, removes relative/datetime/duration, or
  drops Shadow DOM fallback behavior.
- TypeScript cannot type `createElement("relative-time", hostProps)` without
  a global `JSX.IntrinsicElements` merge or a file-level `@ts-expect-error` /
  `any` on the component. A narrow local host-props type is allowed; a
  suppression comment or global augmentation is not.
- The StyleX compiler cannot apply `className` / `style` to the custom
  element, or inherited `color` / `font` fail in live Storybook and `::part(root)`
  cannot be expressed through `stylex.create` + `stylex.props`. Do not add
  global CSS, JSX `sx`, or a runtime style engine.
- React 19 does not set camelCase custom-element properties (`formatStyle`,
  `noTitle`, `timeZone`) after upgrade, and attribute kebab-casing would be
  required as a second mapping layer — stop for review rather than silently
  adding an attribute-name table.
- Plan 008 is IN PROGRESS and owns `package.json` / `package-lock.json`.
- Plan 003, 004, 005, or another concurrent task changed a shared
  export/gallery/index file and cannot be cleanly reconciled without
  discarding any task.
- Correct behavior appears to require wrapping `<time>`, a public utility,
  Intl polyfills, new tokens, or Tooltip ownership.
- A required verification command fails twice after one focused correction.
- The implementation would need to modify a file listed as out of scope.

## Maintenance notes

- If a second consumer needs `weekday` / `month` / `year` (or other
  `Intl.DateTimeFormat` fields), add those as explicit optional props on
  `RelativeTime` rather than a nested options object or a parallel formatter.
- If AT testing shows the custom element is not a sufficient time semantic,
  consider a follow-up that keeps this helper's public props and changes only
  the host to `<time>` plus the GitHub element, with evidence. Do not do that
  speculatively.
- Future custom-element wrappers should copy this pattern: React helper,
  `createElement` host, side-effect registration from the component module,
  no global JSX augmentation, compact forwarded contract.
- Callers must keep supplying fallback `children` when no-JS or pre-upgrade
  text matters. The helper does not invent a locale-independent fallback.
- Reviewers should scrutinize ISO serialization, property forwarding (not
  kebab-attribute duplication), margin stripping, inheritance, `noTitle`, and
  absence of typography/tooltip scope creep.
