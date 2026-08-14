import { expect, test, type Page } from "@playwright/test";

const storyPath = "/iframe.html?id=blocks-model-selector--normalization-regression&viewMode=story";
const consoleErrorsByPage = new WeakMap<Page, string[]>();

test.describe.configure({ timeout: 120_000 });

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
	await page.goto(storyPath);
	await expect(page.getByTestId("controlled-status")).toHaveText("0||||", { timeout: 30_000 });
}

async function openModelMenu(page: Page, triggerName: string, modelLabel: string) {
	await page.getByRole("button", { name: triggerName, exact: true }).click();
	return openSubmenu(page, "Model", new RegExp(`^${modelLabel}`));
}

async function openSubmenu(page: Page, submenuName: string, optionName: RegExp) {
	const submenuTrigger = page.getByRole("menuitem", { name: submenuName });
	await expect(submenuTrigger).toBeVisible();
	await submenuTrigger.focus();
	await page.keyboard.press("ArrowRight");
	const option = page.getByRole("menuitemradio", { name: optionName });
	await expect(option).toBeVisible();
	return option;
}

async function expectSelectedModel(page: Page, triggerName: string, modelLabel: string) {
	const trigger = page.getByRole("button", { name: triggerName, exact: true });
	await expect(trigger).toContainText(modelLabel);
	const option = await openModelMenu(page, triggerName, modelLabel);
	await expect(option).toHaveAttribute("aria-checked", "true");
	await page.keyboard.press("Escape");
	await page.keyboard.press("Escape");
	await expect(trigger).toHaveAttribute("aria-expanded", "false");
}

test("invalid controlled model normalizes display, selection, and the next callback", async ({ page }) => {
	await openStory(page);
	await expect(page.getByTestId("controlled-status")).toHaveText("0||||");
	await expectSelectedModel(page, "Controlled invalid model selector", "5.6 Sol");

	await page.getByRole("button", { name: "Controlled invalid model selector", exact: true }).click();
	const effort = await openSubmenu(page, "Effort", /^High$/);
	await effort.focus();
	await page.keyboard.press("Enter");
	await expect(page.getByTestId("controlled-status")).toHaveText("1|gpt-5.6-sol|High|Default|effort");
});

test("invalid uncontrolled default normalizes display, selection, and stored callback value", async ({ page }) => {
	await openStory(page);
	await expect(page.getByTestId("uncontrolled-status")).toHaveText("0||||");
	await expectSelectedModel(page, "Uncontrolled invalid default selector", "5.6 Sol");

	await page.getByRole("button", { name: "Uncontrolled invalid default selector", exact: true }).click();
	const speed = await openSubmenu(page, "Speed", /^Fast$/);
	await speed.focus();
	await page.keyboard.press("Enter");
	await expect(page.getByTestId("uncontrolled-status")).toHaveText("1|gpt-5.6-sol|Medium|Fast|speed");
});

test("dynamic model removal normalizes without a callback until the next user action", async ({ page }) => {
	await openStory(page);
	await expect(page.getByRole("button", { name: "Dynamic model removal selector", exact: true })).toContainText("5.6 Terra");
	await page.getByRole("button", { name: "Remove selected model" }).click();
	await expect(page.getByTestId("dynamic-status")).toHaveText("0||||");
	await expectSelectedModel(page, "Dynamic model removal selector", "5.6 Sol");

	await page.getByRole("button", { name: "Dynamic model removal selector", exact: true }).click();
	const effort = await openSubmenu(page, "Effort", /^High$/);
	await effort.focus();
	await page.keyboard.press("Enter");
	await expect(page.getByTestId("dynamic-status")).toHaveText("1|gpt-5.6-sol|High|Default|effort");
});

test("an empty first group falls through to the first later option", async ({ page }) => {
	await openStory(page);
	await expectSelectedModel(page, "Controlled invalid model selector", "5.6 Sol");
});
