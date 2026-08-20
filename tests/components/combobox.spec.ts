import { expect, test, type Page } from "@playwright/test";

const storyPath = "/iframe.html?id=components-combobox--creatable-tags&viewMode=story";
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

test("shows the plus indicator for a creatable item", async ({ page }) => {
	await page.goto(storyPath);

	const input = page.getByRole("combobox");
	await input.fill("Gemini");

	const creatableItem = page.getByRole("option", { name: 'Create “Gemini”' });
	await expect(creatableItem).toBeVisible();
	await expect(creatableItem.locator("svg")).toBeVisible();
});
