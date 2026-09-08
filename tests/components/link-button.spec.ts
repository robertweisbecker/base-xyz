import { expect, test } from "../playwright";

test("uses link semantics for the native and router-rendered forms", async ({ page }) => {
	await page.goto("/iframe.html?id=components-link-link-button--playground&viewMode=story");

	const nativeLink = page.locator("#link-button-playground");
	await expect(nativeLink).toHaveAttribute("href", "#create-project");
	await expect(nativeLink).toHaveRole("link");

	await page.goto("/iframe.html?id=components-link-link-button--rendering&viewMode=story");

	const routerLink = page.locator("#link-button-rendered");
	await expect(routerLink).toHaveAttribute("href", "#router-dashboard");
	await expect(routerLink).toHaveRole("link");
});
