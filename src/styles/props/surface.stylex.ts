import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

export const tokenTextColorStyles = stylex.create({
	grayA1: { color: tokens["--color-gray-a1"] },
	grayA2: { color: tokens["--color-gray-a2"] },
	grayA3: { color: tokens["--color-gray-a3"] },
	grayA4: { color: tokens["--color-gray-a4"] },
	grayA5: { color: tokens["--color-gray-a5"] },
	blackA1: { color: tokens["--color-black-a1"] },
	blackA2: { color: tokens["--color-black-a2"] },
	blackA3: { color: tokens["--color-black-a3"] },
	blackA4: { color: tokens["--color-black-a4"] },
	blackA5: { color: tokens["--color-black-a5"] },
	whiteA1: { color: tokens["--color-white-a1"] },
	whiteA2: { color: tokens["--color-white-a2"] },
	whiteA3: { color: tokens["--color-white-a3"] },
	whiteA4: { color: tokens["--color-white-a4"] },
	whiteA5: { color: tokens["--color-white-a5"] },
	accentS1: { color: tokens["--color-accent-s1"] },
	accentS2: { color: tokens["--color-accent-s2"] },
	accentC1: { color: tokens["--color-accent-c1"] },
	accentC2: { color: tokens["--color-accent-c2"] },
	accentC3: { color: tokens["--color-accent-c3"] },
	accentB1: { color: tokens["--color-accent-b1"] },
	accentB2: { color: tokens["--color-accent-b2"] },
	accentB3: { color: tokens["--color-accent-b3"] },
	accentP1: { color: tokens["--color-accent-p1"] },
	accentP2: { color: tokens["--color-accent-p2"] },
	accentT1: { color: tokens["--color-accent-t1"] },
	accentT2: { color: tokens["--color-accent-t2"] },

	grayS1: { color: tokens["--color-gray-s1"] },
	grayS2: { color: tokens["--color-gray-s2"] },
	grayS3: { color: tokens["--color-gray-s3"] },
	grayC1: { color: tokens["--color-gray-c1"] },
	grayC2: { color: tokens["--color-gray-c2"] },
	grayC3: { color: tokens["--color-gray-c3"] },
	grayB1: { color: tokens["--color-gray-b1"] },
	grayB2: { color: tokens["--color-gray-b2"] },
	grayB3: { color: tokens["--color-gray-b3"] },
	grayP1: { color: tokens["--color-gray-p1"] },
	grayP2: { color: tokens["--color-gray-p2"] },
	grayP3: { color: tokens["--color-gray-p3"] },
	grayP4: { color: tokens["--color-gray-p4"] },
	grayT1: { color: tokens["--color-gray-t1"] },
	grayT2: { color: tokens["--color-gray-t2"] },
	grayT3: { color: tokens["--color-gray-t3"] },

	errorS1: { color: tokens["--color-error-s1"] },
	errorS2: { color: tokens["--color-error-s2"] },
	errorC1: { color: tokens["--color-error-c1"] },
	errorC2: { color: tokens["--color-error-c2"] },
	errorC3: { color: tokens["--color-error-c3"] },
	errorB1: { color: tokens["--color-error-b1"] },
	errorB2: { color: tokens["--color-error-b2"] },
	errorB3: { color: tokens["--color-error-b3"] },
	errorP1: { color: tokens["--color-error-p1"] },
	errorP2: { color: tokens["--color-error-p2"] },
	errorT1: { color: tokens["--color-error-t1"] },
	errorT2: { color: tokens["--color-error-t2"] },

	successS1: { color: tokens["--color-success-s1"] },
	successS2: { color: tokens["--color-success-s2"] },
	successC1: { color: tokens["--color-success-c1"] },
	successC2: { color: tokens["--color-success-c2"] },
	successC3: { color: tokens["--color-success-c3"] },
	successB1: { color: tokens["--color-success-b1"] },
	successB2: { color: tokens["--color-success-b2"] },
	successB3: { color: tokens["--color-success-b3"] },
	successP1: { color: tokens["--color-success-p1"] },
	successP2: { color: tokens["--color-success-p2"] },
	successT1: { color: tokens["--color-success-t1"] },
	successT2: { color: tokens["--color-success-t2"] },

	warningS1: { color: tokens["--color-warning-s1"] },
	warningS2: { color: tokens["--color-warning-s2"] },
	warningC1: { color: tokens["--color-warning-c1"] },
	warningC2: { color: tokens["--color-warning-c2"] },
	warningC3: { color: tokens["--color-warning-c3"] },
	warningB1: { color: tokens["--color-warning-b1"] },
	warningB2: { color: tokens["--color-warning-b2"] },
	warningB3: { color: tokens["--color-warning-b3"] },
	warningP1: { color: tokens["--color-warning-p1"] },
	warningP2: { color: tokens["--color-warning-p2"] },
	warningT1: { color: tokens["--color-warning-t1"] },
	warningT2: { color: tokens["--color-warning-t2"] },
});

