import * as stylex from "@stylexjs/stylex";
import {
	color,
	fontFamily,
	fontSize,
	fontWeight,
	letterSpacing,
	lineHeight,
	space,
	typeScale,
} from "@/styles/tokens.stylex";

export type TypographySize = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type TypographyFontFamily = "sans" | "serif" | "mono";
export type TypographyFontWeight = "regular" | "medium" | "semibold" | "bold";
export type TypographyColor =
	| "default"
	| "subtle"
	| "muted"
	| "accent"
	| "danger"
	| "success"
	| "warning"
	| "inverse"
	| "inverse-muted";
export type TypographyAlign = "start" | "center" | "end" | "justify";
export type TypographyWrap = "wrap" | "nowrap" | "pretty" | "balance";
export type TypographySpace = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "12" | "16";
export type TextType = "body" | "large" | "label" | "code" | "supporting" | "display";
export type HeadingLevel = "1" | "2" | "3" | "4" | "5" | "6";

export type TypographyStyleProps = {
	align?: TypographyAlign;
	color?: TypographyColor;
	fontFamily?: TypographyFontFamily;
	fontWeight?: TypographyFontWeight;
	m?: TypographySpace;
	mb?: TypographySpace;
	ml?: TypographySpace;
	mr?: TypographySpace;
	mt?: TypographySpace;
	mx?: TypographySpace;
	my?: TypographySpace;
	size?: TypographySize;
	truncate?: boolean;
	wrap?: TypographyWrap;
};

export const textBaseStyles = stylex.create({
	root: {
		margin: 0,
		boxSizing: "border-box",
	},
});

export const textColorStyles = stylex.create({
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

const textRoleSizeStyles = stylex.create({
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

const textRoleWeightStyles = stylex.create({
	body: { fontWeight: typeScale.bodyWeight },
	large: { fontWeight: typeScale.largeWeight },
	label: { fontWeight: typeScale.labelWeight },
	code: { fontWeight: typeScale.codeWeight },
	supporting: { fontWeight: typeScale.supportingWeight },
	display: { fontWeight: typeScale.display1Weight },
});

export const textStyles = {
	body: [textRoleSizeStyles.body, textRoleWeightStyles.body],
	large: [textRoleSizeStyles.large, textRoleWeightStyles.large],
	label: [textRoleSizeStyles.label, textRoleWeightStyles.label],
	code: [textRoleSizeStyles.code, textRoleWeightStyles.code],
	supporting: [textRoleSizeStyles.supporting, textRoleWeightStyles.supporting],
	display: [textRoleSizeStyles.display, textRoleWeightStyles.display],
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

export const textAlignStyles = stylex.create({
	start: { textAlign: "start" },
	center: { textAlign: "center" },
	end: { textAlign: "end" },
	justify: { textAlign: "justify" },
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

const spacingByStep = {
	"0": 0,
	"1": space.x1,
	"2": space.x2,
	"3": space.x3,
	"4": space.x4,
	"5": space.x5,
	"6": space.x6,
	"7": space.x7,
	"8": space.x8,
	"9": space.x9,
	"10": space.x10,
	"12": space.x12,
	"16": space.x16,
} as const;

export function getTextMarginStyle({
	m,
	mb,
	ml,
	mr,
	mt,
	mx,
	my,
}: Pick<TypographyStyleProps, "m" | "mb" | "ml" | "mr" | "mt" | "mx" | "my">) {
	const margin = m === undefined ? undefined : spacingByStep[m];
	const marginBlock = my === undefined ? undefined : spacingByStep[my];
	const marginInline = mx === undefined ? undefined : spacingByStep[mx];

	return {
		margin,
		marginBlock,
		marginInline,
		marginTop: mt === undefined ? undefined : spacingByStep[mt],
		marginRight: mr === undefined ? undefined : spacingByStep[mr],
		marginBottom: mb === undefined ? undefined : spacingByStep[mb],
		marginLeft: ml === undefined ? undefined : spacingByStep[ml],
	};
}
