import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	composeThemeProps,
	createThemePropDefinition,
	radiusThemePropKeys,
	shadowThemePropKeys,
	surfaceColorThemePropKeys,
} from "./theme-props";
import type {
	RadiusThemeProps,
	RadiusValue,
	SemanticColor,
	ShadowThemeProps,
	ShadowValue,
	SurfaceThemeProps,
} from "./theme-props.types";
import { tokens } from "./tokens.stylex";

type SurfaceColorProps = Pick<SurfaceThemeProps, "color" | "bg">;

const scalarStyles = stylex.create({
	color: (value) => ({ color: value }),
	backgroundColor: (value) => ({ backgroundColor: value }),
	borderRadius: (value) => ({ borderRadius: value }),
	boxShadow: (value) => ({ boxShadow: value }),
});

const colorValues = {
	canvas: tokens["--bg-canvas"],
	inset: tokens["--bg-inset"],
	surface: tokens["--surface"],
	bgPanel: tokens["--panel"],
	bgElevated: tokens["--elevated"],
	bgElevatedActive: tokens["--elevated-active"],
	surfaceSubtle: tokens["--surface-subtle"],
	surfaceSubtleHover: tokens["--surface-subtle-hover"],
	surfaceSubtleActive: tokens["--surface-subtle-active"],
	highlight: tokens["--bg-highlight"],
	fg: tokens["--fg"],
	fgMuted: tokens["--fg-muted"],
	fgSubtle: tokens["--fg-subtle"],
	fgAccent: tokens["--fg-accent"],
	fgAccentStrong: tokens["--fg-accent-strong"],
	fgAccentHover: tokens["--fg-accent-hover"],
	border: tokens["--border"],
	borderInput: tokens["--border-input"],
	borderInputHover: tokens["--border-input-hover"],
	borderDisabled: tokens["--border-disabled"],
	bgPrimary: tokens["--bg-primary"],
	bgPrimaryHighlight: tokens["--bg-primary-highlight"],
	bgAccent: tokens["--bg-accent"],
	bgAccentHover: tokens["--bg-accent-hover"],
	bgAccentActive: tokens["--bg-accent-active"],
	fgAccentContrast: tokens["--fg-accent-contrast"],
	bgNeutral: tokens["--bg-neutral"],
	bgNeutralStrong: tokens["--bg-neutral-strong"],
	fgNeutralContrast: tokens["--fg-neutral-contrast"],
	bgErrorPrimary: tokens["--bg-error-primary"],
	fgError: tokens["--fg-error"],
	bgError: tokens["--bg-error"],
	fgSuccess: tokens["--fg-success"],
	bgSuccessPrimary: tokens["--bg-success-primary"],
	bgSuccess: tokens["--bg-success"],
	fgWarning: tokens["--fg-warning"],
	bgWarningPrimary: tokens["--bg-warning-primary"],
	bgWarning: tokens["--bg-warning-subtle"],
	bgInverse: tokens["--bg-inverse"],
	fgInverse: tokens["--fg-inverse"],
	fgInverseMuted: tokens["--fg-inverse-muted"],
	focus: tokens["--focus"],
	overlay: tokens["--overlay"],
	fillTrack: tokens["--fill-track"],
	fillDisabled: tokens["--fill-disabled"],
	bgTooltip: tokens["--tooltip"],
	fgWarningContrast: tokens["--fg-warning-contrast"],
} satisfies Record<SemanticColor, string>;

const radiusValues = {
	xxs: tokens["--radius-xxs"],
	xs: tokens["--radius-xs"],
	sm: tokens["--radius-sm"],
	md: tokens["--radius-md"],
	lg: tokens["--radius-lg"],
	xl: tokens["--radius-xl"],
	full: tokens["--radius-full"],
} satisfies Record<RadiusValue, string>;

const shadowValues = {
	inset: tokens["--shadow-inset"],
	xs: tokens["--shadow-xs"],
	sm: tokens["--shadow-sm"],
	md: tokens["--shadow-md"],
	lg: tokens["--shadow-lg"],
} satisfies Record<Exclude<ShadowValue, "none">, string>;

function resolveColor(value: SemanticColor): unknown {
	return colorValues[value];
}

function resolveRadius(value: RadiusValue): unknown {
	return radiusValues[value];
}

function resolveShadow(value: ShadowValue): unknown {
	return value === "none" ? "none" : shadowValues[value];
}

function compileSurfaceColor(props: SurfaceColorProps): StyleXStyles[] {
	const styles: StyleXStyles[] = [];
	if (props.color !== undefined) styles.push(scalarStyles.color(resolveColor(props.color)));
	if (props.bg !== undefined) styles.push(scalarStyles.backgroundColor(resolveColor(props.bg)));
	return styles;
}

function compileRadius(props: RadiusThemeProps): StyleXStyles[] {
	return props.radius === undefined ? [] : [scalarStyles.borderRadius(resolveRadius(props.radius))];
}

function compileShadow(props: ShadowThemeProps): StyleXStyles[] {
	return props.shadow === undefined ? [] : [scalarStyles.boxShadow(resolveShadow(props.shadow))];
}

const surfaceColorThemeProps = createThemePropDefinition<SurfaceColorProps>(
	surfaceColorThemePropKeys,
	compileSurfaceColor,
);
export const radiusThemeProps = createThemePropDefinition<RadiusThemeProps>(radiusThemePropKeys, compileRadius);
export const shadowThemeProps = createThemePropDefinition<ShadowThemeProps>(shadowThemePropKeys, compileShadow);
export const surfaceThemeProps = composeThemeProps(surfaceColorThemeProps, radiusThemeProps, shadowThemeProps);
