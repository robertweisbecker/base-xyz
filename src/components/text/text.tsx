import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { resolveTypography, type TypographyProps } from "@/styles/props/typography.stylex";
import {
	textColorStyles,
	typescaleStyles,
	textBaseStyles,
	textTruncationStyles,
	textTabularStyles,
	textWrapStyles,
} from "./text.stylex";
import type { TypographyColor, TypographyFontFamily, TypographyFontWeight, TypographySize, TypographyWrap } from "./text.types";
import { attrJoin } from "@/utils/attr-join";

export type TextProps = Omit<
	useRender.ComponentProps<"p">,
	"className" | "color" | "render" | "style" | "xstyle" | keyof MarginProps | keyof TypographyProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		color?: TypographyColor;
		fontFamily?: TypographyFontFamily;
		fontWeight?: TypographyFontWeight;
		textAlign?: TypographyProps["textAlign"];
		render?: useRender.RenderProp;
		size?: TypographySize;
		tabular?: boolean;
		truncate?: boolean;
		wrap?: TypographyWrap;
	};

export function Text({
	ref,
	className,
	color = "default",
	fontFamily = "sans",
	fontWeight = "regular",
	textAlign,
	render,
	size = "2",
	style,
	xstyle,
	tabular = false,
	truncate = false,
	wrap = "wrap",
	...props
}: TextProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(
		textBaseStyles.root,
		typescaleStyles[size],
		textColorStyles[color],
		textWrapStyles[wrap],
		truncate && textTruncationStyles.truncate,
		tabular && textTabularStyles.tabular,
		...resolveTypography({ fontFamily, fontWeight, textAlign }),
		...marginStyles,
		xstyle,
	);

	return useRender<{}, HTMLElement>({
		defaultTagName: "p",
		render,
		ref,
		props: {
			...rest,
			className: attrJoin(sx.className, className),
			style: mergeStyle(sx.style, style),
		},
	});
}
