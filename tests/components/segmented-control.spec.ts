import { expect, test, type Page } from "@playwright/test";

const playgroundPath = "/iframe.html?id=components-segmented-control--playground&viewMode=story";
const formPath = "/iframe.html?id=components-segmented-control--form&viewMode=story";
const consoleErrorsByPage = new WeakMap<Page, string[]>();

test.beforeEach(({ page }) => {
	const consoleErrors: string[] = [];
	consoleErrorsByPage.set(page, consoleErrors);
	page.on("console", (message) => {
		if (message.type() === "error") consoleErrors.push(message.text());
	});
});

test.afterEach(({ page }) => {
	expect(consoleErrorsByPage.get(page)).toEqual([]);
});

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

test("elevates the selected segment against the muted track", async ({ page }) => {
	await page.goto(playgroundPath);

	const group = page.getByRole("radiogroup", { name: "View range" });
	const selected = group.getByRole("radio", { name: "Week" });
	const unselected = group.getByRole("radio", { name: "Day" });

	await expect
		.poll(async () =>
			group.evaluate((element) => {
				const groupBackground = getComputedStyle(element).backgroundColor;
				const checked = element.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]');
				return checked !== null && getComputedStyle(checked).backgroundColor !== groupBackground;
			}),
		)
		.toBe(true);
	await expect(selected).not.toHaveCSS("box-shadow", "none");
	await expect(unselected).toHaveCSS("box-shadow", "none");
});

test("participates in required form submission", async ({ page }) => {
	await page.goto(formPath);

	await page.getByRole("button", { name: "Apply range" }).click();
	await expect(page.getByText("Nothing submitted yet.")).toBeVisible();

	await page.getByRole("radio", { name: "Week" }).click();
	await page.getByRole("button", { name: "Apply range" }).click();
	await expect(page.getByText("Submitted: week")).toBeVisible();
});
