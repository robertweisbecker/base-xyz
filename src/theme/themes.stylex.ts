import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";
import type { ThemeName } from "./theme-context";

const defaultTheme = stylex.createTheme(tokens, {});

const mpTheme = stylex.createTheme(tokens, {
	"--bg-canvas": "#FFFFFF",
	"--color-gray-s1": "#FBF9F9",
	"--color-gray-s2": "#F5F2F2",
	"--color-gray-c1": "#EAE7E7",
	"--color-gray-c2": "#E9E9E9",
	"--color-gray-c3": "#C0C0C0",
	"--color-gray-p1": "#626266",
	"--color-gray-p2": "#1F1F24",
	"--color-gray-t1": "#737378",
	"--color-gray-t2": "#626266",
	"--color-gray-t3": "#1F1F24",

	"--color-success-s1": "#f2f8f8",
	"--color-success-s2": "#eaf6f4",
	"--color-success-c1": "#cff4f0",
	"--color-success-c2": "#b4efea",
	"--color-success-c3": "#98e8e1",
	"--color-success-b1": "#7bdcd4",
	"--color-success-b2": "#4fcbc3",
	"--color-success-b3": "#00b7ae",
	"--color-success-p1": "#09d6cc",
	"--color-success-p2": "#00cbc1",
	"--color-success-t1": "#00736c",
	"--color-success-t2": "#004440",
	"--fg-success-contrast": "var(--fg)",

	"--color-error-s1": "#FFE1D6",
	"--color-error-s2": "#FFE1D6",
	"--color-error-c1": "#FFE1D6",
	"--color-error-c2": "#FFB0A3",
	"--color-error-c3": "#FFB0A3",
	"--color-error-p1": "#FF7557",
	"--color-error-p2": "#CC332B",
	"--color-error-t1": "oklch(53.4% 0.191 28.16)",
	"--color-error-t2": "#5B0237",
	"--fg-error-contrast": "var(--fg)",

	"--color-warning-s1": "#f8f7f5",
	"--color-warning-s2": "#ffefd8",
	"--color-warning-c1": "#ffebbe",
	"--color-warning-c2": "#ffe19c",
	"--color-warning-c3": "#ffd57b",
	"--color-warning-b1": "#f5c976",
	"--color-warning-b2": "#e2b869",
	"--color-warning-b3": "#d0a03f",
	"--color-warning-p1": "#ffbf2c",
	"--color-warning-p2": "#f1b632",
	"--color-warning-t1": "#DA6B16",
	"--color-warning-t2": "#A33B16",

	// "--color-accent-s1": "#e8ddff",
	// "--color-accent-s2": "#e8ddff",
	// "--color-accent-c1": "#e8ddff",
	// "--color-accent-c2": "#e8ddff",
	// "--color-accent-c3": "#1b0b3b",
	// "--color-accent-p1": "#5028c0",
	// "--color-accent-p2": "#7856ff",
	// "--color-accent-t1": "#1b0b3b",
	// "--color-accent-t2": "#1b0b3b",

	"--color-accent-s1": "oklch(97.5% 0.0035 285.7)",
	"--color-accent-s2": "oklch(96.3% 0.0119 285.7)",
	"--color-accent-c1": "oklch(94.2% 0.0243 285.7)",
	"--color-accent-c2": "oklch(91.3% 0.0498 285.7)",
	"--color-accent-c3": "oklch(88.1% 0.073 285.7)",
	"--color-accent-b1": "oklch(84% 0.094 285.7)",
	"--color-accent-b2": "oklch(78.2% 0.1179 285.7)",
	"--color-accent-b3": "oklch(70.3% 0.156 285.7)",
	"--color-accent-p1": "#573bb3",
	"--color-accent-p2": "#4a3298",
	"--color-accent-t1": "oklch(48.3% 0.2151 285.7)",
	"--color-accent-t2": "oklch(31.3% 0.1288 285.7)",
	"--icon-accent": "#7856ff",
	"--font-family-sans": '"Apercu", sans-serif',
	"--shadow-primary": "0 0 0 transparent",
	"--shadow-primary-pressed": "0 0 0 transparent",
	"--font-weight-regular": "400",
	"--font-weight-medium": "500",
	"--font-weight-semibold": "700",
	"--font-weight-bold": "700",
});

const themes = {
	default: defaultTheme,
	mp: mpTheme,
} satisfies Record<ThemeName, ReturnType<typeof stylex.createTheme>>;

export function getThemeStyle(theme: ThemeName) {
	return themes[theme];
}