export const tokenBackgroundColorStyles = stylex.create({
	grayA1: { backgroundColor: tokens["--color-gray-a1"] },
	grayA2: { backgroundColor: tokens["--color-gray-a2"] },
	grayA3: { backgroundColor: tokens["--color-gray-a3"] },
	grayA4: { backgroundColor: tokens["--color-gray-a4"] },
	grayA5: { backgroundColor: tokens["--color-gray-a5"] },
	blackA1: { backgroundColor: tokens["--color-black-a1"] },
	blackA2: { backgroundColor: tokens["--color-black-a2"] },
	blackA3: { backgroundColor: tokens["--color-black-a3"] },
	blackA4: { backgroundColor: tokens["--color-black-a4"] },
	blackA5: { backgroundColor: tokens["--color-black-a5"] },
	whiteA1: { backgroundColor: tokens["--color-white-a1"] },
	whiteA2: { backgroundColor: tokens["--color-white-a2"] },
	whiteA3: { backgroundColor: tokens["--color-white-a3"] },
	whiteA4: { backgroundColor: tokens["--color-white-a4"] },
	whiteA5: { backgroundColor: tokens["--color-white-a5"] },
	accentS1: { backgroundColor: tokens["--color-accent-s1"] },
	accentS2: { backgroundColor: tokens["--color-accent-s2"] },
	accentC1: { backgroundColor: tokens["--color-accent-c1"] },
	accentC2: { backgroundColor: tokens["--color-accent-c2"] },
	accentC3: { backgroundColor: tokens["--color-accent-c3"] },
	accentB1: { backgroundColor: tokens["--color-accent-b1"] },
	accentB2: { backgroundColor: tokens["--color-accent-b2"] },
	accentB3: { backgroundColor: tokens["--color-accent-b3"] },
	accentP1: { backgroundColor: tokens["--color-accent-p1"] },
	accentP2: { backgroundColor: tokens["--color-accent-p2"] },
	accentT1: { backgroundColor: tokens["--color-accent-t1"] },
	accentT2: { backgroundColor: tokens["--color-accent-t2"] },
	grayS1: { backgroundColor: tokens["--color-gray-s1"] },
	grayS2: { backgroundColor: tokens["--color-gray-s2"] },
	grayS3: { backgroundColor: tokens["--color-gray-s3"] },
	grayC1: { backgroundColor: tokens["--color-gray-c1"] },
	grayC2: { backgroundColor: tokens["--color-gray-c2"] },
	grayC3: { backgroundColor: tokens["--color-gray-c3"] },
	grayB1: { backgroundColor: tokens["--color-gray-b1"] },
	grayB2: { backgroundColor: tokens["--color-gray-b2"] },
	grayB3: { backgroundColor: tokens["--color-gray-b3"] },
	grayP1: { backgroundColor: tokens["--color-gray-p1"] },
	grayP2: { backgroundColor: tokens["--color-gray-p2"] },
	grayP3: { backgroundColor: tokens["--color-gray-p3"] },
	grayP4: { backgroundColor: tokens["--color-gray-p4"] },
	grayT1: { backgroundColor: tokens["--color-gray-t1"] },
	grayT2: { backgroundColor: tokens["--color-gray-t2"] },
	grayT3: { backgroundColor: tokens["--color-gray-t3"] },
	errorS1: { backgroundColor: tokens["--color-error-s1"] },
	errorS2: { backgroundColor: tokens["--color-error-s2"] },
	errorC1: { backgroundColor: tokens["--color-error-c1"] },
	errorC2: { backgroundColor: tokens["--color-error-c2"] },
	errorC3: { backgroundColor: tokens["--color-error-c3"] },
	errorB1: { backgroundColor: tokens["--color-error-b1"] },
	errorB2: { backgroundColor: tokens["--color-error-b2"] },
	errorB3: { backgroundColor: tokens["--color-error-b3"] },
	errorP1: { backgroundColor: tokens["--color-error-p1"] },
	errorP2: { backgroundColor: tokens["--color-error-p2"] },
	errorT1: { backgroundColor: tokens["--color-error-t1"] },
	errorT2: { backgroundColor: tokens["--color-error-t2"] },
	successS1: { backgroundColor: tokens["--color-success-s1"] },
	successS2: { backgroundColor: tokens["--color-success-s2"] },
	successC1: { backgroundColor: tokens["--color-success-c1"] },
	successC2: { backgroundColor: tokens["--color-success-c2"] },
	successC3: { backgroundColor: tokens["--color-success-c3"] },
	successB1: { backgroundColor: tokens["--color-success-b1"] },
	successB2: { backgroundColor: tokens["--color-success-b2"] },
	successB3: { backgroundColor: tokens["--color-success-b3"] },
	successP1: { backgroundColor: tokens["--color-success-p1"] },
	successP2: { backgroundColor: tokens["--color-success-p2"] },
	successT1: { backgroundColor: tokens["--color-success-t1"] },
	successT2: { backgroundColor: tokens["--color-success-t2"] },
	warningS1: { backgroundColor: tokens["--color-warning-s1"] },
	warningS2: { backgroundColor: tokens["--color-warning-s2"] },
	warningC1: { backgroundColor: tokens["--color-warning-c1"] },
	warningC2: { backgroundColor: tokens["--color-warning-c2"] },
	warningC3: { backgroundColor: tokens["--color-warning-c3"] },
	warningB1: { backgroundColor: tokens["--color-warning-b1"] },
	warningB2: { backgroundColor: tokens["--color-warning-b2"] },
	warningB3: { backgroundColor: tokens["--color-warning-b3"] },
	warningP1: { backgroundColor: tokens["--color-warning-p1"] },
	warningP2: { backgroundColor: tokens["--color-warning-p2"] },
	warningT1: { backgroundColor: tokens["--color-warning-t1"] },
	warningT2: { backgroundColor: tokens["--color-warning-t2"] },
});

