import * as stylex from "@stylexjs/stylex";
import { textStyles } from "@/components/text/text.stylex";
import { popupMotionStyles } from "@/components/popover/popover.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { tokens } from "@/theme/tokens.stylex";

const styles = stylex.create({
	surface: {
		[popupVars.background]: tokens["--bg-inverse"],
		[popupVars.border]: tokens["--border"],
		[popupVars.foreground]: tokens["--fg-inverse"],
		borderRadius: tokens["--radius-md"],
		cornerShape: "superEllipse(1.5)",
		paddingBlock: tokens["--space-1"],
		paddingInline: tokens["--space-2"],
		backgroundColor: popupVars.background,
		boxShadow: tokens["--shadow-md"],
		color: popupVars.foreground,
		hyphens: "auto",
		textAlign: "center",
		maxWidth: tokens["--size-container-lg"],
	},
});

export const tooltipStyles = {
	popup: [textStyles.supporting, styles.surface, popupMotionStyles.anchoredPopup, popupMotionStyles.tooltipPopup],
	chrome: [textStyles.supporting, styles.surface],
} as const;
