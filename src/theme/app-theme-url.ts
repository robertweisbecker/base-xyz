import type { ThemeMode, ThemeName } from "./theme-context";

export function parseThemeFromSearchParams(searchParams: URLSearchParams): ThemeName | undefined {
	const value = searchParams.get("theme");
	if (value === null) return undefined;
	if (value === "mp") return "mp";
	return "default";
}

export function parseModeFromSearchParams(searchParams: URLSearchParams): ThemeMode | undefined {
	const value = searchParams.get("mode");
	if (value === null) return undefined;
	if (value === "light" || value === "dark" || value === "system") return value;
	return "system";
}

export function syncAppThemeUrl(theme: ThemeName, mode: ThemeMode): void {
	if (typeof window === "undefined") return;

	const params = new URLSearchParams(window.location.search);
	if (theme === "mp") params.set("theme", theme);
	else params.delete("theme");
	if (mode === "system") params.delete("mode");
	else params.set("mode", mode);

	const search = params.toString();
	const nextUrl = search
		? `${window.location.pathname}?${search}${window.location.hash}`
		: `${window.location.pathname}${window.location.hash}`;
	const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

	if (currentUrl !== nextUrl) {
		window.history.replaceState(null, "", nextUrl);
	}
}
