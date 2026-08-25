import { expect, test, type Locator, type Page } from "@playwright/test";

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

test("keeps the component Gallery at the landing page", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole("heading", { name: "Components" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Blocks" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Gallery" })).toHaveAttribute("aria-current", "page");
});

test("supports direct navigation to a separate experiments page", async ({ page }) => {
	await page.goto("/experiments?theme=mp&mode=dark");

	await expect(page).toHaveURL(/\/experiments\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Experiments", level: 1 })).toBeVisible();
	expect(await page.getByRole("combobox", { name: "Theme" }).evaluate((element) => element.closest("span"))).toBeNull();
	await expect(page.getByRole("link", { name: "Experiments" })).toHaveAttribute("aria-current", "page");
	await expect(page.getByRole("navigation", { name: "Experiments" })).toBeVisible();
	await expect(page.getByRole("group", { name: "Blocks" })).toBeVisible();
	await expect(page.getByRole("group", { name: "Components" })).toBeVisible();
	await expect(page.getByRole("group", { name: "Blocks" }).getByRole("link", { name: "Blocks", exact: true })).toBeVisible();
	await expect(page.getByRole("group", { name: "Components" }).getByRole("link", { name: "Components", exact: true })).toBeVisible();
	await expect(page.getByRole("link", { name: "Utilities" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Agent Blocks" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Inputs" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Popups" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Tables" })).toBeVisible();
	await expect(page.getByRole("navigation", { name: "Breadcrumbs" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Collapse sidebar" })).toBeVisible();
	const utilityItem = page.getByRole("group", { name: "Blocks" }).getByRole("link", { name: "Utilities" }).locator("..");
	expect(await utilityItem.evaluate((element) => getComputedStyle(element).borderInlineStartStyle)).toBe("solid");
	expect(await utilityItem.evaluate((element) => Number.parseFloat(getComputedStyle(element).marginInlineStart)))
		.toBeGreaterThan(0);

	await page.getByRole("button", { name: "Collapse sidebar" }).click();
	await expect(page.getByRole("button", { name: "Expand sidebar" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Utilities" })).toBeVisible();
	expect(await utilityItem.evaluate((element) => getComputedStyle(element).borderInlineStartWidth)).toBe("0px");
	expect(await utilityItem.evaluate((element) => Number.parseFloat(getComputedStyle(element).marginInlineStart))).toBe(0);

	await page.getByRole("navigation", { name: "Demo pages" }).getByRole("link", { name: "Gallery" }).click();
	await expect(page).toHaveURL(/\/\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Components" })).toBeVisible();
});

test("supports grouped child routes and identifies the current experiment", async ({ page }) => {
	await page.goto("/experiments/components/inputs?theme=mp&mode=dark");

	await expect(page).toHaveURL(/\/experiments\/components\/inputs\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Inputs", level: 1 })).toBeVisible();
	await expect(page.getByRole("link", { name: "Inputs" })).toHaveAttribute("aria-current", "page");
	await expect(page.getByRole("heading", { name: "Fields", level: 2 })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Input Group", level: 2 })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Controls", level: 2 })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Composed form", level: 2 })).toBeVisible();
	await expect(page.locator('[data-comparison-container="field-sizing"]')).toBeVisible();
	await expect(page.locator('[data-comparison-container="field-states"]')).toBeVisible();
	const choiceControlSizing = page.locator('[data-comparison-container="choice-control-sizing"]');
	const choiceControlStates = page.locator('[data-comparison-container="choice-control-states"]');
	const valueControlSizing = page.locator('[data-comparison-container="value-control-sizing"]');
	const valueControlStates = page.locator('[data-comparison-container="value-control-states"]');
	await expect(choiceControlSizing).toBeVisible();
	await expect(choiceControlStates).toBeVisible();
	await expect(valueControlSizing).toBeVisible();
	await expect(valueControlStates).toBeVisible();
	await expect(choiceControlSizing.getByText("Switch", { exact: true })).toHaveCount(0);
	await expect(choiceControlStates.getByText("Switch", { exact: true })).toHaveCount(0);
	await expect(choiceControlSizing.getByRole("radio")).toHaveCount(2);
	await expect(choiceControlSizing.getByRole("checkbox")).toHaveCount(2);
	await expect(choiceControlSizing.getByText("Not supported")).toHaveCount(2);
	await expect(valueControlSizing.getByText("Switch", { exact: true })).toBeVisible();
	await expect(valueControlSizing.getByText("Slider", { exact: true })).toBeVisible();
	await expect(valueControlSizing.getByRole("slider")).toHaveCount(3);
	await expect(valueControlStates.getByRole("slider")).toHaveCount(3);
	const sizingMatrix = page.locator("[data-field-sizing-scroll]");
	await expect(sizingMatrix).toHaveCount(1);
	expect(await sizingMatrix.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
	expect(await page.locator("[data-size-comparison]").evaluateAll((rows) =>
		rows.every((row) => getComputedStyle(row).overflowX === "visible"),
	)).toBe(true);
	await expect(page.locator("[data-size-comparison]")).toHaveCount(3);
	await expect(page.locator('[data-measurement-guide="baseline"]')).toHaveCount(4);
	await expect(page.getByRole("region", { name: "Field state comparison" })).toBeVisible();
	const choiceStateRegion = page.getByRole("region", { name: "Radio and checkbox state comparison" });
	const valueStateRegion = page.getByRole("region", { name: "Switch and slider state comparison" });
	await expect(choiceStateRegion).toBeVisible();
	await expect(valueStateRegion).toBeVisible();
	const stateRadios = choiceStateRegion.getByRole("radio");
	const stateCheckboxes = choiceStateRegion.getByRole("checkbox");
	await expect(stateRadios.nth(0)).not.toBeChecked();
	await expect(stateRadios.nth(1)).toBeChecked();
	await stateRadios.nth(2).press("Space");
	await expect(stateRadios.nth(2)).not.toBeChecked();
	await expect(stateRadios.nth(3)).toBeDisabled();
	await expect(stateCheckboxes.nth(0)).not.toBeChecked();
	await expect(stateCheckboxes.nth(1)).toBeChecked();
	await stateCheckboxes.nth(2).press("Space");
	await expect(stateCheckboxes.nth(2)).not.toBeChecked();
	await expect(stateCheckboxes.nth(3)).toBeDisabled();
	const stateSwitches = valueStateRegion.getByRole("switch");
	const stateSliders = valueStateRegion.getByRole("slider");
	await expect(stateSwitches.nth(0)).not.toBeChecked();
	await expect(stateSwitches.nth(1)).toBeChecked();
	await expect(stateSwitches.nth(2)).toBeChecked();
	await expect(stateSwitches.nth(2)).toBeDisabled();
	await expect(stateSliders.nth(0)).toHaveAttribute("aria-valuenow", "0");
	await expect(stateSliders.nth(1)).toHaveAttribute("aria-valuenow", "65");
	await expect(stateSliders.nth(2)).toHaveAttribute("aria-valuenow", "65");
	await expect(stateSliders.nth(2)).toBeDisabled();
	const switchHeights = await valueControlSizing.getByRole("switch").evaluateAll((switches) =>
		switches.map((control) => control.getBoundingClientRect().height),
	);
	const radioHeights = await choiceControlSizing.getByRole("radio").evaluateAll((radios) =>
		radios.map((control) => control.getBoundingClientRect().height),
	);
	const checkboxHeights = await choiceControlSizing.getByRole("checkbox").evaluateAll((checkboxes) =>
		checkboxes.map((control) => control.getBoundingClientRect().height),
	);
	const sliderHeights = await valueControlSizing.locator("[data-size]").evaluateAll((sliders) =>
		sliders.map((control) => control.getBoundingClientRect().height),
	);
	expect(radioHeights[0]).toBeLessThan(radioHeights[1] ?? 0);
	expect(checkboxHeights[0]).toBeLessThan(checkboxHeights[1] ?? 0);
	expect(switchHeights[0]).toBeLessThan(switchHeights[1] ?? 0);
	expect(switchHeights[1]).toBeLessThan(switchHeights[2] ?? 0);
	expect(sliderHeights[0]).toBeLessThan(sliderHeights[1] ?? 0);
	expect(sliderHeights[1]).toBeLessThan(sliderHeights[2] ?? 0);
	await expect(page.locator("[data-padding-guide]")).toHaveCount(2);
	await expect(page.getByRole("searchbox", { name: "Search projects" })).toBeVisible();
	await expect(page.locator('[data-component="kbd-group"] > [data-component="kbd"]')).toHaveText(["⌘", "K"]);
	await expect(page.getByRole("button", { name: "Copy API token" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Create environment" })).toBeVisible();
	await expect(page.getByRole("navigation", { name: "Breadcrumbs" }).getByRole("link", { name: "Experiments" }))
		.toHaveAttribute("href", "/experiments?theme=mp&mode=dark");
	await expect(page.getByRole("navigation", { name: "Breadcrumbs" }).getByRole("link", { name: "Components" }))
		.toHaveAttribute("href", "/experiments/components?theme=mp&mode=dark");

	await page.getByRole("link", { name: "Popups" }).press("Enter");
	await expect(page).toHaveURL(/\/experiments\/components\/popups\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Popups", level: 1 })).toBeVisible();
	await expect(page.getByRole("link", { name: "Popups" })).toHaveAttribute("aria-current", "page");
});

test("provides a Blocks index with cards for each subpage", async ({ page }) => {
	await page.goto("/experiments/blocks?theme=mp&mode=dark");

	await expect(page).toHaveURL(/\/experiments\/blocks\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Blocks", level: 1 })).toBeVisible();
	await expect(page.getByRole("main").getByRole("link", { name: /Utilities/ })).toBeVisible();
	await expect(page.getByRole("main").getByRole("link", { name: /Agent Blocks/ })).toBeVisible();

	await page.getByRole("main").getByRole("link", { name: /Utilities/ }).click();
	await expect(page).toHaveURL(/\/experiments\/blocks\/utilities\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Utilities", level: 1 })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Copy Button", level: 2 })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Password Field", level: 2 })).toBeVisible();
	await expect(page.getByRole("heading", { name: "PageHeader", level: 2 })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Confirmation Dialog", level: 2 })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Workflow Progress", level: 2 })).toBeVisible();
	await expect(page.getByRole("button", { name: "Copy preview URL" })).toBeVisible();
	await expect(page.getByRole("textbox", { name: "Create a service password" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "base-stylex-lab", level: 3 })).toBeVisible();
	await expect(page.getByRole("button", { name: "Promote to production" })).toBeVisible();
	await expect(page.getByRole("list", { name: "Release workflow progress" })).toBeVisible();

	await page.getByRole("link", { name: "Agent Blocks" }).click();
	await expect(page).toHaveURL(/\/experiments\/blocks\/agent-blocks\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Agent Blocks", level: 1 })).toBeVisible();
	const onThisPage = page.getByRole("navigation", { name: "Agent blocks on this page" });
	await expect(onThisPage.getByRole("link")).toHaveCount(7);
	await expect(onThisPage.getByRole("link", { name: "Context Popover" })).toHaveAttribute("href", "#context-popover");
	expect(await onThisPage.locator("..").evaluate((element) => getComputedStyle(element).position)).toBe("sticky");
	const tableOfContentsBox = await onThisPage.boundingBox();
	const firstExampleBox = await page.locator("#agent-action-approval").boundingBox();
	expect(tableOfContentsBox?.x).toBeGreaterThan(firstExampleBox?.x ?? 0);
	await expect(page.locator("main section > div > h2[id]")).toHaveText([
		"Agent Action Approval",
		"Async Job Progress",
		"Context Popover",
		"Goal Toolbar",
		"Model Selector",
		"Prompt Composer",
		"Streaming Response",
	]);
	await expect(page.getByRole("textbox", { name: "Message" })).toBeVisible();
	await expect(page.getByRole("button", { name: /5\.6 Sol/ })).toBeVisible();
	const firstAgentHeading = page.getByRole("heading", { name: "Agent Action Approval", level: 2 });
	await expect(firstAgentHeading).toHaveAttribute("id", "agent-action-approval");
	expect(await firstAgentHeading.evaluate((element) => getComputedStyle(element).scrollMarginBlockStart)).not.toBe("0px");
	await expect(page.getByText("Allow this action?")).toBeVisible();
	await expect(page.getByText("Build the component search index")).toBeVisible();
	await expect(page.getByRole("article", { name: "Component audit response" })).toBeVisible();
	await page.getByRole("group", { name: "Job state" }).getByRole("button", { name: "Error" }).click();
	await expect(page.locator("#async-job-progress").locator("xpath=ancestor::section").getByRole("status")).toContainText(
		"Failed",
	);
	await page.getByRole("group", { name: "Response state" }).getByRole("button", { name: "Error" }).click();
	await expect(page.locator("#streaming-response").locator("xpath=ancestor::section").getByRole("status")).toContainText(
		"Response failed",
	);
});

test("provides a Components index with cards for each subpage", async ({ page }) => {
	await page.goto("/experiments/components?theme=mp&mode=dark");

	await expect(page).toHaveURL(/\/experiments\/components\?theme=mp&mode=dark$/);
	await expect(page.getByRole("heading", { name: "Components", level: 1 })).toBeVisible();
	await expect(page.getByRole("main").getByRole("link", { name: /Inputs/ })).toBeVisible();
	await expect(page.getByRole("main").getByRole("link", { name: /Popups/ })).toBeVisible();
	await expect(page.getByRole("main").getByRole("link", { name: /Tables/ })).toBeVisible();
});

test("stacks experiment index cards in a single mobile column", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("/experiments/components");

	const cards = page.locator("[data-experiment-index-grid]").getByRole("link");
	const cardBoxes = await cards.evaluateAll((elements) =>
		elements.map((element) => {
			const { x, y, width } = element.getBoundingClientRect();
			return { x, y, width };
		}),
	);

	expect(cardBoxes).toHaveLength(3);
	expect(cardBoxes[1]?.x).toBe(cardBoxes[0]?.x);
	expect(cardBoxes[2]?.x).toBe(cardBoxes[0]?.x);
	expect(cardBoxes[1]?.y).toBeGreaterThan(cardBoxes[0]?.y ?? 0);
	expect(cardBoxes[2]?.y).toBeGreaterThan(cardBoxes[1]?.y ?? 0);
	expect(cardBoxes[0]?.width).toBeGreaterThan(300);
});

test("provides plain popup triggers with representative content and behaviors", async ({ page }) => {
	await page.goto("/experiments/components/popups?theme=mp&mode=dark");

	const triggers = page.locator("[data-popup-trigger-grid]");
	await expect(triggers).toBeVisible();
	await expect(triggers.getByRole("button", { name: "Menu", exact: true })).toBeVisible();
	await expect(triggers.getByRole("combobox")).toHaveText("Select");
	for (const name of [
		"Popover",
		"Link Preview",
		"Tooltip",
		"Command Palette",
		"Dialog",
		"Alert Dialog",
		"Confirmation Dialog",
		"Drawer",
		"Nested popups",
		"Shared transitions",
		"Tooltip to toast",
	]) {
		await expect(triggers.getByRole("button", { name, exact: true })).toBeVisible();
	}
	await triggers.getByRole("button", { name: "Menu", exact: true }).press("Enter");
	await expect(page.getByRole("menuitem", { name: "Duplicate project ⌘D" })).toBeVisible();
	await page.keyboard.press("Escape");

	await triggers.getByRole("combobox").press("Enter");
	await expect(page.getByRole("option", { name: "Preview" })).toBeVisible();
	await page.keyboard.press("Escape");

	await triggers.getByRole("button", { name: "Popover", exact: true }).press("Enter");
	await expect(page.getByRole("dialog", { name: "Create a preview deployment" })).toBeVisible();
	await expect(page.getByRole("textbox", { name: "Branch" })).toHaveValue("feature/popup-lab");
	await expect(page.getByRole("checkbox", { name: "Include environment variables" })).toBeChecked();
	await page.keyboard.press("Escape");

	await triggers.getByRole("button", { name: "Link Preview" }).focus();
	await expect(page.getByRole("heading", { name: "Base UI popup primitives" })).toBeVisible();
	await triggers.getByRole("button", { name: "Tooltip", exact: true }).focus();

	await expect(page.getByText("This tooltip opens on hover or keyboard focus.", { exact: true })).toBeVisible();
});

test("reuses animated Tooltip, Link Preview, and Popover surfaces across shared triggers", async ({ page }) => {
	await page.goto("/experiments/components/popups");

	await page.getByRole("button", { name: "Shared transitions" }).press("Enter");
	const dialog = page.getByRole("dialog", { name: "Shared transitions" });
	await expect(dialog).toBeVisible();

	const tooltipGroup = dialog.getByRole("region", { name: "Shared Tooltip transition" });
	const tooltipPopup = page.locator('[data-shared-transition-popup="tooltip"]');
	await tooltipGroup.getByRole("button", { name: "Notifications" }).hover();
	await expect(tooltipPopup).toContainText("Review notification settings");
	await tooltipGroup.getByRole("button", { name: "Settings" }).hover();
	await expect(tooltipPopup).toContainText("Open workspace settings");
	await expectSharedPopupMotion(tooltipPopup, page.locator(".popup-transition-positioner-tooltip"));
	await expect(tooltipPopup).toHaveCount(1);

	const linkPreviewGroup = dialog.getByRole("region", { name: "Shared Link Preview transition" });
	const linkPreviewPopup = page.locator('[data-shared-transition-popup="link-preview"]');
	await linkPreviewGroup.getByRole("button", { name: "Dialog" }).hover();
	await expect(linkPreviewPopup.getByRole("heading", { name: "Dialog" })).toBeVisible();
	await linkPreviewGroup.getByRole("button", { name: "Drawer" }).hover();
	await expect(linkPreviewPopup.getByRole("heading", { name: "Drawer" })).toBeVisible();
	await expectSharedPopupMotion(linkPreviewPopup, page.locator(".popup-transition-positioner-link-preview"));
	await expect(linkPreviewPopup).toHaveCount(1);

	const popoverGroup = dialog.getByRole("region", { name: "Shared Popover transition" });
	const popoverPopup = page.locator('[data-shared-transition-popup="popover"]');
	await page.mouse.move(0, 0);
	await expect(linkPreviewPopup).toBeHidden();
	await popoverGroup.getByRole("button", { name: "Inbox" }).focus();
	await page.keyboard.press("Enter");
	await expect(popoverPopup.getByRole("heading", { name: "Inbox zero" })).toBeVisible();
	await popoverGroup.getByRole("button", { name: "Mentions" }).focus();
	await page.keyboard.press("Enter");
	await expect(popoverPopup.getByRole("heading", { name: "Two mentions" })).toBeVisible();
	await expectSharedPopupMotion(popoverPopup, page.locator(".popup-transition-positioner-popover"));
	await expect(popoverPopup).toHaveCount(1);
});

test("replaces a Tooltip with anchored toast feedback after click", async ({ page }) => {
	await page.addInitScript(() => {
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { writeText: () => Promise.resolve() },
		});
	});
	await page.goto("/experiments/components/popups");

	const trigger = page.getByRole("button", { name: "Tooltip to toast" });
	await trigger.focus();
	const tooltip = page.getByText("Copy invite link", { exact: true });
	await expect(tooltip).toBeVisible();

	await trigger.click();
	await expect(tooltip).toBeHidden();
	await expect(trigger).toBeFocused();
	const feedback = page.getByRole("dialog", { name: "Copied invite link" });
	await expect(feedback).toBeVisible();
	const [triggerBox, feedbackBox] = await Promise.all([trigger.boundingBox(), feedback.boundingBox()]);
	expect(triggerBox).not.toBeNull();
	expect(feedbackBox).not.toBeNull();
	expect((feedbackBox?.y ?? 0) + (feedbackBox?.height ?? 0)).toBeLessThanOrEqual((triggerBox?.y ?? 0) + 1);
	const triggerCenter = (triggerBox?.x ?? 0) + (triggerBox?.width ?? 0) / 2;
	const feedbackCenter = (feedbackBox?.x ?? 0) + (feedbackBox?.width ?? 0) / 2;
	expect(Math.abs(triggerCenter - feedbackCenter)).toBeLessThan(2);
	await expect(feedback).toBeHidden({ timeout: 4000 });

	await page.keyboard.press("Tab");
	await trigger.focus();
	await expect(tooltip).toBeVisible();

	await page.evaluate(() => {
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { writeText: () => Promise.reject(new Error("Clipboard write failed")) },
		});
	});
	await trigger.click();
	await expect(tooltip).toBeHidden();
	await expect(trigger).toBeFocused();
	await expect(page.getByRole("dialog", { name: "Unable to copy invite link" })).toBeVisible();
});

async function expectSharedPopupMotion(popup: Locator, positioner: Locator) {
	await expect(popup).toHaveCSS("transition-property", /width/);
	await expect(positioner).toHaveCSS("transition-property", /top/);
}

test("exposes dialog, command palette, confirmation, and drawer variations", async ({ page }) => {
	await page.goto("/experiments/components/popups");

	await page.getByRole("button", { name: "Command Palette" }).press("Enter");
	await expect(page.getByRole("dialog", { name: "Command palette example" })).toBeVisible();
	await expect(page.getByRole("option", { name: "Create project" })).toBeVisible();
	await page.keyboard.press("Escape");

	await page.getByRole("button", { name: "Dialog", exact: true }).click();
	const variations = page.getByRole("dialog", { name: "Dialog variations" });
	await expect(variations).toBeVisible();
	await expect(variations.getByRole("button", { name: "Small" })).toBeVisible();
	await expect(variations.getByRole("button", { name: "Large" })).toBeVisible();
	await expect(variations.getByRole("button", { name: "Popup scroll" })).toBeVisible();
	await expect(variations.getByRole("button", { name: "Inside scroll" })).toBeVisible();
	await expect(variations.getByRole("button", { name: "Outside scroll" })).toBeVisible();
	await variations.getByRole("button", { name: "Inside scroll" }).click();
	const scrollArea = page.locator('[aria-label="Inside-scroll dialog guidance"]');
	await expect(scrollArea).toBeVisible();
	expect(await scrollArea.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
	await page.keyboard.press("Escape");
	await page.keyboard.press("Escape");

	await page.getByRole("button", { name: "Alert Dialog" }).click();
	await expect(page.getByRole("alertdialog", { name: "Discard the draft?" })).toBeVisible();
	await page.getByRole("button", { name: "Keep editing" }).click();

	await page.getByRole("button", { name: "Confirmation Dialog" }).click();
	await expect(page.getByRole("dialog", { name: "Publish this project?" })).toBeVisible();
	await page.getByRole("button", { name: "Cancel" }).click();

	await page.getByRole("button", { name: "Drawer", exact: true }).click();
	const drawer = page.getByRole("dialog", { name: "Drawer variations" });
	await expect(drawer).toBeVisible();
	await expect(drawer.getByRole("button", { name: "Details" })).toBeVisible();
	await expect(drawer.getByRole("button", { name: "Activity" })).toBeVisible();
	await expect(drawer.getByRole("button", { name: "Compact" })).toBeVisible();
	await expect(drawer.getByRole("button", { name: "Full height" })).toBeVisible();
	await expect(drawer.getByRole("button", { name: "Details" })).toHaveAttribute("aria-pressed", "true");
	await expect(drawer.getByRole("button", { name: "Compact" })).toHaveAttribute("aria-pressed", "true");
	await drawer.getByRole("button", { name: "Full height" }).click();
	await expect(drawer.getByRole("button", { name: "Full height" })).toHaveAttribute("aria-pressed", "true");
	await drawer.getByRole("button", { name: "Open nested drawer" }).click();
	const nestedDrawer = page.getByRole("dialog", { name: "Nested drawer" });
	await expect(nestedDrawer).toBeVisible();
	await nestedDrawer.getByRole("button", { name: "Back" }).click();
	await expect(nestedDrawer).toBeHidden();
	await drawer.getByRole("button", { name: "Activity" }).click();
	await expect(drawer.getByRole("button", { name: "Activity" })).toHaveAttribute("aria-pressed", "true");
	await expect(drawer.getByText("Activity 14")).toBeVisible();
});

test("keeps nested popup layers interactive and correctly stacked", async ({ page }) => {
	await page.goto("/experiments/components/popups");

	const trigger = page.getByRole("button", { name: "Nested popups" });
	await trigger.click();
	const dialog = page.getByRole("dialog", { name: "Nested popup stack" });
	await expect(dialog).toBeVisible();
	const dialogLayer = await popupStackingLevel(dialog);

	await dialog.getByRole("button", { name: "Open nested popover" }).click();
	const popover = page.getByRole("dialog", { name: "Nested popover" });
	await expect(popover).toBeVisible();
	const popoverLayer = await popupStackingLevel(popover);
	expect(popoverLayer).toBeGreaterThan(dialogLayer);

	await popover.getByRole("button", { name: "Open nested menu" }).click();
	const menu = page.getByRole("menu");
	await expect(menu).toBeVisible();
	const menuLayer = await popupStackingLevel(menu);
	expect(menuLayer).toBeGreaterThanOrEqual(popoverLayer);
	await page.getByRole("menuitem", { name: "First nested action" }).click();
	await expect(menu).toBeHidden();

	await page.keyboard.press("Escape");
	await expect(popover).toBeHidden();
	await dialog.getByRole("button", { name: "Nested tooltip" }).hover();
	const tooltip = page.getByText("Tooltip above modal content", { exact: true });
	await expect(tooltip).toBeVisible();
	const tooltipLayer = await popupStackingLevel(tooltip);
	expect(tooltipLayer).toBeGreaterThan(menuLayer);

	await page.mouse.move(0, 0);
	await page.keyboard.press("Escape");
	await expect(dialog).toBeHidden();
	await expect(trigger).toBeFocused();
});

async function popupStackingLevel(locator: Locator) {
	return locator.evaluate((element) => {
		let current: Element | null = element;

		while (current) {
			const zIndex = getComputedStyle(current).zIndex;
			if (zIndex !== "auto") return Number(zIndex);
			current = current.parentElement;
		}

		return 0;
	});
}

test("preserves theme URL state changed after the router initializes", async ({ page }) => {
	await page.goto("/");

	await page.getByRole("combobox", { name: "Theme" }).click();
	await page.getByRole("option", { name: "MP" }).click();
	await page.getByRole("button", { name: /Switch to (dark|light) mode/ }).click();

	const searchBeforeNavigation = new URL(page.url()).search;
	expect(searchBeforeNavigation).toContain("theme=mp");
	expect(searchBeforeNavigation).toMatch(/mode=(dark|light)/);

	await page.getByRole("link", { name: "Experiments" }).click();
	await expect(page).toHaveURL(new RegExp(`/experiments${searchBeforeNavigation.replaceAll("?", "\\?")}$`));
});
