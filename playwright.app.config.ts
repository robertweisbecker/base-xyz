import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/app",
	fullyParallel: false,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: "list",
	use: {
		baseURL: "http://127.0.0.1:6107",
		screenshot: "only-on-failure",
		trace: "retain-on-failure",
	},
	webServer: {
		command: "npm run preview -- --host 127.0.0.1 --port 6107",
		reuseExistingServer: false,
		url: "http://127.0.0.1:6107",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
