import { useRender } from "@base-ui/react/use-render";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	useContext,
	useLayoutEffect,
	useMemo,
	useRef,
	useSyncExternalStore,
	type CSSProperties,
	type Ref,
	type ReactNode,
} from "react";
import { tokens } from "@/theme/tokens.stylex";
import {
	ThemeContext,
	type ResolvedThemeMode,
	type ThemeContextValue,
	type ThemeMode,
	type ThemeName,
} from "./theme-context";
import { getThemeStyle } from "./themes.stylex";

type ThemeProviderState = {
	theme: ThemeName;
	mode: ThemeMode;
};

export type ThemeProviderProps = Omit<
	useRender.ComponentProps<"div", ThemeProviderState>,
	"children" | "ref" | "style"
> & {
	children?: ReactNode;
	mode?: ThemeMode;
	ref?: Ref<HTMLElement>;
	style?: StyleXStyles;
	theme?: ThemeName;
};

export function ThemeProvider({
	children,
	className,
	mode: modeProp,
	ref,
	render,
	style,
	theme: themeProp,
	...props
}: ThemeProviderProps) {
	const parentTheme = useContext(ThemeContext);
	const systemMode = useSyncExternalStore(subscribeToSystemMode, getSystemMode, getServerMode);
	const theme = themeProp ?? parentTheme?.theme ?? "default";
	const mode = modeProp ?? parentTheme?.mode ?? "system";
	const resolvedMode = mode === "system" ? systemMode : mode;
	const isRootProvider = parentTheme === null;
	const documentThemeOwner = useRef(Symbol("ThemeProvider"));
	const themeStyle = getThemeStyle(theme);
	const ownedStyleProps = stylex.props(themeStyle, providerStyles.root, modeStyles[resolvedMode]);
	const hostStyleProps = stylex.props(themeStyle, providerStyles.root, modeStyles[resolvedMode], style);

	useLayoutEffect(() => {
		if (!isRootProvider) return;
		return synchronizeDocumentTheme(
			documentThemeOwner.current,
			theme,
			mode,
			resolvedMode,
			ownedStyleProps.className,
			ownedStyleProps.style,
		);
	}, [isRootProvider, mode, ownedStyleProps.className, ownedStyleProps.style, resolvedMode, theme]);

	const value = useMemo<ThemeContextValue>(() => ({ mode, resolvedMode, theme }), [mode, resolvedMode, theme]);
	const element = useRender<ThemeProviderState, HTMLElement>({
		defaultTagName: "div",
		ref,
		render,
		state: { mode, theme },
		props: {
			...props,
			children,
			className: [hostStyleProps.className, className].filter(Boolean).join(" ") || undefined,
			style: hostStyleProps.style,
			"data-mode": mode,
			"data-theme": theme,
		},
	});

	return <ThemeContext.Provider value={value}>{element}</ThemeContext.Provider>;
}

