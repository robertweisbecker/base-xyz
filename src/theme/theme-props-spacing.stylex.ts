import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	composeThemeProps,
	createThemePropDefinition,
	gapThemePropKeys,
	marginThemePropKeys,
	paddingThemePropKeys,
	textAlignThemePropKeys,
} from "./theme-props";
import type { GapProps, MarginProps, PaddingProps, SpaceStep, TextAlignProps } from "./theme-props.types";
import { tokens } from "@/theme/tokens.stylex";

/** Long-form styles for margin, padding, gap, and text alignment that override common shorthands. */
const scalarStyles = stylex.create({
	marginBlockStart: (value) => ({ marginTop: value }),
	marginBlockEnd: (value) => ({ marginBottom: value }),
	marginInlineStart: (value) => ({ marginInlineStart: value }),
	marginInlineEnd: (value) => ({ marginInlineEnd: value }),
	paddingBlockStart: (value) => ({ paddingTop: value }),
	paddingBlockEnd: (value) => ({ paddingBottom: value }),
	paddingInlineStart: (value) => ({ paddingInlineStart: value }),
	paddingInlineEnd: (value) => ({ paddingInlineEnd: value }),
	rowGap: (value) => ({ rowGap: value }),
	columnGap: (value) => ({ columnGap: value }),
	textAlign: (value) => ({ textAlign: value }),
});

const spaceValues = {
	0: tokens["--space-0"],
	0.5: tokens["--space-0-5"],
	1: tokens["--space-1"],
	1.5: tokens["--space-1-5"],
	2: tokens["--space-2"],
	3: tokens["--space-3"],
	3.5: tokens["--space-3-5"],
	4: tokens["--space-4"],
	5: tokens["--space-5"],
	6: tokens["--space-6"],
	7: tokens["--space-7"],
	8: tokens["--space-8"],
	9: tokens["--space-9"],
	10: tokens["--space-10"],
	12: tokens["--space-12"],
	16: tokens["--space-16"],
} satisfies Record<SpaceStep, string>;

/** Shared by positioning compilers; numeric values always resolve through spacing tokens. */
export function resolveSpaceValue(value: unknown): unknown {
	if (typeof value !== "number") return value;
	if (value < 0) return `calc(${spaceValues[Math.abs(value) as SpaceStep]} * -1)`;
	return spaceValues[value as SpaceStep];
}

function resolveEdge(all: unknown, axis: unknown, side: unknown): unknown {
	return resolveSpaceValue(side ?? axis ?? all);
}

/** Allow individual margin props to override less-specific shorthands.
 * all sides -> axis (x, y) -> side (start = left/top, end = right/bottom)
 */
function compileMargins(props: MarginProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	const blockStart = resolveEdge(props.m, props.my, props.mt);
	const blockEnd = resolveEdge(props.m, props.my, props.mb);
	const inlineStart = resolveEdge(props.m, props.mx, props.ms);
	const inlineEnd = resolveEdge(props.m, props.mx, props.me);
	if (blockStart !== undefined) styles.push(scalarStyles.marginBlockStart(blockStart));
	if (blockEnd !== undefined) styles.push(scalarStyles.marginBlockEnd(blockEnd));
	if (inlineStart !== undefined) styles.push(scalarStyles.marginInlineStart(inlineStart));
	if (inlineEnd !== undefined) styles.push(scalarStyles.marginInlineEnd(inlineEnd));
	return styles;
}

/** Allow individual padding props to override all-sides declarations. */
function compilePadding(props: PaddingProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	const blockStart = resolveEdge(props.p, props.py, props.pt);
	const blockEnd = resolveEdge(props.p, props.py, props.pb);
	const inlineStart = resolveEdge(props.p, props.px, props.ps);
	const inlineEnd = resolveEdge(props.p, props.px, props.pe);
	if (blockStart !== undefined) styles.push(scalarStyles.paddingBlockStart(blockStart));
	if (blockEnd !== undefined) styles.push(scalarStyles.paddingBlockEnd(blockEnd));
	if (inlineStart !== undefined) styles.push(scalarStyles.paddingInlineStart(inlineStart));
	if (inlineEnd !== undefined) styles.push(scalarStyles.paddingInlineEnd(inlineEnd));
	return styles;
}

function compileGap(props: GapProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	const rowGap = resolveSpaceValue(props.gapY ?? props.gap);
	const columnGap = resolveSpaceValue(props.gapX ?? props.gap);
	if (rowGap !== undefined) styles.push(scalarStyles.rowGap(rowGap));
	if (columnGap !== undefined) styles.push(scalarStyles.columnGap(columnGap));
	return styles;
}

function compileTextAlign(props: TextAlignProps): StyleXStyles[] {
	return props.textAlign === undefined ? [] : [scalarStyles.textAlign(props.textAlign)];
}

export const marginThemeProps = createThemePropDefinition<MarginProps>(marginThemePropKeys, compileMargins);
export const paddingThemeProps = createThemePropDefinition<PaddingProps>(paddingThemePropKeys, compilePadding);
export const spacingThemeProps = composeThemeProps(marginThemeProps, paddingThemeProps);
export const gapThemeProps = createThemePropDefinition<GapProps>(gapThemePropKeys, compileGap);
export const textAlignThemeProps = createThemePropDefinition<TextAlignProps>(textAlignThemePropKeys, compileTextAlign);
