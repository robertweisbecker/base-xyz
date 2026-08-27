import type { StorybookConfig } from "@storybook/react-vite";

const getStorybookViteCacheDir = (configType: "DEVELOPMENT" | "PRODUCTION") =>
	`node_modules/.cache/storybook-vite-${configType.toLowerCase()}`;

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	docs: {
		autodocs: "tag",
	},
	async viteFinal(viteConfig, { configType }) {
		const cacheDir = getStorybookViteCacheDir(configType);

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
