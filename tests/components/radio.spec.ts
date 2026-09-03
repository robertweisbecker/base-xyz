import { expect, test } from "../playwright";

const statesPath = "/iframe.html?id=components-radio--states&viewMode=story";

test("read-only radio groups ignore label selection", async ({ page }) => {
	await page.goto(statesPath);

	const group = page.getByRole("radiogroup", { name: "Access level" });
	const viewer = group.getByRole("radio", { name: "Viewer" });
	const editor = group.getByRole("radio", { name: "Editor" });

	await expect(editor).toBeChecked();
	await expect(viewer).not.toBeChecked();

	await group.getByText("Viewer", { exact: true }).click();
	await expect(viewer).not.toBeChecked();
	await expect(editor).toBeChecked();
});
