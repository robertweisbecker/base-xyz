import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { motion } from "@/styles/tokens.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { colors } from "@/styles/tokens.stylex";

export type LinkProps = Omit<ComponentProps<"a">, "style"> & {
	external?: boolean;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Link({ ref, children, className, external = false, rel, style, target, ...props }: LinkProps) {
	const sx = stylex.props(linkStyles.root, focusRing.outset, style);

	return (
		<a
			ref={ref}
			className={[sx.className, "ds-link", className].filter(Boolean).join(" ")}
			style={sx.style}
			rel={external ? mergeRel(rel, "noopener noreferrer") : rel}
			target={external ? "_blank" : target}
			{...props}
		>
			{children}
			{external ? <ArrowUpRightIcon aria-hidden size="1em" weight="regular" /> : null}
		</a>
	);
}

function mergeRel(rel: string | undefined, requiredRel: string) {
	return Array.from(new Set(`${rel ?? ""} ${requiredRel}`.trim().split(/\s+/))).join(" ");
}

const linkStyles = stylex.create({
	root: {
		alignItems: "center",
		color: {
			default: colors["--text-accent"],
			":hover": colors["--text-accent-hover"],
		},
		columnGap: "0.2em",
		display: "inline-flex",
		textDecorationColor: {
			default: "color-mix(in srgb, currentColor 50%, transparent)",
			":hover": "currentColor",
		},
		textDecorationLine: "underline",
		textDecorationThickness: "0.075em",
		textUnderlineOffset: "0.25em",
		transitionDuration: motion.durationQuick,
		transitionProperty: "color, text-decoration-color",
		transitionTimingFunction: motion.easeOut,
	},
});
