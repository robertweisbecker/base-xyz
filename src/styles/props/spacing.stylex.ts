import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

export type SpaceStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12 | 16;
export type SpaceValue =
	| SpaceStep
	| -0.5
	| -1
	| -1.5
	| -2
	| -3
	| -3.5
	| -4
	| -5
	| -6
	| -7
	| -8
	| -9
	| -10
	| -12
	| -16
	| string;

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
	[-0.5]: `calc(0rem - ${tokens["--space-0-5"]})`,
	[-1]: `calc(0rem - ${tokens["--space-1"]})`,
	[-1.5]: `calc(0rem - ${tokens["--space-1-5"]})`,
	[-2]: `calc(0rem - ${tokens["--space-2"]})`,
	[-3]: `calc(0rem - ${tokens["--space-3"]})`,
	[-3.5]: `calc(0rem - ${tokens["--space-3-5"]})`,
	[-4]: `calc(0rem - ${tokens["--space-4"]})`,
	[-5]: `calc(0rem - ${tokens["--space-5"]})`,
	[-6]: `calc(0rem - ${tokens["--space-6"]})`,
	[-7]: `calc(0rem - ${tokens["--space-7"]})`,
	[-8]: `calc(0rem - ${tokens["--space-8"]})`,
	[-9]: `calc(0rem - ${tokens["--space-9"]})`,
	[-10]: `calc(0rem - ${tokens["--space-10"]})`,
	[-12]: `calc(0rem - ${tokens["--space-12"]})`,
	[-16]: `calc(0rem - ${tokens["--space-16"]})`,
};

export function resolveSpacingValue(value: SpaceValue): string {
	if (typeof value === "string") return value;
	return spaceValues[value];
}

const paddingEdgeStyles = stylex.create({
	blockStart: (value: string) => ({ paddingTop: value }),
	blockEnd: (value: string) => ({ paddingBottom: value }),
	inlineStart: (value: string) => ({ paddingInlineStart: value }),
	inlineEnd: (value: string) => ({ paddingInlineEnd: value }),
});

const gapStyles = stylex.create({
	row: (value: string) => ({ rowGap: value }),
	column: (value: string) => ({ columnGap: value }),
});

const marginEdgeStyles = stylex.create({
	blockStart: (value: string) => ({ marginBlockStart: value }),
	blockEnd: (value: string) => ({ marginBlockEnd: value }),
	inlineStart: (value: string) => ({ marginInlineStart: value }),
	inlineEnd: (value: string) => ({ marginInlineEnd: value }),
});

export type GapProps = {
	gap?: SpaceValue;
	gapX?: SpaceValue;
	gapY?: SpaceValue;
};

export type PaddingProps = {
	p?: SpaceValue;
	px?: SpaceValue;
	py?: SpaceValue;
	pt?: SpaceValue;
	pb?: SpaceValue;
	ps?: SpaceValue;
	pe?: SpaceValue;
};

export type MarginProps = {
	m?: SpaceValue;
	mx?: SpaceValue;
	my?: SpaceValue;
	mt?: SpaceValue;
	mb?: SpaceValue;
	ms?: SpaceValue;
	me?: SpaceValue;
};

/** Restyle-style umbrella for components that take both margin and padding. */
export type SpacingProps = MarginProps & PaddingProps;

export function extractMarginProps<T extends MarginProps>(props: T) {
	const { m, mx, my, mt, mb, ms, me, ...rest } = props;
	const blockStart = mt ?? my ?? m;
	const blockEnd = mb ?? my ?? m;
	const inlineStart = ms ?? mx ?? m;
	const inlineEnd = me ?? mx ?? m;

	return {
		marginStyles: [
			blockStart !== undefined && marginEdgeStyles.blockStart(resolveSpacingValue(blockStart)),
			blockEnd !== undefined && marginEdgeStyles.blockEnd(resolveSpacingValue(blockEnd)),
			inlineStart !== undefined && marginEdgeStyles.inlineStart(resolveSpacingValue(inlineStart)),
			inlineEnd !== undefined && marginEdgeStyles.inlineEnd(resolveSpacingValue(inlineEnd)),
		],
		rest,
	};
}

export function resolveEdge<T>(
	all: T | undefined,
	axis: T | undefined,
	side: T | undefined,
): T | undefined {
	return side ?? axis ?? all;
}

/** Per-edge padding resolution: side ?? axis ?? all. */
export function resolvePadding(props: PaddingProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	const blockStart = resolveEdge(props.p, props.py, props.pt);
	const blockEnd = resolveEdge(props.p, props.py, props.pb);
	const inlineStart = resolveEdge(props.p, props.px, props.ps);
	const inlineEnd = resolveEdge(props.p, props.px, props.pe);
	if (blockStart !== undefined)
		styles.push(paddingEdgeStyles.blockStart(resolveSpacingValue(blockStart)));
	if (blockEnd !== undefined)
		styles.push(paddingEdgeStyles.blockEnd(resolveSpacingValue(blockEnd)));
	if (inlineStart !== undefined)
		styles.push(paddingEdgeStyles.inlineStart(resolveSpacingValue(inlineStart)));
	if (inlineEnd !== undefined)
		styles.push(paddingEdgeStyles.inlineEnd(resolveSpacingValue(inlineEnd)));
	return styles;
}

/** Axis gap resolution: gapY/gapX fall back to gap. */
export function resolveGap(props: GapProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	const rowGap = props.gapY ?? props.gap;
	const columnGap = props.gapX ?? props.gap;
	if (rowGap !== undefined) styles.push(gapStyles.row(resolveSpacingValue(rowGap)));
	if (columnGap !== undefined) styles.push(gapStyles.column(resolveSpacingValue(columnGap)));
	return styles;
}
