import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { Ref } from "react";
import {
	composeThemeProps,
	resolveThemeProps,
	type ThemePropDefinition,
	type ThemePropsOf,
} from "@/theme/theme-props";
import {
	childLayoutThemeProps,
	displayThemeProps,
	gridLayoutThemeProps,
	positioningThemeProps,
	sizingThemeProps,
	verticalFlexThemeProps,
} from "@/theme/theme-props-layout.stylex";
import { spacingThemeProps } from "@/theme/theme-props-spacing.stylex";
import { surfaceThemeProps } from "@/theme/theme-props-surface.stylex";
import { layoutBaseStyles } from "./layout.stylex";
import { attrJoin } from "@/utils/attr-join";

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

export type BoxThemeProps = ThemePropsOf<typeof boxThemeProps>;
export type StackThemeProps = ThemePropsOf<typeof stackThemeProps>;
export type GridThemeProps = ThemePropsOf<typeof gridThemeProps>;

export type BoxProps = LayoutElementProps<BoxThemeProps> & BoxThemeProps;
export type StackProps = LayoutElementProps<StackThemeProps> & StackThemeProps;
export type GridProps = LayoutElementProps<GridThemeProps> & GridThemeProps;

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
	// SAFETY: TypeScript cannot retain ThemeProps through a rest operation over a generic intersection.
	const { restProps, styles } = resolveThemeProps(props as typeof props & Partial<ThemeProps>, definition);
	const sx = stylex.props(layoutBaseStyles[kind], ...styles, style);

	return useRender<{}, HTMLElement>({
		defaultTagName: "div",
		ref,
		render,
		props: {
			...restProps,
			className: attrJoin(sx.className, className),
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
