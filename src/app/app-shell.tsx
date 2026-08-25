import { Link as RouterLink, Outlet } from "@tanstack/react-router";
import { MoonIcon } from "@phosphor-icons/react/dist/csr/Moon";
import { StairsIcon } from "@phosphor-icons/react/dist/csr/Stairs";
import { SunIcon } from "@phosphor-icons/react/dist/csr/Sun";
import * as stylex from "@stylexjs/stylex";
import { useLayoutEffect, useState } from "react";
import { IconButton, Select, Separator } from "@/components";
import { textStyles } from "@/components/text/text.stylex";
import { Text } from "@/components/text";
import { zIndex } from "@/styles/constants.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { parseModeFromSearchParams, parseThemeFromSearchParams, syncAppThemeUrl } from "@/theme/app-theme-url";
import { ThemeProvider, useTheme, type ResolvedThemeMode, type ThemeMode, type ThemeName } from "@/theme";
import { tokens } from "@/theme/tokens.stylex";

const themeIconSize = 18;
const themeModeStorageKey = "base-stylex-theme";
const themeBrandStorageKey = "base-stylex-theme-brand";

const themeBrandItems: { label: string; value: ThemeName }[] = [
	{ label: "Base", value: "default" },
	{ label: "MP", value: "mp" },
];

export function AppShell() {
	const [mode, setMode] = useState<ThemeMode>(getInitialThemeMode);
	const [theme, setTheme] = useState<ThemeName>(getInitialThemeBrand);

	useLayoutEffect(() => {
		localStorage.setItem(themeModeStorageKey, mode);
	}, [mode]);

	useLayoutEffect(() => {
		localStorage.setItem(themeBrandStorageKey, theme);
	}, [theme]);

	const handleModeChange = (nextMode: ThemeMode) => {
		setMode(nextMode);
		syncAppThemeUrl(theme, nextMode);
	};

	const handleThemeChange = (nextTheme: ThemeName) => {
		setTheme(nextTheme);
		syncAppThemeUrl(nextTheme, mode);
	};

	return (
		<ThemeProvider mode={mode} theme={theme} render={<div id="top" />} style={styles.app}>
			<AppHeader onModeChange={handleModeChange} onThemeChange={handleThemeChange} theme={theme} />
			<Outlet />
		</ThemeProvider>
	);
}

function AppHeader({
	onModeChange,
	onThemeChange,
	theme,
}: {
	onModeChange: (mode: ThemeMode) => void;
	onThemeChange: (theme: ThemeName) => void;
	theme: ThemeName;
}) {
	const { resolvedMode } = useTheme();
	const nextMode: ResolvedThemeMode = resolvedMode === "light" ? "dark" : "light";

	return (
		<header {...stylex.props(styles.header)}>
			<RouterLink to="/" search={true} {...stylex.props(textStyles.supporting, styles.brand, focusRing.offset)}>
				<span {...stylex.props(styles.brandMark)}>
					<StairsIcon aria-hidden size={16} weight="duotone" />
				</span>
				<span>BaseX</span>
			</RouterLink>
			<div {...stylex.props(styles.headerMeta)}>
				<nav aria-label="Demo pages" {...stylex.props(styles.navigation)}>
					<RouterLink
						to="/"
						activeOptions={{ exact: true }}
						search={true}
						{...stylex.props(textStyles.supporting, styles.headerNavLink, focusRing.offset)}>
						Gallery
					</RouterLink>
					<RouterLink
						to="/experiments"
						search={true}
						{...stylex.props(textStyles.supporting, styles.headerNavLink, focusRing.offset)}>
						Experiments
					</RouterLink>
				</nav>
				<Separator orientation="vertical" />
				<Text size={"1"} render={<span />}>
					<Select.Root<ThemeName>
						size="sm"
						value={theme}
						items={themeBrandItems}
						onValueChange={(value) => {
							if (value) onThemeChange(value);
						}}>
						<Select.Trigger aria-label="Theme" variant="inline" />
						<Select.Popup>
							<Select.List>
								{themeBrandItems.map((item) => (
									<Select.Item key={item.value} value={item.value}>
										{item.label}
									</Select.Item>
								))}
							</Select.List>
						</Select.Popup>
					</Select.Root>
				</Text>
				<IconButton
					icon={
						<span {...stylex.props(styles.themeIcon)}>
							{resolvedMode === "light" ? (
								<MoonIcon aria-hidden size={themeIconSize} weight="duotone" />
							) : (
								<SunIcon aria-hidden size={themeIconSize} weight="duotone" />
							)}
						</span>
					}
					label={`Switch to ${nextMode} mode`}
					variant="ghost"
					shape="circle"
					size="sm"
					onClick={() => onModeChange(nextMode)}
				/>
			</div>
		</header>
	);
}

function getInitialThemeMode(): ThemeMode {
	if (typeof window === "undefined") return "system";
	const fromUrl = parseModeFromSearchParams(new URLSearchParams(window.location.search));
	if (fromUrl !== undefined) return fromUrl;
	const storedMode = localStorage.getItem(themeModeStorageKey);
	return storedMode === "light" || storedMode === "dark" || storedMode === "system" ? storedMode : "system";
}

function getInitialThemeBrand(): ThemeName {
	if (typeof window === "undefined") return "default";
	const fromUrl = parseThemeFromSearchParams(new URLSearchParams(window.location.search));
	if (fromUrl !== undefined) return fromUrl;
	const storedTheme = localStorage.getItem(themeBrandStorageKey);
	return storedTheme === "default" || storedTheme === "mp" ? storedTheme : "default";
}

const styles = stylex.create({
	app: {
		backgroundColor: tokens["--canvas"],
		color: tokens["--fg"],
		minHeight: "100svh",
	},
	header: {
		paddingInline: tokens["--space-4"],
		alignItems: "center",
		// backgroundImage: `linear-gradient(to bottom, ${tokens["--canvas"]}, transparent)`,
		backgroundColor: tokens["--surface"],
		borderBottomWidth: tokens["--border-width"],
		borderBottomStyle: "solid",
		borderBottomColor: tokens["--border"],
		display: "flex",
		justifyContent: "space-between",
		position: "sticky",
		zIndex: zIndex.sticky,
		height: tokens["--size-navbar-height"],
		top: 0,
	},
	brand: {
		gap: tokens["--space-2"],
		textDecoration: "none",
		alignItems: "center",
		color: tokens["--fg"],
		display: "inline-flex",
	},
	brandMark: {
		borderRadius: tokens["--radius-xs"],
		outline: `1px solid ${tokens["--canvas"]}`,
		alignItems: "center",
		aspectRatio: 1,
		backgroundColor: tokens["--border"],
		color: tokens["--fg-muted"],
		display: "inline-flex",
		justifyContent: "center",
		height: "20px",
	},
	headerMeta: {
		gap: tokens["--space-3"],
		alignItems: "center",
		display: "flex",
	},
	navigation: {
		gap: tokens["--space-3"],
		alignItems: "center",
		display: "flex",
	},
	headerNavLink: {
		textDecoration: "none",
		color: {
			"[aria-current='page']": tokens["--fg"],
			default: tokens["--fg-muted"],
			":hover": tokens["--fg"],
		},
		fontSize: tokens["--font-size-1"],
	},
	themeIcon: {
		alignItems: "center",
		display: "inline-flex",
		justifyContent: "center",
		lineHeight: 0,
		height: `${themeIconSize}px`,
		width: `${themeIconSize}px`,
	},
});
