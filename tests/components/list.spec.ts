import { expect, test, type Page } from "@playwright/test";

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

test("preserves list semantics and differentiates nested markers", async ({ page }) => {
	await page.goto("/iframe.html?id=components-list--examples&viewMode=story");

	const unorderedLists = page.getByTestId("unordered-list-example").locator("ul");
	await expect(unorderedLists).toHaveCount(2);
	await expect(page.getByTestId("unordered-list-example")).toHaveCSS("list-style-type", "disc");
	await expect(unorderedLists.nth(0)).toHaveCSS("list-style-type", "circle");
	await expect(unorderedLists.nth(1)).toHaveCSS("list-style-type", "square");

	const orderedRoot = page.getByTestId("ordered-list-example");
	await expect(orderedRoot).toHaveCSS("list-style-type", "decimal");
	await expect(orderedRoot.locator("ol")).toHaveCSS("list-style-type", "lower-alpha");

	const customItem = page.getByRole("listitem").filter({ hasText: "deliberately long line" });
	await expect(customItem).toHaveCSS("display", "grid");
	await expect(customItem).toHaveCSS("align-items", "start");
	await expect
		.poll(() =>
			customItem.evaluate((item) => {
				const marker = item.querySelector(":scope > span");
				if (!(marker instanceof HTMLElement)) return false;
				return Math.abs(marker.getBoundingClientRect().height - Number.parseFloat(getComputedStyle(item).lineHeight)) <= 1;
			}),
		)
		.toBe(true);
	await expect
		.poll(async () => {
			const [itemBox, markerBox, contentBox] = await Promise.all([
				customItem.boundingBox(),
				customItem.locator(":scope > span").boundingBox(),
				customItem.locator(":scope > div").boundingBox(),
			]);
			if (itemBox === null || markerBox === null || contentBox === null) return false;
			return markerBox.x < contentBox.x && Math.abs(itemBox.x + markerBox.width - contentBox.x) <= 1;
		})
		.toBe(true);
});

test("a custom item marker forces unordered semantics", async ({ page }) => {
	await page.goto("/iframe.html?id=components-list--playground&viewMode=story&args=ordered:true;marker:Check");

	await expect(page.getByTestId("list-playground")).toHaveJSProperty("tagName", "UL");
});
