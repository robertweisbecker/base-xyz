import { expect, test, type Page } from "../playwright";

const storyPath =
	"/iframe.html?id=blocks-ai-model-selector--normalization-regression&viewMode=story";

async function openStory(page: Page) {
	await page.goto(storyPath);
	await expect(page.getByTestId("controlled-trigger")).toBeVisible();
}

async function openSubmenu(page: Page, setting: string, optionName: string) {
	const submenuTrigger = page.getByRole("menuitem", { name: new RegExp(`^${setting}`) });
	await expect(submenuTrigger).toBeVisible();
	await submenuTrigger.focus();
	await page.keyboard.press("ArrowRight");
	const option = page.getByRole("menuitemradio", { name: optionName, exact: true });
	await expect(option).toBeVisible();
	return option;
}

async function openModelMenu(page: Page, triggerTestId: string, modelName = "Alpha") {
	await page.getByTestId(triggerTestId).click();
	return openSubmenu(page, "Model", modelName);
}

async function expectSelectedModel(page: Page, triggerTestId: string, modelName = "Alpha") {
	const trigger = page.getByTestId(triggerTestId);
	await expect(trigger).toContainText(modelName);
	const option = await openModelMenu(page, triggerTestId, modelName);
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

test("invalid controlled model skips an empty group and normalizes the next callback", async ({
	page,
}) => {
	await openStory(page);
	await expect(page.getByTestId("controlled-status")).toHaveAttribute("data-event-count", "0");
	await expectSelectedModel(page, "controlled-trigger");

	await page.getByTestId("controlled-trigger").click();
	const effort = await openSubmenu(page, "Effort", "High");
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
	const speed = await openSubmenu(page, "Speed", "Fast");
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
	await expectSelectedModel(page, "dynamic-trigger", "Beta");
	await page.getByTestId("dynamic-remove-model").click();
	await expect(page.getByTestId("dynamic-status")).toHaveAttribute("data-event-count", "0");
	await expectSelectedModel(page, "dynamic-trigger");

	await page.getByTestId("dynamic-trigger").click();
	const effort = await openSubmenu(page, "Effort", "High");
	await effort.focus();
	await page.keyboard.press("Enter");
	await expectLatestEvent(page, "dynamic-status", {
		effort: "High",
		model: "model-alpha",
		reason: "effort",
		speed: "Default",
	});
});
