import { expect, test } from "../playwright";

test("keeps the Gallery route at the landing page", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveURL(/\/$/);
	const appNavigation = page.getByTestId("app-navigation");
	await expect(appNavigation).toHaveRole("navigation");
	await expect(appNavigation).toHaveAccessibleName(/\S/);
	await expect(appNavigation.locator('a[href="/"]')).toHaveAttribute("aria-current", "page");
});

test("navigates between the top-level app routes while preserving search state", async ({
	page,
}) => {
	await page.goto("/experiments?theme=mp&mode=dark");

	await expect(page).toHaveURL(/\/experiments\?theme=mp&mode=dark$/);
	const appNavigation = page.getByTestId("app-navigation");
	await expect(appNavigation).toHaveRole("navigation");
	await expect(appNavigation).toHaveAccessibleName(/\S/);
	await expect(appNavigation.locator('a[href="/experiments?theme=mp&mode=dark"]')).toHaveAttribute(
		"aria-current",
		"page",
	);
	const breadcrumbs = page.getByTestId("experiment-breadcrumbs");
	await expect(breadcrumbs).toHaveRole("navigation");
	await expect(breadcrumbs).toHaveAccessibleName(/\S/);
	await expect(breadcrumbs.locator('[aria-current="page"]')).toBeVisible();

	await appNavigation.locator('a[href="/?theme=mp&mode=dark"]').click();
	await expect(page).toHaveURL(/\/\?theme=mp&mode=dark$/);
	await expect(appNavigation.locator('a[href="/?theme=mp&mode=dark"]')).toHaveAttribute(
		"aria-current",
		"page",
	);
});

const experimentRoutes = [
	{
		path: "/experiments/blocks/utilities",
		siblingPath: "/experiments/blocks/agent-blocks",
	},
	{
		path: "/experiments/components/inputs",
		siblingPath: "/experiments/components/popups",
	},
] as const;

for (const { path, siblingPath } of experimentRoutes) {
	test(`${path} updates navigation and breadcrumbs`, async ({ page }) => {
		const search = "?theme=mp&mode=dark";
		await page.goto(`${path}${search}`);

		await expect.poll(() => new URL(page.url()).pathname).toBe(path);
		expect(new URL(page.url()).search).toBe(search);

		const experimentNavigation = page.getByTestId("experiment-navigation");
		await expect(experimentNavigation).toHaveRole("navigation");
		await expect(experimentNavigation).toHaveAccessibleName(/\S/);
		await expect(experimentNavigation.locator(`a[href="${path}${search}"]`)).toHaveAttribute(
			"aria-current",
			"page",
		);

		const breadcrumbs = page.getByTestId("experiment-breadcrumbs");
		await expect(breadcrumbs).toHaveRole("navigation");
		await expect(breadcrumbs).toHaveAccessibleName(/\S/);
		const breadcrumbLinks = breadcrumbs.getByRole("link");
		await expect(breadcrumbLinks.nth(0)).toHaveAttribute("href", `/experiments${search}`);
		await expect(breadcrumbLinks.nth(1)).toHaveAttribute(
			"href",
			`${path.slice(0, path.lastIndexOf("/"))}${search}`,
		);
		const currentBreadcrumb = breadcrumbs.locator('[aria-current="page"]');
		await expect(currentBreadcrumb).toHaveAttribute("data-path", path);

		await experimentNavigation.locator(`a[href="${siblingPath}${search}"]`).click();
		await expect.poll(() => new URL(page.url()).pathname).toBe(siblingPath);
		expect(new URL(page.url()).search).toBe(search);
		await expect(experimentNavigation.locator(`a[href="${siblingPath}${search}"]`)).toHaveAttribute(
			"aria-current",
			"page",
		);
		await expect(currentBreadcrumb).toHaveAttribute("data-path", siblingPath);
	});
}

test("preserves theme URL state changed after the router initializes", async ({ page }) => {
	await page.goto("/experiments/components/inputs");

	await page.getByTestId("theme-trigger").click();
	await page.getByTestId("theme-option-mp").click();
	await page.getByTestId("theme-mode-toggle").click();

	const searchBeforeNavigation = new URL(page.url()).search;
	expect(searchBeforeNavigation).toContain("theme=mp");
	expect(searchBeforeNavigation).toMatch(/mode=(dark|light)/);

	const experimentsBreadcrumb = page
		.getByTestId("experiment-breadcrumbs")
		.getByRole("link")
		.first();
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

test("uses persisted explicit preferences on direct queryless navigation", async ({ page }) => {
	await page.goto("/experiments?theme=mp&mode=dark");
	await expect(page.locator("html")).toHaveAttribute("data-theme", "mp");
	await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");

	await page.goto("/experiments");
	await expect(page.locator("html")).toHaveAttribute("data-theme", "mp");
	await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");

	await page.reload();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "mp");
	await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
});
