import { defineConfig } from "vite";
import type { PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { unplugin as stylex } from "@stylexjs/unplugin";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";

const stylexConstantsPath = fileURLToPath(
	new URL("./src/styles/constants.stylex.ts", import.meta.url),
);

// The dev CSS endpoint can be requested before Vite has traversed a consumer's
// imports. Register selector constants immediately before serving the document
// so breakpoints never reach Lightning CSS as unresolved `var(...)` selectors.
const preloadStylexConstants = (): PluginOption => ({
	name: "preload-stylex-constants",
	apply: "serve",
	enforce: "pre",
	transformIndexHtml: {
		order: "pre",
		async handler(_html, { server }) {
			if (server) {
				await server.transformRequest(stylexConstantsPath);
			}
		},
	},
});

export default defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	plugins: [
		preloadStylexConstants(),
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		stylex.vite({
			aliases: {
				"@/*": "/ROOT/src/*",
			},
			useCSSLayers: {
				before: ["reset"],
			},
		}),
		react(),
	],
});
