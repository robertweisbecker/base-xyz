import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	composeThemeProps,
	createThemePropDefinition,
	radiusThemePropKeys,
	shadowThemePropKeys,
	surfaceColorThemePropKeys,
} from "../theme/theme-props";
import type {
	RadiusThemeProps,
	RadiusValue,
	SemanticColor,
	ShadowThemeProps,
	ShadowValue,
	SurfaceThemeProps,
} from "../theme/theme-props.types";
import { colorDefaults, radius, shadow } from "./tokens.stylex";

type SurfaceColorProps = Pick<SurfaceThemeProps, "color" | "bg">;

const scalarStyles = stylex.create({
	color: (value) => ({ color: value }),
	backgroundColor: (value) => ({ backgroundColor: value }),
	borderRadius: (value) => ({ borderRadius: value }),
	boxShadow: (value) => ({ boxShadow: value }),
});

function resolveColor(value: SemanticColor): unknown {
	return colorDefaults[value];
}

function resolveRadius(value: RadiusValue): unknown {
	return radius[value];
}

function resolveShadow(value: ShadowValue): unknown {
	return value === "none" ? "none" : shadow[value];
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
