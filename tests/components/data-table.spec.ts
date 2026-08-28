import { expect, test } from "../playwright";

const storyPath = "/iframe.html?id=components-data-table--playground&viewMode=story";

test("row expansion toggles keep contextual accessible names and pressed state", async ({
	page,
}) => {
	await page.goto(storyPath);

	const firstRowToggle = page
		.getByRole("table")
		.locator("tbody tr")
		.first()
		.locator("button[aria-pressed]");
	await expect(firstRowToggle).toBeVisible();
	await expect(firstRowToggle).toHaveAttribute("aria-pressed", "false");
	await expect(firstRowToggle).toHaveAccessibleName(/\S/);
	const collapsedName = await firstRowToggle.getAttribute("aria-label");

	await firstRowToggle.click();
	await expect(firstRowToggle).toHaveAttribute("aria-pressed", "true");
	await expect(firstRowToggle).not.toHaveAccessibleName(collapsedName ?? "");
});
