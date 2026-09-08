import { expect, test } from "../playwright";

const storyPath = "/iframe.html?id=blocks-streaming-response--replacement-reset&viewMode=story";
const initialResponse = "The initial response contains enough words to expose stale reveal state";
const replacementResponse = "The replacement response is ready";

test("replacement and retry streams reveal fresh text and complete once", async ({ page }) => {
	await page.clock.install();
	await page.goto(storyPath);
	const content = page.getByTestId("streaming-replacement-content");
	const completionCount = page.getByTestId("streaming-completion-count");
	await expect(content).toBeVisible();
	await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 100);

	await page.clock.runFor(2_000);
	await expect(content).toHaveText(initialResponse);
	await expect(completionCount).toHaveAttribute("data-value", "1");

	for (const [action, completed] of [
		["streaming-replace", 2],
		["streaming-retry", 3],
	] as const) {
		await page.getByTestId(action).click();
		const firstText = (await content.textContent())?.trim() ?? "";
		expect(firstText.length).toBeGreaterThan(0);
		expect(replacementResponse.startsWith(firstText)).toBe(true);
		expect(firstText).not.toBe(replacementResponse);
		await expect(completionCount).toHaveAttribute("data-value", String(completed - 1));

		await page.clock.runFor(2_000);
		await expect(content).toHaveText(replacementResponse);
		await expect(completionCount).toHaveAttribute("data-value", String(completed));
	}
});