function subscribeToSystemMode(onStoreChange: () => void) {
	if (typeof window === "undefined") return () => {};
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	mediaQuery.addEventListener("change", onStoreChange);
	return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getSystemMode(): ResolvedThemeMode {
	return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerMode(): ResolvedThemeMode {
	return "light";
}

type DocumentThemeRegistration = {
	className: string | undefined;
	mode: ThemeMode;
	resolvedMode: ResolvedThemeMode;
	style: CSSProperties | undefined;
	theme: ThemeName;
};

type OriginalDocumentTheme = {
	classNames: Set<string>;
	mode: string | null;
	styles: Map<string, { priority: string; value: string }>;
	theme: string | null;
};

const documentThemeRegistrations = new Map<symbol, DocumentThemeRegistration>();
let originalDocumentTheme: OriginalDocumentTheme | null = null;
let appliedDocumentClassNames = new Set<string>();
let appliedDocumentStyleProperties = new Set<string>();

function synchronizeDocumentTheme(
	owner: symbol,
	theme: ThemeName,
	mode: ThemeMode,
	resolvedMode: ResolvedThemeMode,
	className: string | undefined,
	style: CSSProperties | undefined,
) {
	if (documentThemeRegistrations.size === 0) captureOriginalDocumentTheme();
	const registration = { className, mode, resolvedMode, style, theme };
	documentThemeRegistrations.set(owner, registration);
	applyActiveDocumentTheme();

	return () => {
		if (documentThemeRegistrations.get(owner) !== registration) return;
		documentThemeRegistrations.delete(owner);
		applyActiveDocumentTheme();
	};
}

function captureOriginalDocumentTheme() {
	const root = document.documentElement;
	originalDocumentTheme = {
		classNames: new Set(root.classList),
		mode: root.getAttribute("data-mode"),
		styles: new Map(),
		theme: root.getAttribute("data-theme"),
	};
}

function applyActiveDocumentTheme() {
	const root = document.documentElement;
	const activeTheme = Array.from(documentThemeRegistrations.values()).at(-1);
	if (!activeTheme || !originalDocumentTheme) {
		restoreOriginalDocumentTheme();
		return;
	}

	const nextClassNames = new Set(activeTheme.className?.split(/\s+/).filter(Boolean) ?? []);
	for (const name of appliedDocumentClassNames) {
		if (!nextClassNames.has(name) && !originalDocumentTheme.classNames.has(name)) root.classList.remove(name);
	}
	for (const name of nextClassNames) root.classList.add(name);
	appliedDocumentClassNames = nextClassNames;

	const nextStyleEntries = new Map(
		Object.entries({ ...activeTheme.style, colorScheme: activeTheme.resolvedMode }).map(([property, value]) => [
			toCssProperty(property),
			value,
		]),
	);
	for (const property of appliedDocumentStyleProperties) {
		if (!nextStyleEntries.has(property)) restoreDocumentStyle(property);
	}
	for (const [property, value] of nextStyleEntries) {
		if (!originalDocumentTheme.styles.has(property)) {
			originalDocumentTheme.styles.set(property, {
				priority: root.style.getPropertyPriority(property),
				value: root.style.getPropertyValue(property),
			});
		}
		if (value !== null && value !== undefined) root.style.setProperty(property, String(value));
	}
	appliedDocumentStyleProperties = new Set(nextStyleEntries.keys());
	root.dataset.theme = activeTheme.theme;
	root.dataset.mode = activeTheme.mode;
}

function restoreOriginalDocumentTheme() {
	if (!originalDocumentTheme) return;
	const root = document.documentElement;
	restoreAttribute(root, "data-theme", originalDocumentTheme.theme);
	restoreAttribute(root, "data-mode", originalDocumentTheme.mode);
	for (const name of appliedDocumentClassNames) {
		if (!originalDocumentTheme.classNames.has(name)) root.classList.remove(name);
	}
	for (const property of appliedDocumentStyleProperties) restoreDocumentStyle(property);
	originalDocumentTheme = null;
	appliedDocumentClassNames = new Set();
	appliedDocumentStyleProperties = new Set();
}

function restoreDocumentStyle(property: string) {
	if (!originalDocumentTheme) return;
	const originalStyle = originalDocumentTheme.styles.get(property);
	if (originalStyle?.value) {
		document.documentElement.style.setProperty(property, originalStyle.value, originalStyle.priority);
	} else {
		document.documentElement.style.removeProperty(property);
	}
}

function restoreAttribute(element: HTMLElement, name: string, value: string | null) {
	if (value === null) element.removeAttribute(name);
	else element.setAttribute(name, value);
}

function toCssProperty(property: string) {
	if (property.startsWith("--")) return property;
	return property.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);
}

const providerStyles = stylex.create({
	root: {
		color: tokens["--fg"],
		fontFamily: tokens["--font-family-sans"],
	},
});

const modeStyles = stylex.create({
	dark: { colorScheme: "dark" },
	light: { colorScheme: "light" },
});
