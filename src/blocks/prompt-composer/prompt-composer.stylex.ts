import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

export const composerMarker = stylex.defineMarker();

export const promptComposerStyles = stylex.create({
	root: {
		gap: tokens["--space-0"],
		color: tokens["--fg"],
		display: "flex",
		flexDirection: "column",
		maxWidth: "42rem",
		width: "100%",
	},
	inputGroup: {
		"--_input-group-padding": tokens["--space-1-5"],
		"--_input-padding": tokens["--space-2"],
		padding: tokens["--space-1-5"],
		// A circular md button and the surface share their corner center.
		borderRadius: `calc(${tokens["--size-control-md"]} / 2 + ${tokens["--space-1-5"]})`,
		cornerShape: "round",
		gap: tokens["--space-1"],
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr)",
		minHeight: 0,
	},
	compact: {
		gridTemplateColumns: "auto minmax(0, 1fr) auto",
	},
	input: {
		"--scroll-fade-size": tokens["--space-4"],
		paddingBlock: tokens["--space-1"],
		paddingInline: tokens["--space-2"],
		gridColumnStart: {
			default: "auto",
			[stylex.when.ancestor("[data-compact]", composerMarker)]: "2",
		},
		gridRowStart: {
			default: "auto",
			[stylex.when.ancestor("[data-compact]", composerMarker)]: "1",
		},
		minHeight: 0,
	},
	footer: {
		display: {
			default: "flex",
			[stylex.when.ancestor("[data-compact]", composerMarker)]: "contents",
		},
		flexWrap: "wrap",
		paddingBlockEnd: 0,
		paddingInlineEnd: 0,
		paddingInlineStart: 0,
	},
	options: {
		gap: tokens["--space-1"],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		gridColumnStart: "1",
		gridRowStart: "1",
		maxWidth: "100%",
		minWidth: 0,
		width: "max-content",
	},
	actions: {
		gridColumnStart: "3",
		gridRowStart: "1",
		marginInlineStart: "auto",
		paddingInlineEnd: { default: 0, ":has(button)": 0 },
		paddingInlineStart: 0,
	},
	addMenu: { minWidth: "15rem" },
	addMenuCopy: {
		gap: tokens["--space-2"],
		alignItems: "baseline",
		display: "flex",
		gridColumnEnd: "4",
		gridColumnStart: "2",
		minWidth: 0,
	},
	addMenuDescription: {
		overflow: "hidden",
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	},
});
