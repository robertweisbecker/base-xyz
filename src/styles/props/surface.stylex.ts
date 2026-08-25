import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

export const colorStyles = stylex.create({
	canvas: { color: tokens["--canvas"] },
	inset: { color: tokens["--bg-inset"] },
	surface: { color: tokens["--surface"] },
	bgPanel: { color: tokens["--panel"] },
	bgElevated: { color: tokens["--elevated"] },
	bgElevatedActive: { color: tokens["--inset"] },
	surfaceSubtle: { color: tokens["--surface-subtle"] },
	surfaceSubtleHover: { color: tokens["--surface-subtle-hover"] },
	surfaceSubtleActive: { color: tokens["--surface-subtle-active"] },
	highlight: { color: tokens["--bg-highlight"] },
	fg: { color: tokens["--fg"] },
	fgMuted: { color: tokens["--fg-muted"] },
	fgSubtle: { color: tokens["--fg-subtle"] },
	fgAccent: { color: tokens["--fg-accent"] },
	fgAccentStrong: { color: tokens["--fg-accent-strong"] },
	fgAccentHover: { color: tokens["--fg-accent-hover"] },
	border: { color: tokens["--border"] },
	borderInput: { color: tokens["--border-input"] },
	borderInputHover: { color: tokens["--border-input-hover"] },
	borderDisabled: { color: tokens["--border-disabled"] },
	bgPrimary: { color: tokens["--bg-primary"] },
	bgPrimaryHighlight: { color: tokens["--bg-primary-highlight"] },
	bgAccent: { color: tokens["--bg-accent"] },
	bgAccentHover: { color: tokens["--bg-accent-hover"] },
	bgAccentActive: { color: tokens["--bg-accent-active"] },
	fgAccentContrast: { color: tokens["--fg-accent-contrast"] },
	bgNeutral: { color: tokens["--bg-neutral"] },
	bgNeutralStrong: { color: tokens["--bg-neutral-strong"] },
	fgNeutralContrast: { color: tokens["--fg-neutral-contrast"] },
	bgErrorPrimary: { color: tokens["--bg-error-primary"] },
	fgError: { color: tokens["--fg-error"] },
	bgError: { color: tokens["--bg-error"] },
	fgSuccess: { color: tokens["--fg-success"] },
	bgSuccessPrimary: { color: tokens["--bg-success-primary"] },
	bgSuccess: { color: tokens["--bg-success"] },
	fgWarning: { color: tokens["--fg-warning"] },
	bgWarningPrimary: { color: tokens["--bg-warning-primary"] },
	bgWarning: { color: tokens["--bg-warning-subtle"] },
	bgInverse: { color: tokens["--bg-inverse"] },
	fgInverse: { color: tokens["--fg-inverse"] },
	fgInverseMuted: { color: tokens["--fg-inverse-muted"] },
	focus: { color: tokens["--focus"] },
	overlay: { color: tokens["--overlay"] },
	fillTrack: { color: tokens["--fill-track"] },
	fillDisabled: { color: tokens["--fill-disabled"] },
	bgTooltip: { color: tokens["--tooltip"] },
	fgWarningContrast: { color: tokens["--fg-warning-contrast"] },
});

