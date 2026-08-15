import { expect, test, type Page } from "@playwright/test";

const storyPath = "/iframe.html?id=blocks-confirmation-dialog--async-settlement&viewMode=story";
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

async function openStory(page: Page) {
	await page.clock.install();
	await page.goto(storyPath);
	await expect(page.getByRole("button", { name: "Resolve async action", exact: true })).toBeVisible();
}

async function pauseClock(page: Page) {
	await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 100);
}

async function openDialog(page: Page, triggerName: string) {
	await page.getByRole("button", { name: triggerName, exact: true }).click();
	const dialog = page.getByRole("dialog", { name: "Confirm async action?", exact: true });
	await expect(dialog).toBeVisible();
	return dialog;
}

test("resolved confirmation stays pending until it closes and announces success", async ({ page }) => {
	await openStory(page);
	const dialog = await openDialog(page, "Resolve async action");
	await pauseClock(page);

	const confirm = dialog.getByRole("button", { name: "Confirm resolve async action", exact: true });
	await confirm.click();
	await expect(dialog).toBeVisible();
	await expect(confirm).toHaveAttribute("aria-busy", "true");

	await page.clock.runFor(500);
	await expect(dialog).toHaveAttribute("data-closed", "");
	await expect(page.getByText("Async action completed", { exact: true })).toBeVisible();
});

test("rejected confirmation stays open, restores the action, and announces failure", async ({ page }) => {
	await openStory(page);
	const dialog = await openDialog(page, "Reject async action");
	await pauseClock(page);

	const confirm = dialog.getByRole("button", { name: "Confirm reject async action", exact: true });
	await confirm.click();
	await expect(dialog).toBeVisible();
	await expect(confirm).toHaveAttribute("aria-busy", "true");

	await page.clock.runFor(500);
	await expect(dialog).toBeVisible();
	await expect(confirm).not.toHaveAttribute("aria-busy", "true");
	await expect(confirm).toBeEnabled();
	await expect(page.getByText("Async action failed", { exact: true })).toBeVisible();
	await expect(page.getByText("Unexpected success", { exact: true })).toHaveCount(0);
	await expect(page.getByTestId("confirmation-error-count")).toHaveText("1");
});

test("duplicate confirmation clicks start one operation and announce one success", async ({ page }) => {
	await openStory(page);
	const dialog = await openDialog(page, "Resolve async action");
	await pauseClock(page);

	const confirm = dialog.getByRole("button", { name: "Confirm resolve async action", exact: true });
	await confirm.dispatchEvent("click");
	await confirm.dispatchEvent("click");
	await expect(confirm).toHaveAttribute("aria-busy", "true");

	await page.clock.runFor(500);
	await expect(dialog).toHaveAttribute("data-closed", "");
	await expect(page.getByText("Async action completed", { exact: true })).toHaveCount(1);
	await expect(page.getByTestId("confirmation-operation-count")).toHaveText("1");
});

test("a synchronously prevented confirmation does not start, close, or announce", async ({ page }) => {
	await openStory(page);
	const dialog = await openDialog(page, "Prevent confirmation");
	await pauseClock(page);

	const confirm = dialog.getByRole("button", { name: "Prevent confirmation", exact: true });
	await confirm.click();
	await expect(dialog).toBeVisible();
	await expect(confirm).not.toHaveAttribute("aria-busy", "true");
	await expect(page.getByTestId("confirmation-operation-count")).toHaveText("0");
	await expect(page.getByText("Prevented action completed", { exact: true })).toHaveCount(0);
});
