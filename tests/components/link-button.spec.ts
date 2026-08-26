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

test("uses link semantics for the native and router-rendered forms", async ({ page }) => {
	await page.goto("/iframe.html?id=components-link-link-button--playground&viewMode=story");

	const nativeLink = page.getByRole("link", { name: "Create project" });
	await expect(nativeLink).toHaveAttribute("href", "#create-project");
	await expect(nativeLink).toHaveAttribute("data-variant", "primary");
	await expect(page.getByRole("button", { name: "Create project" })).toHaveCount(0);

	await page.goto("/iframe.html?id=components-link-link-button--rendering&viewMode=story");

	const routerLink = page.getByRole("link", { name: "Open dashboard" });
	await expect(routerLink).toHaveAttribute("data-router-link", "");
	await expect(routerLink).toHaveAttribute("href", "#router-dashboard");
});

test("the Button rendering guidance points to LinkButton", async ({ page }) => {
	await page.goto("/iframe.html?id=components-button--rendering&viewMode=story");

	await expect(page.getByRole("link", { name: "LinkButton" })).toHaveAttribute(
		"href",
		"/?path=/story/components-link-link-button--playground",
	);
});
