import { expect, test } from "../playwright";

test("preserves ordered and unordered native list semantics", async ({ page }) => {
	await page.goto("/iframe.html?id=components-list--examples&viewMode=story");

	const unorderedRoot = page.getByTestId("unordered-list-example");
	await expect(unorderedRoot).toHaveJSProperty("tagName", "UL");

	const orderedRoot = page.getByTestId("ordered-list-example");
	await expect(orderedRoot).toHaveJSProperty("tagName", "OL");

	const customRoot = page.getByTestId("custom-marker-list-example");
	await expect(customRoot).toHaveJSProperty("tagName", "UL");
});

test("a custom item marker forces unordered semantics", async ({ page }) => {
	await page.goto(
		"/iframe.html?id=components-list--playground&viewMode=story&args=ordered:true;marker:Check",
	);

	await expect(page.getByTestId("list-playground")).toHaveJSProperty("tagName", "UL");
});
