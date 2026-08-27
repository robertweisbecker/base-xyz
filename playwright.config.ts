import { defineConfig, devices } from "@playwright/test";

const storybookPort = process.env.PLAYWRIGHT_STORYBOOK_PORT ?? "6106";
const storybookURL = `http://127.0.0.1:${storybookPort}`;

export default defineConfig({
	testDir: "./tests",
	testIgnore: "**/app/**",
	fullyParallel: false,
	workers: 1,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: "list",
	expect: {
		timeout: 15_000,
	},
	use: {
		baseURL: storybookURL,
		screenshot: "only-on-failure",
		trace: "retain-on-failure",
	},
	webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
		? undefined
		: {
				command: `npx vite preview --outDir storybook-static --host 127.0.0.1 --port ${storybookPort}`,
				reuseExistingServer: false,
				url: storybookURL,
			},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
