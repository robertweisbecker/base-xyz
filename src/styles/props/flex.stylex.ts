import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { GapProps } from "./spacing.stylex";

export const flexDirectionStyles = stylex.create({
	row: { flexDirection: "row" },
	"row-reverse": { flexDirection: "row-reverse" },
	column: { flexDirection: "column" },
	"column-reverse": { flexDirection: "column-reverse" },
});

export type FlexDirection = keyof typeof flexDirectionStyles;

export const alignItemsStyles = stylex.create({
	start: { alignItems: "start" },
	center: { alignItems: "center" },
	end: { alignItems: "end" },
	stretch: { alignItems: "stretch" },
	baseline: { alignItems: "baseline" },
});

export type AlignValue = keyof typeof alignItemsStyles;

export const justifyContentStyles = stylex.create({
	start: { justifyContent: "start" },
	center: { justifyContent: "center" },
	end: { justifyContent: "end" },
	stretch: { justifyContent: "stretch" },
	"space-between": { justifyContent: "space-between" },
	"space-around": { justifyContent: "space-around" },
	"space-evenly": { justifyContent: "space-evenly" },
});

export type JustifyValue = keyof typeof justifyContentStyles;

export const flexWrapStyles = stylex.create({
	nowrap: { flexWrap: "nowrap" },
	wrap: { flexWrap: "wrap" },
	"wrap-reverse": { flexWrap: "wrap-reverse" },
});

export type WrapValue = keyof typeof flexWrapStyles;

export const displayStyles = stylex.create({
	none: { display: "none" },
	block: { display: "block" },
	inline: { display: "inline" },
	"inline-block": { display: "inline-block" },
	contents: { display: "contents" },
	flex: { display: "flex" },
	"inline-flex": { display: "inline-flex" },
	grid: { display: "grid" },
	"inline-grid": { display: "inline-grid" },
});

export type DisplayValue = keyof typeof displayStyles;

export type DisplayProps = {
	display?: DisplayValue;
};

export type Orientation = "horizontal" | "vertical";

export type FlexLayoutProps = GapProps & {
	orientation?: Orientation;
	reverse?: boolean;
	align?: AlignValue;
	justify?: JustifyValue;
	wrap?: WrapValue;
};

export function resolveFlexLayout(
	props: Pick<FlexLayoutProps, "orientation" | "reverse" | "align" | "justify" | "wrap">,
	defaultOrientation: Orientation = "vertical",
): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	if (props.orientation !== undefined || props.reverse !== undefined) {
		const axis = (props.orientation ?? defaultOrientation) === "horizontal" ? "row" : "column";
		const direction = props.reverse ? `${axis}-reverse` : axis;
		// SAFETY: direction is always a key of flexDirectionStyles (row, column, or their -reverse variants).
		styles.push(flexDirectionStyles[direction as FlexDirection]);
	}
	if (props.align !== undefined) styles.push(alignItemsStyles[props.align]);
	if (props.justify !== undefined) styles.push(justifyContentStyles[props.justify]);
	if (props.wrap !== undefined) styles.push(flexWrapStyles[props.wrap]);
	return styles;
}