export const tokenBorderColorStyles = stylex.create({
	grayA1: { borderColor: tokens["--color-gray-a1"] },
	grayA2: { borderColor: tokens["--color-gray-a2"] },
	grayA3: { borderColor: tokens["--color-gray-a3"] },
	grayA4: { borderColor: tokens["--color-gray-a4"] },
	grayA5: { borderColor: tokens["--color-gray-a5"] },
	blackA1: { borderColor: tokens["--color-black-a1"] },
	blackA2: { borderColor: tokens["--color-black-a2"] },
	blackA3: { borderColor: tokens["--color-black-a3"] },
	blackA4: { borderColor: tokens["--color-black-a4"] },
	blackA5: { borderColor: tokens["--color-black-a5"] },
	whiteA1: { borderColor: tokens["--color-white-a1"] },
	whiteA2: { borderColor: tokens["--color-white-a2"] },
	whiteA3: { borderColor: tokens["--color-white-a3"] },
	whiteA4: { borderColor: tokens["--color-white-a4"] },
	whiteA5: { borderColor: tokens["--color-white-a5"] },
	accentS1: { borderColor: tokens["--color-accent-s1"] },
	accentS2: { borderColor: tokens["--color-accent-s2"] },
	accentC1: { borderColor: tokens["--color-accent-c1"] },
	accentC2: { borderColor: tokens["--color-accent-c2"] },
	accentC3: { borderColor: tokens["--color-accent-c3"] },
	accentB1: { borderColor: tokens["--color-accent-b1"] },
	accentB2: { borderColor: tokens["--color-accent-b2"] },
	accentB3: { borderColor: tokens["--color-accent-b3"] },
	accentP1: { borderColor: tokens["--color-accent-p1"] },
	accentP2: { borderColor: tokens["--color-accent-p2"] },
	accentT1: { borderColor: tokens["--color-accent-t1"] },
	accentT2: { borderColor: tokens["--color-accent-t2"] },
	grayS1: { borderColor: tokens["--color-gray-s1"] },
	grayS2: { borderColor: tokens["--color-gray-s2"] },
	grayS3: { borderColor: tokens["--color-gray-s3"] },
	grayC1: { borderColor: tokens["--color-gray-c1"] },
	grayC2: { borderColor: tokens["--color-gray-c2"] },
	grayC3: { borderColor: tokens["--color-gray-c3"] },
	grayB1: { borderColor: tokens["--color-gray-b1"] },
	grayB2: { borderColor: tokens["--color-gray-b2"] },
	grayB3: { borderColor: tokens["--color-gray-b3"] },
	grayP1: { borderColor: tokens["--color-gray-p1"] },
	grayP2: { borderColor: tokens["--color-gray-p2"] },
	grayP3: { borderColor: tokens["--color-gray-p3"] },
	grayP4: { borderColor: tokens["--color-gray-p4"] },
	grayT1: { borderColor: tokens["--color-gray-t1"] },
	grayT2: { borderColor: tokens["--color-gray-t2"] },
	grayT3: { borderColor: tokens["--color-gray-t3"] },
	errorS1: { borderColor: tokens["--color-error-s1"] },
	errorS2: { borderColor: tokens["--color-error-s2"] },
	errorC1: { borderColor: tokens["--color-error-c1"] },
	errorC2: { borderColor: tokens["--color-error-c2"] },
	errorC3: { borderColor: tokens["--color-error-c3"] },
	errorB1: { borderColor: tokens["--color-error-b1"] },
	errorB2: { borderColor: tokens["--color-error-b2"] },
	errorB3: { borderColor: tokens["--color-error-b3"] },
	errorP1: { borderColor: tokens["--color-error-p1"] },
	errorP2: { borderColor: tokens["--color-error-p2"] },
	errorT1: { borderColor: tokens["--color-error-t1"] },
	errorT2: { borderColor: tokens["--color-error-t2"] },
	successS1: { borderColor: tokens["--color-success-s1"] },
	successS2: { borderColor: tokens["--color-success-s2"] },
	successC1: { borderColor: tokens["--color-success-c1"] },
	successC2: { borderColor: tokens["--color-success-c2"] },
	successC3: { borderColor: tokens["--color-success-c3"] },
	successB1: { borderColor: tokens["--color-success-b1"] },
	successB2: { borderColor: tokens["--color-success-b2"] },
	successB3: { borderColor: tokens["--color-success-b3"] },
	successP1: { borderColor: tokens["--color-success-p1"] },
	successP2: { borderColor: tokens["--color-success-p2"] },
	successT1: { borderColor: tokens["--color-success-t1"] },
	successT2: { borderColor: tokens["--color-success-t2"] },
	warningS1: { borderColor: tokens["--color-warning-s1"] },
	warningS2: { borderColor: tokens["--color-warning-s2"] },
	warningC1: { borderColor: tokens["--color-warning-c1"] },
	warningC2: { borderColor: tokens["--color-warning-c2"] },
	warningC3: { borderColor: tokens["--color-warning-c3"] },
	warningB1: { borderColor: tokens["--color-warning-b1"] },
	warningB2: { borderColor: tokens["--color-warning-b2"] },
	warningB3: { borderColor: tokens["--color-warning-b3"] },
	warningP1: { borderColor: tokens["--color-warning-p1"] },
	warningP2: { borderColor: tokens["--color-warning-p2"] },
	warningT1: { borderColor: tokens["--color-warning-t1"] },
	warningT2: { borderColor: tokens["--color-warning-t2"] },
});

