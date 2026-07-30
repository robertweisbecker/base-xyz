import * as stylex from "@stylexjs/stylex";
import { textStyles } from "@/components/text/text.stylex";
import { popupMotionStyles } from "@/components/popover/popover.stylex";
import { popupVars } from "@/components/popover/popover-vars.stylex";
import { color, radius, shadow, space } from "@/styles/tokens.stylex";

const styles = stylex.create({
	surface: {
		[popupVars.background]: color.bgTooltip,
		[popupVars.border]: color.border,
		[popupVars.foreground]: color.fg,
		borderRadius: radius.sm,
		paddingBlock: space.x1,
		paddingInline: space.x2,
		backgroundColor: popupVars.background,
		boxShadow: shadow.md,
		color: popupVars.foreground,
		hyphens: "auto",
		textAlign: "center",
		maxWidth: "320px",
	},
});

export const tooltipStyles = {
	popup: [textStyles.supporting, styles.surface, popupMotionStyles.anchoredPopup, popupMotionStyles.tooltipPopup],
	chrome: [textStyles.supporting, styles.surface],
} as const;
