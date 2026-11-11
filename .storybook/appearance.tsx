import {
	useLayoutEffect,
	useState,
	useSyncExternalStore,
	type ComponentProps,
	type ReactNode,
} from "react";
import { DocsContainer } from "@storybook/addon-docs/blocks";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import { themes } from "storybook/theming";
import { ThemeProvider } from "../src/theme";

type Appearance = "system" | "light" | "dark" | "mp-light";

function normalizeAppearance(value: unknown): Appearance {
	return value === "light" || value === "dark" || value === "mp-light" ? value : "system";
}

function getInitialAppearance(): Appearance {
	return normalizeAppearance(document.documentElement.dataset.storybookAppearance);
}

export function StorybookTheme({
	appearance: value,
	children,
}: {
	appearance: unknown;
	children: ReactNode;
}) {
	const appearance = normalizeAppearance(value);
	useLayoutEffect(() => {
		// This document fallback intentionally survives story unmounts and loading screens.
		document.documentElement.dataset.storybookAppearance = appearance;
		try {
			localStorage.setItem("stylex-storybook-appearance", appearance);
		} catch {
			// Restricted storage must not prevent stories from rendering.
		}
	}, [appearance]);
	return (
		<ThemeProvider
			mode={appearance === "mp-light" ? "light" : appearance}
			theme={appearance === "mp-light" ? "mp" : "default"}
		>
			{children}
		</ThemeProvider>
	);
}

function subscribeSystemMode(onChange: () => void) {
	const query = window.matchMedia("(prefers-color-scheme: dark)");
	query.addEventListener("change", onChange);
	return () => query.removeEventListener("change", onChange);
}

function isSystemDark() {
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function StorybookDocs({ context, ...props }: ComponentProps<typeof DocsContainer>) {
	const [appearance, setAppearance] = useState(() => {
		const story = context.componentStories()[0];
		return story
			? normalizeAppearance(context.getStoryContext(story).globals.appearance)
			: getInitialAppearance();
	});
	const systemDark = useSyncExternalStore(subscribeSystemMode, isSystemDark, () => false);
	useLayoutEffect(() => {
		const update = ({ globals }: { globals: Record<string, unknown> }) =>
			setAppearance(normalizeAppearance(globals.appearance));
		context.channel.on(GLOBALS_UPDATED, update);
		return () => {
			context.channel.off(GLOBALS_UPDATED, update);
		};
	}, [context]);
	const dark = appearance === "dark" || (appearance === "system" && systemDark);
	return (
		<StorybookTheme appearance={appearance}>
			<DocsContainer {...props} context={context} theme={dark ? themes.dark : themes.light} />
		</StorybookTheme>
	);
}
