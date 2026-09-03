import { expect, test } from "../playwright";

const statesPath = "/iframe.html?id=components-radio--states&viewMode=story";

test("read-only radio groups ignore label selection", async ({ page }) => {
	await page.goto(statesPath);

	const group = page.getByTestId("readonly-radio-group");
	const viewer = page.getByTestId("readonly-radio-viewer");
	const editor = page.getByTestId("readonly-radio-editor");
	const viewerLabel = page.locator("label").filter({ has: viewer });
	await expect(group).toHaveRole("radiogroup");
	await expect(group).toHaveAccessibleName(/\S/);
	await expect(viewer).toHaveRole("radio");
	await expect(editor).toHaveRole("radio");

	await expect(editor).toBeChecked();
	await expect(viewer).not.toBeChecked();

	await viewerLabel.click();
	await expect(viewer).not.toBeChecked();
	await expect(editor).toBeChecked();
});
