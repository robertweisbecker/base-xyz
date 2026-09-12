import { expect, test } from "../playwright";

const storyPath = "/iframe.html?id=blocks-ai-prompt-composer--examples&viewMode=story";

test("keeps the initial row floor while growing with content", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByTestId("growing-prompt-composer").getByRole("textbox");
	await expect(input).toBeVisible();

	const initialHeight = await input.evaluate((element) => element.clientHeight);
	await input.fill(
		"First line of the prompt.\nSecond line of the prompt.\nThird line of the prompt.\nFourth line of the prompt.\nFifth line of the prompt.",
	);
	await expect
		.poll(() => input.evaluate((element) => element.clientHeight))
		.toBeGreaterThan(initialHeight);

	await input.fill("");
	await expect.poll(() => input.evaluate((element) => element.clientHeight)).toBe(initialHeight);
});
