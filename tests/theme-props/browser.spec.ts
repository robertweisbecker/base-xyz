import { expect, test, type Page } from "@playwright/test";

const storyPath = "/iframe.html?id=design-system-theme-props-verification--all-capabilities&viewMode=story";
const badgeTruncationStoryPath = "/iframe.html?id=components-badge--truncation-tooltip&viewMode=story";
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

async function openFixture(page: Page) {
	await page.goto(storyPath);
	await expect(page.getByTestId("fixture-ready")).toBeVisible();
}

test("responsive grid spans are supplied as one predeclared StyleX set", async ({ page }) => {
	await openFixture(page);
	const span = page.getByTestId("predeclared-responsive-span");
	await page.setViewportSize({ width: 600, height: 900 });
	await expect(span).toHaveCSS("width", "240px");
	await page.setViewportSize({ width: 800, height: 900 });
	await expect(span).toHaveCSS("width", "120px");
});

test("flex defaults, shorthand precedence, logical properties, and final style are deterministic", async ({ page }) => {
	await openFixture(page);
	const verticalReverse = page.getByTestId("vertical-reverse");
	const horizontalReverse = page.getByTestId("horizontal-reverse");
	await expect(verticalReverse).toHaveCSS("flex-direction", "column-reverse");
	await expect(horizontalReverse).toHaveCSS("flex-direction", "row-reverse");
	expect(await verticalReverse.locator(":scope > span").allTextContents()).toEqual(["First", "Second"]);
	expect(await horizontalReverse.locator(":scope > span").allTextContents()).toEqual(["First", "Second"]);
	await expect(page.getByTestId("precedence")).toHaveCSS("padding-left", "16px");
	await expect(page.getByTestId("precedence")).toHaveCSS("padding-right", "8px");
	await expect(page.getByTestId("logical-rtl")).toHaveCSS("margin-inline-start", "8px");
	await expect(page.getByTestId("logical-rtl")).toHaveCSS("margin-inline-end", "16px");
});

test("scalar layout composition covers flex, grid, spans, surfaces, and logical insets", async ({ page }) => {
	await openFixture(page);
	const stack = page.getByTestId("horizontal-stack");
	const grid = page.getByTestId("scalar-grid");
	const span = page.getByTestId("scalar-span");
	const card = page.getByTestId("composed-card");
	const surface = page.getByTestId("scalar-surface");
	const insetStart = page.getByTestId("inset-start-rtl");
	const insetEnd = page.getByTestId("inset-end-rtl");

	await expect(stack).toHaveCSS("flex-direction", "row-reverse");
	await expect(grid).toHaveCSS("grid-template-columns", "60px 60px 60px 60px");
	await expect(span).toHaveCSS("width", "120px");
	await expect(card).toHaveCSS("flex-direction", "row");
	await expect(card).toHaveCSS("border-radius", "15px");
	await expect(card).not.toHaveCSS("box-shadow", "none");
	await expect(surface).toHaveCSS("border-radius", "15px");
	await expect(surface).not.toHaveCSS("box-shadow", "none");
	await expect(insetStart).toHaveCSS("inset-inline-start", "8px");
	await expect(insetEnd).toHaveCSS("inset-inline-end", "-8px");
});

test("Badge width removes its intrinsic max width unless the caller supplies one", async ({ page }) => {
	await openFixture(page);
	const badge = page.getByTestId("full-badge");
	await expect(badge).toHaveCSS("width", "200px");
	await expect(badge).toHaveCSS("max-width", "none");
	const boundedBadge = page.getByTestId("bounded-badge");
	await expect(boundedBadge).toHaveCSS("max-width", "100px");
	await expect(boundedBadge).toHaveCSS("width", "100px");
});

test("Badge exposes its measured truncated label through a tooltip", async ({ page }) => {
	await page.goto(badgeTruncationStoryPath);
	const labelText = "Approved for the upcoming production release";
	const label = page.getByText(labelText, { exact: true });
	const badge = label.locator("..");

	await expect(label).toBeVisible();
	expect(await label.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
	await expect(badge).toHaveAttribute("tabindex", "0");
	await badge.focus();
	await expect(page.getByText(labelText, { exact: true })).toHaveCount(2);
	await expect(page.getByText(labelText, { exact: true }).last()).toBeVisible();
});

test("field choice groups use static inline and stacked layouts", async ({ page }) => {
	await openFixture(page);
	const inlineItems = page.getByTestId("inline-checkbox-group").locator(":scope > div").last();
	await expect(inlineItems).toHaveCSS("display", "flex");
	await expect(inlineItems).toHaveCSS("flex-direction", "row");
	await expect(inlineItems).toHaveCSS("column-gap", "24px");
	await expect(inlineItems).toHaveCSS("row-gap", "12px");

	const stackedItems = page.getByTestId("stacked-radio-group").locator(":scope > div").last();
	await expect(stackedItems).toHaveCSS("display", "flex");
	await expect(stackedItems).toHaveCSS("flex-direction", "column");
	await expect(stackedItems).toHaveCSS("column-gap", "12px");
	await expect(stackedItems).toHaveCSS("row-gap", "12px");
});

test("root semantics, DOM filtering, full width, and text props survive composition", async ({ page }) => {
	await openFixture(page);
	const semanticBox = page.getByRole("region", { name: "Semantic box" });
	expect(await semanticBox.evaluate((element) => element.tagName)).toBe("SECTION");
	expect(await semanticBox.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");
	await expect(page.getByTestId("filtered-button")).not.toHaveAttribute("bg");
	await expect(page.getByTestId("full-button")).toHaveCSS("width", "200px");
	await expect(page.getByTestId("aligned-text")).toHaveCSS("text-align", "center");
	await expect(page.getByTestId("aligned-text")).toHaveCSS("margin-bottom", "8px");
	const fieldControl = page.getByRole("textbox", { name: "Project name" });
	await expect(fieldControl).toHaveCSS("height", "32px");
	await expect(fieldControl.locator("..")).toHaveCSS("flex-direction", "row");
	await expect(fieldControl.locator("..")).toHaveCSS("gap", "16px");
	const switchControl = page.getByRole("switch", { name: "Project notifications" });
	const switchRoot = switchControl.locator("xpath=../..");
	await expect(switchRoot).toHaveCSS("display", "flex");
	await expect(switchRoot).toHaveCSS("flex-direction", "row");
	await expect(switchRoot).toHaveCSS("gap", "16px");
	await switchControl.focus();
	await page.keyboard.press("Space");
	await expect(switchControl).toHaveAttribute("aria-checked", "true");
});
