import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import type { BaseStyleProps } from "@/styles/props/base";
import type { MarginProps } from "@/styles/props/spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";

import { ScrollArea } from "@/components/scroll-area/scroll-area";

export type CodeBlockProps = Omit<
	ComponentProps<"pre">,
	"className" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
	};

export function CodeBlock({
	ref,
	children,
	className,
	style,
	xstyle,
	m,
	mx,
	my,
	mt,
	mb,
	ms,
	me,
	...preProps
}: CodeBlockProps) {
	const marginProps = { m, mx, my, mt, mb, ms, me };

	return (
		<ScrollArea
			className={className}
			label="Code block"
			{...marginProps}
			orientation="horizontal"
			size="content"
			style={style}
			xstyle={[styles.root, xstyle]}
		>
			<pre ref={ref} {...stylex.props(styles.pre)} {...preProps}>
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
		width: "max-content",
	},
});
