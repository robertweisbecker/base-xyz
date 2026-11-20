import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

export const emojiPickerStyles = stylex.create({
	root: {
		padding: tokens["--space-2"],
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-lg"],
		borderStyle: "solid",
		borderWidth: "1px",
		backgroundColor: tokens["--surface"],
		color: tokens["--fg"],
		maxWidth: "100%",
		width: `calc(7 * ${tokens["--size-control-md"]} + 6 * ${tokens["--space-1"]} + 2 * ${tokens["--space-2"]} + 2px)`,
	},
	searchGroup: { position: "relative", marginBottom: tokens["--space-2"] },
	search: {
		paddingInlineEnd: tokens["--space-8"],
		width: "100%",
		"::-webkit-search-cancel-button": { display: "none" },
	},
	clear: { insetInlineEnd: tokens["--space-1"], position: "absolute", top: tokens["--space-1"] },
	grid: { gap: tokens["--space-1"], display: "flex", flexDirection: "column" },
	row: {
		gap: tokens["--space-1"],
		display: "grid",
		gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
	},
	cell: { fontSize: tokens["--font-size-5"], lineHeight: 1 },
	empty: {
		paddingBlock: tokens["--space-6"],
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		textAlign: "center",
	},
	hidden: {
		padding: 0,
		overflow: "hidden",
		clipPath: "inset(50%)",
		position: "absolute",
		whiteSpace: "nowrap",
		height: "1px",
		width: "1px",
	},
});
