import type { MarginProps } from "@/styles/props/spacing.stylex";
import type { TypographyProps } from "@/styles/props/typography.stylex";

export type TypographySize = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type TypographyFontFamily = "sans" | "serif" | "mono";
export type TypographyFontWeight = "regular" | "medium" | "semibold" | "bold";
export type TypographyColor =
	| "inherit"
	| "default"
	| "subtle"
	| "muted"
	| "accent"
	| "error"
	| "success"
	| "warning"
	| "inverse"
	| "inverse-muted";
export type TypographyWrap = "wrap" | "nowrap" | "pretty" | "balance" | "truncate";
export type TextType = "body" | "large" | "label" | "code" | "supporting" | "display";
export type HeadingLevel = "1" | "2" | "3" | "4" | "5" | "6";

export type TextStyleProps = MarginProps &
	Pick<TypographyProps, "fontFamily" | "fontWeight" | "textAlign">;

export type TypographyStyleProps = TextStyleProps & {
	color?: TypographyColor;
	fontFamily?: TypographyFontFamily;
	fontWeight?: TypographyFontWeight;
	size?: TypographySize;
	truncate?: boolean;
	wrap?: TypographyWrap;
	textStyle?: TextType;
	tabular?: boolean;
};
