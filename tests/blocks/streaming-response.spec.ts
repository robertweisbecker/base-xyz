import { expect, test, type Page } from "../playwright";

const storyPath = "/iframe.html?id=blocks-streaming-response--replacement-reset&viewMode=story";

async function pauseClock(page: Page) {
	await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 100);
}

test("resets replacement and retry streams before their first render", async ({ page }) => {
	test.setTimeout(120_000);
	await page.clock.install();
	await page.goto(storyPath);

	const content = page.getByTestId("streaming-replacement-content");
	const completionCount = page.getByTestId("streaming-completion-count");
	const chunks = content.locator("[data-streaming-text-chunk]");

	await expect(content).toBeVisible({ timeout: 30_000 });
	await expect(completionCount).toHaveAttribute("data-value", "1", { timeout: 30_000 });
	await expect.poll(() => chunks.count()).toBeGreaterThan(1);
	await expect(content.locator("[data-streaming-text-caret]")).toHaveCount(0);

	await pauseClock(page);

	await page.getByTestId("streaming-replace").click();
	await expect(chunks).toHaveCount(1);
	await expect(completionCount).toHaveAttribute("data-value", "1");
	await expect(content.locator("[data-streaming-text-caret]")).toHaveCount(1);

	await page.clock.runFor(92);
	await expect(chunks).toHaveCount(2);
	await expect(completionCount).toHaveAttribute("data-value", "2");
	await expect(content.locator("[data-streaming-text-caret]")).toHaveCount(0);

	await page.getByTestId("streaming-retry").click();
	await expect(chunks).toHaveCount(1);
	await expect(completionCount).toHaveAttribute("data-value", "2");
	await expect(content.locator("[data-streaming-text-caret]")).toHaveCount(1);

	await page.clock.runFor(92);
	await expect(chunks).toHaveCount(2);
	await expect(completionCount).toHaveAttribute("data-value", "3");
	await expect(content.locator("[data-streaming-text-caret]")).toHaveCount(0);
});
