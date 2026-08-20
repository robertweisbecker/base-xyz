import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

/**
 * Inherited values shared by a popup, its arrow, transition styles, and Base UI's
 * generated viewport payload wrappers.
 */
export const popupVars = stylex.defineVars({
	background: tokens["--elevated"],
	border: tokens["--border"],
	foreground: tokens["--fg"],
	duration: tokens["--motion-duration-content"],
	easing: tokens["--motion-ease-smooth-out"],
	distance: "12px",
});
