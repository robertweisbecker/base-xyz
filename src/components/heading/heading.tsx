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
	textWrapStyles,
} from "@/components/text/text.stylex";
import type {
	TypographyColor,
	TypographyFontFamily,
	TypographyFontWeight,
	TypographySize,
	TypographyWrap,
} from "@/components/text/text.types";
import { attrJoin } from "@/utils/attr-join";

export type HeadingProps = Omit<
	useRender.ComponentProps<"h2">,
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
		truncate?: boolean;
		wrap?: TypographyWrap;
	};

export function Heading({
	ref,
	className,
	color = "default",
	fontFamily = "sans",
	fontWeight = "semibold",
	textAlign,
	render,
	size = "5",
	style,
	xstyle,
	truncate = false,
	wrap = "balance",
	...props
}: HeadingProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(
		textBaseStyles.root,
		typescaleStyles[size],
		textColorStyles[color],
		textWrapStyles[wrap],
		truncate && textTruncationStyles.truncate,
		...resolveTypography({ fontFamily, fontWeight, textAlign }),
		...marginStyles,
		xstyle,
	);

	return useRender<{}, HTMLElement>({
		defaultTagName: "h2",
		render,
		ref,
		props: {
			...rest,
			className: attrJoin(sx.className, className),
			style: mergeStyle(sx.style, style),
		},
	});
}
