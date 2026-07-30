import * as stylex from "@stylexjs/stylex";
import { typingTextVars } from "./typing-text-vars.stylex";

const textReveal = stylex.keyframes({
	from: {
		maxWidth: "0%",
	},
	to: {
		maxWidth: "100%",
	},
});

const caretPulse = stylex.keyframes({
	"0%": {
		opacity: 1,
	},
	"45%": {
		opacity: 1,
	},
	"46%": {
		opacity: 0,
	},
	"100%": {
		opacity: 0,
	},
});

export const typingTextStyles = stylex.create({
	reveal: {
		[typingTextVars.revealDuration]: "2200ms",
		[typingTextVars.revealSteps]: "72",
		overflow: "hidden",
		animationDuration: typingTextVars.revealDuration,
		animationFillMode: "both",
		animationName: {
			default: textReveal,
			"@media (prefers-reduced-motion: reduce)": "none",
		},
		animationTimingFunction: `steps(${typingTextVars.revealSteps}, end)`,
		display: "inline-block",
		verticalAlign: "bottom",
		whiteSpace: "inherit",
		willChange: {
			default: "max-width",
			"@media (prefers-reduced-motion: reduce)": "auto",
		},
		maxWidth: "100%",
	},
	caret: {
		[typingTextVars.caretColor]: "currentColor",
		[typingTextVars.caretDuration]: "1100ms",
		[typingTextVars.caretGap]: "0.125em",
		[typingTextVars.caretOpacity]: "0.72",
		[typingTextVars.caretWidth]: "0.08em",
		"::after": {
			animationDuration: typingTextVars.caretDuration,
			animationIterationCount: "infinite",
			animationName: {
				default: caretPulse,
				"@media (prefers-reduced-motion: reduce)": "none",
			},
			animationTimingFunction: "steps(1, end)",
			backgroundColor: typingTextVars.caretColor,
			content: '""',
			display: "inline-block",
			opacity: {
				default: typingTextVars.caretOpacity,
				"@media (prefers-reduced-motion: reduce)": typingTextVars.caretOpacity,
			},
			transform: "translateY(0.12em)",
			height: "1em",
			marginLeft: typingTextVars.caretGap,
			width: typingTextVars.caretWidth,
		},
	},
});
