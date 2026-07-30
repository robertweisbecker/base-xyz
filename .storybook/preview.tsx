import type { Decorator, Preview } from "@storybook/react-vite";
import { themes } from "storybook/theming";
import "../src/styles/index.css";
import { ThemeFrame } from "./theme-frame";

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
	const theme =
		context.globals.theme === "light" || context.globals.theme === "dark" ? context.globals.theme : "system";
	return (
		<ThemeFrame theme={theme}>
			<Story />
		</ThemeFrame>
	);
};

const preview: Preview = {
	decorators: [withStorybookFocusCompatibility, withTheme],
	globalTypes: {
		theme: {
			description: "Global color theme",
			toolbar: {
				dynamicTitle: true,
				icon: "paintbrush",
				items: [
					{ value: "system", title: "System" },
					{ value: "light", title: "Light" },
					{ value: "dark", title: "Dark" },
				],
			},
		},
	},
	initialGlobals: {
		theme: "system",
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
				order: ["Foundations", "Components", "Blocks", "Experimental"],
			},
		},
	},
	tags: ["autodocs"],
};

export default preview;