export const semanticTextColorStyles = stylex.create({
	default: { color: tokens["--fg"] },
	muted: { color: tokens["--fg-muted"] },
	subtle: { color: tokens["--fg-subtle"] },
	accent: { color: tokens["--fg-accent"] },
	accentStrong: { color: tokens["--fg-accent-strong"] },
	accentHover: { color: tokens["--fg-accent-hover"] },
	accentContrast: { color: tokens["--fg-accent-contrast"] },
	neutralContrast: { color: tokens["--fg-neutral-contrast"] },
	error: { color: tokens["--fg-error"] },
	success: { color: tokens["--fg-success"] },
	warning: { color: tokens["--fg-warning"] },
	inverse: { color: tokens["--fg-inverse"] },
	inverseMuted: { color: tokens["--fg-inverse-muted"] },
	focus: { color: tokens["--focus"] },
	fillTrack: { color: tokens["--fill-track"] },
	fillDisabled: { color: tokens["--fill-disabled"] },
	warningContrast: { color: tokens["--fg-warning-contrast"] },
});

export type TokenTextColorValues =
	keyof typeof semanticTextColorStyles | keyof typeof tokenTextColorStyles;

export const semanticBackgroundColorStyles = stylex.create({
	canvas: { backgroundColor: tokens["--canvas"] },
	inset: { backgroundColor: tokens["--bg-inset"] },
	surface: { backgroundColor: tokens["--surface"] },
	panel: { backgroundColor: tokens["--panel"] },
	elevated: { backgroundColor: tokens["--elevated"] },
	elevatedActive: { backgroundColor: tokens["--inset"] },
	surfaceSubtle: { backgroundColor: tokens["--surface-subtle"] },
	surfaceSubtleHover: { backgroundColor: tokens["--surface-subtle-hover"] },
	surfaceSubtleActive: { backgroundColor: tokens["--surface-subtle-active"] },
	highlight: { backgroundColor: tokens["--bg-highlight"] },
	primary: { backgroundColor: tokens["--bg-primary"] },
	primaryHighlight: { backgroundColor: tokens["--bg-primary-highlight"] },
	accent: { backgroundColor: tokens["--bg-accent"] },
	accentHover: { backgroundColor: tokens["--bg-accent-hover"] },
	accentActive: { backgroundColor: tokens["--bg-accent-active"] },
	neutral: { backgroundColor: tokens["--bg-neutral"] },
	neutralStrong: { backgroundColor: tokens["--bg-neutral-strong"] },
	errorPrimary: { backgroundColor: tokens["--bg-error-primary"] },
	bgError: { backgroundColor: tokens["--bg-error"] },
	successPrimary: { backgroundColor: tokens["--bg-success-primary"] },
	success: { backgroundColor: tokens["--bg-success"] },
	warningPrimary: { backgroundColor: tokens["--bg-warning-primary"] },
	warning: { backgroundColor: tokens["--bg-warning-subtle"] },
	inverse: { backgroundColor: tokens["--bg-inverse"] },
	focus: { backgroundColor: tokens["--focus"] },
	overlay: { backgroundColor: tokens["--overlay"] },
	fillTrack: { backgroundColor: tokens["--fill-track"] },
	fillDisabled: { backgroundColor: tokens["--fill-disabled"] },
	tooltip: { backgroundColor: tokens["--tooltip"] },
});

