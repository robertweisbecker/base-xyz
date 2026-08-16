import { composeThemeProps, type ThemePropsOf } from "@/theme/theme-props";
import {
	childLayoutThemeProps,
	positioningThemeProps,
	sizingThemeProps,
} from "@/theme/theme-props-layout.stylex";
import { gapThemeProps, spacingThemeProps } from "@/theme/theme-props-spacing.stylex";
export const buttonThemeProps = composeThemeProps(
	spacingThemeProps,
	sizingThemeProps,
	positioningThemeProps,
	childLayoutThemeProps,
	gapThemeProps,
);

export type ButtonThemeProps = ThemePropsOf<typeof buttonThemeProps>;
