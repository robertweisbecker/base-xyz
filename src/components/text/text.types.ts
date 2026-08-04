import type { MarginProps, TextAlignProps } from "@/theme/theme-props.types";

export type TypographySize = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type TypographyFontFamily = "sans" | "serif" | "mono";
export type TypographyFontWeight = "regular" | "medium" | "semibold" | "bold";
export type TypographyColor =
	| "default"
	| "subtle"
	| "muted"
	| "accent"
	| "error"
	| "success"
	| "warning"
	| "inverse"
	| "inverse-muted";
export type TypographyWrap = "wrap" | "nowrap" | "pretty" | "balance";
export type TextType = "body" | "large" | "label" | "code" | "supporting" | "display";
export type HeadingLevel = "1" | "2" | "3" | "4" | "5" | "6";

export type TextThemeProps = MarginProps & TextAlignProps;

export type TypographyStyleProps = TextThemeProps & {
	color?: TypographyColor;
	fontFamily?: TypographyFontFamily;
	fontWeight?: TypographyFontWeight;
	size?: TypographySize;
	truncate?: boolean;
	wrap?: TypographyWrap;
};
