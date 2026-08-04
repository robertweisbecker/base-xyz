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
} from "../text/text.stylex";
import type { TypographyStyleProps } from "../text/text.types";

export type HeadingProps = Omit<
	useRender.ComponentProps<"h2">,
	"align" | "className" | "color" | "render" | "style" | keyof TypographyStyleProps
> &
	TypographyStyleProps & {
		className?: string;
		render?: useRender.RenderProp;
		/** StyleX overrides, applied after the component's own styles. */
		style?: StyleXStyles;
	};

export function Heading({
	ref,
	className,
	color = "default",
	fontFamily = "sans",
	fontWeight = "semibold",
	render,
	size = "5",
	style,
	truncate = false,
	wrap = "balance",
	...props
}: HeadingProps) {
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
		defaultTagName: "h2",
		render,
		ref,
		props: {
			...restProps,
			className: [sx.className, className].filter(Boolean).join(" "),
			style: sx.style,
		},
	});
}