export const backgroundColorStyles = stylex.create({
	canvas: { backgroundColor: tokens["--canvas"] },
	inset: { backgroundColor: tokens["--bg-inset"] },
	surface: { backgroundColor: tokens["--surface"] },
	bgPanel: { backgroundColor: tokens["--panel"] },
	bgElevated: { backgroundColor: tokens["--elevated"] },
	bgElevatedActive: { backgroundColor: tokens["--inset"] },
	surfaceSubtle: { backgroundColor: tokens["--surface-subtle"] },
	surfaceSubtleHover: { backgroundColor: tokens["--surface-subtle-hover"] },
	surfaceSubtleActive: { backgroundColor: tokens["--surface-subtle-active"] },
	highlight: { backgroundColor: tokens["--bg-highlight"] },
	fg: { backgroundColor: tokens["--fg"] },
	fgMuted: { backgroundColor: tokens["--fg-muted"] },
	fgSubtle: { backgroundColor: tokens["--fg-subtle"] },
	fgAccent: { backgroundColor: tokens["--fg-accent"] },
	fgAccentStrong: { backgroundColor: tokens["--fg-accent-strong"] },
	fgAccentHover: { backgroundColor: tokens["--fg-accent-hover"] },
	border: { backgroundColor: tokens["--border"] },
	borderInput: { backgroundColor: tokens["--border-input"] },
	borderInputHover: { backgroundColor: tokens["--border-input-hover"] },
	borderDisabled: { backgroundColor: tokens["--border-disabled"] },
	bgPrimary: { backgroundColor: tokens["--bg-primary"] },
	bgPrimaryHighlight: { backgroundColor: tokens["--bg-primary-highlight"] },
	bgAccent: { backgroundColor: tokens["--bg-accent"] },
	bgAccentHover: { backgroundColor: tokens["--bg-accent-hover"] },
	bgAccentActive: { backgroundColor: tokens["--bg-accent-active"] },
	fgAccentContrast: { backgroundColor: tokens["--fg-accent-contrast"] },
	bgNeutral: { backgroundColor: tokens["--bg-neutral"] },
	bgNeutralStrong: { backgroundColor: tokens["--bg-neutral-strong"] },
	fgNeutralContrast: { backgroundColor: tokens["--fg-neutral-contrast"] },
	bgErrorPrimary: { backgroundColor: tokens["--bg-error-primary"] },
	fgError: { backgroundColor: tokens["--fg-error"] },
	bgError: { backgroundColor: tokens["--bg-error"] },
	fgSuccess: { backgroundColor: tokens["--fg-success"] },
	bgSuccessPrimary: { backgroundColor: tokens["--bg-success-primary"] },
	bgSuccess: { backgroundColor: tokens["--bg-success"] },
	fgWarning: { backgroundColor: tokens["--fg-warning"] },
	bgWarningPrimary: { backgroundColor: tokens["--bg-warning-primary"] },
	bgWarning: { backgroundColor: tokens["--bg-warning-subtle"] },
	bgInverse: { backgroundColor: tokens["--bg-inverse"] },
	fgInverse: { backgroundColor: tokens["--fg-inverse"] },
	fgInverseMuted: { backgroundColor: tokens["--fg-inverse-muted"] },
	focus: { backgroundColor: tokens["--focus"] },
	overlay: { backgroundColor: tokens["--overlay"] },
	fillTrack: { backgroundColor: tokens["--fill-track"] },
	fillDisabled: { backgroundColor: tokens["--fill-disabled"] },
	bgTooltip: { backgroundColor: tokens["--tooltip"] },
	fgWarningContrast: { backgroundColor: tokens["--fg-warning-contrast"] },
});

export type SemanticColor = keyof typeof colorStyles;

export const borderRadiusStyles = stylex.create({
	xxs: { borderRadius: tokens["--radius-xxs"] },
	xs: { borderRadius: tokens["--radius-xs"] },
	sm: { borderRadius: tokens["--radius-sm"] },
	md: { borderRadius: tokens["--radius-md"] },
	lg: { borderRadius: tokens["--radius-lg"] },
	xl: { borderRadius: tokens["--radius-xl"] },
	full: { borderRadius: tokens["--radius-full"] },
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
	border: {
		borderColor: tokens["--border"],
		borderStyle: "solid",
		borderWidth: 1,
	},
	borderInput: {
		borderColor: tokens["--border-input"],
		borderStyle: "solid",
		borderWidth: 1,
	},
	borderInputHover: {
		borderColor: tokens["--border-input-hover"],
		borderStyle: "solid",
		borderWidth: 1,
	},
	borderDisabled: {
		borderColor: tokens["--border-disabled"],
		borderStyle: "solid",
		borderWidth: 1,
	},
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

const dynamicBorderStyles = stylex.create({
	width: (borderWidth: number | string) => ({ borderWidth }),
});

export type BorderColorValue = keyof typeof borderColorStyles;
export type BorderWidthValue = number | string;
export type BorderStyleValue = "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "inset" | "outset";

export type SurfaceProps = {
	bg?: SemanticColor;
	color?: SemanticColor;
	radius?: RadiusValue;
	shadow?: ShadowValue;
	borderColor?: BorderColorValue;
	borderWidth?: BorderWidthValue;
	borderStyle?: BorderStyleValue;
};

export function resolveSurface(props: SurfaceProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	if (props.color !== undefined) styles.push(colorStyles[props.color]);
	if (props.bg !== undefined) styles.push(backgroundColorStyles[props.bg]);
	if (props.radius !== undefined) styles.push(borderRadiusStyles[props.radius]);
	if (props.shadow !== undefined) styles.push(boxShadowStyles[props.shadow]);
	if (props.borderColor !== undefined) styles.push(borderColorStyles[props.borderColor]);
	if (props.borderStyle !== undefined) styles.push(borderStyleStyles[props.borderStyle]);
	if (props.borderWidth !== undefined) styles.push(dynamicBorderStyles.width(props.borderWidth));
	return styles;
}
