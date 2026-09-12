import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	async viteFinal(viteConfig, { configType = "PRODUCTION" }) {
		const cacheDir = `node_modules/.cache/storybook-vite-${configType.toLowerCase()}`;

		if (configType !== "DEVELOPMENT") {
			return {
				...viteConfig,
				cacheDir,
			};
		}

		const { mergeConfig } = await import("vite");

		return mergeConfig(viteConfig, {
			cacheDir,
			server: {
				watch: {
					usePolling: true,
					interval: 1000,
				},
			},
		});
	},
};

export default config;
