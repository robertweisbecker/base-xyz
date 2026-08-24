import { expect, test } from "@playwright/test";

test.beforeEach(({ page }) => {
	page.on("console", (message) => {
		if (message.type() === "error") throw new Error(`Browser console error: ${message.text()}`);
	});
});

test("keeps the component Gallery at the landing page", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole("heading", { name: "Components" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Blocks" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Gallery" })).toHaveAttribute("aria-current", "page");
});

test("supports direct navigation to a separate experiments page", async ({ page }) => {
	await page.goto("/experiments?theme=mp&mode=dark");

	await expect(page).toHaveURL(/\/experiments\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Experiments", level: 1 })).toBeVisible();
	await expect(page.getByRole("link", { name: "Experiments" })).toHaveAttribute("aria-current", "page");

	await page.getByRole("link", { name: "Gallery" }).click();
	await expect(page).toHaveURL(/\/\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Components" })).toBeVisible();
});

test("preserves theme URL state changed after the router initializes", async ({ page }) => {
	await page.goto("/");

	await page.getByRole("combobox", { name: "Theme" }).click();
	await page.getByRole("option", { name: "MP" }).click();
	await page.getByRole("button", { name: /Switch to (dark|light) mode/ }).click();

	const searchBeforeNavigation = new URL(page.url()).search;
	expect(searchBeforeNavigation).toContain("theme=mp");
	expect(searchBeforeNavigation).toMatch(/mode=(dark|light)/);

	await page.getByRole("link", { name: "Experiments" }).click();
	await expect(page).toHaveURL(new RegExp(`/experiments${searchBeforeNavigation.replaceAll("?", "\\?")}$`));
});
