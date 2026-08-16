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
	FlexProps,
	GapProps,
	GridSpan,
	GridLayoutProps,
	MaxDimensionValue,
	Orientation,
	PositioningProps,
	SizingProps,
	WidthFraction,
	WidthValue,
} from "./theme-props.types";
import { tokens } from "@/theme/tokens.stylex";

type FlexLayoutProps = Omit<FlexProps, keyof GapProps>;
type GridCompositionProps = Omit<GridLayoutProps, keyof GapProps>;

const scalarStyles = stylex.create({
	display: (value) => ({ display: value }),
	width: (value) => ({ width: value }),
	height: (value) => ({ height: value }),
	minWidth: (value) => ({ minWidth: value }),
	maxWidth: (value) => ({ maxWidth: value }),
	minHeight: (value) => ({ minHeight: value }),
	maxHeight: (value) => ({ maxHeight: value }),
	position: (value) => ({ position: value }),
	insetBlockStart: (value) => ({ top: value }),
	insetBlockEnd: (value) => ({ bottom: value }),
	insetInlineStart: (value) => ({ insetInlineStart: value }),
	insetInlineEnd: (value) => ({ insetInlineEnd: value }),
	zIndex: (value) => ({ zIndex: value }),
	alignSelf: (value) => ({ alignSelf: value }),
	justifySelf: (value) => ({ justifySelf: value }),
	flexBasis: (value) => ({ flexBasis: value }),
	flexGrow: (value) => ({ flexGrow: value }),
	flexShrink: (value) => ({ flexShrink: value }),
	order: (value) => ({ order: value }),
	gridColumn: (value) => ({ gridColumn: value }),
	gridRow: (value) => ({ gridRow: value }),
	flexDirection: (value) => ({ flexDirection: value }),
	alignItems: (value) => ({ alignItems: value }),
	justifyContent: (value) => ({ justifyContent: value }),
	flexWrap: (value) => ({ flexWrap: value }),
	gridTemplateColumns: (value) => ({ gridTemplateColumns: value }),
	gridAutoFlow: (value) => ({ gridAutoFlow: value }),
	justifyItems: (value) => ({ justifyItems: value }),
});

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

function appendStyle<Value>(
	styles: StyleXStyles[],
	value: Value | undefined,
	compile: (value: Value) => StyleXStyles,
): void {
	if (value !== undefined) styles.push(compile(value));
}

function compileDisplay(props: DisplayProps): StyleXStyles[] {
	return props.display === undefined ? [] : [scalarStyles.display(props.display)];
}

function compileSizing(props: SizingProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	appendStyle(styles, props.width === undefined ? undefined : resolveWidth(props.width), scalarStyles.width);
	appendStyle(styles, props.height === undefined ? undefined : resolveDimension(props.height), scalarStyles.height);
	appendStyle(styles, props.minWidth === undefined ? undefined : resolveDimension(props.minWidth), scalarStyles.minWidth);
	appendStyle(styles, props.maxWidth === undefined ? undefined : resolveDimension(props.maxWidth), scalarStyles.maxWidth);
	appendStyle(styles, props.minHeight === undefined ? undefined : resolveDimension(props.minHeight), scalarStyles.minHeight);
	appendStyle(styles, props.maxHeight === undefined ? undefined : resolveDimension(props.maxHeight), scalarStyles.maxHeight);
	return styles;
}

function compilePositioning(props: PositioningProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	appendStyle(styles, props.position, scalarStyles.position);
	appendStyle(styles, resolveSpaceValue(props.insetTop ?? props.insetY ?? props.inset), scalarStyles.insetBlockStart);
	appendStyle(styles, resolveSpaceValue(props.insetBottom ?? props.insetY ?? props.inset), scalarStyles.insetBlockEnd);
	appendStyle(styles, resolveSpaceValue(props.insetStart ?? props.insetX ?? props.inset), scalarStyles.insetInlineStart);
	appendStyle(styles, resolveSpaceValue(props.insetEnd ?? props.insetX ?? props.inset), scalarStyles.insetInlineEnd);
	appendStyle(styles, props.zIndex, scalarStyles.zIndex);
	return styles;
}

function compileChildLayout(props: ChildLayoutProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	appendStyle(styles, props.alignSelf, scalarStyles.alignSelf);
	appendStyle(styles, props.justifySelf, scalarStyles.justifySelf);
	appendStyle(styles, props.flexBasis === undefined ? undefined : resolveDimension(props.flexBasis), scalarStyles.flexBasis);
	appendStyle(styles, props.flexGrow, scalarStyles.flexGrow);
	appendStyle(styles, props.flexShrink, scalarStyles.flexShrink);
	appendStyle(styles, props.order, scalarStyles.order);
	appendStyle(styles, resolveSpan(props.columnSpan), scalarStyles.gridColumn);
	appendStyle(styles, resolveSpan(props.rowSpan), scalarStyles.gridRow);
	return styles;
}

function compileFlexLayout(props: FlexLayoutProps, defaultOrientation: Orientation): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	if (props.orientation !== undefined || props.reverse !== undefined) {
		const axis = (props.orientation ?? defaultOrientation) === "horizontal" ? "row" : "column";
		styles.push(scalarStyles.flexDirection(props.reverse ? `${axis}-reverse` : axis));
	}
	appendStyle(styles, props.align, scalarStyles.alignItems);
	appendStyle(styles, props.justify, scalarStyles.justifyContent);
	appendStyle(styles, props.wrap, scalarStyles.flexWrap);
	return styles;
}

function compileGridComposition(props: GridCompositionProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	appendStyle(
		styles,
		props.columns === undefined ? undefined : `repeat(${props.columns}, minmax(0, 1fr))`,
		scalarStyles.gridTemplateColumns,
	);
	appendStyle(styles, props.flow, scalarStyles.gridAutoFlow);
	appendStyle(styles, props.align, scalarStyles.alignItems);
	appendStyle(styles, props.justify, scalarStyles.justifyItems);
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
