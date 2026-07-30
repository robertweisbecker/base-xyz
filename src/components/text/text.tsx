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
} from "./text.stylex";

export type TextProps = Omit<useRender.ComponentProps<"p">, "className" | "color" | "render" | "style"> &
	TypographyStyleProps & {
		className?: string;
		render?: useRender.RenderProp;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

export function Text({
	ref,
	align,
	className,
	color = "default",
	fontFamily = "sans",
	fontWeight = "regular",
	m,
	mb,
	ml,
	mr,
	mt,
	mx,
	my,
	render,
	size = "2",
	style,
	truncate = false,
	wrap = "wrap",
	...props
}: TextProps) {
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
		defaultTagName: "p",
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
