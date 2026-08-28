import { expect, test, type Locator, type Page } from "../playwright";

const storyPath =
	"/iframe.html?id=design-system-style-props-verification--consumer-contract&viewMode=story";
const badgeTruncationStoryPath =
	"/iframe.html?id=components-badge--truncation-tooltip&viewMode=story";

async function openFixture(page: Page) {
	await page.goto(storyPath);
	await expect(page.getByTestId("fixture-ready")).toBeVisible();
}

async function expectTooltip(trigger: Locator, content: Locator) {
	await expect(trigger).toHaveAttribute("data-popup-open", "");
	await expect(content).toBeVisible();
	await expect(content).toContainText(/\S/);
}

test("margin props preserve shorthand precedence, logical edges, negatives, and auto", async ({
	page,
}) => {
	await openFixture(page);

	const precedence = page.getByTestId("margin-precedence");
	await expect(precedence).toHaveCSS("margin-top", "12px");
	await expect(precedence).toHaveCSS("margin-right", "8px");
	await expect(precedence).toHaveCSS("margin-bottom", "4px");
	await expect(precedence).toHaveCSS("margin-left", "8px");

	const logical = page.getByTestId("logical-margin");
	await expect(logical).toHaveCSS("margin-inline-start", "8px");
	await expect(logical).toHaveCSS("margin-inline-end", "16px");
	await expect(page.getByTestId("negative-margin")).toHaveCSS("margin-top", "-8px");

	const pushedButton = page.getByTestId("auto-margin");
	const inlineEndGap = await pushedButton.evaluate((button) => {
		const row = button.parentElement;
		if (row === null) throw new Error("Auto-margin fixture button must have a row parent.");
		const rowRect = row.getBoundingClientRect();
		const buttonRect = button.getBoundingClientRect();
		return Math.round(rowRect.right - buttonRect.right);
	});
	expect(inlineEndGap).toBe(0);
});

test("margin, padding, gap, and inset props accept CSS values", async ({ page }) => {
	await openFixture(page);

	await expect(page.getByTestId("css-margin")).toHaveCSS("margin-top", "13px");
	await expect(page.getByTestId("css-padding")).toHaveCSS("padding-top", "7px");
	await expect(page.getByTestId("css-gap")).toHaveCSS("row-gap", "9px");
	await expect(page.getByTestId("css-inset")).toHaveCSS("top", "11px");
});

test("border styles provide a default width while borderWidth remains the final override", async ({
	page,
}) => {
	await openFixture(page);

	const defaultBorder = page.getByTestId("border-style-default");
	await expect(defaultBorder).toHaveCSS("border-top-style", "dashed");
	await expect(defaultBorder).toHaveCSS("border-top-width", "1px");

	const overriddenBorder = page.getByTestId("border-width-override");
	await expect(overriddenBorder).toHaveCSS("border-top-style", "dashed");
	await expect(overriddenBorder).toHaveCSS("border-top-width", "5px");
});

test("theme overrides, xstyle, and native style follow the declared precedence", async ({
	page,
}) => {
	await openFixture(page);

	const themed = page.getByTestId("themed-margin");
	await expect(themed).toHaveCSS("margin-top", "32px");
	await expect(themed).toHaveCSS("margin-right", "32px");
	await expect(themed).toHaveCSS("margin-bottom", "32px");
	await expect(themed).toHaveCSS("margin-left", "32px");

	const xstyleWins = page.getByTestId("xstyle-margin-wins");
	await expect(xstyleWins).toHaveCSS("margin-top", "0px");
	await expect(xstyleWins).toHaveCSS("margin-right", "0px");
	await expect(xstyleWins).toHaveCSS("margin-bottom", "0px");
	await expect(xstyleWins).toHaveCSS("margin-left", "0px");
	await expect(page.getByTestId("native-style-wins")).toHaveCSS("color", "rgb(0, 0, 255)");
	const compound = page.getByTestId("compound-native-style-wins");
	await expect(compound).toHaveCSS("color", "rgb(0, 0, 255)");
	await expect(compound).toHaveCSS("width", "123px");
});

