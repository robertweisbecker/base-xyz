import { expect, test, type Page } from "@playwright/test";

const storyPath = "/iframe.html?id=blocks-streaming-response--replacement-reset&viewMode=story";
const consoleErrorsByPage = new WeakMap<Page, string[]>();

test.beforeEach(({ page }) => {
	const consoleErrors: string[] = [];
	consoleErrorsByPage.set(page, consoleErrors);
	page.on("console", (message) => {
		if (message.type() === "error") consoleErrors.push(message.text());
	});
});

test.afterEach(({ page }) => {
	expect(consoleErrorsByPage.get(page)).toEqual([]);
});

async function pauseClock(page: Page) {
	await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 100);
}

test("resets replacement and retry streams before their first render", async ({ page }) => {
	test.setTimeout(120_000);
	await page.clock.install();
	await page.goto(storyPath);

	const content = page.getByTestId("streaming-replacement-content");
	const completionCount = page.getByTestId("streaming-completion-count");

	await expect(content).toBeVisible({ timeout: 30_000 });
	await expect(completionCount).toHaveText("1", { timeout: 30_000 });
	await expect(content).toContainText(
		"The initial response contains enough words to expose stale reveal state",
	);
	await expect(content.locator("[data-streaming-text-caret]")).toHaveCount(0);

	await pauseClock(page);

	await page.getByRole("button", { name: "Replace response" }).click();
	await expect(content).toContainText("The replacement response");
	await expect(content).not.toContainText("is ready");
	await expect(completionCount).toHaveText("1");
	await expect(content.locator("[data-streaming-text-caret]")).toHaveCount(1);

	await page.clock.runFor(92);
	await expect(content).toContainText("The replacement response is ready");
	await expect(completionCount).toHaveText("2");
	await expect(content.locator("[data-streaming-text-caret]")).toHaveCount(0);

	await page.getByRole("button", { name: "Retry same response" }).click();
	await expect(content).toContainText("The replacement response");
	await expect(content).not.toContainText("is ready");
	await expect(completionCount).toHaveText("2");
	await expect(content.locator("[data-streaming-text-caret]")).toHaveCount(1);

	await page.clock.runFor(92);
	await expect(content).toContainText("The replacement response is ready");
	await expect(completionCount).toHaveText("3");
	await expect(content.locator("[data-streaming-text-caret]")).toHaveCount(0);
});
