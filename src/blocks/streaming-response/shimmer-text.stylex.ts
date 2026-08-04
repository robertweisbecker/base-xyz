import * as stylex from "@stylexjs/stylex";
import { shimmerTextVars } from "./shimmer-text-vars.stylex";

const shimmerSweep = stylex.keyframes({
	"0%": {
		backgroundPosition: "150% 0",
	},
	"50%": {
		backgroundPosition: "0 0",
	},
	"100%": {
		backgroundPosition: "0 0",
	},
});

export const shimmerTextStyles = stylex.create({
	effect: {
		[shimmerTextVars.base]: "color-mix(in oklch, currentColor 54%, transparent)",
		[shimmerTextVars.duration]: "2000ms",
		[shimmerTextVars.highlight]: "currentColor",
		WebkitBackgroundClip: {
			default: "text",
			"@media (prefers-reduced-motion: reduce)": "initial",
		},
		WebkitTextFillColor: {
			default: "transparent",
			"@media (prefers-reduced-motion: reduce)": "currentColor",
		},
		backgroundPosition: "200% 0",
		animationDuration: shimmerTextVars.duration,
		animationIterationCount: "infinite",
		animationName: {
			default: shimmerSweep,
			"@media (prefers-reduced-motion: reduce)": "none",
		},
		animationTimingFunction: "linear",
		backgroundClip: {
			default: "text",
			"@media (prefers-reduced-motion: reduce)": "border-box",
		},
		backgroundImage: {
			default: `linear-gradient(100deg, ${shimmerTextVars.base} 0 40%, ${shimmerTextVars.highlight} 50%, ${shimmerTextVars.base} 60% 100%)`,
			"@media (prefers-reduced-motion: reduce)": "none",
		},
		backgroundSize: "300% 100%",
		willChange: {
			default: "background-position",
			"@media (prefers-reduced-motion: reduce)": "auto",
		},
	},
	once: {
		animationIterationCount: 1,
	},
	reverse: {
		animationDirection: "reverse",
	},
	none: {
		WebkitBackgroundClip: "initial",
		WebkitTextFillColor: "currentColor",
		animationName: "none",
		backgroundClip: "border-box",
		backgroundImage: "none",
		willChange: "auto",
	},
});
