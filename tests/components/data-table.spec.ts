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

test("filtering, sorting, visibility, selection, and empty results remain observable", async ({
	page,
}) => {
	await page.goto(storyPath);

	const table = page.getByRole("table");
	const filter = page.getByRole("textbox", { name: "Search by URL…" });

	await filter.fill("feature-auth");
	await expect(table.locator("tbody tr")).toHaveCount(1);
	await expect(page.getByText("0 of 1 row(s) selected.")).toBeVisible();

	await filter.fill("");
	const sortButton = page.getByRole("button", { name: "Sort URL ascending" });
	await sortButton.click();
	await expect(table.getByRole("columnheader", { name: /URL/ })).toHaveAttribute(
		"aria-sort",
		"ascending",
	);
	await expect(table.locator("tbody tr").first()).toContainText("app.example.com");

	await page.getByRole("button", { name: "Column settings" }).click();
	const updatedColumn = page.getByRole("menuitemcheckbox", { name: "Updated" });
	await expect(updatedColumn).toBeChecked();
	await updatedColumn.click();
	await expect(table.getByRole("columnheader", { name: /Updated/ })).toHaveCount(0);
	await expect(page.getByText("7 column(s) visible.")).toBeVisible();

	await filter.fill("no-such-deployment");
	await expect(table.getByText("No results.")).toBeVisible();
});

test("selection and expansion compose on a stable row before actions run", async ({ page }) => {
	await page.goto(storyPath);

	const table = page.getByRole("table");
	const firstRow = table.locator("tbody tr").first();
	await firstRow.getByRole("checkbox", { name: "Select row 1" }).click();
	await expect(firstRow.getByRole("checkbox", { name: "Select row 1" })).toBeChecked();

	const expand = firstRow.getByRole("button", { name: "Expand row 1" });
	await expand.click();
	await expect(firstRow.locator("button[aria-pressed]")).toHaveAttribute("aria-pressed", "true");
	await expect(table.getByText(/Deployment dep_/)).toBeVisible();

	await expect(page.getByText("1 of 5 row(s) selected.")).toBeVisible();
});

test("the table container remains the accessible horizontal overflow owner", async ({ page }) => {
	await page.goto(storyPath);

	const viewport = page.getByLabel("Scrollable table");
	await expect(viewport).toBeVisible();
	await expect(viewport.locator("table")).toBeVisible();
});
