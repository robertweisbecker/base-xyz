import { createRootRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";
import type { ThemeMode, ThemeName } from "@/theme";

type AppSearch = Record<string, unknown> & {
	mode?: ThemeMode;
	theme?: ThemeName;
};

export const Route = createRootRoute({
	component: AppShell,
	validateSearch: validateAppSearch,
});

function validateAppSearch(search: Record<string, unknown>): AppSearch {
	const validatedSearch: AppSearch = { ...search };

	if (search.mode === "dark" || search.mode === "light" || search.mode === "system") {
		validatedSearch.mode = search.mode;
	} else {
		delete validatedSearch.mode;
	}

	if (search.theme === "default" || search.theme === "mp") {
		validatedSearch.theme = search.theme;
	} else {
		delete validatedSearch.theme;
	}

	return validatedSearch;
}
