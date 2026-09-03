import * as stylex from "@stylexjs/stylex";
import { textStyles } from "@/components/text/text.stylex";
import { popupMotionStyles } from "@/components/popover/popover.stylex";
import { tokens } from "@/theme/tokens.stylex";

const styles = stylex.create({
	surface: {
		cornerShape: "superellipse(1.4)",
		paddingBlock: tokens["--space-1"],
		paddingInline: tokens["--space-1-5"],
		backgroundColor: tokens["--tooltip"],
		boxShadow: `${tokens["--shadow-md"]}`,
		color: tokens["--fg"],
		hyphens: "auto",
		textAlign: "center",
		borderBottomLeftRadius: {
			"[data-side='right']:has([data-slot='arrow'])": tokens["--radius-xs"],
			default: tokens["--radius-sm"],
		},
		borderBottomRightRadius: {
			"[data-side='left']:has([data-slot='arrow'])": tokens["--radius-xs"],
			default: tokens["--radius-sm"],
		},
		borderTopLeftRadius: {
			"[data-side='right']:has([data-slot='arrow'])": tokens["--radius-xs"],
			default: tokens["--radius-sm"],
		},
		borderTopRightRadius: {
			"[data-side='left']:has([data-slot='arrow'])": tokens["--radius-xs"],
			default: tokens["--radius-sm"],
		},
		maxWidth: tokens["--size-container-lg"],
	},
	arrow: {
		overflow: "clip",
		boxSizing: "border-box",
		clipPath: "ellipse(8px 16px at center)",
		display: "flex",
		flexShrink: 0,
		position: "relative",
		rotate: {
			"[data-side='left']": "90deg",
			"[data-side='right']": "-90deg",
			"[data-side='top']": "180deg",
			default: "0deg",
		},
		bottom: {
			"[data-side='top']": "-8px",
			default: "auto",
		},
		left: {
			"[data-side='right']": "-13px",
			default: "auto",
		},
		right: {
			"[data-side='left']": "-13px",
			default: "auto",
		},
		top: {
			"[data-side='bottom']": "-8px",
			default: "auto",
		},
	},
	arrowFill: {
		fill: tokens["--tooltip"],
	},
	arrowOuterStroke: {
		fill: `light-dark(${tokens["--border"]}, transparent)`,
	},
	arrowInnerStroke: {
		fill: `light-dark(transparent, ${tokens["--border"]})`,
	},
});

export const tooltipStyles = {
	popup: [
		textStyles.supporting,
		styles.surface,
		popupMotionStyles.anchoredPopup,
		popupMotionStyles.tooltipPopup,
	],
	chrome: [textStyles.supporting, styles.surface],
	arrow: styles.arrow,
	arrowFill: styles.arrowFill,
	arrowOuterStroke: styles.arrowOuterStroke,
	arrowInnerStroke: styles.arrowInnerStroke,
} as const;
