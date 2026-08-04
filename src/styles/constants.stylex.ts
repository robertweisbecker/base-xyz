import * as stylex from "@stylexjs/stylex";

/**
 * Mobile-first viewport selectors.
 *
 * Breakpoints are selectors rather than CSS values, so they must remain static
 * constants and be used as computed condition keys in `stylex.create`.
 */
export const breakpoints = stylex.defineConsts({
	xs: "@media (min-width: 20rem)",
	sm: "@media (min-width: 34rem)",
	md: "@media (min-width: 48rem)",
	lg: "@media (min-width: 63.25rem)",
	xl: "@media (min-width: 80rem)",
	xxl: "@media (min-width: 87.5rem)",
});

/**
 * Non-overlapping ranges for component-owned responsive style sets.
 *
 * Use these only when a component intentionally needs one active slot at a
 * time. General responsive styles should prefer the mobile-first selectors.
 */
export const breakpointRanges = stylex.defineConsts({
	xs: "@media (20rem <= width < 34rem)",
	sm: "@media (34rem <= width < 48rem)",
	md: "@media (48rem <= width < 63.25rem)",
	lg: "@media (63.25rem <= width < 80rem)",
	xl: "@media (80rem <= width < 87.5rem)",
	xxl: "@media (width >= 87.5rem)",
});

/**
 * Shared stacking order for surfaces that escape normal document flow.
 *
 * Keep related backdrop/content pairs adjacent so nested confirmation dialogs
 * reliably render above their parent modal or drawer.
 */
export const zIndex = stylex.defineConsts({
	base: "0",
	sticky: "100",
	modalBackdropStyles: "200",
	modal: "300",
	alertBackdropStyles: "400",
	alert: "500",
	popup: "600",
	tooltip: "700",
	toast: "800",
});
