import { useLayoutEffect, useSyncExternalStore, type ReactNode } from "react";

type ResolvedTheme = "light" | "dark";
type Theme = "system" | ResolvedTheme;

export function ThemeFrame({ children, theme }: { children: ReactNode; theme: Theme }) {
	const systemTheme = useSyncExternalStore(subscribeToSystemTheme, getSystemTheme, getServerTheme);
	const resolvedTheme = theme === "system" ? systemTheme : theme;

	useLayoutEffect(() => {
		document.documentElement.dataset.theme = resolvedTheme;
	}, [resolvedTheme]);

	return <>{children}</>;
}

function subscribeToSystemTheme(onStoreChange: () => void) {
	if (typeof window === "undefined") {
		return () => {};
	}

	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	mediaQuery.addEventListener("change", onStoreChange);

	return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getSystemTheme(): ResolvedTheme {
	return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerTheme(): ResolvedTheme {
	return "light";
}
