import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { zIndex } from "@/styles/constants.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

type StyledHeaderProps = Omit<
	ComponentProps<"header">,
	"children" | "className" | "style" | "xstyle"
> &
	BaseStyleProps & {
		className?: string;
	};

export type NavbarPosition = "absolute" | "fixed" | "sticky";

export type NavbarProps = StyledHeaderProps & {
	end?: ReactNode;
	position?: NavbarPosition;
	start?: ReactNode;
};

export function Navbar({
	ref,
	className,
	end,
	position = "fixed",
	start,
	style,
	xstyle,
	...props
}: NavbarProps) {
	const fillsInlineEdge = position === "absolute" || position === "fixed";
	const sx = stylex.props(
		styles.root,
		positionStyles.anchor,
		fillsInlineEdge && positionStyles.inlineEdges,
		positionStyles[position],
		xstyle,
	);

	return (
		<header
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}
		>
			{start == null ? null : <div {...stylex.props(styles.section)}>{start}</div>}
			{end == null ? null : <div {...stylex.props(styles.section, styles.end)}>{end}</div>}
		</header>
	);
}

const styles = stylex.create({
	root: {
		gap: tokens["--space-3"],
		paddingInline: tokens["--space-4"],
		alignItems: "center",
		backgroundColor: tokens["--surface"],
		boxSizing: "border-box",
		color: tokens["--fg"],
		display: "flex",
		borderBottomColor: tokens["--border"],
		borderBottomStyle: "solid",
		borderBottomWidth: tokens["--border-width"],
		minHeight: tokens["--size-navbar-height"],
	},
	section: {
		gap: tokens["--space-3"],
		alignItems: "center",
		display: "flex",
		minWidth: 0,
	},
	end: {
		marginInlineStart: "auto",
	},
});

const positionStyles = stylex.create({
	anchor: {
		zIndex: zIndex.sticky,
		top: 0,
	},
	inlineEdges: {
		insetInline: 0,
	},
	absolute: {
		position: "absolute",
	},
	fixed: {
		position: "fixed",
	},
	sticky: {
		position: "sticky",
	},
});
