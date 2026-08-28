import { expect, test, type Page } from "../playwright";

const storyPath = "/iframe.html?id=blocks-confirmation-dialog--async-settlement&viewMode=story";

async function openStory(page: Page) {
	await page.clock.install();
	await page.goto(storyPath);
	await expect(page.getByTestId("resolve-trigger")).toBeVisible();
}

async function pauseClock(page: Page) {
	await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 100);
}

async function openDialog(page: Page, testId: string) {
	await page.getByTestId(`${testId}-trigger`).click();
	const title = page.getByTestId(`${testId}-title`);
	const dialog = page.getByRole("dialog").filter({ has: title });
	await expect(dialog).toBeVisible();
	await expect(title).toHaveAttribute("id", /\S/);
	await expect(dialog).toHaveAttribute("aria-labelledby", (await title.getAttribute("id")) ?? "");
	return dialog;
}

async function expectAnnouncement(page: Page, testId: string) {
	const marker = page.getByTestId(testId);
	const toast = page.getByRole("dialog").filter({ has: marker });
	const region = page.getByRole("region").filter({ has: toast });
	await expect(toast).toBeVisible();
	await expect(toast).toContainText(/\S/);
	await expect(region).toHaveAccessibleName(/\S/);
}

test("resolved confirmation stays pending until it closes and announces success", async ({
	page,
}) => {
	await openStory(page);
	const dialog = await openDialog(page, "resolve");
	await pauseClock(page);

	const confirm = page.getByTestId("resolve-confirm");
	await confirm.click();
	await expect(dialog).toBeVisible();
	await expect(confirm).toHaveAttribute("aria-busy", "true");

	await page.clock.runFor(500);
	await expect(dialog).toHaveAttribute("data-closed", "");
	await expectAnnouncement(page, "confirmation-success-announcement");
});

test("rejected confirmation stays open, restores the action, and announces failure", async ({
	page,
}) => {
	await openStory(page);
	const dialog = await openDialog(page, "reject");
	await pauseClock(page);

	const confirm = page.getByTestId("reject-confirm");
	await confirm.click();
	await expect(dialog).toBeVisible();
	await expect(confirm).toHaveAttribute("aria-busy", "true");

	await page.clock.runFor(500);
	await expect(dialog).toBeVisible();
	await expect(confirm).not.toHaveAttribute("aria-busy", "true");
	await expect(confirm).toBeEnabled();
	await expectAnnouncement(page, "confirmation-failure-announcement");
	await expect(page.getByTestId("confirmation-unexpected-success-announcement")).toHaveCount(0);
	await expect(page.getByTestId("confirmation-error-count")).toHaveAttribute("data-value", "1");
});

test("duplicate confirmation clicks start one operation and announce one success", async ({
	page,
}) => {
	await openStory(page);
	const dialog = await openDialog(page, "resolve");
	await pauseClock(page);

	const confirm = page.getByTestId("resolve-confirm");
	await confirm.dispatchEvent("click");
	await confirm.dispatchEvent("click");
	await expect(confirm).toHaveAttribute("aria-busy", "true");

	await page.clock.runFor(500);
	await expect(dialog).toHaveAttribute("data-closed", "");
	await expectAnnouncement(page, "confirmation-success-announcement");
	await expect(page.getByTestId("confirmation-operation-count")).toHaveAttribute("data-value", "1");
});

test("a synchronously prevented confirmation does not start, close, or announce", async ({
	page,
}) => {
	await openStory(page);
	const dialog = await openDialog(page, "prevent");
	await pauseClock(page);

	const confirm = page.getByTestId("prevent-confirm");
	await confirm.click();
	await expect(dialog).toBeVisible();
	await expect(confirm).not.toHaveAttribute("aria-busy", "true");
	await expect(page.getByTestId("confirmation-operation-count")).toHaveAttribute("data-value", "0");
	await expect(page.locator('[data-testid$="-announcement"]')).toHaveCount(0);
});
