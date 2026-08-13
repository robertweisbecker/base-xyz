import * as stylex from "@stylexjs/stylex";
import { media } from "@/styles/constants.stylex";
import { shimmerTextVars } from "@/styles/recipes/shimmer-text-vars.stylex";
import { tokens } from "@/theme/tokens.stylex";

const shimmerSweep = stylex.keyframes({
	"0%": {
		backgroundPosition: "150% 0",
	},
	"50%": {
		backgroundPosition: "0 0",
	},
	"100%": {
		backgroundPosition: "-150% 0",
	},
});

export const shimmerTextStyles = stylex.create({
	effect: {
		[shimmerTextVars.base]: "color-mix(in oklch, currentColor 54%, transparent)",
		[shimmerTextVars.duration]: "2000ms",
		[shimmerTextVars.highlight]: `color-mix(in srgb, currentColor, ${tokens["--bg-inverse"]})`,
		WebkitBackgroundClip: {
			default: "text",
			[media.reducedMotion]: "initial",
		},
		WebkitTextFillColor: {
			default: "transparent",
			[media.reducedMotion]: "currentColor",
		},
		backgroundPosition: "150% 0",
		animationDuration: shimmerTextVars.duration,
		animationIterationCount: "infinite",
		animationName: {
			default: shimmerSweep,
			[media.reducedMotion]: "none",
		},
		animationTimingFunction: "linear",
		backgroundClip: {
			default: "text",
			[media.reducedMotion]: "border-box",
		},
		backgroundImage: {
			default: `linear-gradient(30deg, ${shimmerTextVars.base} 0 40%, ${shimmerTextVars.highlight} 50%, ${shimmerTextVars.base} 60% 100%)`,
			[media.reducedMotion]: "none",
		},
		backgroundSize: "300% 100%",
		willChange: {
			default: "background-position",
			[media.reducedMotion]: "auto",
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
