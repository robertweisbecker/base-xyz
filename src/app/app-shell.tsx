import { Link as RouterLink, Outlet, useNavigate, useSearch } from "@tanstack/react-router";
import { MoonIcon } from "@phosphor-icons/react/dist/csr/Moon";
import { StairsIcon } from "@phosphor-icons/react/dist/csr/Stairs";
import { SunIcon } from "@phosphor-icons/react/dist/csr/Sun";
import * as stylex from "@stylexjs/stylex";
import { useEffect } from "react";
import { IconButton, Select, Separator } from "@/components";
import { textStyles } from "@/components/text/text.stylex";
import { media, zIndex } from "@/styles/constants.stylex";
import { focusRing } from "@/styles/recipes/focus";
import {
	ThemeProvider,
	useTheme,
	type ResolvedThemeMode,
	type ThemeMode,
	type ThemeName,
} from "@/theme";
import { tokens } from "@/theme/tokens.stylex";

const themeIconSize = 16;
const themeModeStorageKey = "base-stylex-theme";
const themeBrandStorageKey = "base-stylex-theme-brand";

const themeBrandItems: { label: string; value: ThemeName }[] = [
	{ label: "Base", value: "default" },
	{ label: "MP", value: "mp" },
];

export function AppShell() {
	const navigate = useNavigate();
	const search = useSearch({ from: "__root__" });
	const preferredMode = getStoredThemeMode();
	const preferredTheme = getStoredThemeBrand();
	const mode = search.mode ?? preferredMode;
	const theme = search.theme ?? preferredTheme;

	useEffect(() => {
		setStoredThemeMode(mode);
		setStoredThemeBrand(theme);
	}, [mode, theme]);

	function updateThemeSearch(nextPreference: { mode?: ThemeMode; theme?: ThemeName }) {
		void navigate({
			replace: true,
			resetScroll: false,
			to: ".",
			search: (previous) => {
				const nextMode = nextPreference.mode ?? previous.mode ?? getStoredThemeMode();
				const nextTheme = nextPreference.theme ?? previous.theme ?? getStoredThemeBrand();

				return {
					...previous,
					mode: nextMode === "system" ? undefined : nextMode,
					theme: nextTheme === "default" ? undefined : nextTheme,
				};
			},
		});
	}

	const handleModeChange = (nextMode: ThemeMode) => {
		setStoredThemeMode(nextMode);
		updateThemeSearch({ mode: nextMode });
	};

	const handleThemeChange = (nextTheme: ThemeName) => {
		setStoredThemeBrand(nextTheme);
		updateThemeSearch({ theme: nextTheme });
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
			<RouterLink
				to="/"
				search={true}
				{...stylex.props(textStyles.supporting, styles.brand, focusRing.offset)}
			>
				<span {...stylex.props(styles.brandMark)}>
					<StairsIcon aria-hidden size={16} weight="duotone" />
				</span>
				<span>BaseX</span>
			</RouterLink>
			<div {...stylex.props(styles.headerMeta)}>
				<nav
					aria-label="Demo pages"
					data-testid="app-navigation"
					{...stylex.props(styles.navigation)}
				>
					<RouterLink
						to="/"
						activeOptions={{ exact: true }}
						search={true}
						{...stylex.props(textStyles.supporting, styles.headerNavLink, focusRing.offset)}
					>
						Gallery
					</RouterLink>
					<RouterLink
						to="/experiments"
						search={true}
						{...stylex.props(textStyles.supporting, styles.headerNavLink, focusRing.offset)}
					>
						Experiments
					</RouterLink>
				</nav>
				<Separator orientation="vertical" />
				<Select.Root<ThemeName>
					size="sm"
					value={theme}
					items={themeBrandItems}
					onValueChange={(value) => {
						if (value) onThemeChange(value);
					}}
				>
					<Select.Trigger aria-label="Theme" data-testid="theme-trigger" variant="inline" />
					<Select.Popup>
						<Select.List>
							{themeBrandItems.map((item) => (
								<Select.Item
									data-testid={`theme-option-${item.value}`}
									key={item.value}
									value={item.value}
								>
									{item.label}
								</Select.Item>
							))}
						</Select.List>
					</Select.Popup>
				</Select.Root>
				<IconButton
					data-testid="theme-mode-toggle"
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

function getStoredThemeMode(): ThemeMode {
	if (typeof window === "undefined") return "system";
	const storedMode = localStorage.getItem(themeModeStorageKey);
	return storedMode === "light" || storedMode === "dark" || storedMode === "system"
		? storedMode
		: "system";
}

function getStoredThemeBrand(): ThemeName {
	if (typeof window === "undefined") return "default";
	const storedTheme = localStorage.getItem(themeBrandStorageKey);
	return storedTheme === "default" || storedTheme === "mp" ? storedTheme : "default";
}

function setStoredThemeMode(mode: ThemeMode) {
	if (typeof window !== "undefined") localStorage.setItem(themeModeStorageKey, mode);
}

function setStoredThemeBrand(theme: ThemeName) {
	if (typeof window !== "undefined") localStorage.setItem(themeBrandStorageKey, theme);
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
		display: "flex",
		justifyContent: "space-between",
		position: "sticky",
		zIndex: zIndex.sticky,
		borderBottomColor: tokens["--border"],
		borderBottomStyle: "solid",
		borderBottomWidth: tokens["--border-width"],
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
			":hover": {
				default: null,
				[media.canHover]: tokens["--fg"],
			},
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
