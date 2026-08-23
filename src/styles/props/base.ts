import type { StyleXStyles } from "@stylexjs/stylex";
import type { CSSProperties } from "react";

/** Shared override contract from ADR 0011: native inline style plus StyleX overrides merged last. */
export type BaseStyleProps = {
	style?: CSSProperties;
	xstyle?: StyleXStyles;
};

/** Merge StyleX-produced inline style with the consumer's native style; consumer values win. */
export function mergeStyle(
	stylexStyle: CSSProperties | undefined,
	style: CSSProperties | undefined,
): CSSProperties | undefined {
	if (stylexStyle === undefined) return style;
	if (style === undefined) return stylexStyle;
	return { ...stylexStyle, ...style };
}
