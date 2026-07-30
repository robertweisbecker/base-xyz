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
	revealDuration: "2200ms",
	revealSteps: "72",
});
