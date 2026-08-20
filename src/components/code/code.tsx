import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";


export type CodeProps = Omit<ComponentProps<"code">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Code({ ref, className, style, ...props }: CodeProps) {
	const sx = stylex.props(styles.root, style);
	return <code ref={ref} className={attrJoin(sx.className, className)} style={sx.style} {...props} />;
}

const styles = stylex.create({
	root: {
		borderRadius: "0.45em",
		marginBlock: "-0.25em",
		paddingBlock: "0.125lh",
		paddingInline: "0.45em",
		backgroundColor: tokens["--bg-inset"],
		color: tokens["--fg-muted"],
		display: "inline",
		fontFamily: tokens["--font-family-mono"],
		fontSize: "0.875em",
		fontWeight: tokens["--font-weight-regular"],
		lineHeight: "1em",
		outlineColor: "color-mix(in srgb, currentColor 10%, transparent)",
		outlineOffset: "-0.0625rem",
		outlineStyle: "solid",
		outlineWidth: "0.0625rem",
		verticalAlign: "baseline",
		whiteSpace: "nowrap",
	},
});
