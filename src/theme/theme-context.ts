import { createContext } from "react";

export type ThemeName = "default" | "mp";
export type ThemeMode = "system" | "light" | "dark";
export type ResolvedThemeMode = Exclude<ThemeMode, "system">;

export type ThemeContextValue = {
	theme: ThemeName;
	mode: ThemeMode;
	resolvedMode: ResolvedThemeMode;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
