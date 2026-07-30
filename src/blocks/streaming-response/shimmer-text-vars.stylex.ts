import * as stylex from "@stylexjs/stylex";

/**
 * Inherited values consumed by the shimmer-text effect; override them on an
 * ancestor to tune the sweep.
 */
export const shimmerTextVars = stylex.defineVars({
	base: "color-mix(in oklch, currentColor 54%, transparent)",
	duration: "2500ms",
	highlight: "currentColor",
});
