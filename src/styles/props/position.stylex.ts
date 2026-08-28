import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { resolveEdge, resolveSpacingValue, type SpaceValue } from "./spacing.stylex";

export const positionStyles = stylex.create({
	static: { position: "static" },
	relative: { position: "relative" },
	absolute: { position: "absolute" },
	fixed: { position: "fixed" },
	sticky: { position: "sticky" },
});

export type PositionValue = keyof typeof positionStyles;

/** CSS-var indirection keeps xstyle and media-query overrides winning over inline style. */
const dynamicStyles = stylex.create({
	blockStart: (value: string) => ({ top: value }),
	blockEnd: (value: string) => ({ bottom: value }),
	inlineStart: (value: string) => ({ insetInlineStart: value }),
	inlineEnd: (value: string) => ({ insetInlineEnd: value }),
	zIndex: (value: number | string) => ({ zIndex: value }),
});

export type PositionProps = {
	position?: PositionValue;
	inset?: SpaceValue;
	insetX?: SpaceValue;
	insetY?: SpaceValue;
	insetTop?: SpaceValue;
	insetBottom?: SpaceValue;
	insetStart?: SpaceValue;
	insetEnd?: SpaceValue;
	zIndex?: number | string;
};

export function resolvePosition(props: PositionProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	if (props.position !== undefined) styles.push(positionStyles[props.position]);
	const blockStart = resolveEdge(props.inset, props.insetY, props.insetTop);
	const blockEnd = resolveEdge(props.inset, props.insetY, props.insetBottom);
	const inlineStart = resolveEdge(props.inset, props.insetX, props.insetStart);
	const inlineEnd = resolveEdge(props.inset, props.insetX, props.insetEnd);
	if (blockStart !== undefined)
		styles.push(dynamicStyles.blockStart(resolveSpacingValue(blockStart)));
	if (blockEnd !== undefined) styles.push(dynamicStyles.blockEnd(resolveSpacingValue(blockEnd)));
	if (inlineStart !== undefined)
		styles.push(dynamicStyles.inlineStart(resolveSpacingValue(inlineStart)));
	if (inlineEnd !== undefined) styles.push(dynamicStyles.inlineEnd(resolveSpacingValue(inlineEnd)));
	if (props.zIndex !== undefined) {
		// SAFETY: StyleX dynamic zIndex styles are valid StyleXStyles at runtime; TS widens the CSS property type.
		styles.push(dynamicStyles.zIndex(props.zIndex) as StyleXStyles);
	}
	return styles;
}
