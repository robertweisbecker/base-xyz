import { expect, test } from "../playwright";

const storyPath = "/iframe.html?id=blocks-ai-streaming-response--replacement-reset&viewMode=story";
const initialResponse = "The initial response contains enough words to expose stale reveal state";
const replacementResponse = "The replacement response is ready";

test("replacement and retry streams reveal fresh text and complete once", async ({ page }) => {
	// Freeze before navigation, with a target that cannot become stale within this test.
	await page.clock.install({ time: 0 });
	await page.clock.pauseAt(test.info().timeout);
	await page.goto(storyPath);
	const content = page.getByTestId("streaming-replacement-content");
	const completionCount = page.getByTestId("streaming-completion-count");

	async function expectCompletedText(response: string) {
		await expect
			.poll(async () => {
				await page.clock.runFor(100);
				return (await content.textContent())?.trim();
			})
			.toBe(response);
	}

	await expect(content).toBeVisible();
	await expectCompletedText(initialResponse);
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

		await expectCompletedText(replacementResponse);
		await expect(completionCount).toHaveAttribute("data-value", String(completed));
	}
});
