import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	composeThemeProps,
	createThemePropDefinition,
	gapThemePropKeys,
	marginThemePropKeys,
	paddingThemePropKeys,
	textAlignThemePropKeys,
} from "../theme/theme-props";
import type {
	GapProps,
	MarginProps,
	PaddingProps,
	SpaceStep,
	TextAlignProps,
} from "../theme/theme-props.types";
import { space } from "./tokens.stylex";

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

/** Shared by positioning compilers; numeric values always resolve through spacing tokens. */
export function resolveSpaceValue(value: unknown): unknown {
	if (typeof value !== "number") return value;
	if (value < 0) return `calc(${space[Math.abs(value) as SpaceStep]} * -1)`;
	return space[value as SpaceStep];
}

function resolveEdge(broad: unknown, axis: unknown, edge: unknown): unknown {
	return resolveSpaceValue(edge ?? axis ?? broad);
}

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
export const textAlignThemeProps = createThemePropDefinition<TextAlignProps>(
	textAlignThemePropKeys,
	compileTextAlign,
);
