import type { Decorator, Preview } from "@storybook/react-vite";
import { themes } from "storybook/theming";
import "../src/styles/index.css";
import "./docs.css";
import "./reduced-motion.css";
import { ReducedMotionFrame } from "./reduced-motion-frame";
import { ThemeProvider, type ThemeMode, type ThemeName } from "../src/theme";

type StorybookTheme = { mode: ThemeMode; theme: ThemeName };

function resolveAppearance(appearance: string | undefined): StorybookTheme {
	switch (appearance) {
		case "light":
			return { mode: "light", theme: "default" };
		case "dark":
			return { mode: "dark", theme: "default" };
		case "mp-light":
			return { mode: "light", theme: "mp" };
		default:
			return { mode: "system", theme: "default" };
	}
}

let focusAccessorGuarded = false;

const guardStorybookFocusAccessor = () => {
	if (focusAccessorGuarded || typeof HTMLElement === "undefined") return;

	const focusDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "focus");
	if (!focusDescriptor?.get || !focusDescriptor.set) return;

	const focus = focusDescriptor.get.call(document.documentElement);
	const getFocus = focusDescriptor.get;
	const setFocus = focusDescriptor.set;

	Object.defineProperty(HTMLElement.prototype, "focus", {
		...focusDescriptor,
		get() {
			return this === HTMLElement.prototype ? focus : getFocus.call(this);
		},
		set(value) {
			setFocus.call(this, value);
		},
	});
	focusAccessorGuarded = true;
};

const withStorybookFocusCompatibility: Decorator = (Story) => {
	// Storybook replaces focus with an accessor while running Canvas stories.
	// React Aria reads that accessor from the prototype when Docs blocks load.
	guardStorybookFocusAccessor();
	return <Story />;
};

const withTheme: Decorator = (Story, context) => {
	const { mode, theme } = resolveAppearance(context.globals.appearance);
	return (
		<ThemeProvider mode={mode} theme={theme}>
			<Story />
		</ThemeProvider>
	);
};

const withReducedMotion: Decorator = (Story, context) => (
	<ReducedMotionFrame reducedMotion={context.globals.reducedMotion === "reduce"}>
		<Story />
	</ReducedMotionFrame>
);

const preview: Preview = {
	decorators: [withStorybookFocusCompatibility, withTheme, withReducedMotion],
	globalTypes: {
		appearance: {
			description: "Theme",
			toolbar: {
				title: "Theme",
				items: [
					{ value: "system", title: "System", icon: "paintbrush" },
					{ value: "light", title: "Light", icon: "sun" },
					{ value: "dark", title: "Dark", icon: "moon" },
					{ value: "mp-light", title: "mp-light", icon: "paintbrush" },
				],
			},
		},
		reducedMotion: {
			description: "Global motion preference",
			toolbar: {
				dynamicTitle: false,
				title: "Motion",
				items: [
					{ value: "system", title: "On", icon: "lightning" },
					{ value: "reduce", title: "Off", icon: "lightningoff" },
				],
			},
		},
	},
	initialGlobals: {
		appearance: "system",
		reducedMotion: "system",
	},
	parameters: {
		docs: {
			theme: themes.normal,
		},
		layout: "padded",
		controls: {
			expanded: true,
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			test: "error",
		},
		options: {
			storySort: {
				includeNames: false,
				locales: "en",
				method: "alphabetical",
				order: ["Gallery", "Components", "Blocks", "Experimental", "Design system"],
			},
		},
	},
	tags: ["autodocs"],
};

export default preview;