export type TokenBackgroundColorValues =
	keyof typeof semanticBackgroundColorStyles | keyof typeof tokenBackgroundColorStyles;

export const borderRadiusStyles = stylex.create({
	xxs: {
		borderRadius: tokens["--radius-xxs"],
		cornerShape: { default: null, "@supports (corner-shape: squircle)": "squircle" },
	},
	xs: {
		borderRadius: tokens["--radius-xs"],
		cornerShape: { default: null, "@supports (corner-shape: squircle)": "squircle" },
	},
	sm: {
		borderRadius: tokens["--radius-sm"],
		cornerShape: { default: null, "@supports (corner-shape: squircle)": "superellipse(1.4)" },
	},
	md: {
		borderRadius: tokens["--radius-md"],
		cornerShape: { default: null, "@supports (corner-shape: squircle)": "superellipse(1.5)" },
	},
	lg: {
		borderRadius: tokens["--radius-lg"],
		cornerShape: { default: null, "@supports (corner-shape: squircle)": "squircle" },
	},
	xl: {
		borderRadius: tokens["--radius-xl"],
		cornerShape: { default: null, "@supports (corner-shape: squircle)": "squircle" },
	},
	full: { borderRadius: tokens["--radius-full"], cornerShape: null },
});

export type RadiusValue = keyof typeof borderRadiusStyles;

