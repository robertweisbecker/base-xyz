import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { resolveThemeProps } from "@/theme/theme-props";
import {
	textColorPropStyles,
	textFamilyStyles,
	textSizeStyles,
	textBaseStyles,
	textTruncationStyles,
	textWeightStyles,
	textWrapStyles,
	textThemeProps,
} from "./text.stylex";
import type { TypographyStyleProps } from "./text.types";

export type TextProps = Omit<
	useRender.ComponentProps<"p">,
	"align" | "className" | "color" | "render" | "style" | keyof TypographyStyleProps
> &
	TypographyStyleProps & {
		className?: string;
		render?: useRender.RenderProp;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

export function Text({
	ref,
	className,
	color = "default",
	fontFamily = "sans",
	fontWeight = "regular",
	render,
	size = "2",
	style,
	truncate = false,
	wrap = "wrap",
	...props
}: TextProps) {
	const { restProps, styles } = resolveThemeProps(props, textThemeProps);
	const sx = stylex.props(
		textBaseStyles.root,
		textFamilyStyles[fontFamily],
		textSizeStyles[size],
		textWeightStyles[fontWeight],
		textColorPropStyles[color],
		textWrapStyles[wrap],
		truncate && textTruncationStyles.singleLine,
		...styles,
		style,
	);

	return useRender<{}, HTMLElement>({
		defaultTagName: "p",
		render,
		ref,
		props: {
			...restProps,
			className: [sx.className, className].filter(Boolean).join(" "),
			style: sx.style,
		},
	});
}
