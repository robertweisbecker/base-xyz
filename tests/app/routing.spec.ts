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
	await expect(page.getByRole("navigation", { name: "Experiments" })).toBeVisible();
	await expect(page.getByRole("group", { name: "Blocks" })).toBeVisible();
	await expect(page.getByRole("group", { name: "Components" })).toBeVisible();
	await expect(page.getByRole("group", { name: "Blocks" }).getByRole("link", { name: "Blocks", exact: true })).toBeVisible();
	await expect(page.getByRole("group", { name: "Components" }).getByRole("link", { name: "Components", exact: true })).toBeVisible();
	await expect(page.getByRole("link", { name: "Utilities" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Agent Blocks" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Inputs" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Popups" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Tables" })).toBeVisible();
	await expect(page.getByRole("navigation", { name: "Breadcrumbs" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Collapse sidebar" })).toBeVisible();
	const utilityItem = page.getByRole("group", { name: "Blocks" }).getByRole("link", { name: "Utilities" }).locator("..");
	expect(await utilityItem.evaluate((element) => getComputedStyle(element).borderInlineStartStyle)).toBe("solid");
	expect(await utilityItem.evaluate((element) => Number.parseFloat(getComputedStyle(element).marginInlineStart)))
		.toBeGreaterThan(0);

	await page.getByRole("button", { name: "Collapse sidebar" }).click();
	await expect(page.getByRole("button", { name: "Expand sidebar" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Utilities" })).toBeVisible();
	expect(await utilityItem.evaluate((element) => getComputedStyle(element).borderInlineStartWidth)).toBe("0px");
	expect(await utilityItem.evaluate((element) => Number.parseFloat(getComputedStyle(element).marginInlineStart))).toBe(0);

	await page.getByRole("navigation", { name: "Demo pages" }).getByRole("link", { name: "Gallery" }).click();
	await expect(page).toHaveURL(/\/\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Components" })).toBeVisible();
});

test("supports grouped child routes and identifies the current experiment", async ({ page }) => {
	await page.goto("/experiments/components/inputs?theme=mp&mode=dark");

	await expect(page).toHaveURL(/\/experiments\/components\/inputs\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Inputs", level: 1 })).toBeVisible();
	await expect(page.getByRole("link", { name: "Inputs" })).toHaveAttribute("aria-current", "page");
	await expect(page.getByRole("heading", { name: "Create an environment", level: 2 })).toBeVisible();
	await expect(page.getByRole("navigation", { name: "Breadcrumbs" }).getByRole("link", { name: "Experiments" }))
		.toHaveAttribute("href", "/experiments?theme=mp&mode=dark");
	await expect(page.getByRole("navigation", { name: "Breadcrumbs" }).getByRole("link", { name: "Components" }))
		.toHaveAttribute("href", "/experiments/components?theme=mp&mode=dark");

	await page.getByRole("link", { name: "Popups" }).press("Enter");
	await expect(page).toHaveURL(/\/experiments\/components\/popups\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Popups", level: 1 })).toBeVisible();
	await expect(page.getByRole("link", { name: "Popups" })).toHaveAttribute("aria-current", "page");
});

test("provides a Blocks index with cards for each subpage", async ({ page }) => {
	await page.goto("/experiments/blocks?theme=mp&mode=dark");

	await expect(page).toHaveURL(/\/experiments\/blocks\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Blocks", level: 1 })).toBeVisible();
	await expect(page.getByRole("main").getByRole("link", { name: /Utilities/ })).toBeVisible();
	await expect(page.getByRole("main").getByRole("link", { name: /Agent Blocks/ })).toBeVisible();

	await page.getByRole("main").getByRole("link", { name: /Utilities/ }).click();
	await expect(page).toHaveURL(/\/experiments\/blocks\/utilities\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Utilities", level: 1 })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Copy Button", level: 2 })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Password Field", level: 2 })).toBeVisible();
	await expect(page.getByRole("heading", { name: "PageHeader", level: 2 })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Confirmation Dialog", level: 2 })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Workflow Progress", level: 2 })).toBeVisible();
	await expect(page.getByRole("button", { name: "Copy preview URL" })).toBeVisible();
	await expect(page.getByRole("textbox", { name: "Create a service password" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "base-stylex-lab", level: 3 })).toBeVisible();
	await expect(page.getByRole("button", { name: "Promote to production" })).toBeVisible();
	await expect(page.getByRole("list", { name: "Release workflow progress" })).toBeVisible();

	await page.getByRole("link", { name: "Agent Blocks" }).click();
	await expect(page).toHaveURL(/\/experiments\/blocks\/agent-blocks\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Agent Blocks", level: 1 })).toBeVisible();
	const onThisPage = page.getByRole("navigation", { name: "Agent blocks on this page" });
	await expect(onThisPage.getByRole("link")).toHaveCount(7);
	await expect(onThisPage.getByRole("link", { name: "Context Popover" })).toHaveAttribute("href", "#context-popover");
	expect(await onThisPage.locator("..").evaluate((element) => getComputedStyle(element).position)).toBe("sticky");
	const tableOfContentsBox = await onThisPage.boundingBox();
	const firstExampleBox = await page.locator("#agent-action-approval").boundingBox();
	expect(tableOfContentsBox?.x).toBeGreaterThan(firstExampleBox?.x ?? 0);
	await expect(page.locator("main section[id] > div > div > h2")).toHaveText([
		"Agent Action Approval",
		"Async Job Progress",
		"Context Popover",
		"Goal Toolbar",
		"Model Selector",
		"Prompt Composer",
		"Streaming Response",
	]);
	await expect(page.getByRole("textbox", { name: "Message" })).toBeVisible();
	await expect(page.getByRole("button", { name: /5\.6 Sol/ })).toBeVisible();
	await expect(page.getByText("Allow this action?")).toBeVisible();
	await expect(page.getByText("Build the component search index")).toBeVisible();
	await expect(page.getByRole("article", { name: "Component audit response" })).toBeVisible();
	await page.getByRole("group", { name: "Job state" }).getByRole("button", { name: "Error" }).click();
	await expect(page.locator("#async-job-progress").getByRole("status")).toContainText("Failed");
	await page.getByRole("group", { name: "Response state" }).getByRole("button", { name: "Error" }).click();
	await expect(page.locator("#streaming-response").getByRole("status")).toContainText("Response failed");
});

test("provides a Components index with cards for each subpage", async ({ page }) => {
	await page.goto("/experiments/components?theme=mp&mode=dark");

	await expect(page).toHaveURL(/\/experiments\/components\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Components", level: 1 })).toBeVisible();
	await expect(page.getByRole("main").getByRole("link", { name: /Inputs/ })).toBeVisible();
	await expect(page.getByRole("main").getByRole("link", { name: /Popups/ })).toBeVisible();
	await expect(page.getByRole("main").getByRole("link", { name: /Tables/ })).toBeVisible();
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
