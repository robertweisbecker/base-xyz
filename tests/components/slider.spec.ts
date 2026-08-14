import { expect, test, type Page } from "@playwright/test";

const storyPath = "/iframe.html?id=components-slider--marker-density&viewMode=story";
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

test("bounds marker density without changing slider values", async ({ page }) => {
	await page.goto(storyPath);

	const denseSlider = page.getByTestId("dense-slider");
	const denseMarkers = denseSlider.locator("[data-slider-marker]");
	const normalMarkers = page.getByTestId("normal-slider").locator("[data-slider-marker]");

	await expect.poll(() => denseMarkers.count()).toBeGreaterThan(1);
	const denseMarkerCount = await denseMarkers.count();
	expect(denseMarkerCount).toBeLessThanOrEqual(200);
	await expect(normalMarkers).toHaveCount(11);

	const slider = denseSlider.getByRole("slider");
	await slider.focus();
	await expect(slider).toBeFocused();
	await expect(slider).toHaveAttribute("aria-valuenow", "0");
	await page.keyboard.press("ArrowRight");
	await expect(slider).toHaveAttribute("aria-valuenow", "0.000001");
});
