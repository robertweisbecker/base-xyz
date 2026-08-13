import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentProps } from "react";
import { media } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

export type LoaderProps = Omit<ComponentProps<"svg">, "children" | "height" | "style" | "width"> & {
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Loader({
	"aria-hidden": ariaHidden,
	"aria-label": ariaLabel,
	className,
	focusable = "false",
	role,
	style,
	...props
}: LoaderProps) {
	const isDecorative = ariaHidden === true || ariaHidden === "true" || (ariaHidden == null && ariaLabel == null);
	const sx = stylex.props(loaderParts.root, style);

	return (
		<svg
			aria-hidden={isDecorative || undefined}
			aria-label={ariaLabel}
			className={[sx.className, className].filter(Boolean).join(" ")}
			focusable={focusable}
			role={role ?? (isDecorative ? undefined : "progressbar")}
			style={sx.style}
			viewBox="0 0 24 24"
			{...props}>
			<circle {...stylex.props(loaderParts.track)} cx="12" cy="12" r="9" />
			<circle {...stylex.props(loaderParts.indicator)} cx="12" cy="12" pathLength="100" r="9" />
		</svg>
	);
}

const rotate = stylex.keyframes({
	to: { transform: "rotate(360deg)" },
});

const changeArcLength = stylex.keyframes({
	"0%": {
		strokeDasharray: "14 86",
		strokeDashoffset: 0,
	},
	"50%": {
		strokeDasharray: "62 38",
		strokeDashoffset: -18,
	},
	"100%": {
		strokeDasharray: "14 86",
		strokeDashoffset: -100,
	},
});

const loaderParts = stylex.create({
	root: {
		overflow: "visible",
		alignItems: "center",
		animationDuration: `calc(${tokens["--motion-duration-long"]} + ${tokens["--motion-duration-long"]})`,
		animationIterationCount: "infinite",
		animationName: {
			default: rotate,
			[media.reducedMotion]: "none",
		},
		animationTimingFunction: "linear",
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		transformOrigin: "center",
		verticalAlign: "-0.125em",
		height: "1em",
		minHeight: "1em",
		minWidth: "1em",
		width: "1em",
	},
	track: {
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 3,
		opacity: 0.28,
	},
	indicator: {
		fill: "none",
		stroke: "currentColor",
		strokeDasharray: "14 86",
		strokeLinecap: "round",
		strokeWidth: 3,
		animationDuration: `calc(${tokens["--motion-duration-long"]} * 5)`,
		animationIterationCount: "infinite",
		animationName: {
			default: changeArcLength,
			[media.reducedMotion]: "none",
		},
		animationTimingFunction: "ease-in-out",
	},
});
