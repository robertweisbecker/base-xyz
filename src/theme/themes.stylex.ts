import * as stylex from "@stylexjs/stylex";
import { colors } from "@/styles/tokens.stylex";
import type { ThemeName } from "./theme-context";

const defaultColorTheme = stylex.createTheme(colors, {
	"--purple-s1": "var(--indigo-s1)",
	"--purple-c1": "var(--indigo-c1)",
	"--purple-p1": "var(--indigo-p1)",
	"--purple-p2": "var(--indigo-p2)",
	"--purple-t1": "var(--indigo-t2)",
	"--accent": "var(--indigo-p1)",
	"--accent-hover": "var(--indigo-p2)",
	"--accent-soft": "var(--indigo-c1)",
	"--accent-soft-hover": "var(--indigo-c2)",
	"--text-accent": "var(--indigo-t1)",
	"--text-accent-strong": "var(--indigo-t2)",
	"--focus": "var(--indigo-p2)",
});

const mpColorTheme = stylex.createTheme(colors, {
	"--purple-s1": "light-dark(#e8ddff, var(--indigo-s1))",
	"--purple-c1": "light-dark(#b094ff, var(--indigo-c1))",
	"--purple-p1": "light-dark(#5028c0, var(--indigo-p1))",
	"--purple-p2": "light-dark(#7856ff, var(--indigo-p2))",
	"--purple-t1": "light-dark(#1b0b3b, var(--indigo-t2))",
	"--accent": "light-dark(var(--purple-p1), var(--indigo-p1))",
	"--accent-hover": "light-dark(var(--purple-p2), var(--indigo-p2))",
	"--accent-soft": "light-dark(var(--purple-s1), var(--indigo-c1))",
	"--accent-soft-hover": "light-dark(var(--purple-c1), var(--indigo-c2))",
	"--text-accent": "light-dark(var(--purple-p1), var(--indigo-t1))",
	"--text-accent-strong": "light-dark(var(--purple-t1), var(--indigo-t2))",
	"--focus": "light-dark(var(--purple-p2), var(--indigo-p2))",
});

export function getThemeStyles(theme: ThemeName) {
	return theme === "mp" ? [defaultColorTheme, mpColorTheme] : [defaultColorTheme];
}
