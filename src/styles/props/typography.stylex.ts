import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { fontFamilyStyles, fontWeightStyles } from "@/components/text/text.stylex";
import { tokens } from "@/theme/tokens.stylex";

export const fontSizeStyles = stylex.create({
	xs: { fontSize: tokens["--text-xs"] },
	sm: { fontSize: tokens["--text-sm"] },
	md: { fontSize: tokens["--text-md"] },
	lg: { fontSize: tokens["--text-lg"] },
	xl: { fontSize: tokens["--text-xl"] },
	"2xl": { fontSize: tokens["--text-2xl"] },
	"3xl": { fontSize: tokens["--text-3xl"] },
	"4xl": { fontSize: tokens["--text-4xl"] },
	"5xl": { fontSize: tokens["--text-5xl"] },
});

export const lineHeightStyles = stylex.create({
	1: { lineHeight: 1 },
	1.25: { lineHeight: 1.25 },
	1.5: { lineHeight: 1.5 },
	1.75: { lineHeight: 1.75 },
	2: { lineHeight: 2 },
});

export const textAlignStyles = stylex.create({
	start: { textAlign: "start" },
	center: { textAlign: "center" },
	end: { textAlign: "end" },
	justify: { textAlign: "justify" },
});

export type TypographyProps = {
	fontFamily?: keyof typeof fontFamilyStyles;
	fontSize?: keyof typeof fontSizeStyles;
	fontWeight?: keyof typeof fontWeightStyles;
	lineHeight?: keyof typeof lineHeightStyles;
	textAlign?: keyof typeof textAlignStyles;
};

export function resolveTypography(props: TypographyProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	if (props.fontFamily !== undefined) styles.push(fontFamilyStyles[props.fontFamily]);
	if (props.fontSize !== undefined) styles.push(fontSizeStyles[props.fontSize]);
	if (props.fontWeight !== undefined) styles.push(fontWeightStyles[props.fontWeight]);
	if (props.lineHeight !== undefined) styles.push(lineHeightStyles[props.lineHeight]);
	if (props.textAlign !== undefined) styles.push(textAlignStyles[props.textAlign]);
	return styles;
}
