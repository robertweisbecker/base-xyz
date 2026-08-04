import { Separator as BaseSeparator } from "@base-ui/react/separator";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	composeThemeProps,
	resolveThemeProps,
	type VerifyThemeProps,
} from "@/theme/theme-props";
import {
	childLayoutThemeProps,
	positioningThemeProps,
	sizingThemeProps,
} from "@/styles/theme-props-layout.stylex";
import { marginThemeProps } from "@/styles/theme-props-spacing.stylex";
import type { ChildLayoutProps, MarginProps, PositioningProps, SizingProps } from "@/theme/theme-props.types";
import { color } from "@/styles/tokens.stylex";

export interface SeparatorThemeProps extends MarginProps, SizingProps, PositioningProps, ChildLayoutProps {}
const separatorThemeProps = composeThemeProps(
	marginThemeProps,
	sizingThemeProps,
	positioningThemeProps,
	childLayoutThemeProps,
);
type VerifiedSeparatorThemeProps = VerifyThemeProps<SeparatorThemeProps, typeof separatorThemeProps>;

export type SeparatorProps = Omit<
	BaseSeparator.Props,
	"className" | "color" | "height" | "style" | "width" | keyof VerifiedSeparatorThemeProps
> &
	VerifiedSeparatorThemeProps & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Separator({ ref, className, orientation = "horizontal", style, ...props }: SeparatorProps) {
	const { restProps, styles } = resolveThemeProps(props, separatorThemeProps);
	const sx = stylex.props(separatorParts.root, orientationVariants[orientation], ...styles, style);

	return (
		<BaseSeparator
			ref={ref}
			orientation={orientation}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...restProps}
		/>
	);
}

const separatorParts = stylex.create({
	root: {
		backgroundColor: color.border,
		flexShrink: 0,
	},
});

const orientationVariants = stylex.create({
	horizontal: {
		height: "1px",
		width: "100%",
	},
	vertical: {
		alignSelf: "stretch",
		minHeight: "1em",
		width: "1px",
	},
});
