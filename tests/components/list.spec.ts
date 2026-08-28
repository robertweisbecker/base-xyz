import { expect, test } from "../playwright";

test("preserves native list semantics and decorative custom markers", async ({ page }) => {
	await page.goto("/iframe.html?id=components-list--examples&viewMode=story");

	const unorderedRoot = page.getByTestId("unordered-list-example");
	const unorderedLists = unorderedRoot.locator("ul");
	await expect(unorderedRoot).toHaveJSProperty("tagName", "UL");
	await expect(unorderedLists).toHaveCount(2);

	const orderedRoot = page.getByTestId("ordered-list-example");
	await expect(orderedRoot).toHaveJSProperty("tagName", "OL");
	await expect(orderedRoot.locator("ol")).toHaveCount(1);

	const customRoot = page.getByTestId("custom-marker-list-example");
	await expect(customRoot).toHaveJSProperty("tagName", "UL");
	const customItems = customRoot.getByRole("listitem");
	await expect(customItems).toHaveCount(3);
	await expect(customItems.locator(":scope > span[aria-hidden='true']")).toHaveCount(3);
});

test("a custom item marker forces unordered semantics", async ({ page }) => {
	await page.goto(
		"/iframe.html?id=components-list--playground&viewMode=story&args=ordered:true;marker:Check",
	);

	await expect(page.getByTestId("list-playground")).toHaveJSProperty("tagName", "UL");
});
