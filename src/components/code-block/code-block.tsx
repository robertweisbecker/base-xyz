import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { tokens } from "@/theme/tokens.stylex";

import { ScrollArea } from "../scroll-area/scroll-area";

export type CodeBlockProps = Omit<ComponentProps<"pre">, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function CodeBlock({ ref, children, className, style, ...props }: CodeBlockProps) {
	return (
		<ScrollArea
			className={className}
			label="Code block"
			orientation="horizontal"
			size="content"
			style={[styles.root, style]}
			contentStyle={styles.content}>
			<pre ref={ref} {...stylex.props(styles.pre)} {...props}>
				<code>{children}</code>
			</pre>
		</ScrollArea>
	);
}

const styles = stylex.create({
	root: {
		borderRadius: tokens["--radius-sm"],
		backgroundColor: tokens["--surface-subtle"],
		maxWidth: "100%",
		width: "100%",
	},
	content: {
		minWidth: "100%",
		width: "max-content",
	},
	pre: {
		margin: 0,
		padding: tokens["--space-2"],
		boxSizing: "border-box",
		color: tokens["--fg"],
		fontFamily: tokens["--font-family-mono"],
		fontSize: tokens["--font-size-1"],
		lineHeight: tokens["--line-height-2"],
		whiteSpace: "pre",
		minWidth: "100%",
	},
});
