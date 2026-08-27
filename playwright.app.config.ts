import { defineConfig, devices } from "@playwright/test";

const appPort = process.env.PLAYWRIGHT_APP_PORT ?? "6107";
const appURL = `http://127.0.0.1:${appPort}`;

export default defineConfig({
	testDir: "./tests/app",
	fullyParallel: false,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: "list",
	use: {
		baseURL: appURL,
		screenshot: "only-on-failure",
		trace: "retain-on-failure",
	},
	webServer: {
		command: `npm run preview -- --host 127.0.0.1 --port ${appPort}`,
		reuseExistingServer: false,
		url: appURL,
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
