import * as stylex from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

export type CodeProps = Omit<ComponentProps<"code">, "className" | "style" | keyof MarginProps> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
	};

export function Code({ ref, className, style, xstyle, ...props }: CodeProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(
		styles.root,
		...marginStyles,
		xstyle,
	);

	return (
		<code
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...rest}
		/>
	);
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
