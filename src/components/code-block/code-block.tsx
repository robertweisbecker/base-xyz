import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { fontFamily, fontSize, lineHeight } from "@/styles/tokens.stylex";
import { color, radius, space } from "@/styles/tokens.stylex";

export type CodeBlockProps = Omit<ComponentProps<"pre">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function CodeBlock({ ref, children, className, style, ...props }: CodeBlockProps) {
	const sx = stylex.props(styles.root, style);
	return (
		<pre ref={ref} className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props}>
			<code>{children}</code>
		</pre>
	);
}

const styles = stylex.create({
	root: {
		margin: 0,
		padding: space.x2,
		borderRadius: radius.sm,
		backgroundColor: color.surfaceSubtle,
		color: color.fg,
		fontFamily: fontFamily.mono,
		fontSize: fontSize.x1,
		lineHeight: lineHeight.x2,
		overflowWrap: "anywhere",
		whiteSpace: "pre-wrap",
	},
});
