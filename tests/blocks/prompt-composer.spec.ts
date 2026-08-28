import { expect, test, type Page } from "@playwright/test";

const storyPath = "/iframe.html?id=blocks-prompt-composer--examples&viewMode=story";
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

test("keeps the initial row floor while growing with content", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Message" }).first();
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
