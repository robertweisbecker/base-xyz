import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";
import { resolveSpacingValue, type SpaceStep } from "./spacing.stylex";

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
} as const;

const widthFractions = {
	"1/2": "50%",
	"1/3": "33.333333%",
	"2/3": "66.666667%",
	"1/4": "25%",
	"3/4": "75%",
} as const;

/** CSS-var indirection keeps xstyle and media-query overrides winning over inline style. */
export const dynamicSizingStyles = stylex.create({
	width: (value: string) => ({ width: value }),
	height: (value: string) => ({ height: value }),
	minWidth: (value: string) => ({ minWidth: value }),
	maxWidth: (value: string) => ({ maxWidth: value }),
	minHeight: (value: string) => ({ minHeight: value }),
	maxHeight: (value: string) => ({ maxHeight: value }),
});

export function resolveSize(value: SpaceStep | string | undefined): string | undefined {
	if (value === undefined) return undefined;
	if (typeof value === "number") {
		return resolveSpacingValue(value);
	}
	if (value === "full") return tokens["--size-full"];
	if (Object.hasOwn(containerValues, value)) {
		// SAFETY: Object.hasOwn verifies that value is a containerValues key.
		return containerValues[value as keyof typeof containerValues];
	}
	return value;
}

export function resolveWidth(value: SpaceStep | string | undefined): string | undefined {
	if (value === undefined) return undefined;
	if (typeof value === "string" && Object.hasOwn(widthFractions, value)) {
		// SAFETY: Object.hasOwn verifies that value is a widthFractions key.
		return widthFractions[value as keyof typeof widthFractions];
	}
	return resolveSize(value);
}

export type SizingProps = {
	width?: SpaceStep | string;
	height?: SpaceStep | string;
	minWidth?: SpaceStep | string;
	maxWidth?: SpaceStep | string;
	minHeight?: SpaceStep | string;
	maxHeight?: SpaceStep | string;
};

export function resolveSizing(props: SizingProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	const width = resolveWidth(props.width);
	const height = resolveSize(props.height);
	const minWidth = resolveSize(props.minWidth);
	const maxWidth = resolveSize(props.maxWidth);
	const minHeight = resolveSize(props.minHeight);
	const maxHeight = resolveSize(props.maxHeight);
	if (width !== undefined) styles.push(dynamicSizingStyles.width(width));
	if (height !== undefined) styles.push(dynamicSizingStyles.height(height));
	if (minWidth !== undefined) styles.push(dynamicSizingStyles.minWidth(minWidth));
	if (maxWidth !== undefined) styles.push(dynamicSizingStyles.maxWidth(maxWidth));
	if (minHeight !== undefined) styles.push(dynamicSizingStyles.minHeight(minHeight));
	if (maxHeight !== undefined) styles.push(dynamicSizingStyles.maxHeight(maxHeight));
	return styles;
}
