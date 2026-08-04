import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { type ComponentProps } from "react";
import { tokens } from "@/theme/tokens.stylex";
import { focusRing } from "@/styles/recipes/focus";

export type LinkVariant = "accent" | "neutral";

export type LinkProps = Omit<ComponentProps<"a">, "style"> & {
	external?: boolean;
	variant?: LinkVariant;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Link({
	ref,
	children,
	className,
	external = false,
	rel,
	style,
	target,
	variant = "accent",
	...props
}: LinkProps) {
	const sx = stylex.props(linkStyles.root, linkVariants[variant], focusRing.outset, style);

	return (
		<a
			ref={ref}
			className={[sx.className, "ds-link", className].filter(Boolean).join(" ")}
			style={sx.style}
			rel={external ? mergeRel(rel, "noopener noreferrer") : rel}
			target={external ? "_blank" : target}
			{...props}>
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
		columnGap: "0.125em",
		display: "inline-flex",
		textDecorationColor: {
			default: "color-mix(in srgb, currentColor 50%, transparent)",
			":hover": "currentColor",
		},
		textDecorationLine: "underline",
		textDecorationThickness: "0.075em",
		textUnderlineOffset: "0.25em",
		transitionDuration: tokens["--motion-duration-quick"],
		transitionProperty: "color, text-decoration-color",
		transitionTimingFunction: tokens["--motion-ease-out"],
	},
});

const linkVariants = stylex.create({
	accent: {
		color: {
			default: tokens["--fg-accent"],
			":hover": tokens["--fg-accent-hover"],
		},
	},
	neutral: {
		color: {
			default: tokens["--fg-muted"],
			":hover": tokens["--fg"],
		},
	},
});
