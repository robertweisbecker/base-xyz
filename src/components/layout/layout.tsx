import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { Ref } from "react";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { resolveChildLayout, type ChildLayoutProps } from "@/styles/props/child-layout.stylex";
import {
	displayStyles,
	resolveFlexLayout,
	type DisplayProps,
	type FlexLayoutProps,
} from "@/styles/props/flex.stylex";
import { resolveGridLayout, type GridLayoutProps } from "@/styles/props/grid.stylex";
import { resolvePosition, type PositionProps } from "@/styles/props/position.stylex";
import { resolveSizing, type SizingProps } from "@/styles/props/sizing.stylex";
import {
	extractMarginProps,
	resolveGap,
	resolvePadding,
	type MarginProps,
	type PaddingProps,
} from "@/styles/props/spacing.stylex";
import { resolveSurface, type SurfaceProps } from "@/styles/props/surface.stylex";
import { resolveTypography, type TypographyProps } from "@/styles/props/typography.stylex";
import { layoutBaseStyles } from "./layout.stylex";
import { attrJoin } from "@/utils/attr-join";

export type BoxStyleProps = DisplayProps &
	MarginProps &
	PaddingProps &
	SizingProps &
	PositionProps &
	ChildLayoutProps &
	SurfaceProps &
	TypographyProps;

export type StackStyleProps = BoxStyleProps & FlexLayoutProps;
export type GridStyleProps = BoxStyleProps & GridLayoutProps;

type LayoutElementProps = Omit<
	useRender.ComponentProps<"div">,
	"className" | "color" | "height" | "render" | "style" | "width" | keyof BoxStyleProps
> & {
	className?: string;
	ref?: Ref<HTMLElement>;
	render?: useRender.RenderProp;
} & BaseStyleProps;

export type BoxProps = LayoutElementProps & BoxStyleProps;
export type StackProps = LayoutElementProps & StackStyleProps;
export type GridProps = LayoutElementProps & GridStyleProps;

type BoxStylePropsWithoutMargin = Omit<BoxStyleProps, keyof MarginProps>;

function splitBoxStyleProps<T extends BoxStylePropsWithoutMargin>(props: T) {
	const {
		display,
		p,
		px,
		py,
		pt,
		pb,
		ps,
		pe,
		width,
		height,
		minWidth,
		maxWidth,
		minHeight,
		maxHeight,
		position,
		inset,
		insetX,
		insetY,
		insetTop,
		insetBottom,
		insetStart,
		insetEnd,
		zIndex,
		alignSelf,
		justifySelf,
		flexBasis,
		flexGrow,
		flexShrink,
		order,
		columnSpan,
		rowSpan,
		bg,
		color,
		radius,
		shadow,
		border,
		fontFamily,
		fontSize,
		fontWeight,
		lineHeight,
		textAlign,
		...rest
	} = props;

	return {
		styleProps: {
			display,
			p,
			px,
			py,
			pt,
			pb,
			ps,
			pe,
			width,
			height,
			minWidth,
			maxWidth,
			minHeight,
			maxHeight,
			position,
			inset,
			insetX,
			insetY,
			insetTop,
			insetBottom,
			insetStart,
			insetEnd,
			zIndex,
			alignSelf,
			justifySelf,
			flexBasis,
			flexGrow,
			flexShrink,
			order,
			columnSpan,
			rowSpan,
			bg,
			color,
			radius,
			shadow,
			border,
			fontFamily,
			fontSize,
			fontWeight,
			lineHeight,
			textAlign,
		},
		rest,
	};
}

function resolveBoxStyles(props: BoxStylePropsWithoutMargin): StyleXStyles[] {
	return [
		...resolvePadding(props),
		...resolveSizing(props),
		...resolvePosition(props),
		...resolveChildLayout(props),
		...resolveSurface(props),
		...resolveTypography(props),
	];
}

export function Box({
	className,
	ref,
	render,
	style,
	xstyle,
	...props
}: BoxProps) {
	const { marginStyles, rest: propsWithoutMargin } = extractMarginProps(props);
	const { styleProps, rest } = splitBoxStyleProps(propsWithoutMargin);
	const sx = stylex.props(
		layoutBaseStyles.box,
		styleProps.display !== undefined && displayStyles[styleProps.display],
		...marginStyles,
		...resolveBoxStyles(styleProps),
		xstyle,
	);

	return useRender<{}, HTMLElement>({
		defaultTagName: "div",
		ref,
		render,
		props: {
			...rest,
			className: attrJoin(sx.className, className),
			style: mergeStyle(sx.style, style),
		},
	});
}

/** `reverse` only changes visual order. Semantic and keyboard order remain in DOM order. */
export function Stack({
	className,
	ref,
	render,
	style,
	xstyle,
	gap,
	gapX,
	gapY,
	orientation,
	reverse,
	align,
	justify,
	wrap,
	...props
}: StackProps) {
	const { marginStyles, rest: propsWithoutMargin } = extractMarginProps(props);
	const { styleProps, rest } = splitBoxStyleProps(propsWithoutMargin);
	const sx = stylex.props(
		layoutBaseStyles.stack,
		...resolveGap({ gap, gapX, gapY }),
		...resolveFlexLayout({ orientation, reverse, align, justify, wrap }),
		styleProps.display !== undefined && displayStyles[styleProps.display],
		...marginStyles,
		...resolveBoxStyles(styleProps),
		xstyle,
	);

	return useRender<{}, HTMLElement>({
		defaultTagName: "div",
		ref,
		render,
		props: {
			...rest,
			className: attrJoin(sx.className, className),
			style: mergeStyle(sx.style, style),
		},
	});
}

export function Grid({
	className,
	ref,
	render,
	style,
	xstyle,
	gap,
	gapX,
	gapY,
	columns,
	flow,
	align,
	justify,
	...props
}: GridProps) {
	const { marginStyles, rest: propsWithoutMargin } = extractMarginProps(props);
	const { styleProps, rest } = splitBoxStyleProps(propsWithoutMargin);
	const sx = stylex.props(
		layoutBaseStyles.grid,
		...resolveGap({ gap, gapX, gapY }),
		...resolveGridLayout({ columns, flow, align, justify }),
		styleProps.display !== undefined && displayStyles[styleProps.display],
		...marginStyles,
		...resolveBoxStyles(styleProps),
		xstyle,
	);

	return useRender<{}, HTMLElement>({
		defaultTagName: "div",
		ref,
		render,
		props: {
			...rest,
			className: attrJoin(sx.className, className),
			style: mergeStyle(sx.style, style),
		},
	});
}
