import {
	composeThemeProps,
	type ThemePropDefinition,
	type VerifyThemeProps,
} from "@/theme/theme-props";
import {
	childLayoutThemeProps,
	positioningThemeProps,
	sizingThemeProps,
} from "@/theme/theme-props-layout.stylex";
import { gapThemeProps, spacingThemeProps } from "@/theme/theme-props-spacing.stylex";
import type {
	ChildLayoutProps,
	GapProps,
	PositioningProps,
	SizingProps,
	SpacingProps,
} from "@/theme/theme-props.types";

export interface ButtonThemeProps
	extends SpacingProps, SizingProps, PositioningProps, ChildLayoutProps, GapProps {}

const buttonThemePropsDefinition = composeThemeProps(
	spacingThemeProps,
	sizingThemeProps,
	positioningThemeProps,
	childLayoutThemeProps,
	gapThemeProps,
);

export const buttonThemeProps: ThemePropDefinition<
	VerifyThemeProps<ButtonThemeProps, typeof buttonThemePropsDefinition>
> = buttonThemePropsDefinition;
