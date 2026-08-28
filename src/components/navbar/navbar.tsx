import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";
import { zIndex } from "@/styles/constants.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

type StyledHeaderProps = Omit<
	ComponentProps<"header">,
	"children" | "className" | "style" | "xstyle"
> &
	BaseStyleProps & {
		className?: string;
	};

export type NavbarPosition = "static" | "sticky";

export type NavbarProps = StyledHeaderProps &
	MarginProps & {
		end?: ReactNode;
		position?: NavbarPosition;
		start?: ReactNode;
	};

export function Navbar({
	ref,
	className,
	end,
	position = "static",
	start,
	style,
	xstyle,
	...props
}: NavbarProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(styles.root, positionStyles[position], ...marginStyles, xstyle);

	return (
		<header
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...rest}
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
		width: "100%",
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
	static: {
		position: "static",
	},
	sticky: {
		position: "sticky",
		zIndex: zIndex.sticky,
		top: 0,
	},
});
