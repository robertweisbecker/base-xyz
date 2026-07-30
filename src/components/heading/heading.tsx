import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	getTextMarginStyle,
	textAlignStyles,
	textColorStyles,
	textFamilyStyles,
	textSizeStyles,
	textBaseStyles,
	textTruncationStyles,
	textWeightStyles,
	textWrapStyles,
	type TypographyStyleProps,
} from "../text/text.stylex";

export type HeadingProps = Omit<useRender.ComponentProps<"h2">, "className" | "color" | "render" | "style"> &
	TypographyStyleProps & {
		className?: string;
		render?: useRender.RenderProp;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

export function Heading({
	ref,
	align,
	className,
	color = "default",
	fontFamily = "sans",
	fontWeight = "semibold",
	m,
	mb,
	ml,
	mr,
	mt,
	mx,
	my,
	render,
	size = "5",
	style,
	truncate = false,
	wrap = "balance",
	...props
}: HeadingProps) {
	const sx = stylex.props(
		textBaseStyles.root,
		textFamilyStyles[fontFamily],
		textSizeStyles[size],
		textWeightStyles[fontWeight],
		textColorStyles[color],
		align && textAlignStyles[align],
		textWrapStyles[wrap],
		truncate && textTruncationStyles.singleLine,
		style,
	);

	return useRender<{}, HTMLElement>({
		defaultTagName: "h2",
		render,
		ref,
		props: {
			...props,
			className: [sx.className, className].filter(Boolean).join(" "),
			style: {
				...getTextMarginStyle({ m, mb, ml, mr, mt, mx, my }),
				...sx.style,
			},
		},
	});
}
