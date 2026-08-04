import * as stylex from "@stylexjs/stylex";
import { textStyles, textWeightStyles } from "@/components/text/text.stylex";
import { colors, radius } from "@/styles/tokens.stylex";

const toastTextParts = stylex.create({
	title: {
		margin: 0,
	},
	description: {
		margin: 0,
		color: colors["--text-muted"],
	},
});

export const toastTextStyles = {
	title: [textStyles.body, textWeightStyles.semibold, toastTextParts.title],
	description: [textStyles.supporting, toastTextParts.description],
} as const;

const toastControlParts = stylex.create({
	action: {
		padding: 0,
		borderWidth: 0,
		backgroundColor: "transparent",
		color: colors["--accent"],
		flexShrink: 0,
	},
	close: {
		padding: 0,
		borderWidth: 0,
		alignItems: "center",
		backgroundColor: {
			default: "transparent",
			":hover": {
				"@media (hover: hover) and (pointer: fine)": colors["--surface-subtle"],
			},
		},
		color: "currentColor",
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
	},
	stackedClose: {
		borderRadius: radius.sm,
		marginBlock: "-8px",
		color: colors["--text-muted"],
		marginInlineEnd: "-8px",
		height: "36px",
		width: "36px",
	},
	anchoredClose: {
		borderRadius: radius.full,
		marginInlineEnd: "-6px",
		height: "28px",
		width: "28px",
	},
});

export const toastControlStyles = {
	action: [textStyles.supporting, textWeightStyles.semibold, toastControlParts.action],
	close: toastControlParts.close,
	stackedClose: toastControlParts.stackedClose,
	anchoredClose: toastControlParts.anchoredClose,
} as const;
