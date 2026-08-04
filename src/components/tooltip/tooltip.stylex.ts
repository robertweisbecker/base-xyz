import * as stylex from "@stylexjs/stylex";
import { textStyles } from "@/components/text/text.stylex";
import { popupMotionStyles } from "@/components/popover/popover.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { colors, radius, shadow, space, size } from "@/styles/tokens.stylex";

const styles = stylex.create({
	surface: {
		[popupVars.background]: colors["--inverse-surface"],
		[popupVars.border]: colors["--border"],
		[popupVars.foreground]: colors["--inverse-text"],
		borderRadius: radius.md,
		cornerShape: "superEllipse(1.5)",
		paddingBlock: space[1],
		paddingInline: space[2],
		backgroundColor: popupVars.background,
		boxShadow: shadow.md,
		color: popupVars.foreground,
		hyphens: "auto",
		textAlign: "center",
		maxWidth: size["container.lg"],
	},
});

export const tooltipStyles = {
	popup: [textStyles.supporting, styles.surface, popupMotionStyles.anchoredPopup, popupMotionStyles.tooltipPopup],
	chrome: [textStyles.supporting, styles.surface],
} as const;
