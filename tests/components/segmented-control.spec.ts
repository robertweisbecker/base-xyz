import { expect, test } from "../playwright";

const playgroundPath = "/iframe.html?id=components-segmented-control--playground&viewMode=story";
const formPath = "/iframe.html?id=components-segmented-control--form&viewMode=story";
const statesPath = "/iframe.html?id=components-segmented-control--states&viewMode=story";
test("uses radio semantics and arrow-key selection", async ({ page }) => {
	await page.goto(playgroundPath);

	const group = page.getByRole("radiogroup", { name: "View range" });
	const day = group.getByRole("radio", { name: "Day" });
	const week = group.getByRole("radio", { name: "Week" });
	const month = group.getByRole("radio", { name: "Month" });

	await expect(group).toBeVisible();
	await expect(day).not.toBeChecked();
	await expect(week).toBeChecked();
	await expect(month).not.toBeChecked();

	await week.focus();
	await page.keyboard.press("ArrowRight");
	await expect(month).toBeFocused();
	await expect(month).toBeChecked();

	await page.keyboard.press("ArrowLeft");
	await expect(week).toBeFocused();
	await expect(week).toBeChecked();
});

test("participates in required form submission", async ({ page }) => {
	await page.goto(formPath);

	await page.getByRole("button", { name: "Apply range" }).click();
	await expect(page.getByText("Nothing submitted yet.")).toBeVisible();

	await page.getByRole("radio", { name: "Week" }).click();
	await page.getByRole("button", { name: "Apply range" }).click();
	await expect(page.getByText("Submitted: week")).toBeVisible();
});

test("read-only segments ignore pointer and keyboard selection", async ({ page }) => {
	await page.goto(statesPath);

	const group = page.getByRole("radiogroup", { name: "Read-only example" });
	const day = group.getByRole("radio", { name: "Day" });
	const week = group.getByRole("radio", { name: "Week" });
	await expect(day).toBeChecked();
	await week.click();
	await expect(week).not.toBeChecked();
	await week.focus();
	await week.press("Space");
	await expect(day).toBeChecked();
	await expect(week).not.toBeChecked();
});
