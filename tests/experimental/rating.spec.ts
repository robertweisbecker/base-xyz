import { expect, test, type Page } from "@playwright/test";

const storyPath = "/iframe.html?id=experimental-rating--playground&viewMode=story";
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

test("keeps hover visual-only and selects with arrow keys", async ({ page }) => {
	await page.goto(storyPath);

	const group = page.getByRole("radiogroup", { name: "Rating" });
	const stars = group.getByRole("radio");
	const restingBackground = await stars.nth(0).evaluate((star) => getComputedStyle(star).backgroundColor);
	await expect(stars).toHaveCount(5);
	await expect(group).toHaveCSS("column-gap", "0px");
	await expect(stars.nth(2)).toHaveAttribute("aria-checked", "true");

	await stars.nth(2).focus();
	await page.keyboard.press("ArrowRight");
	await expect(stars.nth(3)).toBeFocused();
	await expect(stars.nth(3)).toHaveAttribute("aria-checked", "true");
	await expect(stars.nth(2)).toHaveAttribute("aria-checked", "false");

	await stars.nth(4).hover();
	await expect.poll(async () => group.locator("svg").evaluateAll((icons) => icons.map((icon) => icon.getAttribute("fill")))).toEqual([
		"currentColor",
		"currentColor",
		"currentColor",
		"currentColor",
		"none",
	]);
	await expect(stars.nth(4)).toHaveAttribute("data-rating-hovered", "");
	const hoveredBackground = await stars.nth(0).evaluate((star) => getComputedStyle(star).backgroundColor);
	expect(hoveredBackground).not.toBe(restingBackground);
	await expect(stars.nth(4)).toHaveCSS("background-color", hoveredBackground);

	await page.mouse.move(500, 500);
	await expect(stars.nth(4)).not.toHaveAttribute("data-rating-hovered");
	await expect(stars.nth(0)).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
	await expect.poll(async () => group.locator("svg").evaluateAll((icons) => icons.map((icon) => icon.getAttribute("fill")))).toEqual([
		"currentColor",
		"currentColor",
		"currentColor",
		"currentColor",
		"none",
	]);
});

test("supports custom item counts and icons", async ({ page }) => {
	await page.goto("/iframe.html?id=experimental-rating--examples&viewMode=story");

	const group = page.getByRole("radiogroup", { name: "Custom rating" });
	const stars = group.getByRole("radio");
	const restingBackground = await stars.nth(0).evaluate((star) => getComputedStyle(star).backgroundColor);
	await expect(stars).toHaveCount(7);
	await expect.poll(async () => group.locator("svg circle").evaluateAll((circles) => circles.map((circle) => circle.getAttribute("r")))).toEqual([
		"8",
		"8",
		"8",
		"8",
		"8",
		"6",
		"6",
	]);

	await stars.nth(6).hover();
	const hoveredBackground = await stars.nth(0).evaluate((star) => getComputedStyle(star).backgroundColor);
	expect(hoveredBackground).not.toBe(restingBackground);
	await expect(stars.nth(6)).toHaveCSS("background-color", hoveredBackground);
});

test("bounds oversized counts without changing the rating semantics", async ({ page }) => {
	await page.goto("/iframe.html?id=experimental-rating--examples&viewMode=story");

	const group = page.getByRole("radiogroup", { name: "Bounded rating" });
	await expect(group.getByRole("radio")).toHaveCount(10);
});

test("allows consumers to cancel uncontrolled selection", async ({ page }) => {
	await page.goto("/iframe.html?id=experimental-rating--cancellation&viewMode=story");

	const group = page.getByRole("radiogroup", { name: "Cancellation rating" });
	const stars = group.getByRole("radio");
	await expect(stars.nth(1)).toHaveAttribute("aria-checked", "true");

	await stars.nth(3).click();
	await expect(stars.nth(1)).toHaveAttribute("aria-checked", "true");
	await expect(stars.nth(3)).toHaveAttribute("aria-checked", "false");
});
