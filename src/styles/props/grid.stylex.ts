import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { alignItemsStyles, type AlignValue } from "./flex.stylex";
import type { GapProps } from "./spacing.stylex";

export const gridTemplateColumnsStyles = stylex.create({
	1: { gridTemplateColumns: "repeat(1, minmax(0, 1fr))" },
	2: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
	3: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" },
	4: { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" },
	5: { gridTemplateColumns: "repeat(5, minmax(0, 1fr))" },
	6: { gridTemplateColumns: "repeat(6, minmax(0, 1fr))" },
	7: { gridTemplateColumns: "repeat(7, minmax(0, 1fr))" },
	8: { gridTemplateColumns: "repeat(8, minmax(0, 1fr))" },
	9: { gridTemplateColumns: "repeat(9, minmax(0, 1fr))" },
	10: { gridTemplateColumns: "repeat(10, minmax(0, 1fr))" },
	11: { gridTemplateColumns: "repeat(11, minmax(0, 1fr))" },
	12: { gridTemplateColumns: "repeat(12, minmax(0, 1fr))" },
});

export type GridColumns = keyof typeof gridTemplateColumnsStyles;

export const gridAutoFlowStyles = stylex.create({
	row: { gridAutoFlow: "row" },
	column: { gridAutoFlow: "column" },
	dense: { gridAutoFlow: "dense" },
	"row dense": { gridAutoFlow: "row dense" },
	"column dense": { gridAutoFlow: "column dense" },
});

export type GridFlow = keyof typeof gridAutoFlowStyles;

export const justifyItemsStyles = stylex.create({
	start: { justifyItems: "start" },
	center: { justifyItems: "center" },
	end: { justifyItems: "end" },
	stretch: { justifyItems: "stretch" },
	baseline: { justifyItems: "baseline" },
});

export const gridColumnSpanStyles = stylex.create({
	1: { gridColumnEnd: "span 1", gridColumnStart: "span 1" },
	2: { gridColumnEnd: "span 2", gridColumnStart: "span 2" },
	3: { gridColumnEnd: "span 3", gridColumnStart: "span 3" },
	4: { gridColumnEnd: "span 4", gridColumnStart: "span 4" },
	5: { gridColumnEnd: "span 5", gridColumnStart: "span 5" },
	6: { gridColumnEnd: "span 6", gridColumnStart: "span 6" },
	7: { gridColumnEnd: "span 7", gridColumnStart: "span 7" },
	8: { gridColumnEnd: "span 8", gridColumnStart: "span 8" },
	9: { gridColumnEnd: "span 9", gridColumnStart: "span 9" },
	10: { gridColumnEnd: "span 10", gridColumnStart: "span 10" },
	11: { gridColumnEnd: "span 11", gridColumnStart: "span 11" },
	12: { gridColumnEnd: "span 12", gridColumnStart: "span 12" },
	full: { gridColumnEnd: "-1", gridColumnStart: "1" },
});

export const gridRowSpanStyles = stylex.create({
	1: { gridRowEnd: "span 1", gridRowStart: "span 1" },
	2: { gridRowEnd: "span 2", gridRowStart: "span 2" },
	3: { gridRowEnd: "span 3", gridRowStart: "span 3" },
	4: { gridRowEnd: "span 4", gridRowStart: "span 4" },
	5: { gridRowEnd: "span 5", gridRowStart: "span 5" },
	6: { gridRowEnd: "span 6", gridRowStart: "span 6" },
	7: { gridRowEnd: "span 7", gridRowStart: "span 7" },
	8: { gridRowEnd: "span 8", gridRowStart: "span 8" },
	9: { gridRowEnd: "span 9", gridRowStart: "span 9" },
	10: { gridRowEnd: "span 10", gridRowStart: "span 10" },
	11: { gridRowEnd: "span 11", gridRowStart: "span 11" },
	12: { gridRowEnd: "span 12", gridRowStart: "span 12" },
	full: { gridRowEnd: "-1", gridRowStart: "1" },
});

export type GridSpan = keyof typeof gridColumnSpanStyles;

export type JustifyItemsValue = keyof typeof justifyItemsStyles;

export const placeContentStyles = stylex.create({
	start: { placeContent: "start" },
	center: { placeContent: "center" },
	end: { placeContent: "end" },
	stretch: { placeContent: "stretch" },
	"space-between": { placeContent: "space-between" },
	"space-around": { placeContent: "space-around" },
	"space-evenly": { placeContent: "space-evenly" },
});

export type PlaceContentValue = keyof typeof placeContentStyles;

export const placeItemsStyles = stylex.create({
	start: { placeItems: "start" },
	center: { placeItems: "center" },
	end: { placeItems: "end" },
	stretch: { placeItems: "stretch" },
	baseline: { placeItems: "baseline" },
});

export type PlaceItemsValue = keyof typeof placeItemsStyles;

export type GridLayoutProps = GapProps & {
	columns?: GridColumns;
	flow?: GridFlow;
	align?: AlignValue;
	justify?: JustifyItemsValue;
	placeContent?: PlaceContentValue;
	placeItems?: PlaceItemsValue;
};

export function resolveGridLayout(
	props: Pick<GridLayoutProps, "columns" | "flow" | "align" | "justify" | "placeContent" | "placeItems">,
): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	if (props.columns !== undefined) styles.push(gridTemplateColumnsStyles[props.columns]);
	if (props.flow !== undefined) styles.push(gridAutoFlowStyles[props.flow]);
	if (props.placeContent !== undefined) styles.push(placeContentStyles[props.placeContent]);
	if (props.placeItems !== undefined) styles.push(placeItemsStyles[props.placeItems]);
	if (props.align !== undefined) styles.push(alignItemsStyles[props.align]);
	if (props.justify !== undefined) styles.push(justifyItemsStyles[props.justify]);
	return styles;
}