test("field margins land on the wrapper and custom props do not leak to DOM", async ({ page }) => {
	await openFixture(page);

	const control = page.getByTestId("field-control");
	const wrapper = control.locator("xpath=..");
	await expect(wrapper).toHaveCSS("margin-top", "16px");
	await expect(control).toHaveCSS("margin-top", "0px");

	for (const testId of [
		"margin-precedence",
		"logical-margin",
		"negative-margin",
		"themed-margin",
	]) {
		const element = page.getByTestId(testId);
		for (const attribute of ["m", "mx", "my", "mt", "mb", "ms", "me"]) {
			await expect(element).not.toHaveAttribute(attribute);
		}
	}
	await expect(control).not.toHaveAttribute("mt");
});

test("delegated CodeBlock margins stay on ScrollArea while native props stay on pre", async ({
	page,
}) => {
	await openFixture(page);

	const pre = page.getByTestId("code-block-pre");
	const root = page.getByLabel("Code block").locator("..");
	await expect(pre).toHaveJSProperty("tagName", "PRE");
	await expect(pre).toHaveAttribute("id", "code-block-pre");
	await expect(pre).toHaveAttribute("aria-label", "Example source");
	await expect(root).toHaveCSS("margin-top", "16px");
	await expect(root).not.toHaveAttribute("mt");
});

test("Combobox chip overflow delegates trigger props, styles, and tooltip behavior", async ({
	page,
}) => {
	await openFixture(page);

	const trigger = page.getByTestId("chip-overflow-trigger");
	await expect(trigger).toHaveAttribute("data-forwarded", "true");
	await expect(trigger).toHaveCSS("margin-left", "8px");
	await trigger.hover();
	await expectTooltip(trigger, page.getByTestId("chip-overflow-tooltip"));
});

test("created styles and static Atoms compose in one stateful xstyle array", async ({ page }) => {
	await openFixture(page);

	const button = page.getByTestId("atom-submit");
	await expect(button).toHaveCSS("opacity", "1");
	await expect(button).toHaveCSS("margin-top", "4px");
	const [buttonWidth, parentWidth] = await button.evaluate((element) => [
		element.getBoundingClientRect().width,
		element.parentElement?.getBoundingClientRect().width,
	]);
	expect(buttonWidth).toBe(parentWidth);

	await button.click();
	await expect(button).toHaveCSS("opacity", "0.5");
	await expect(button).toHaveAttribute("aria-pressed", "true");
	await button.click();
	await expect(button).toHaveCSS("opacity", "1");
	await expect(button).toHaveAttribute("aria-pressed", "false");
});

test("responsive layout remains a predeclared stylex.create set", async ({ page }) => {
	await openFixture(page);
	const span = page.getByTestId("responsive-created-style");
	await page.setViewportSize({ width: 600, height: 900 });
	await expect(span).toHaveCSS("width", "240px");
	await page.setViewportSize({ width: 800, height: 900 });
	await expect(span).toHaveCSS("width", "120px");
});

test("Badge exposes its measured truncated label through a tooltip", async ({ page }) => {
	await page.goto(badgeTruncationStoryPath);
	const badge = page.getByTestId("truncated-badge");
	const label = badge.locator("span").last();

	await expect(label).toBeVisible();
	expect(await label.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
	await expect(badge).toHaveAttribute("tabindex", "0");
	await badge.focus();
	const badgeText = (await badge.textContent())?.trim() ?? "";
	const tooltip = page.locator("[data-open]").filter({ hasText: badgeText }).last();
	await expectTooltip(badge, tooltip);
	await expect(tooltip).toContainText((await badge.textContent())?.trim() ?? "");
});

test("field choice groups retain native interaction behavior", async ({ page }) => {
	await openFixture(page);
	const firstChoice = page.getByTestId("inline-checkbox-group").getByRole("checkbox").first();
	await firstChoice.check();
	await expect(firstChoice).toBeChecked();
	const firstRadio = page.getByTestId("stacked-radio-group").getByRole("radio").first();
	await firstRadio.check();
	await expect(firstRadio).toBeChecked();
});
