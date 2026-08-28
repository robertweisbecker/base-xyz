import { expect, test } from "../playwright";

const storyPath = "/iframe.html?id=components-slider--marker-density&viewMode=story";

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
	await expect(slider).toHaveAttribute("aria-valuenow", "0.01");
});
