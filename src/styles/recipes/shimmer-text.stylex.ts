import * as stylex from "@stylexjs/stylex";
import { media } from "@/styles/constants.stylex";
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
		WebkitBackgroundClip: {
			default: "text",
			[media.reducedMotion]: "initial",
		},
		WebkitTextFillColor: {
			default: "transparent",
			[media.reducedMotion]: "currentColor",
		},
		backgroundPosition: "150% 0",
		animationDuration: "2000ms",
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
			default: `linear-gradient(30deg, color-mix(in oklch, currentColor 54%, transparent) 0 40%, color-mix(in srgb, currentColor, ${tokens["--bg-inverse"]}) 50%, color-mix(in oklch, currentColor 54%, transparent) 60% 100%)`,
			[media.reducedMotion]: "none",
		},
		backgroundSize: "300% 100%",
		willChange: {
			default: "background-position",
			[media.reducedMotion]: "auto",
		},
	},
});
