import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { AlignValue } from "./flex.stylex";
import { gridColumnSpanStyles, gridRowSpanStyles, type GridSpan } from "./grid.stylex";
import { resolveSize } from "./sizing.stylex";
import type { SpaceStep } from "./spacing.stylex";

export const alignSelfStyles = stylex.create({
	start: { alignSelf: "start" },
	center: { alignSelf: "center" },
	end: { alignSelf: "end" },
	stretch: { alignSelf: "stretch" },
	baseline: { alignSelf: "baseline" },
	auto: { alignSelf: "auto" },
});

export const justifySelfStyles = stylex.create({
	start: { justifySelf: "start" },
	center: { justifySelf: "center" },
	end: { justifySelf: "end" },
	stretch: { justifySelf: "stretch" },
	baseline: { justifySelf: "baseline" },
	auto: { justifySelf: "auto" },
});

/** CSS-var indirection keeps xstyle and media-query overrides winning over inline style. */
const dynamicStyles = stylex.create({
	flexGrow: (value: number) => ({ flexGrow: value }),
	flexShrink: (value: number) => ({ flexShrink: value }),
	order: (value: number) => ({ order: value }),
	flexBasis: (value: string) => ({ flexBasis: value }),
});

export type ChildLayoutProps = {
	alignSelf?: AlignValue | "auto";
	justifySelf?: AlignValue | "auto";
	flexBasis?: SpaceStep | string;
	flexGrow?: number;
	flexShrink?: number;
	order?: number;
	columnSpan?: GridSpan;
	rowSpan?: GridSpan;
};

export function resolveChildLayout(props: ChildLayoutProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	if (props.alignSelf !== undefined) styles.push(alignSelfStyles[props.alignSelf]);
	if (props.justifySelf !== undefined) styles.push(justifySelfStyles[props.justifySelf]);
	if (props.flexBasis !== undefined) {
		const flexBasis = resolveSize(props.flexBasis);
		if (flexBasis !== undefined) styles.push(dynamicStyles.flexBasis(flexBasis));
	}
	if (props.flexGrow !== undefined) styles.push(dynamicStyles.flexGrow(props.flexGrow));
	if (props.flexShrink !== undefined) styles.push(dynamicStyles.flexShrink(props.flexShrink));
	if (props.order !== undefined) styles.push(dynamicStyles.order(props.order));
	if (props.columnSpan !== undefined) styles.push(gridColumnSpanStyles[props.columnSpan]);
	if (props.rowSpan !== undefined) styles.push(gridRowSpanStyles[props.rowSpan]);
	return styles;
}
