import * as stylex from "@stylexjs/stylex";

/**
 * Toast-family timings. These are deliberately not global design tokens:
 * their meaning depends on Base UI's toast stack and deduplication behavior.
 */
export const toastMotion = stylex.defineConsts({
	stackDuration: "500ms",
	heightDuration: "150ms",
	renotifyDuration: "280ms",
	spinnerDuration: "900ms",
	stackItemZIndex: "1000",
});
