import { expect, test } from "../playwright";

const storyPath = "/iframe.html?id=components-combobox--creatable-tags&viewMode=story";

test("exposes a selectable creatable option for new input", async ({ page }) => {
	await page.goto(storyPath);

	const input = page.locator("#creatable-input");
	await input.fill("Fixture value");

	const creatableItem = page
		.getByRole("option")
		.filter({ has: page.getByTestId("creatable-option") });
	await expect(creatableItem).toBeVisible();
	await creatableItem.click();
	await expect(input).toHaveValue("");
});
