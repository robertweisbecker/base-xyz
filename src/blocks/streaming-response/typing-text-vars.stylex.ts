import * as stylex from "@stylexjs/stylex";

/**
 * Inherited values consumed by the typing-text effect; override them on an
 * ancestor to tune the reveal and caret.
 */
export const typingTextVars = stylex.defineVars({
	caretColor: "currentColor",
	caretDuration: "1100ms",
	caretGap: "0.125em",
	caretOpacity: "0.72",
	caretWidth: "0.08em",
	chunkDuration: "320ms",
	chunkEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
});
