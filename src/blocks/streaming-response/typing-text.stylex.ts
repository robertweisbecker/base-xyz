import * as stylex from "@stylexjs/stylex";
import { media } from "@/styles/constants.stylex";
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
			[media.reducedMotion]: "none",
		},
		animationTimingFunction: typingTextVars.chunkEasing,
		display: "inline-block",
		filter: {
			default: "blur(1px)",
			[media.reducedMotion]: "none",
		},
		opacity: {
			default: 0,
			[media.reducedMotion]: 1,
		},
		transform: {
			default: "translateX(-0.5em)",
			[media.reducedMotion]: "translateX(0)",
		},
		verticalAlign: "baseline",
		whiteSpace: "inherit",
		willChange: {
			default: "filter, opacity, transform",
			[media.reducedMotion]: "auto",
		},
	},
	chunks: {
		display: "inline-block",
		whiteSpace: "inherit",
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
				[media.reducedMotion]: "none",
			},
			animationTimingFunction: "steps(1, end)",
			backgroundColor: typingTextVars.caretColor,
			content: '""',
			display: "inline-block",
			opacity: {
				default: typingTextVars.caretOpacity,
				[media.reducedMotion]: typingTextVars.caretOpacity,
			},
			transform: "translateY(0.12em)",
			height: "1em",
			marginLeft: typingTextVars.caretGap,
			width: typingTextVars.caretWidth,
		},
	},
});
