import * as stylex from "@stylexjs/stylex";
import { color, motion } from "@/styles/tokens.stylex";

/**
 * Inherited values shared by a popup, its arrow, transition styles, and Base UI's
 * generated viewport payload wrappers.
 */
export const popupVars = stylex.defineVars({
	background: color.bgElevated,
	border: color.border,
	foreground: color.fg,
	duration: motion.durationContent,
	easing: motion.easeSmoothOut,
	distance: "12px",
});
