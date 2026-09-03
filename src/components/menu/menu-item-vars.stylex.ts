import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

/** Inherited layout variables for Menu items and components that intentionally match them. */
export const menuItemVars = stylex.defineVars({
	columns: `${tokens["--space-4"]} minmax(0, 1fr) auto`,
	columnGap: tokens["--space-1-5"],
	indicatorColor: "inherit",
	minHeight: tokens["--size-control-md"],
	paddingBlock: tokens["--space-1"],
	paddingInlineEnd: tokens["--space-2"],
	paddingInlineStart: tokens["--space-2-5"],
	rowGap: "0px",
});
