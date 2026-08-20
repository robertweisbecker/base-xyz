# Theme Props Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the overengineered parts of the theme-prop layout layer — static variant maps instead of dynamic styles for closed keyword values, no positioning props on `Stack`/`Grid`, a trimmed CSS-unit union, and deduplicated capability types — without changing any rendered output except the removal of runtime inline style variables.

**Architecture:** The theme-prop system (ADR 0001) stays: capability definitions in `src/theme/theme-props.ts`, value types in `src/theme/theme-props.types.ts`, StyleX compilers split across `theme-props-spacing.stylex.ts` / `theme-props-layout.stylex.ts` / `theme-props-surface.stylex.ts`, consumed by `Box`/`Stack`/`Grid` in `src/components/layout/layout.tsx`. Only the layout compiler internals, the layout primitives' composed contracts, and shared types change. Dynamic StyleX functions remain only for genuinely unbounded values (dimensions, numbers, spans); every closed keyword value compiles through a predeclared static style.

**Tech Stack:** React 19, StyleX (`stylex.create` static namespaces + dynamic functions), TypeScript 6, Storybook 10, Playwright.

## Global Constraints

- Read `.agents/resources/stylex-authoring.md`, `docs/adr/0003-stylex-ownership-and-application.md`, and `src/styles/README.md` before authoring StyleX (repository rule).
- Tokens are stable API: do not remove tokens or replace token usages with literals.
- Rendered CSS must be identical before and after for every existing prop value. The only observable change: closed keyword props no longer emit inline `style` custom properties, and `Stack`/`Grid` no longer accept positioning props (compile-time only; runtime DOM filtering of those keys is unchanged because `extractThemeProps` deletes all `knownThemePropKeys` from rest props regardless of the component's contract — see `src/theme/theme-props.ts:161`).
- The bundle boundary must hold: `node tests/theme-props/bundle-boundary.mjs` exits 0 (importing `marginThemeProps` must not pull in `gridTemplateColumns`, `insetInlineStart`, or `boxShadow` code).
- Indent with tabs. Commit messages are short imperative sentence case (e.g. `Align StyleX authoring standards`).
- Validation commands (run independently): `npm run build`, `npm run lint`, `npm run build-storybook`, focused Playwright specs. There is no `typecheck` script; `npm run build` runs `tsc -b`.
- `tsconfig.app.json` sets `erasableSyntaxOnly` and `noUnusedLocals`: remove imports that become unused, no enums or parameter properties.
- Several working-tree files are mid-flight from other tasks. Report unrelated failures instead of modifying concurrent work.

## Design decisions

- Static variant maps use camelCase namespace keys plus an explicit public-value-to-style lookup record (`satisfies Record<PublicValue, StyleXStyles>`) whenever a public value is not a valid identifier (`inline-flex`, `space-between`, `wrap-reverse`, `row dense`). Identifier-safe value sets (`position`, `align`, `alignSelf`, `justifySelf`, grid `justify`) index the created namespace directly. This mirrors the existing `colorValues`/`radiusValues` lookup pattern in `src/theme/theme-props-surface.stylex.ts`.
- Kept dynamic (genuinely unbounded or numeric): `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, the four insets, `zIndex`, `flexBasis`, `flexGrow`, `flexShrink`, `order`, `gridColumn`/`gridRow` span strings, and `gridTemplateColumns`.
- `Stack` and `Grid` drop `positioningThemeProps` only. They keep child-layout props (`alignSelf`, `flexGrow`, …) because those apply to the element as a child of its parent. `Box` keeps everything; positioned composition uses `Box` or the `style` escape hatch.
- `CssLengthUnit` shrinks to `px | rem | em | ch | vw | vh | dvw | dvh`. Percentages, the function forms (`calc(...)`, `var(...)`, …), keywords, and container sizes are unchanged. Anything more exotic goes through the `style` prop.
- The `appendStyle` helper is removed; compile functions use plain `if (x !== undefined) styles.push(...)`.
- ADR 0001 gets an Amendments section (per `AGENTS.md`: update the existing ADR when clarifying the same decision; do not rewrite its historical text).

---

### Task 1: Deduplicate shared capability types

**Files:**
- Modify: `src/theme/theme-props.types.ts` (append three exported types)
- Modify: `src/theme/theme-props.ts:30-32` (delete local types, import instead)
- Modify: `src/theme/theme-props-surface.stylex.ts:18` (delete local type, import instead)
- Modify: `src/theme/theme-props-layout.stylex.ts:26-27` (delete local types, import instead)

**Interfaces:**
- Consumes: existing `FlexProps`, `GapProps`, `GridLayoutProps`, `SurfaceThemeProps` from `src/theme/theme-props.types.ts`.
- Produces: exported `FlexLayoutProps`, `GridCompositionProps`, `SurfaceColorProps` from `@/theme/theme-props.types` (exact shapes below). Task 2's rewrite of the layout compiler imports `FlexLayoutProps` and `GridCompositionProps` from there.

- [ ] **Step 1: Export the shared types from the types module**

In `src/theme/theme-props.types.ts`, append after the `GridLayoutProps` declaration at the end of the file:

```ts
/** Flex composition props excluding gaps, which compile in the spacing module. */
export type FlexLayoutProps = Omit<FlexProps, keyof GapProps>;

/** Grid composition props excluding gaps, which compile in the spacing module. */
export type GridCompositionProps = Omit<GridLayoutProps, keyof GapProps>;

/** The shared semantic color capability exposed only by layout primitives. */
export type SurfaceColorProps = Pick<SurfaceThemeProps, "color" | "bg">;
```

- [ ] **Step 2: Replace the local copies with imports**

In `src/theme/theme-props.ts`, delete these three lines:

```ts
type FlexLayoutProps = Omit<FlexProps, keyof GapProps>;
type GridCompositionProps = Omit<GridLayoutProps, keyof GapProps>;
type SurfaceColorProps = Pick<SurfaceThemeProps, "color" | "bg">;
```

and update its type-import block to (note: `FlexProps`, `GridLayoutProps`, and `SurfaceThemeProps` become unused and must be removed because `noUnusedLocals` is on; `GapProps` is still used by `themePropKeys.gap`):

```ts
import type {
	ChildLayoutProps,
	DisplayProps,
	FlexLayoutProps,
	GapProps,
	GridCompositionProps,
	MarginProps,
	PaddingProps,
	PositioningProps,
	RadiusThemeProps,
	ShadowThemeProps,
	SizingProps,
	SurfaceColorProps,
	TextAlignProps,
} from "./theme-props.types";
```

In `src/theme/theme-props-surface.stylex.ts`, delete `type SurfaceColorProps = Pick<SurfaceThemeProps, "color" | "bg">;` and update its type-import block to:

```ts
import type {
	RadiusThemeProps,
	RadiusValue,
	SemanticColor,
	ShadowThemeProps,
	ShadowValue,
	SurfaceColorProps,
} from "./theme-props.types";
```

In `src/theme/theme-props-layout.stylex.ts`, delete these two lines:

```ts
type FlexLayoutProps = Omit<FlexProps, keyof GapProps>;
type GridCompositionProps = Omit<GridLayoutProps, keyof GapProps>;
```

and in its type-import block replace `FlexProps`, `GapProps`, and `GridLayoutProps` with `FlexLayoutProps` and `GridCompositionProps` (the other imported names stay; `GapProps` was only used by the two deleted `Omit` expressions, so it must go too under `noUnusedLocals`). Final layout import block:

```ts
import type {
	ChildLayoutProps,
	ContainerSize,
	DisplayProps,
	FlexLayoutProps,
	GridCompositionProps,
	GridSpan,
	MaxDimensionValue,
	Orientation,
	PositioningProps,
	SizingProps,
	WidthFraction,
	WidthValue,
} from "./theme-props.types";
```

- [ ] **Step 3: Verify with build and lint**

Run: `npm run build` then `npm run lint`
Expected: both pass. This is a pure type-level move; any error means an import list is wrong.

- [ ] **Step 4: Commit**

```bash
git add src/theme/theme-props.types.ts src/theme/theme-props.ts src/theme/theme-props-surface.stylex.ts src/theme/theme-props-layout.stylex.ts
git commit -m "Deduplicate shared theme prop capability types"
```

---

### Task 2: Static variant maps for closed layout keywords

**Files:**
- Modify: `src/foundations/theme-props.verification.stories.tsx` (add one fixture element)
- Modify: `tests/theme-props/browser.spec.ts` (add one test)
- Rewrite: `src/theme/theme-props-layout.stylex.ts` (full contents below)

**Interfaces:**
- Consumes: `FlexLayoutProps`, `GridCompositionProps` from `@/theme/theme-props.types` (Task 1); everything else already exists.
- Produces: the same public exports as before with identical signatures — `displayThemeProps`, `sizingThemeProps`, `positioningThemeProps`, `childLayoutThemeProps`, and the composed `verticalFlexThemeProps`, `horizontalFlexThemeProps`, `gridLayoutThemeProps`. The uncomposed flex/grid definitions stay module-private. No consumer changes.

- [ ] **Step 1: Add the failing fixture and test**

In `src/foundations/theme-props.verification.stories.tsx`, insert this element directly after the closing tag of the `<Stack data-testid="horizontal-stack" ...>` element (line 49):

```tsx
			<Stack
				data-testid="static-flex"
				align="center"
				justify="space-between"
				orientation="horizontal"
				wrap="wrap">
				<span>First</span>
				<span>Second</span>
			</Stack>
```

In `tests/theme-props/browser.spec.ts`, append this test at the end of the file. The final assertion is the point: dynamic StyleX functions inject inline `style` custom properties, static variants do not, and `useLayoutRender` passes `style: sx.style` which is `undefined` when no dynamic styles are active, so React omits the attribute entirely.

```ts
test("closed flex keywords compile to static classes without inline style variables", async ({ page }) => {
	await openFixture(page);
	const staticFlex = page.getByTestId("static-flex");
	await expect(staticFlex).toHaveCSS("flex-direction", "row");
	await expect(staticFlex).toHaveCSS("align-items", "center");
	await expect(staticFlex).toHaveCSS("justify-content", "space-between");
	await expect(staticFlex).toHaveCSS("flex-wrap", "wrap");
	expect(await staticFlex.getAttribute("style")).toBeNull();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run build-storybook && npx playwright test tests/theme-props/browser.spec.ts`
Expected: the new test FAILS on the final `toBeNull()` assertion (the current dynamic compiler puts CSS custom properties in the `style` attribute). All pre-existing tests PASS.

- [ ] **Step 3: Rewrite the layout compiler**

Replace the entire contents of `src/theme/theme-props-layout.stylex.ts` with:

```ts
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	composeThemeProps,
	createThemePropDefinition,
	themePropKeys,
} from "./theme-props";
import { gapThemeProps, resolveSpaceValue } from "./theme-props-spacing.stylex";
import type {
	ChildLayoutProps,
	ContainerSize,
	DisplayProps,
	DisplayValue,
	FlexLayoutProps,
	GridCompositionProps,
	GridFlow,
	GridSpan,
	JustifyValue,
	MaxDimensionValue,
	Orientation,
	PositioningProps,
	SizingProps,
	WidthFraction,
	WidthValue,
	WrapValue,
} from "./theme-props.types";
import { tokens } from "@/theme/tokens.stylex";

/** Dynamic declarations are reserved for genuinely unbounded values. */
const scalarStyles = stylex.create({
	width: (value) => ({ width: value }),
	height: (value) => ({ height: value }),
	minWidth: (value) => ({ minWidth: value }),
	maxWidth: (value) => ({ maxWidth: value }),
	minHeight: (value) => ({ minHeight: value }),
	maxHeight: (value) => ({ maxHeight: value }),
	insetBlockStart: (value) => ({ top: value }),
	insetBlockEnd: (value) => ({ bottom: value }),
	insetInlineStart: (value) => ({ insetInlineStart: value }),
	insetInlineEnd: (value) => ({ insetInlineEnd: value }),
	zIndex: (value) => ({ zIndex: value }),
	flexBasis: (value) => ({ flexBasis: value }),
	flexGrow: (value) => ({ flexGrow: value }),
	flexShrink: (value) => ({ flexShrink: value }),
	order: (value) => ({ order: value }),
	gridColumn: (value) => ({ gridColumn: value }),
	gridRow: (value) => ({ gridRow: value }),
	gridTemplateColumns: (value) => ({ gridTemplateColumns: value }),
});

const displayStyles = stylex.create({
	none: { display: "none" },
	block: { display: "block" },
	inline: { display: "inline" },
	inlineBlock: { display: "inline-block" },
	contents: { display: "contents" },
	flex: { display: "flex" },
	inlineFlex: { display: "inline-flex" },
	grid: { display: "grid" },
	inlineGrid: { display: "inline-grid" },
});

const displayVariants = {
	none: displayStyles.none,
	block: displayStyles.block,
	inline: displayStyles.inline,
	"inline-block": displayStyles.inlineBlock,
	contents: displayStyles.contents,
	flex: displayStyles.flex,
	"inline-flex": displayStyles.inlineFlex,
	grid: displayStyles.grid,
	"inline-grid": displayStyles.inlineGrid,
} satisfies Record<DisplayValue, StyleXStyles>;

const positionStyles = stylex.create({
	static: { position: "static" },
	relative: { position: "relative" },
	absolute: { position: "absolute" },
	fixed: { position: "fixed" },
	sticky: { position: "sticky" },
});

const flexDirectionStyles = stylex.create({
	row: { flexDirection: "row" },
	column: { flexDirection: "column" },
	rowReverse: { flexDirection: "row-reverse" },
	columnReverse: { flexDirection: "column-reverse" },
});

const alignItemsStyles = stylex.create({
	start: { alignItems: "start" },
	center: { alignItems: "center" },
	end: { alignItems: "end" },
	stretch: { alignItems: "stretch" },
	baseline: { alignItems: "baseline" },
});

const justifyContentStyles = stylex.create({
	start: { justifyContent: "start" },
	center: { justifyContent: "center" },
	end: { justifyContent: "end" },
	stretch: { justifyContent: "stretch" },
	spaceBetween: { justifyContent: "space-between" },
	spaceAround: { justifyContent: "space-around" },
	spaceEvenly: { justifyContent: "space-evenly" },
});

const justifyContentVariants = {
	start: justifyContentStyles.start,
	center: justifyContentStyles.center,
	end: justifyContentStyles.end,
	stretch: justifyContentStyles.stretch,
	"space-between": justifyContentStyles.spaceBetween,
	"space-around": justifyContentStyles.spaceAround,
	"space-evenly": justifyContentStyles.spaceEvenly,
} satisfies Record<JustifyValue, StyleXStyles>;

const flexWrapStyles = stylex.create({
	nowrap: { flexWrap: "nowrap" },
	wrap: { flexWrap: "wrap" },
	wrapReverse: { flexWrap: "wrap-reverse" },
});

const flexWrapVariants = {
	nowrap: flexWrapStyles.nowrap,
	wrap: flexWrapStyles.wrap,
	"wrap-reverse": flexWrapStyles.wrapReverse,
} satisfies Record<WrapValue, StyleXStyles>;

const alignSelfStyles = stylex.create({
	auto: { alignSelf: "auto" },
	start: { alignSelf: "start" },
	center: { alignSelf: "center" },
	end: { alignSelf: "end" },
	stretch: { alignSelf: "stretch" },
	baseline: { alignSelf: "baseline" },
});

const justifySelfStyles = stylex.create({
	auto: { justifySelf: "auto" },
	start: { justifySelf: "start" },
	center: { justifySelf: "center" },
	end: { justifySelf: "end" },
	stretch: { justifySelf: "stretch" },
	baseline: { justifySelf: "baseline" },
});

const justifyItemsStyles = stylex.create({
	start: { justifyItems: "start" },
	center: { justifyItems: "center" },
	end: { justifyItems: "end" },
	stretch: { justifyItems: "stretch" },
	baseline: { justifyItems: "baseline" },
});

const gridAutoFlowStyles = stylex.create({
	row: { gridAutoFlow: "row" },
	column: { gridAutoFlow: "column" },
	dense: { gridAutoFlow: "dense" },
	rowDense: { gridAutoFlow: "row dense" },
	columnDense: { gridAutoFlow: "column dense" },
});

const gridAutoFlowVariants = {
	row: gridAutoFlowStyles.row,
	column: gridAutoFlowStyles.column,
	dense: gridAutoFlowStyles.dense,
	"row dense": gridAutoFlowStyles.rowDense,
	"column dense": gridAutoFlowStyles.columnDense,
} satisfies Record<GridFlow, StyleXStyles>;

const widthFractions = {
	"1/2": "50%",
	"1/3": "33.333333%",
	"2/3": "66.666667%",
	"1/4": "25%",
	"3/4": "75%",
} satisfies Record<WidthFraction, string>;

const containerValues = {
	"container.xs": tokens["--size-container-xs"],
	"container.sm": tokens["--size-container-sm"],
	"container.md": tokens["--size-container-md"],
	"container.lg": tokens["--size-container-lg"],
	"container.xl": tokens["--size-container-xl"],
	"container.2xl": tokens["--size-container-2xl"],
	"container.3xl": tokens["--size-container-3xl"],
	"container.4xl": tokens["--size-container-4xl"],
	"container.5xl": tokens["--size-container-5xl"],
	"container.6xl": tokens["--size-container-6xl"],
	"container.7xl": tokens["--size-container-7xl"],
} satisfies Record<ContainerSize, string>;

function resolveDimension(value: MaxDimensionValue | undefined) {
	if (typeof value === "number") return resolveSpaceValue(value);
	if (value === "full") return tokens["--size-full"];
	if (typeof value === "string" && value.startsWith("container.")) {
		// SAFETY: Container-prefixed members of MaxDimensionValue are exactly ContainerSize.
		return containerValues[value as ContainerSize];
	}
	return value;
}

function resolveWidth(value: WidthValue | undefined) {
	if (typeof value === "string" && Object.hasOwn(widthFractions, value)) {
		// SAFETY: Object.hasOwn verifies that value is a key of the complete widthFractions map.
		return widthFractions[value as WidthFraction];
	}
	// SAFETY: The fraction members return above; the remaining WidthValue members are dimensions.
	return resolveDimension(value as MaxDimensionValue | undefined);
}

function resolveSpan(value: GridSpan | undefined) {
	if (value === "full") return "1 / -1";
	return value === undefined ? undefined : `span ${value} / span ${value}`;
}

function compileDisplay(props: DisplayProps): StyleXStyles[] {
	return props.display === undefined ? [] : [displayVariants[props.display]];
}

function compileSizing(props: SizingProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	if (props.width !== undefined) styles.push(scalarStyles.width(resolveWidth(props.width)));
	if (props.height !== undefined) styles.push(scalarStyles.height(resolveDimension(props.height)));
	if (props.minWidth !== undefined) styles.push(scalarStyles.minWidth(resolveDimension(props.minWidth)));
	if (props.maxWidth !== undefined) styles.push(scalarStyles.maxWidth(resolveDimension(props.maxWidth)));
	if (props.minHeight !== undefined) styles.push(scalarStyles.minHeight(resolveDimension(props.minHeight)));
	if (props.maxHeight !== undefined) styles.push(scalarStyles.maxHeight(resolveDimension(props.maxHeight)));
	return styles;
}

function compilePositioning(props: PositioningProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	if (props.position !== undefined) styles.push(positionStyles[props.position]);
	const blockStart = resolveSpaceValue(props.insetTop ?? props.insetY ?? props.inset);
	const blockEnd = resolveSpaceValue(props.insetBottom ?? props.insetY ?? props.inset);
	const inlineStart = resolveSpaceValue(props.insetStart ?? props.insetX ?? props.inset);
	const inlineEnd = resolveSpaceValue(props.insetEnd ?? props.insetX ?? props.inset);
	if (blockStart !== undefined) styles.push(scalarStyles.insetBlockStart(blockStart));
	if (blockEnd !== undefined) styles.push(scalarStyles.insetBlockEnd(blockEnd));
	if (inlineStart !== undefined) styles.push(scalarStyles.insetInlineStart(inlineStart));
	if (inlineEnd !== undefined) styles.push(scalarStyles.insetInlineEnd(inlineEnd));
	if (props.zIndex !== undefined) styles.push(scalarStyles.zIndex(props.zIndex));
	return styles;
}

function compileChildLayout(props: ChildLayoutProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	if (props.alignSelf !== undefined) styles.push(alignSelfStyles[props.alignSelf]);
	if (props.justifySelf !== undefined) styles.push(justifySelfStyles[props.justifySelf]);
	if (props.flexBasis !== undefined) styles.push(scalarStyles.flexBasis(resolveDimension(props.flexBasis)));
	if (props.flexGrow !== undefined) styles.push(scalarStyles.flexGrow(props.flexGrow));
	if (props.flexShrink !== undefined) styles.push(scalarStyles.flexShrink(props.flexShrink));
	if (props.order !== undefined) styles.push(scalarStyles.order(props.order));
	const columnSpan = resolveSpan(props.columnSpan);
	const rowSpan = resolveSpan(props.rowSpan);
	if (columnSpan !== undefined) styles.push(scalarStyles.gridColumn(columnSpan));
	if (rowSpan !== undefined) styles.push(scalarStyles.gridRow(rowSpan));
	return styles;
}

function compileFlexLayout(props: FlexLayoutProps, defaultOrientation: Orientation): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	if (props.orientation !== undefined || props.reverse !== undefined) {
		const axis = (props.orientation ?? defaultOrientation) === "horizontal" ? "row" : "column";
		if (axis === "row") {
			styles.push(props.reverse ? flexDirectionStyles.rowReverse : flexDirectionStyles.row);
		} else {
			styles.push(props.reverse ? flexDirectionStyles.columnReverse : flexDirectionStyles.column);
		}
	}
	if (props.align !== undefined) styles.push(alignItemsStyles[props.align]);
	if (props.justify !== undefined) styles.push(justifyContentVariants[props.justify]);
	if (props.wrap !== undefined) styles.push(flexWrapVariants[props.wrap]);
	return styles;
}

function compileGridComposition(props: GridCompositionProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	if (props.columns !== undefined) {
		styles.push(scalarStyles.gridTemplateColumns(`repeat(${props.columns}, minmax(0, 1fr))`));
	}
	if (props.flow !== undefined) styles.push(gridAutoFlowVariants[props.flow]);
	if (props.align !== undefined) styles.push(alignItemsStyles[props.align]);
	if (props.justify !== undefined) styles.push(justifyItemsStyles[props.justify]);
	return styles;
}

export const displayThemeProps = createThemePropDefinition<DisplayProps>(themePropKeys.display, compileDisplay);
export const sizingThemeProps = createThemePropDefinition<SizingProps>(themePropKeys.sizing, compileSizing);
export const positioningThemeProps = createThemePropDefinition<PositioningProps>(
	themePropKeys.positioning,
	compilePositioning,
);
export const childLayoutThemeProps = createThemePropDefinition<ChildLayoutProps>(
	themePropKeys.childLayout,
	compileChildLayout,
);

const verticalFlexLayoutThemeProps = createThemePropDefinition<FlexLayoutProps>(
	themePropKeys.flexLayout,
	(props) => compileFlexLayout(props, "vertical"),
);
const horizontalFlexLayoutThemeProps = createThemePropDefinition<FlexLayoutProps>(
	themePropKeys.flexLayout,
	(props) => compileFlexLayout(props, "horizontal"),
);
const gridCompositionThemeProps = createThemePropDefinition<GridCompositionProps>(
	themePropKeys.gridComposition,
	compileGridComposition,
);

export const verticalFlexThemeProps = composeThemeProps(gapThemeProps, verticalFlexLayoutThemeProps);
export const horizontalFlexThemeProps = composeThemeProps(gapThemeProps, horizontalFlexLayoutThemeProps);
export const gridLayoutThemeProps = composeThemeProps(gapThemeProps, gridCompositionThemeProps);
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run build && npm run lint && npm run build-storybook && npx playwright test tests/theme-props/`
Expected: build, lint, and Storybook build pass; all tests in `tests/theme-props/browser.spec.ts` and `tests/theme-props/theme-provider.spec.ts` PASS including the new static-classes test. Then run `node tests/theme-props/bundle-boundary.mjs` — expected exit code 0.

- [ ] **Step 5: Verify live Storybook**

A production build does not prove dev-transform behavior. Run `npm run storybook`, open `Components/Layout/Stack` Playground, and confirm the `align`, `justify`, `wrap`, `orientation`, and `reverse` controls all still change the layout; check the browser devtools for console errors and confirm the Stack element has no `style` attribute when only those controls are set.

- [ ] **Step 6: Commit**

```bash
git add src/theme/theme-props-layout.stylex.ts src/foundations/theme-props.verification.stories.tsx tests/theme-props/browser.spec.ts
git commit -m "Compile closed layout keywords as static StyleX variants"
```

---

### Task 3: Scope positioning props to Box

**Files:**
- Modify: `src/components/layout/layout.tsx:34-43`
- Modify: `src/foundations/theme-props.mdx:73-74` (component coverage rows)
- Modify: `docs/adr/0001-token-backed-theme-props.md` (append an Amendments section)

**Interfaces:**
- Consumes: the existing composed definitions from Task 2 (unchanged names).
- Produces: `StackProps` and `GridProps` no longer include `position`, `inset`, `insetX`, `insetY`, `insetTop`, `insetBottom`, `insetStart`, `insetEnd`, `zIndex`. `BoxProps` is unchanged. This is a compile-time contract change only; runtime DOM filtering is unchanged.

- [ ] **Step 1: Confirm nothing passes positioning props to Stack or Grid**

Run: `rg --multiline '<(Stack|Grid)\b[^>]*\b(position|inset\w*|zIndex)=' src`
Expected: no matches (verified at planning time; if this now matches real usages because of concurrent work, stop and report instead of proceeding).

- [ ] **Step 2: Recompose the layout primitives**

In `src/components/layout/layout.tsx`, replace lines 34-43 (`const boxThemeProps = ...` through `const gridThemeProps = ...`) with:

```ts
const boxThemeProps = composeThemeProps(
	spacingThemeProps,
	sizingThemeProps,
	positioningThemeProps,
	childLayoutThemeProps,
	surfaceThemeProps,
	displayThemeProps,
);
// Stack and Grid stay unpositioned: positioned composition uses Box or the style prop.
const stackAndGridBaseThemeProps = composeThemeProps(
	spacingThemeProps,
	sizingThemeProps,
	childLayoutThemeProps,
	surfaceThemeProps,
	displayThemeProps,
);
const stackThemeProps = composeThemeProps(stackAndGridBaseThemeProps, verticalFlexThemeProps);
const gridThemeProps = composeThemeProps(stackAndGridBaseThemeProps, gridLayoutThemeProps);
```

No import changes: `positioningThemeProps` is still used by `boxThemeProps`.

- [ ] **Step 3: Update the docs table**

In `src/foundations/theme-props.mdx`, replace the Stack and Grid rows of the Component coverage table with:

```
| Stack                             | Box without position, plus orientation, reverse, alignment, distribution, wrapping, and gaps             |
| Grid                              | Box without position, plus 1–12 columns, flow, alignment, gaps, and child spans                           |
```

- [ ] **Step 4: Amend ADR 0001**

Append to the end of `docs/adr/0001-token-backed-theme-props.md` (do not modify the existing text):

```markdown
## Amendments (2026-08-18)

- Closed keyword values (display, position, alignment, distribution, wrap, flex direction, grid flow) compile through predeclared static variant styles. Dynamic StyleX declarations are reserved for genuinely unbounded values: dimensions, numeric factors, and grid spans.
- Stack and Grid do not expose the positioning capability. Positioned composition uses Box or the final `style` prop; Box remains the broadest layout contract.
- Shared capability aliases (`FlexLayoutProps`, `GridCompositionProps`, `SurfaceColorProps`) are exported once from `theme-props.types.ts` rather than redeclared per module.
```

- [ ] **Step 5: Verify with build, lint, and the focused specs**

Run: `npm run build && npm run lint && npm run build-storybook && npx playwright test tests/theme-props/`
Expected: all pass. A build failure here means some file passes a positioning prop to `Stack`/`Grid` — fix the call site to use `Box` or `style` only if it is part of this change's blast radius; otherwise report it.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/layout.tsx src/foundations/theme-props.mdx docs/adr/0001-token-backed-theme-props.md
git commit -m "Scope positioning theme props to Box"
```

---

### Task 4: Trim the CSS dimension unit union

**Files:**
- Modify: `src/theme/theme-props.types.ts:24-54` (the `CssLengthUnit` union)

**Interfaces:**
- Consumes: nothing new.
- Produces: `CssLengthUnit = "px" | "rem" | "em" | "ch" | "vw" | "vh" | "dvw" | "dvh"`. `CssDimensionString` (percentages, `calc(...)`/`min(...)`/`max(...)`/`clamp(...)`/`var(...)`/`env(...)`/`fit-content(...)`/`anchor-size(...)`, global keywords) is unchanged.

- [ ] **Step 1: Confirm no code uses the removed units as theme-prop values**

Run: `rg '"[0-9.]+(cap|ic|lh|rlh|vmin|vmax|svw|svh|lvw|lvh|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|in|pt|pc)"' src`
Expected: no matches (verified at planning time). If a match appears in a theme-prop position, stop and report.

- [ ] **Step 2: Shrink the union**

In `src/theme/theme-props.types.ts`, replace the entire `CssLengthUnit` declaration with:

```ts
/** Common units for arbitrary dimension strings. Anything more exotic goes through the `style` escape hatch. */
export type CssLengthUnit = "px" | "rem" | "em" | "ch" | "vw" | "vh" | "dvw" | "dvh";
```

- [ ] **Step 3: Verify with build and lint**

Run: `npm run build && npm run lint`
Expected: both pass. A type error means a component passes a now-removed unit; route that value through the `style` prop instead, or report if it belongs to concurrent work.

- [ ] **Step 4: Final validation sweep**

Run each independently and confirm all pass:

```bash
npm run build
npm run lint
npm run build-storybook
npx playwright test tests/theme-props/
node tests/theme-props/bundle-boundary.mjs
```

Report any unrelated failures instead of modifying concurrent work.

- [ ] **Step 5: Commit**

```bash
git add src/theme/theme-props.types.ts
git commit -m "Trim dimension strings to common CSS units"
```

---

## Explicitly out of scope

- `theme-props-spacing.stylex.ts` and `theme-props-surface.stylex.ts` compiler internals (their dynamic declarations resolve token values, which is a different trade-off; revisit separately if desired).
- The resolver machinery in `theme-props.ts` (`defineThemePropKeys`, `composeThemeProps`, `extractThemeProps`) — it is shared by ~19 components and stays as is.
- `gridTemplateColumns`/`gridColumn`/`gridRow` static maps (13+ variants each for marginal benefit; they stay dynamic).
- Removing capabilities from any non-layout component's contract.
