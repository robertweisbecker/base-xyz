import { expect, test, type Page } from "@playwright/test";

const storyPath = "/iframe.html?id=components-navbar--playground&viewMode=story";
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

test("renders app-header landmarks, current-page state, and actions", async ({ page }) => {
	await page.goto(storyPath);

	const banner = page.getByRole("banner");
	const navigation = page.getByTestId("navbar-navigation");
	const brand = page.getByTestId("navbar-brand");
	const currentLink = navigation.getByTestId("navbar-link-overview");
	const otherLink = navigation.getByTestId("navbar-link-projects");

	await expect(banner).toHaveCSS("position", "fixed");
	await expect(brand).toHaveRole("link");
	await expect(navigation).toHaveRole("navigation");
	await expect(navigation).toHaveAccessibleName(/\S/);
	await expect(currentLink).toHaveRole("link");
	await expect(currentLink).toHaveAttribute("aria-current", "page");
	await expect(otherLink).toHaveRole("link");
	await expect(otherLink).not.toHaveAttribute("aria-current", /.+/);
	await expect(page.getByTestId("navbar-notifications")).toHaveRole("button");
	await expect(page.getByTestId("navbar-create")).toHaveRole("button");
});

test("keeps links in native keyboard order", async ({ page }) => {
	await page.goto(storyPath);

	await page.getByTestId("navbar-brand").focus();
	await page.keyboard.press("Tab");
	await expect(page.getByTestId("navbar-link-overview")).toBeFocused();
	await page.keyboard.press("Tab");
	await expect(page.getByTestId("navbar-link-projects")).toBeFocused();
	await page.keyboard.press("Tab");
	await expect(page.getByTestId("navbar-link-activity")).toBeFocused();
	await page.keyboard.press("Tab");
	await expect(page.getByTestId("navbar-notifications")).toBeFocused();
});

test("supports absolute, fixed, and sticky positioning", async ({ page }) => {
	for (const position of ["absolute", "fixed", "sticky"] as const) {
		await page.goto(`${storyPath}&args=position:${position}`);

		await expect(page.getByRole("banner")).toHaveCSS("position", position);
		await expect(page.getByTestId("navbar-navigation")).toBeVisible();
	}
});
