import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { chromium } from "@playwright/test";
import { createServer } from "vite";

const cacheDir = await mkdtemp(path.join(tmpdir(), "base-stylex-vite-"));
let browser;
let server;

try {
	server = await createServer({
		cacheDir,
		configFile: "vite.config.ts",
		logLevel: "silent",
		server: {
			host: "127.0.0.1",
			port: 0,
			strictPort: true,
		},
	});
	await server.listen();

	const appUrl = server.resolvedUrls?.local[0];
	assert(appUrl, "Vite did not expose a local development URL.");

	browser = await chromium.launch({ headless: true });
	const page = await browser.newPage();
	const stylesheetResponses = [];

	page.on("response", (response) => {
		if (response.url().includes("/virtual:stylex.css")) {
			stylesheetResponses.push({ status: response.status(), url: response.url() });
		}
	});

	await page.goto(appUrl, { waitUntil: "networkidle" });
	await page.locator("#root").waitFor({ state: "visible" });

	assert(stylesheetResponses.length > 0, "The StyleX development stylesheet was not requested.");
	assert.deepEqual(
		stylesheetResponses.filter(({ status }) => status !== 200),
		[],
		"The StyleX development stylesheet failed during a cold page load.",
	);

	const stylesheetResponse = await page.request.get(new URL("/virtual:stylex.css", appUrl).href);
	assert.equal(stylesheetResponse.status(), 200);
	const stylesheet = await stylesheetResponse.text();
	assert(stylesheet.length > 0, "The StyleX development stylesheet is empty.");
	assert.doesNotMatch(stylesheet, /@(media|container)\s+var\(--/);
} finally {
	await browser?.close();
	await server?.close();
	await rm(cacheDir, { force: true, recursive: true });
}
