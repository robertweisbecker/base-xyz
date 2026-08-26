import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

export const listStyles = stylex.create({
	root: {
		margin: 0,
		boxSizing: "border-box",
		display: "grid",
		listStylePosition: "outside",
		paddingInlineStart: tokens["--space-6"],
		rowGap: tokens["--space-1"],
	},
	nested: {
		marginBlockStart: tokens["--space-1"],
	},
	item: {
		boxSizing: "border-box",
		minWidth: 0,
		"::marker": {
			color: "color-mix(in srgb, currentColor 64%, transparent)",
			fontVariantNumeric: "tabular-nums",
		},
	},
	customMarkerItem: {
		alignItems: "start",
		display: "grid",
		gridTemplateColumns: `${tokens["--space-6"]} minmax(0, 1fr)`,
		listStyleType: "none",
		marginInlineStart: `calc(0px - ${tokens["--space-6"]})`,
	},
	customMarker: {
		alignItems: "center",
		boxSizing: "border-box",
		color: "color-mix(in srgb, currentColor 55%, transparent)",
		display: "inline-flex",
		fontSize: "1em",
		justifyContent: "flex-end",
		paddingInlineEnd: tokens["--space-2"],
		height: "1lh",
		width: "100%",
	},
	content: {
		minWidth: 0,
	},
});

export const unorderedMarkerStyles = stylex.create({
	"0": { listStyleType: "disc" },
	"1": { listStyleType: "circle" },
	"2": { listStyleType: "square" },
});

export const orderedMarkerStyles = stylex.create({
	"0": { listStyleType: "decimal" },
	"1": { listStyleType: "lower-alpha" },
	"2": { listStyleType: "lower-roman" },
});
