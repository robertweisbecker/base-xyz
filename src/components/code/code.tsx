import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { fontFamily } from "@/styles/tokens.stylex";
import { color } from "@/styles/tokens.stylex";

export type CodeProps = Omit<ComponentProps<"code">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Code({ ref, className, style, ...props }: CodeProps) {
	const sx = stylex.props(styles.root, style);
	return (
		<code ref={ref} className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />
	);
}

const styles = stylex.create({
	root: {
		borderRadius: "0.45em",
		marginBlock: "-0.25em",
		paddingBlock: "0.25em",
		paddingInline: "0.45em",
		backgroundColor: color.surface,
		display: "inline",
		fontFamily: fontFamily.mono,
		fontSize: "0.875em",
		lineHeight: "inherit",
		outlineColor: "color-mix(in srgb, currentColor 10%, transparent)",
		outlineOffset: "-0.0625rem",
		outlineStyle: "solid",
		outlineWidth: "0.0625rem",
		verticalAlign: "baseline",
		whiteSpace: "nowrap",
	},
});
