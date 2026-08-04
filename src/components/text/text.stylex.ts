import * as stylex from "@stylexjs/stylex";
import { composeThemeProps, type ThemePropDefinition, type VerifyThemeProps } from "@/theme/theme-props";
import { marginThemeProps, textAlignThemeProps } from "@/theme/theme-props-spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";
import type { TextThemeProps } from "./text.types";

const textThemePropsDefinition = composeThemeProps(marginThemeProps, textAlignThemeProps);
export const textThemeProps: ThemePropDefinition<VerifyThemeProps<TextThemeProps, typeof textThemePropsDefinition>> =
	textThemePropsDefinition;

export const textBaseStyles = stylex.create({
	root: {
		margin: 0,
		boxSizing: "border-box",
	},
});

/** Internal implementation for the Text and Heading `color` prop. Other owners use color tokens directly. */
export const textColorPropStyles = stylex.create({
	default: { color: tokens["--fg"] },
	muted: { color: tokens["--fg-muted"] },
	subtle: { color: tokens["--fg-subtle"] },
	accent: { color: tokens["--fg-accent"] },
	error: { color: tokens["--fg-error"] },
	success: { color: tokens["--fg-success"] },
	warning: { color: tokens["--fg-warning"] },
	inverse: { color: tokens["--fg-inverse"] },
	"inverse-muted": { color: tokens["--fg-inverse-muted"] },
	inherit: { color: "inherit" },
});

export const textWeightStyles = stylex.create({
	regular: { fontWeight: tokens["--font-weight-regular"] },
	medium: { fontWeight: tokens["--font-weight-medium"] },
	semibold: { fontWeight: tokens["--font-weight-semibold"] },
	bold: { fontWeight: tokens["--font-weight-bold"] },
	inherit: { fontWeight: "inherit" },
});

export const textFamilyStyles = stylex.create({
	sans: { fontFamily: tokens["--font-family-sans"] },
	serif: { fontFamily: tokens["--font-family-serif"] },
	mono: { fontFamily: tokens["--font-family-mono"] },
	inherit: { fontFamily: "inherit" },
});

export const textSizeStyles = stylex.create({
	"1": {
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	"2": {
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	"3": {
		fontSize: tokens["--font-size-3"],
		letterSpacing: tokens["--letter-spacing-3"],
		lineHeight: tokens["--line-height-3"],
	},
	"4": {
		fontSize: tokens["--font-size-4"],
		letterSpacing: tokens["--letter-spacing-4"],
		lineHeight: tokens["--line-height-4"],
	},
	"5": {
		fontSize: tokens["--font-size-5"],
		letterSpacing: tokens["--letter-spacing-5"],
		lineHeight: tokens["--line-height-5"],
	},
	"6": {
		fontSize: tokens["--font-size-6"],
		letterSpacing: tokens["--letter-spacing-6"],
		lineHeight: tokens["--line-height-6"],
	},
	"7": {
		fontSize: tokens["--font-size-7"],
		letterSpacing: tokens["--letter-spacing-7"],
		lineHeight: tokens["--line-height-7"],
	},
	"8": {
		fontSize: tokens["--font-size-8"],
		letterSpacing: tokens["--letter-spacing-8"],
		lineHeight: tokens["--line-height-8"],
	},
	"9": {
		fontSize: tokens["--font-size-9"],
		letterSpacing: tokens["--letter-spacing-9"],
		lineHeight: tokens["--line-height-9"],
	},
});

const textStyleSizes = stylex.create({
	body: {
		fontSize: tokens["--type-body-size"],
		letterSpacing: tokens["--type-body-letter-spacing"],
		lineHeight: tokens["--type-body-line-height"],
	},
	large: {
		fontSize: tokens["--type-large-size"],
		letterSpacing: tokens["--type-large-letter-spacing"],
		lineHeight: tokens["--type-large-line-height"],
	},
	label: {
		fontSize: tokens["--type-label-size"],
		letterSpacing: tokens["--type-label-letter-spacing"],
		lineHeight: tokens["--type-label-line-height"],
	},
	code: {
		fontFamily: tokens["--font-family-mono"],
		fontSize: tokens["--type-code-size"],
		letterSpacing: tokens["--type-code-letter-spacing"],
		lineHeight: tokens["--type-code-line-height"],
	},
	supporting: {
		fontSize: tokens["--type-supporting-size"],
		letterSpacing: tokens["--type-supporting-letter-spacing"],
		lineHeight: tokens["--type-supporting-line-height"],
	},
	display: {
		fontSize: tokens["--type-display-1-size"],
		letterSpacing: tokens["--type-display-1-letter-spacing"],
		lineHeight: tokens["--type-display-1-line-height"],
	},
});

const textStyleDefaultWeights = stylex.create({
	body: { fontWeight: tokens["--type-body-weight"] },
	large: { fontWeight: tokens["--type-large-weight"] },
	label: { fontWeight: tokens["--type-label-weight"] },
	code: { fontWeight: tokens["--type-code-weight"] },
	supporting: { fontWeight: tokens["--type-supporting-weight"] },
	display: { fontWeight: tokens["--type-display-1-weight"] },
});

export const textStyles = {
	body: [textStyleSizes.body, textStyleDefaultWeights.body],
	large: [textStyleSizes.large, textStyleDefaultWeights.large],
	label: [textStyleSizes.label, textStyleDefaultWeights.label],
	code: [textStyleSizes.code, textStyleDefaultWeights.code],
	supporting: [textStyleSizes.supporting, textStyleDefaultWeights.supporting],
	display: [textStyleSizes.display, textStyleDefaultWeights.display],
} as const;

export const headingStyles = stylex.create({
	"1": {
		fontSize: tokens["--type-heading-1-size"],
		fontWeight: tokens["--type-heading-1-weight"],
		letterSpacing: tokens["--type-heading-1-letter-spacing"],
		lineHeight: tokens["--type-heading-1-line-height"],
	},
	"2": {
		fontSize: tokens["--type-heading-2-size"],
		fontWeight: tokens["--type-heading-2-weight"],
		letterSpacing: tokens["--type-heading-2-letter-spacing"],
		lineHeight: tokens["--type-heading-2-line-height"],
	},
	"3": {
		fontSize: tokens["--type-heading-3-size"],
		fontWeight: tokens["--type-heading-3-weight"],
		letterSpacing: tokens["--type-heading-3-letter-spacing"],
		lineHeight: tokens["--type-heading-3-line-height"],
	},
	"4": {
		fontSize: tokens["--type-heading-4-size"],
		fontWeight: tokens["--type-heading-4-weight"],
		letterSpacing: tokens["--type-heading-4-letter-spacing"],
		lineHeight: tokens["--type-heading-4-line-height"],
	},
	"5": {
		fontSize: tokens["--type-heading-5-size"],
		fontWeight: tokens["--type-heading-5-weight"],
		letterSpacing: tokens["--type-heading-5-letter-spacing"],
		lineHeight: tokens["--type-heading-5-line-height"],
	},
	"6": {
		fontSize: tokens["--type-heading-6-size"],
		fontWeight: tokens["--type-heading-6-weight"],
		letterSpacing: tokens["--type-heading-6-letter-spacing"],
		lineHeight: tokens["--type-heading-6-line-height"],
	},
});

export const textWrapStyles = stylex.create({
	wrap: { textWrap: "wrap" },
	nowrap: { textWrap: "nowrap" },
	pretty: { textWrap: "pretty" },
	balance: { textWrap: "balance" },
});

export const textTruncationStyles = stylex.create({
	singleLine: {
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		maxWidth: "100%",
		overflowX: "clip",
	},
});
