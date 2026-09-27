import * as stylex from "@stylexjs/stylex";
import { containerBreakpoints } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

export const rootStyles = stylex.create({
	base: {
		margin: 0,
		containerType: "inline-size",
		display: "flex",
		flexDirection: "column",
		rowGap: tokens["--space-3"],
	},
	labelWidth: (value: string) => ({ "--_description-list-label-width": value }),
	grid: {
		columnGap: tokens["--space-4"],
		display: "grid",
		gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))",
		rowGap: tokens["--space-4"],
	},
});

export const itemStyles = stylex.create({
	base: {
		columnGap: tokens["--space-3"],
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr) auto",
		rowGap: tokens["--space-1"],
		minWidth: 0,
	},
	horizontal: {
		gridTemplateColumns: {
			default: "minmax(0, 1fr) auto",
			[containerBreakpoints.xs]: "var(--_description-list-label-width) minmax(0, 1fr) auto",
		},
	},
	grid: {
		gridColumnEnd: { default: "-1", [containerBreakpoints.xs]: "auto" },
		gridColumnStart: { default: "1", [containerBreakpoints.xs]: "auto" },
		gridTemplateColumns: "minmax(0, 1fr) auto",
	},
	divided: {
		borderBlockEndColor: tokens["--border"],
		borderBlockEndStyle: "solid",
		borderBlockEndWidth: { default: "0px", ":not(:last-child)": "1px" },
		paddingBlockEnd: { default: "0px", ":not(:last-child)": tokens["--space-3"] },
	},
	gridDivided: {
		borderBlockEndColor: tokens["--border"],
		borderBlockEndStyle: "solid",
		borderBlockEndWidth: "1px",
		paddingBlockEnd: tokens["--space-3"],
	},
	sm: { rowGap: tokens["--space-0-5"] },
	md: { rowGap: tokens["--space-1"] },
	lg: { rowGap: tokens["--space-2"] },
});

export const alignStyles = stylex.create({
	start: { alignItems: "start" },
	center: { alignItems: "center" },
	baseline: { alignItems: "baseline" },
});

export const labelStyles = stylex.create({
	base: {
		gridColumn: "1",
		color: tokens["--fg-muted"],
		overflowWrap: "anywhere",
		minWidth: 0,
	},
});

export const valueStyles = stylex.create({
	base: {
		margin: 0,
		gridColumnEnd: "-1",
		gridColumnStart: "1",
		overflowWrap: "anywhere",
		minWidth: 0,
	},
	wide: { gridColumn: { default: "1 / -1", [containerBreakpoints.xs]: "2" } },
});

export const actionsStyles = stylex.create({
	base: { margin: 0, gridColumn: "2", gridRow: "1", minWidth: 0 },
	wide: { gridColumn: { default: "2", [containerBreakpoints.xs]: "3" } },
});
