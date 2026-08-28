import { expect, test } from "../playwright";

test("uses link semantics for the native and router-rendered forms", async ({ page }) => {
	await page.goto("/iframe.html?id=components-link-link-button--playground&viewMode=story");

	const nativeLink = page.locator("#link-button-playground");
	await expect(nativeLink).toHaveAttribute("href", "#create-project");
	await expect(nativeLink).toHaveAttribute("data-variant", "primary");
	await expect(nativeLink).toHaveJSProperty("tagName", "A");

	await page.goto("/iframe.html?id=components-link-link-button--rendering&viewMode=story");

	const routerLink = page.locator("#link-button-rendered");
	await expect(routerLink).toHaveAttribute("data-router-link", "");
	await expect(routerLink).toHaveAttribute("href", "#router-dashboard");
	await expect(routerLink).toHaveJSProperty("tagName", "A");
});

test("the Button rendering guidance points to LinkButton", async ({ page }) => {
	await page.goto("/iframe.html?id=components-button--rendering&viewMode=story");

	await expect(page.getByTestId("button-link-guidance")).toHaveAttribute(
		"href",
		"/?path=/story/components-link-link-button--playground",
	);
});
