import * as stylex from "@stylexjs/stylex";
import { motion } from "../tokens.stylex";

/**
 * Interaction-feedback transitions shared so pressed/hovered feedback feels
 * identical on every control. Popup and modal lifecycle motion live in
 * `popup.ts` and `modal.ts`.
 */
export const pressable = stylex.create({
	transition: {
		transitionDuration: motion.durationQuick,
		transitionProperty: "background-color, border-color, color, transform, box-shadow",
		transitionTimingFunction: motion.easeOut,
	},
});

export const iconSwapTransition = stylex.create({
	slot: {
		display: "inline-block",
		flexShrink: 0,
		lineHeight: 0,
		position: "relative",
		height: "1em",
		width: "1em",
	},
	icon: {
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		transitionDuration: {
			default: motion.durationQuick,
			"@media (prefers-reduced-motion: reduce)": "0ms",
		},
		transitionProperty: "filter, opacity, scale",
		transitionTimingFunction: motion.easeSmoothOut,
		willChange: "filter, opacity, scale",
		height: "1em",
		width: "1em",
	},
	from: {
		position: "relative",
	},
	to: {
		inset: 0,
		position: "absolute",
	},
	visible: {
		filter: "blur(0)",
		opacity: 1,
		scale: 1,
	},
	hidden: {
		filter: "blur(2px)",
		opacity: 0,
		scale: 0.25,
	},
});
