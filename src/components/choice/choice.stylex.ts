import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

/** Shared row/column layout for CheckboxGroup and RadioGroup. */
export const choiceGroupStyles = stylex.create({
	root: {
		alignItems: "stretch",
		columnGap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
		flexWrap: "nowrap",
		rowGap: tokens["--space-3"],
	},
	inline: {
		alignItems: "start",
		columnGap: tokens["--space-6"],
		flexDirection: "row",
		flexWrap: "wrap",
	},
});
