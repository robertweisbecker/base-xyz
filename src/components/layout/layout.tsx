import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { Ref } from "react";
import {
	composeThemeProps,
	resolveThemeProps,
	type ThemePropDefinition,
	type VerifyThemeProps,
} from "@/theme/theme-props";
import {
	childLayoutThemeProps,
	displayThemeProps,
	gridLayoutThemeProps,
	positioningThemeProps,
	sizingThemeProps,
	verticalFlexThemeProps,
} from "@/styles/theme-props-layout.stylex";
import { spacingThemeProps } from "@/styles/theme-props-spacing.stylex";
import { surfaceThemeProps } from "@/styles/theme-props-surface.stylex";
import type {
	ChildLayoutProps,
	DisplayProps,
	FlexProps,
	GridLayoutProps,
	PositioningProps,
	SizingProps,
	SpacingProps,
	SurfaceThemeProps,
} from "@/theme/theme-props.types";
import { layoutBaseStyles } from "./layout.stylex";

type LayoutElementProps<ThemeProps> = Omit<
	useRender.ComponentProps<"div">,
	"className" | "color" | "height" | "render" | "style" | "width" | keyof ThemeProps
> & {
	className?: string;
	ref?: Ref<HTMLElement>;
	render?: useRender.RenderProp;
	/** StyleX overrides, applied after defaults and theme props. */
	style?: StyleXStyles;
};

const boxThemeProps = composeThemeProps(
	spacingThemeProps,
	sizingThemeProps,
	positioningThemeProps,
	childLayoutThemeProps,
	surfaceThemeProps,
	displayThemeProps,
);
const stackThemeProps = composeThemeProps(boxThemeProps, verticalFlexThemeProps);
const gridThemeProps = composeThemeProps(boxThemeProps, gridLayoutThemeProps);

export interface BoxThemeProps
	extends SpacingProps, SizingProps, PositioningProps, ChildLayoutProps, SurfaceThemeProps, DisplayProps {}
export interface StackThemeProps extends BoxThemeProps, FlexProps {}
export interface GridThemeProps extends BoxThemeProps, GridLayoutProps {}

type VerifiedBoxThemeProps = VerifyThemeProps<BoxThemeProps, typeof boxThemeProps>;
type VerifiedStackThemeProps = VerifyThemeProps<StackThemeProps, typeof stackThemeProps>;
type VerifiedGridThemeProps = VerifyThemeProps<GridThemeProps, typeof gridThemeProps>;

export type BoxProps = LayoutElementProps<VerifiedBoxThemeProps> & VerifiedBoxThemeProps;
export type StackProps = LayoutElementProps<VerifiedStackThemeProps> & VerifiedStackThemeProps;
export type GridProps = LayoutElementProps<VerifiedGridThemeProps> & VerifiedGridThemeProps;

function useLayoutRender<ThemeProps extends object>(
	kind: "box" | "stack" | "grid",
	definition: ThemePropDefinition<ThemeProps>,
	{
		className,
		ref,
		render,
		style,
		...props
	}: LayoutElementProps<ThemeProps> & ThemeProps,
) {
	// TypeScript cannot retain ThemeProps through a rest operation over a generic intersection.
	const { restProps, styles } = resolveThemeProps(props as typeof props & Partial<ThemeProps>, definition);
	const sx = stylex.props(layoutBaseStyles[kind], ...styles, style);

	return useRender<{}, HTMLElement>({
		defaultTagName: "div",
		ref,
		render,
		props: {
			...restProps,
			className: [sx.className, className].filter(Boolean).join(" "),
			style: sx.style,
		},
	});
}

export function Box(props: BoxProps) {
	return useLayoutRender("box", boxThemeProps, props);
}

/** `reverse` only changes visual order. Semantic and keyboard order remain in DOM order. */
export function Stack(props: StackProps) {
	return useLayoutRender("stack", stackThemeProps, props);
}

export function Grid(props: GridProps) {
	return useLayoutRender("grid", gridThemeProps, props);
}
