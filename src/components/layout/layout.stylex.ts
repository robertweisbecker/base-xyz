import * as stylex from "@stylexjs/stylex";

export const layoutBaseStyles = stylex.create({
	box: { boxSizing: "border-box" },
	stack: { boxSizing: "border-box", display: "flex", flexDirection: "column" },
	grid: { boxSizing: "border-box", display: "grid" },
});
