import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: false,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: "list",
	use: {
		baseURL: "http://127.0.0.1:6106",
		screenshot: "only-on-failure",
		trace: "retain-on-failure",
	},
	webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
		? undefined
		: {
				command: "npx vite preview --outDir storybook-static --host 127.0.0.1 --port 6106",
				reuseExistingServer: false,
				url: "http://127.0.0.1:6106",
			},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
