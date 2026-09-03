import { expect, test } from "../playwright";

const storyPath = "/iframe.html?id=components-data-table--playground&viewMode=story";
const actionIdentityStoryPath =
	"/iframe.html?id=components-data-table--action-identity&viewMode=story";

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

test("row actions retain focus, identity, and callbacks while mounted actions change", async ({
	page,
}) => {
	await page.goto(actionIdentityStoryPath);

	const fixture = page.getByTestId("data-table-action-identity-fixture");
	const rowActions = fixture.getByRole("button", { name: "Open actions for row 1" });
	await rowActions.click();

	const deleteAction = page.getByRole("menuitem", { name: "Delete record" });
	await deleteAction.focus();
	await expect(deleteAction).toBeFocused();

	await fixture.getByRole("button", { name: "Reorder actions" }).evaluate((button) => {
		if (!(button instanceof HTMLButtonElement)) throw new Error("Expected a story control button");
		button.click();
	});
	await expect(page.getByRole("menuitem", { name: "Delete record" })).toBeFocused();

	await page.getByRole("menuitem", { name: "Delete record" }).press("Enter");
	await expect(fixture.getByRole("status")).toHaveText("delete:row-1");

	await rowActions.click();
	await page.getByRole("menuitem", { name: "Delete record" }).focus();
	await fixture.getByRole("button", { name: "Insert action" }).evaluate((button) => {
		if (!(button instanceof HTMLButtonElement)) throw new Error("Expected a story control button");
		button.click();
	});
	await expect(page.getByRole("menuitem", { name: "Delete record" })).toBeFocused();
	await fixture.getByRole("button", { name: "Remove action" }).evaluate((button) => {
		if (!(button instanceof HTMLButtonElement)) throw new Error("Expected a story control button");
		button.click();
	});
	await expect(page.getByRole("menuitem", { name: "Delete record" })).toBeFocused();
	await page.getByRole("menuitem", { name: "Delete record" }).press("Enter");
	await expect(fixture.getByRole("status")).toHaveText("delete:row-1");

	await rowActions.click();
	await fixture.getByRole("button", { name: "Disable delete action" }).evaluate((button) => {
		if (!(button instanceof HTMLButtonElement)) throw new Error("Expected a story control button");
		button.click();
	});
	await fixture.getByRole("button", { name: "Reorder actions" }).evaluate((button) => {
		if (!(button instanceof HTMLButtonElement)) throw new Error("Expected a story control button");
		button.click();
	});
	await expect(page.getByRole("menuitem", { name: "Delete record" })).toBeDisabled();
});
