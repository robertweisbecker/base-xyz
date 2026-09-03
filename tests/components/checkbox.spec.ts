import { expect, test } from "../playwright";

const playgroundPath = "/iframe.html?id=components-checkbox--playground&viewMode=story";

test("clicking a checkbox label toggles its control", async ({ page }) => {
	await page.goto(playgroundPath);

	const checkbox = page.getByTestId("checkbox-playground-control");
	const label = page.locator("label").filter({ has: checkbox });
	await expect(checkbox).toHaveRole("checkbox");
	await expect(checkbox).toHaveAccessibleName(/\S/);
	await expect(checkbox).toBeChecked();

	await label.click();
	await expect(checkbox).not.toBeChecked();

	await label.click();
	await expect(checkbox).toBeChecked();
});
