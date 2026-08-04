import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { fontFamily, fontWeight } from "@/styles/tokens.stylex";
import { colors } from "@/styles/tokens.stylex";

export type CodeProps = Omit<ComponentProps<"code">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Code({ ref, className, style, ...props }: CodeProps) {
	const sx = stylex.props(styles.root, style);
	return <code ref={ref} className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

const styles = stylex.create({
	root: {
		borderRadius: "0.45em",
		marginBlock: "-0.25em",
		paddingBlock: "0.125lh",
		paddingInline: "0.45em",
		backgroundColor: colors["--canvas-subtle"],
		color: colors["--text-muted"],
		display: "inline",
		fontFamily: fontFamily.mono,
		fontSize: "0.875em",
		fontWeight: fontWeight.regular,
		lineHeight: "1em",
		outlineColor: "color-mix(in srgb, currentColor 10%, transparent)",
		outlineOffset: "-0.0625rem",
		outlineStyle: "solid",
		outlineWidth: "0.0625rem",
		verticalAlign: "baseline",
		whiteSpace: "nowrap",
	},
});
