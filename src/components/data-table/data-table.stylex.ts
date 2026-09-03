import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

export const dataTableParts = stylex.create({
	toolbar: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "flex-end",
	},
	filter: {
		flexBasis: "10rem",
		flexGrow: "1",
		flexShrink: "1",
		flexWrap: "nowrap",
	},
	toolbarActions: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "flex-end",
	},
	filterTrigger: {
		maxWidth: "100%",
	},
	filterTriggerLabel: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	headerContent: {
		gap: tokens["--space-1"],
		alignItems: "center",
		display: "inline-flex",
		maxWidth: "100%",
		minWidth: 0,
	},
	headerLabel: {
		overflow: "hidden",
		color: tokens["--fg-muted"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	expandedRow: {
		borderRadius: "inherit",
		backgroundColor: {
			default: tokens["--canvas"],
			":hover": tokens["--inset"],
		},
	},
	expandedCell: {
		paddingBlock: tokens["--space-3"],
		backgroundColor: tokens["--surface"],
		borderBlockStartColor: tokens["--border"],
		borderBlockStartStyle: "solid",
		borderBlockStartWidth: "1px",
		paddingInlineStart: tokens["--space-10"],
	},
	metadata: {
		gap: tokens["--space-2"],
		color: tokens["--fg-muted"],
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
});
