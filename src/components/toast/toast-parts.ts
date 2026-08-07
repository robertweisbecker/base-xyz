import * as stylex from "@stylexjs/stylex";
import { textStyles, textWeightStyles } from "@/components/text/text.stylex";
import { tokens } from "@/theme/tokens.stylex";

const toastTextParts = stylex.create({
	title: {
		marginBlockStart: "-.25em",
	},
	description: {
		margin: 0,
		color: tokens["--fg-muted"],
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
		color: tokens["--bg-primary"],
		flexShrink: 0,
	},
	close: {
		padding: 0,
		borderRadius: tokens["--radius-sm"],
		borderWidth: 0,
		alignItems: "center",
		backgroundColor: {
			default: "transparent",
			":hover": {
				"@media (hover: hover) and (pointer: fine)": tokens["--surface-subtle"],
			},
		},
		color: {
			default: tokens["--fg-subtle"],
			":hover": {
				"@media (hover: hover) and (pointer: fine)": tokens["--fg-muted"],
			},
		},
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		height: tokens["--size-control-sm"],
		width: tokens["--size-control-sm"],
	},
	stackedClose: {
		marginBlock: "-8px",
		alignSelf: "flex-start",
		marginInlineEnd: "-8px",
	},
	anchoredClose: {
		borderRadius: tokens["--radius-full"],
		marginInlineEnd: "-6px",
	},
});

export const toastControlStyles = {
	action: [textStyles.supporting, textWeightStyles.semibold, toastControlParts.action],
	close: toastControlParts.close,
	stackedClose: toastControlParts.stackedClose,
	anchoredClose: toastControlParts.anchoredClose,
} as const;