export const boxShadowStyles = stylex.create({
	none: { boxShadow: "none" },
	inset: { boxShadow: tokens["--shadow-inset"] },
	xs: { boxShadow: tokens["--shadow-xs"] },
	sm: { boxShadow: tokens["--shadow-sm"] },
	md: { boxShadow: tokens["--shadow-md"] },
	lg: { boxShadow: tokens["--shadow-lg"] },
});

export type ShadowValue = keyof typeof boxShadowStyles;

export const borderColorStyles = stylex.create({
	default: { borderColor: tokens["--border"] },
	input: { borderColor: tokens["--border-input"] },
	inputHover: { borderColor: tokens["--border-input-hover"] },
	disabled: { borderColor: tokens["--border-disabled"] },
});

export const borderStyleStyles = stylex.create({
	solid: { borderStyle: "solid", borderWidth: 1 },
	dashed: { borderStyle: "dashed", borderWidth: 1 },
	dotted: { borderStyle: "dotted", borderWidth: 1 },
	double: { borderStyle: "double", borderWidth: 1 },
	groove: { borderStyle: "groove", borderWidth: 1 },
	ridge: { borderStyle: "ridge", borderWidth: 1 },
	inset: { borderStyle: "inset", borderWidth: 1 },
	outset: { borderStyle: "outset", borderWidth: 1 },
});

const dynamicBorderWidthStyles = stylex.create({
	width: (borderWidth: number | string) => ({ borderWidth }),
});

export type TokenBorderColorValues =
	keyof typeof borderColorStyles | keyof typeof tokenBorderColorStyles;
export type BorderWidthValue = number | string;
export type BorderStyleValue =
	"solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "inset" | "outset";

export type SurfaceProps = {
	bg?: TokenBackgroundColorValues;
	color?: TokenTextColorValues;
	radius?: RadiusValue;
	shadow?: ShadowValue;
	borderColor?: TokenBorderColorValues;
	borderWidth?: BorderWidthValue;
	borderStyle?: BorderStyleValue;
};

function hasKey<T extends object>(styleMap: T, key: PropertyKey): key is keyof T {
	return key in styleMap;
}

export function resolveSurface(props: SurfaceProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	if (props.color !== undefined)
		styles.push(
			hasKey(semanticTextColorStyles, props.color)
				? semanticTextColorStyles[props.color]
				: tokenTextColorStyles[props.color],
		);
	if (props.bg !== undefined)
		styles.push(
			hasKey(semanticBackgroundColorStyles, props.bg)
				? semanticBackgroundColorStyles[props.bg]
				: tokenBackgroundColorStyles[props.bg],
		);
	if (props.radius !== undefined) styles.push(borderRadiusStyles[props.radius]);
	if (props.shadow !== undefined) styles.push(boxShadowStyles[props.shadow]);
	if (props.borderColor !== undefined)
		styles.push(
			hasKey(borderColorStyles, props.borderColor)
				? borderColorStyles[props.borderColor]
				: tokenBorderColorStyles[props.borderColor],
		);
	if (props.borderStyle !== undefined) styles.push(borderStyleStyles[props.borderStyle]);
	if (props.borderWidth !== undefined)
		styles.push(dynamicBorderWidthStyles.width(props.borderWidth));
	return styles;
}
