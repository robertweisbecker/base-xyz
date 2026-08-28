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

test("keeps the Gallery route at the landing page", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole("link", { name: "Gallery" })).toHaveAttribute("aria-current", "page");
});

test("navigates between the top-level app routes while preserving search state", async ({
	page,
}) => {
	await page.goto("/experiments?theme=mp&mode=dark");

	await expect(page).toHaveURL(/\/experiments\?theme=mp&mode=dark$/);
	await expect(page.getByRole("link", { name: "Experiments" })).toHaveAttribute(
		"aria-current",
		"page",
	);
	await expect(page.getByRole("navigation", { name: "Breadcrumbs" })).toContainText("Experiments");

	await page
		.getByRole("navigation", { name: "Demo pages" })
		.getByRole("link", { name: "Gallery" })
		.click();
	await expect(page).toHaveURL(/\/\?theme=mp&mode=dark$/);
	await expect(page.getByRole("link", { name: "Gallery" })).toHaveAttribute("aria-current", "page");
});

const experimentRoutes = [
	{
		path: "/experiments/blocks/utilities",
		parent: "Blocks",
		leaf: "Utilities",
		siblingPath: "/experiments/blocks/agent-blocks",
		sibling: "Agent Blocks",
	},
	{
		path: "/experiments/components/inputs",
		parent: "Components",
		leaf: "Inputs",
		siblingPath: "/experiments/components/popups",
		sibling: "Popups",
	},
] as const;

for (const { leaf, parent, path, sibling, siblingPath } of experimentRoutes) {
	test(`${leaf} route updates navigation and breadcrumbs`, async ({ page }) => {
		const search = "?theme=mp&mode=dark";
		await page.goto(`${path}${search}`);

		await expect.poll(() => new URL(page.url()).pathname).toBe(path);
		expect(new URL(page.url()).search).toBe(search);

		const experimentNavigation = page.getByRole("navigation", { name: "Experiments" });
		await expect(experimentNavigation.getByRole("link", { name: leaf })).toHaveAttribute(
			"aria-current",
			"page",
		);

		const breadcrumbs = page.getByRole("navigation", { name: "Breadcrumbs" });
		await expect(breadcrumbs.getByRole("link", { name: "Experiments" })).toHaveAttribute(
			"href",
			`/experiments${search}`,
		);
		await expect(breadcrumbs.getByRole("link", { name: parent })).toHaveAttribute(
			"href",
			`/experiments/${parent.toLowerCase()}${search}`,
		);
		await expect(breadcrumbs).toContainText(leaf);

		await experimentNavigation.getByRole("link", { name: sibling }).click();
		await expect.poll(() => new URL(page.url()).pathname).toBe(siblingPath);
		expect(new URL(page.url()).search).toBe(search);
		await expect(experimentNavigation.getByRole("link", { name: sibling })).toHaveAttribute(
			"aria-current",
			"page",
		);
		await expect(breadcrumbs).toContainText(sibling);
	});
}

test("preserves theme URL state changed after the router initializes", async ({ page }) => {
	await page.goto("/experiments/components/inputs");

	await page.getByRole("combobox", { name: "Theme" }).click();
	await page.getByRole("option", { name: "MP" }).click();
	await page.getByRole("button", { name: /Switch to (dark|light) mode/ }).click();

	const searchBeforeNavigation = new URL(page.url()).search;
	expect(searchBeforeNavigation).toContain("theme=mp");
	expect(searchBeforeNavigation).toMatch(/mode=(dark|light)/);

	const experimentsBreadcrumb = page
		.getByRole("navigation", { name: "Breadcrumbs" })
		.getByRole("link", { name: "Experiments" });
	await expect(experimentsBreadcrumb).toHaveAttribute(
		"href",
		`/experiments${searchBeforeNavigation}`,
	);
	await experimentsBreadcrumb.click();
	await expect(page).toHaveURL(
		new RegExp(`/experiments${searchBeforeNavigation.replaceAll("?", "\\?")}$`),
	);

	const preservedMode = new URL(page.url()).searchParams.get("mode");
	await page.evaluate(() => {
		window.history.pushState(null, "", "/experiments?theme=default&mode=light");
		window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
	});
	await expect(page.locator("html")).toHaveAttribute("data-theme", "default");
	await expect(page.locator("html")).toHaveAttribute("data-mode", "light");

	await page.goBack();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "mp");
	await expect(page.locator("html")).toHaveAttribute("data-mode", preservedMode ?? "system");
});

test("uses the latest explicit theme when history returns to a queryless route", async ({
	page,
}) => {
	await page.goto("/experiments");
	await expect(page.locator("html")).toHaveAttribute("data-theme", "default");

	await page.evaluate(() => {
		window.history.pushState(null, "", "/experiments?theme=mp&mode=dark");
		window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
	});
	await expect(page.locator("html")).toHaveAttribute("data-theme", "mp");
	await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");

	await page.goBack();
	await expect(page).toHaveURL(/\/experiments$/);
	await expect(page.locator("html")).toHaveAttribute("data-theme", "mp");
	await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
});
