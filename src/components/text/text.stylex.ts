import * as stylex from "@stylexjs/stylex";
import { composeThemeProps, type ThemePropDefinition, type VerifyThemeProps } from "@/theme/theme-props";
import { marginThemeProps, textAlignThemeProps } from "@/styles/theme-props-spacing.stylex";
import { color, fontFamily, fontSize, fontWeight, letterSpacing, lineHeight, typeScale } from "@/styles/tokens.stylex";
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
	default: { color: color.fg },
	muted: { color: color.fgMuted },
	subtle: { color: color.fgSubtle },
	accent: { color: color.fgAccent },
	danger: { color: color.fgDanger },
	success: { color: color.fgSuccess },
	warning: { color: color.fgWarning },
	inverse: { color: color.fgInverse },
	"inverse-muted": { color: color.fgInverseMuted },
	inherit: { color: "inherit" },
});

export const textWeightStyles = stylex.create({
	regular: { fontWeight: fontWeight.regular },
	medium: { fontWeight: fontWeight.medium },
	semibold: { fontWeight: fontWeight.semibold },
	bold: { fontWeight: fontWeight.bold },
	inherit: { fontWeight: "inherit" },
});

export const textFamilyStyles = stylex.create({
	sans: { fontFamily: fontFamily.sans },
	serif: { fontFamily: fontFamily.serif },
	mono: { fontFamily: fontFamily.mono },
	inherit: { fontFamily: "inherit" },
});

export const textSizeStyles = stylex.create({
	"1": {
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	"2": {
		fontSize: fontSize.x2,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
	},
	"3": {
		fontSize: fontSize.x3,
		letterSpacing: letterSpacing.x3,
		lineHeight: lineHeight.x3,
	},
	"4": {
		fontSize: fontSize.x4,
		letterSpacing: letterSpacing.x4,
		lineHeight: lineHeight.x4,
	},
	"5": {
		fontSize: fontSize.x5,
		letterSpacing: letterSpacing.x5,
		lineHeight: lineHeight.x5,
	},
	"6": {
		fontSize: fontSize.x6,
		letterSpacing: letterSpacing.x6,
		lineHeight: lineHeight.x6,
	},
	"7": {
		fontSize: fontSize.x7,
		letterSpacing: letterSpacing.x7,
		lineHeight: lineHeight.x7,
	},
	"8": {
		fontSize: fontSize.x8,
		letterSpacing: letterSpacing.x8,
		lineHeight: lineHeight.x8,
	},
	"9": {
		fontSize: fontSize.x9,
		letterSpacing: letterSpacing.x9,
		lineHeight: lineHeight.x9,
	},
});

const textStyleSizes = stylex.create({
	body: {
		fontSize: typeScale.bodySize,
		letterSpacing: typeScale.bodyLetterSpacing,
		lineHeight: typeScale.bodyLineHeight,
	},
	large: {
		fontSize: typeScale.largeSize,
		letterSpacing: typeScale.largeLetterSpacing,
		lineHeight: typeScale.largeLineHeight,
	},
	label: {
		fontSize: typeScale.labelSize,
		letterSpacing: typeScale.labelLetterSpacing,
		lineHeight: typeScale.labelLineHeight,
	},
	code: {
		fontFamily: fontFamily.mono,
		fontSize: typeScale.codeSize,
		letterSpacing: typeScale.codeLetterSpacing,
		lineHeight: typeScale.codeLineHeight,
	},
	supporting: {
		fontSize: typeScale.supportingSize,
		letterSpacing: typeScale.supportingLetterSpacing,
		lineHeight: typeScale.supportingLineHeight,
	},
	display: {
		fontSize: typeScale.display1Size,
		letterSpacing: typeScale.display1LetterSpacing,
		lineHeight: typeScale.display1LineHeight,
	},
});

const textStyleDefaultWeights = stylex.create({
	body: { fontWeight: fontWeight.regular },
	large: { fontWeight: fontWeight.regular },
	label: { fontWeight: fontWeight.medium },
	code: { fontWeight: fontWeight.regular },
	supporting: { fontWeight: fontWeight.regular },
	display: { fontWeight: fontWeight.semibold },
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
		fontSize: typeScale.heading1Size,
		fontWeight: typeScale.heading1Weight,
		letterSpacing: typeScale.heading1LetterSpacing,
		lineHeight: typeScale.heading1LineHeight,
	},
	"2": {
		fontSize: typeScale.heading2Size,
		fontWeight: typeScale.heading2Weight,
		letterSpacing: typeScale.heading2LetterSpacing,
		lineHeight: typeScale.heading2LineHeight,
	},
	"3": {
		fontSize: typeScale.heading3Size,
		fontWeight: typeScale.heading3Weight,
		letterSpacing: typeScale.heading3LetterSpacing,
		lineHeight: typeScale.heading3LineHeight,
	},
	"4": {
		fontSize: typeScale.heading4Size,
		fontWeight: typeScale.heading4Weight,
		letterSpacing: typeScale.heading4LetterSpacing,
		lineHeight: typeScale.heading4LineHeight,
	},
	"5": {
		fontSize: typeScale.heading5Size,
		fontWeight: typeScale.heading5Weight,
		letterSpacing: typeScale.heading5LetterSpacing,
		lineHeight: typeScale.heading5LineHeight,
	},
	"6": {
		fontSize: typeScale.heading6Size,
		fontWeight: typeScale.heading6Weight,
		letterSpacing: typeScale.heading6LetterSpacing,
		lineHeight: typeScale.heading6LineHeight,
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
