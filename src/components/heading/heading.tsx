import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { resolveThemeProps } from "@/theme/theme-props";
import {
	textColorStyles,
	fontFamilyStyles,
	typescaleStyles,
	textBaseStyles,
	textTruncationStyles,
	fontWeightStyles,
	textWrapStyles,
	textThemeProps,
} from "@/components/text/text.stylex";
import type { TypographyStyleProps } from "@/components/text/text.types";

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
		fontFamilyStyles[fontFamily],
		typescaleStyles[size],
		fontWeightStyles[fontWeight],
		textColorStyles[color],
		textWrapStyles[wrap],
		truncate && textTruncationStyles.truncate,
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
