import * as stylex from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { attrJoin } from "@/utils/attr-join";
import { externalLinkIndicator, resolveExternalLinkProps } from "./link-utils";

export type LinkColor = keyof typeof linkColors;

export type LinkProps = Omit<ComponentProps<"a">, "style" | keyof MarginProps> &
	MarginProps &
	BaseStyleProps & {
		external?: boolean;
		color?: LinkColor;
	};

export function Link({
	ref,
	children,
	className,
	external = false,
	rel,
	style,
	target,
	color = "accent",
	xstyle,
	...props
}: LinkProps) {
	const resolvedLinkProps = resolveExternalLinkProps({ external, rel, target });
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(
		linkStyles.root,
		linkColors[color],
		focusRing.offset,
		...marginStyles,
		xstyle,
	);

	return (
		<a
			ref={ref}
			className={attrJoin(sx.className, "xyz-link", className)}
			style={mergeStyle(sx.style, style)}
			rel={resolvedLinkProps.rel}
			target={resolvedLinkProps.target}
			{...rest}
		>
			{children}
			{external ? externalLinkIndicator : null}
		</a>
	);
}

const linkStyles = stylex.create({
	root: {
		alignItems: "center",
		columnGap: "0.25em",
		display: "inline-flex",
		textDecorationColor: {
			default: "color-mix(in srgb, currentColor 40%, transparent)",
			":hover": "currentColor",
		},
		textDecorationLine: "underline",
		// eslint-disable-next-line @stylexjs/valid-styles -- the compiler and target browsers support CSS round().
		textDecorationThickness: "round(0.075em,.5px)",
		textUnderlineOffset: "0.25em",
		transitionDuration: tokens["--motion-duration-quick"],
		transitionProperty: "color, text-decoration-color",
		transitionTimingFunction: tokens["--motion-ease-out"],
	},
});

const linkColors = stylex.create({
	accent: {
		color: {
			default: tokens["--fg-accent"],
			":hover": tokens["--fg-accent-strong"],
		},
	},
	neutral: {
		color: {
			default: tokens["--fg"],
			":hover": tokens["--fg-muted"],
		},
	},
	inherit: {
		color: {
			default: "currentColor",
			":hover": tokens["--fg"],
		},
	},
});
