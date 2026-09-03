import { expect, test } from "../playwright";

const playgroundPath = "/iframe.html?id=components-checkbox--playground&viewMode=story";
const statesPath = "/iframe.html?id=components-checkbox--states&viewMode=story";

test("clicking a checkbox label toggles its control", async ({ page }) => {
	await page.goto(playgroundPath);

	const checkbox = page.getByRole("checkbox", { name: "Product updates" });
	await expect(checkbox).toBeChecked();

	await page.getByText("Product updates", { exact: true }).click();
	await expect(checkbox).not.toBeChecked();

	await page.getByText("Product updates", { exact: true }).click();
	await expect(checkbox).toBeChecked();
});

test("indeterminate checkbox keeps a neutral fill while its accent follows label hover and press", async ({
	page,
}) => {
	await page.goto(statesPath);

	const checkbox = page.getByRole("checkbox", { name: "Indeterminate" });
	const resting = await checkbox.evaluate((element) => {
		const styles = getComputedStyle(element);
		return { backgroundColor: styles.backgroundColor, borderColor: styles.borderColor };
	});

	await checkbox.hover();
	await expect(checkbox).toHaveCSS("background-color", resting.backgroundColor);
	await expect(checkbox).not.toHaveCSS("border-color", resting.borderColor);

	await page.mouse.down();
	await expect(checkbox).toHaveCSS("background-color", resting.backgroundColor);
	await expect(checkbox).not.toHaveCSS("border-color", resting.borderColor);
	await page.mouse.up();
});
