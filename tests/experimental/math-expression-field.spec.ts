import { expect, test } from "../playwright";

const storyPath = "/iframe.html?id=experimental-math-expression-field--examples&viewMode=story";

test("renders an accessible editable field without browser errors", async ({ page }) => {
	await page.goto(storyPath);

	const input = page.getByTestId("math-expression-basic").getByRole("textbox");
	await expect(input).toBeVisible();
	await expect(input).toBeEditable();
	await expect(input).toHaveAccessibleName(/\S/);
});
