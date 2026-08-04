import type { Decorator, Preview } from "@storybook/react-vite";
import { themes } from "storybook/theming";
import "../src/styles/index.css";
import "./docs.css";
import "./reduced-motion.css";
import { ReducedMotionFrame } from "./reduced-motion-frame";
import { ThemeProvider, type ThemeMode, type ThemeName } from "../src/theme";

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
	const theme: ThemeName = context.globals.theme === "mp" ? "mp" : "default";
	const mode: ThemeMode =
		context.globals.mode === "light" || context.globals.mode === "dark" ? context.globals.mode : "system";
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
		mode: {
			description: "Global color mode",
			toolbar: {
				dynamicTitle: false,
				title: "Mode",
				items: [
					{ value: "system", title: "Auto", icon: "paintbrush" },
					{ value: "light", title: "Light", icon: "sun" },
					{ value: "dark", title: "Dark", icon: "moon" },
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
		theme: {
			description: "Global design theme",
			toolbar: {
				dynamicTitle: false,
				title: "Theme",
				items: [
					{ value: "default", title: "Default", icon: "paintbrush" },
					{ value: "mp", title: "MP", icon: "paintbrush" },
				],
			},
		},
	},
	initialGlobals: {
		mode: "system",
		reducedMotion: "system",
		theme: "default",
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
				order: ["Components", "Blocks", "Experimental", "Design system"],
			},
		},
	},
	tags: ["autodocs"],
};

export default preview;
