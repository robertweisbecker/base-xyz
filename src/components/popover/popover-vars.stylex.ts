import * as stylex from "@stylexjs/stylex";
import { colors, motion } from "@/styles/tokens.stylex";

/**
 * Inherited values shared by a popup, its arrow, transition styles, and Base UI's
 * generated viewport payload wrappers.
 */
export const popupVars = stylex.defineVars({
	background: colors["--inverse-surface"],
	border: colors["--border"],
	foreground: colors["--inverse-text"],
	duration: motion.durationContent,
	easing: motion.easeSmoothOut,
	distance: "12px",
});
