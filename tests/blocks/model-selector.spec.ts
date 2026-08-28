import { expect, test, type Page } from "../playwright";

const storyPath = "/iframe.html?id=blocks-model-selector--normalization-regression&viewMode=story";

test.describe.configure({ timeout: 120_000 });

async function openStory(page: Page) {
	await page.goto(storyPath);
	await expect(page.getByTestId("controlled-status")).toHaveAttribute("data-event-count", "0", {
		timeout: 30_000,
	});
}

async function openSubmenu(page: Page, settingIndex: number, optionIndex: number) {
	const submenuTrigger = page.getByRole("menuitem").nth(settingIndex);
	await expect(submenuTrigger).toBeVisible();
	await submenuTrigger.focus();
	await page.keyboard.press("ArrowRight");
	const option = page.getByRole("menuitemradio").nth(optionIndex);
	await expect(option).toBeVisible();
	return option;
}

async function openModelMenu(page: Page, triggerTestId: string, optionIndex = 0) {
	await page.getByTestId(triggerTestId).click();
	return openSubmenu(page, 0, optionIndex);
}

async function expectSelectedModel(page: Page, triggerTestId: string, optionIndex = 0) {
	const trigger = page.getByTestId(triggerTestId);
	const option = await openModelMenu(page, triggerTestId, optionIndex);
	await expect(option).toHaveAttribute("aria-checked", "true");
	await page.keyboard.press("Escape");
	await page.keyboard.press("Escape");
	await expect(trigger).toHaveAttribute("aria-expanded", "false");
}

async function expectLatestEvent(
	page: Page,
	testId: string,
	value: { effort: string; model: string; reason: string; speed: string },
) {
	const status = page.getByTestId(testId);
	await expect(status).toHaveAttribute("data-event-count", "1");
	await expect(status).toHaveAttribute("data-model", value.model);
	await expect(status).toHaveAttribute("data-effort", value.effort);
	await expect(status).toHaveAttribute("data-speed", value.speed);
	await expect(status).toHaveAttribute("data-reason", value.reason);
}

test("invalid controlled model normalizes display, selection, and the next callback", async ({
	page,
}) => {
	await openStory(page);
	await expect(page.getByTestId("controlled-status")).toHaveAttribute("data-event-count", "0");
	await expectSelectedModel(page, "controlled-trigger");

	await page.getByTestId("controlled-trigger").click();
	const effort = await openSubmenu(page, 1, 2);
	await effort.focus();
	await page.keyboard.press("Enter");
	await expectLatestEvent(page, "controlled-status", {
		effort: "High",
		model: "model-alpha",
		reason: "effort",
		speed: "Default",
	});
});

test("invalid uncontrolled default normalizes display, selection, and stored callback value", async ({
	page,
}) => {
	await openStory(page);
	await expect(page.getByTestId("uncontrolled-status")).toHaveAttribute("data-event-count", "0");
	await expectSelectedModel(page, "uncontrolled-trigger");

	await page.getByTestId("uncontrolled-trigger").click();
	const speed = await openSubmenu(page, 2, 1);
	await speed.focus();
	await page.keyboard.press("Enter");
	await expectLatestEvent(page, "uncontrolled-status", {
		effort: "Medium",
		model: "model-alpha",
		reason: "speed",
		speed: "Fast",
	});
});

test("dynamic model removal normalizes without a callback until the next user action", async ({
	page,
}) => {
	await openStory(page);
	await expectSelectedModel(page, "dynamic-trigger", 1);
	await page.getByTestId("dynamic-remove-model").click();
	await expect(page.getByTestId("dynamic-status")).toHaveAttribute("data-event-count", "0");
	await expectSelectedModel(page, "dynamic-trigger");

	await page.getByTestId("dynamic-trigger").click();
	const effort = await openSubmenu(page, 1, 2);
	await effort.focus();
	await page.keyboard.press("Enter");
	await expectLatestEvent(page, "dynamic-status", {
		effort: "High",
		model: "model-alpha",
		reason: "effort",
		speed: "Default",
	});
});

test("an empty first group falls through to the first later option", async ({ page }) => {
	await openStory(page);
	await expectSelectedModel(page, "controlled-trigger");
});
