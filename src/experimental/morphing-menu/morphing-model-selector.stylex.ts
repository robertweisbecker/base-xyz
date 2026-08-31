import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

export const morphingModelSelectorStyles = stylex.create({
	trigger: {
		gap: tokens["--space-2"],
		paddingBlock: 0,
		paddingInline: tokens["--space-3"],
		gridAutoFlow: "column",
		gridTemplateColumns: "auto minmax(0, 1fr)",
		justifyContent: "start",
		justifyItems: "start",
		minWidth: "11.5rem",
		width: "auto",
	},
	triggerIcon: {
		alignItems: "center",
		display: "inline-flex",
		justifyContent: "center",
		height: tokens["--space-4"],
		width: tokens["--space-4"],
	},
	triggerCopy: {
		gap: tokens["--space-2"],
		alignItems: "baseline",
		display: "flex",
		minWidth: 0,
	},
	triggerLabel: {
		overflow: "hidden",
		color: tokens["--fg"],
		fontSize: tokens["--font-size-2"],
		fontWeight: tokens["--font-weight-medium"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	triggerMeta: {
		overflow: "hidden",
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	row: {
		justifyContent: "space-between",
	},
	rowCopy: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		minWidth: 0,
	},
	rowLabel: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	rowValue: {
		overflow: "hidden",
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		marginInlineStart: "auto",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
	rowEnd: {
		gap: tokens["--space-1"],
		alignItems: "center",
		display: "flex",
		flexShrink: 0,
	},
	check: {
		color: tokens["--fg-accent"],
		height: tokens["--space-4"],
		width: tokens["--space-4"],
	},
});
