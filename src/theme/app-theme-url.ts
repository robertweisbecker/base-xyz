import type { ThemeMode, ThemeName } from "./theme-context";

const THEME_QUERY_KEY = "theme";
const MODE_QUERY_KEY = "mode";

export function parseThemeFromSearchParams(searchParams: URLSearchParams): ThemeName | undefined {
	if (!searchParams.has(THEME_QUERY_KEY)) return undefined;
	const value = searchParams.get(THEME_QUERY_KEY);
	if (value === "mp") return "mp";
	return "default";
}

export function parseModeFromSearchParams(searchParams: URLSearchParams): ThemeMode | undefined {
	if (!searchParams.has(MODE_QUERY_KEY)) return undefined;
	const value = searchParams.get(MODE_QUERY_KEY);
	if (value === "light" || value === "dark" || value === "system") return value;
	return "system";
}

function themeNameToQueryValue(theme: ThemeName): string | null {
	return theme === "mp" ? "mp" : null;
}

function themeModeToQueryValue(mode: ThemeMode): string | null {
	return mode === "system" ? null : mode;
}

export function syncAppThemeUrl(theme: ThemeName, mode: ThemeMode): void {
	if (typeof window === "undefined") return;

	const params = new URLSearchParams(window.location.search);
	const themeValue = themeNameToQueryValue(theme);

	if (themeValue) params.set(THEME_QUERY_KEY, themeValue);
	else params.delete(THEME_QUERY_KEY);

	const modeValue = themeModeToQueryValue(mode);

	if (modeValue) params.set(MODE_QUERY_KEY, modeValue);
	else params.delete(MODE_QUERY_KEY);

	const search = params.toString();
	const nextUrl = search
		? `${window.location.pathname}?${search}${window.location.hash}`
		: `${window.location.pathname}${window.location.hash}`;
	const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

	if (currentUrl !== nextUrl) {
		window.history.replaceState(null, "", nextUrl);
	}
}
