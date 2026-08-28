import { expect, test } from "../playwright";

const storyPath = "/iframe.html?id=experimental-rating--playground&viewMode=story";

test("renders accessible rating controls without browser errors", async ({ page }) => {
	await page.goto(storyPath);

	const rating = page.getByTestId("rating-playground");
	await expect(rating).toBeVisible();
	await expect(rating).toHaveRole("radiogroup");
	await expect(rating).toHaveAccessibleName(/\S/);
	expect(await rating.getByRole("radio").count()).toBeGreaterThan(0);
});
