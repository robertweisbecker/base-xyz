import { Separator as BaseSeparator } from "@base-ui/react/separator";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { color } from "@/styles/tokens.stylex";

export type SeparatorProps = Omit<BaseSeparator.Props, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Separator({ ref, className, orientation = "horizontal", style, ...props }: SeparatorProps) {
	const sx = stylex.props(separatorParts.root, orientationVariants[orientation], style);

	return (
		<BaseSeparator
			ref={ref}
			orientation={orientation}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
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
