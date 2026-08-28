import { Separator as BaseSeparator } from "@base-ui/react/separator";
import * as stylex from "@stylexjs/stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

export type SeparatorProps = Omit<
	BaseSeparator.Props,
	"className" | "color" | "height" | "style" | "width" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
	};

export function Separator({
	ref,
	className,
	orientation = "horizontal",
	style,
	xstyle,
	...props
}: SeparatorProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(
		separatorParts.root,
		orientationVariants[orientation],
		...marginStyles,
		xstyle,
	);

	return (
		<BaseSeparator
			ref={ref}
			orientation={orientation}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...rest}
		/>
	);
}

const separatorParts = stylex.create({
	root: {
		backgroundColor: tokens["--border"],
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
