import * as stylex from "@stylexjs/stylex";
import { typingTextVars } from "./typing-text-vars.stylex";

const chunkReveal = stylex.keyframes({
	from: {
		filter: "blur(3px)",
		opacity: 0,
		transform: "translateY(0.42em)",
	},
	to: {
		filter: "blur(0)",
		opacity: 1,
		transform: "translateY(0)",
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
	chunk: {
		[typingTextVars.chunkDuration]: "140ms",
		[typingTextVars.chunkEasing]: "cubic-bezier(0.22, 1, 0.36, 1)",
		animationDuration: typingTextVars.chunkDuration,
		animationFillMode: "both",
		animationName: {
			default: chunkReveal,
			"@media (prefers-reduced-motion: reduce)": "none",
		},
		animationTimingFunction: typingTextVars.chunkEasing,
		display: "inline-block",
		filter: {
			default: "blur(1px)",
			"@media (prefers-reduced-motion: reduce)": "none",
		},
		opacity: {
			default: 0,
			"@media (prefers-reduced-motion: reduce)": 1,
		},
		transform: {
			default: "translateX(-0.5em)",
			"@media (prefers-reduced-motion: reduce)": "translateX(0)",
		},
		verticalAlign: "baseline",
		whiteSpace: "inherit",
		willChange: {
			default: "filter, opacity, transform",
			"@media (prefers-reduced-motion: reduce)": "auto",
		},
	},
	chunks: {
		whiteSpace: "inherit",
		display: "inline-block",
	},
	caret: {
		"--_streaming-text-caret-delay": "0ms",
		[typingTextVars.caretColor]: "currentColor",
		[typingTextVars.caretDuration]: "1100ms",
		[typingTextVars.caretGap]: "0.125em",
		[typingTextVars.caretOpacity]: "0.72",
		[typingTextVars.caretWidth]: "0.08em",
		"::after": {
			animationDelay: "var(--_streaming-text-caret-delay)",
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
