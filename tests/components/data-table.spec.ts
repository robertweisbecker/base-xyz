import { expect, test, type Page } from "@playwright/test";

const storyPath = "/iframe.html?id=components-data-table--playground&viewMode=story";
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

test("row expansion toggles keep row context in the accessible name and short tooltip copy", async ({
	page,
}) => {
	await page.goto(storyPath);

	const firstRowToggle = page.getByRole("button", { name: "Expand row 1" });
	await expect(firstRowToggle).toBeVisible();
	await firstRowToggle.hover();
	await expect(page.getByText("Expand", { exact: true })).toBeVisible();

	await firstRowToggle.click();
	await expect(page.getByRole("button", { name: "Collapse row 1" })).toBeVisible();
});
