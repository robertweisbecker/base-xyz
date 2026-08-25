import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

export const popupsPageStyles = stylex.create({
	linkPreviewButton: { textDecoration: "none" },
	smallDialog: { maxWidth: "22rem" },
	largeDialog: { maxWidth: "48rem" },
	insideScrollDialog: { height: "min(32rem, calc(100dvh - 4rem))" },
	dialogScrollArea: { flexBasis: "auto", flexGrow: 1, flexShrink: 1, minHeight: 0 },
	activityRow: {
		padding: tokens["--space-3"],
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: tokens["--border-width"],
		backgroundColor: tokens["--surface-subtle"],
	},
});
