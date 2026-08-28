import { expect, test } from "../playwright";

const controlledPath = "/iframe.html?id=components-stepper--controlled&viewMode=story";
const orientationsPath = "/iframe.html?id=components-stepper--orientations&viewMode=story";
const statesPath = "/iframe.html?id=components-stepper--states&viewMode=story";

test("uses Base UI tab semantics without custom naming relationships", async ({ page }) => {
	await page.goto(statesPath);

	const root = page.getByTestId("states-stepper");
	const list = root.getByRole("tablist");
	const tabs = list.getByRole("tab");
	const account = tabs.nth(0);
	const review = tabs.nth(1);
	const finish = tabs.nth(4);

	await expect(list).toBeVisible();
	await expect(tabs).toHaveCount(5);
	await expect(account).toHaveAccessibleName(/\S/);
	await expect(account).not.toHaveAttribute("aria-labelledby");
	await expect(account).not.toHaveAttribute("aria-describedby");
	await expect(account).not.toHaveAccessibleName(/1/);
	await expect(review).toHaveAttribute("aria-selected", "true");
	await expect(finish).toBeDisabled();
	const panel = root.getByRole("tabpanel");
	await expect(panel).toBeVisible();
	await expect(panel).toHaveAttribute("aria-labelledby", (await review.getAttribute("id")) ?? "");
});

test("replaces completed and invalid marker children with decorative status icons", async ({
	page,
}) => {
	await page.goto(statesPath);

	const completedMarker = page.getByTestId("completed-step-marker");
	const invalidMarker = page.getByTestId("invalid-step-marker");

	await expect(completedMarker).toHaveAttribute("aria-hidden", "true");
	await expect(completedMarker).toHaveText("");
	await expect(invalidMarker).toHaveAttribute("aria-hidden", "true");
	await expect(invalidMarker).toHaveText("");
});

test("keeps Base UI manual keyboard navigation in both orientations", async ({ page }) => {
	await page.setViewportSize({ width: 1024, height: 800 });
	await page.goto(orientationsPath);

	const horizontal = page.getByTestId("horizontal-stepper");
	const horizontalTabs = horizontal.getByRole("tab");
	const profile = horizontalTabs.nth(0);
	const security = horizontalTabs.nth(1);
	await profile.focus();
	await page.keyboard.press("ArrowRight");
	await expect(security).toBeFocused();
	await expect(profile).toHaveAttribute("aria-selected", "true");
	await page.keyboard.press("Enter");
	await expect(security).toHaveAttribute("aria-selected", "true");

	const vertical = page.getByTestId("vertical-stepper");
	const verticalList = vertical.getByRole("tablist");
	const verticalTabs = vertical.getByRole("tab");
	const verticalSecurity = verticalTabs.nth(1);
	await expect(verticalList).toHaveAttribute("aria-orientation", "vertical");
	await verticalSecurity.focus();
	await page.keyboard.press("ArrowDown");
	await expect(verticalTabs.nth(2)).toBeFocused();

	await page.setViewportSize({ width: 360, height: 800 });
	await expect(verticalList).not.toHaveAttribute("aria-orientation");
	await verticalSecurity.focus();
	await page.keyboard.press("ArrowRight");
	await expect(verticalTabs.nth(2)).toBeFocused();
});

test("leaves locking and pagination under external control", async ({ page }) => {
	await page.goto(controlledPath);

	const tabs = page.getByRole("tab");
	const billing = tabs.nth(2);
	const continueButton = page.getByTestId("stepper-continue");
	await expect(billing).toBeDisabled();
	await continueButton.click();
	await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
	await expect(continueButton).toBeDisabled();

	await page.getByTestId("stepper-toggle-billing").click();
	await expect(billing).toBeEnabled();
	await continueButton.click();
	await expect(billing).toHaveAttribute("aria-selected", "true");
	const billingId = await billing.getAttribute("id");
	const panel = page.locator(`[role='tabpanel'][aria-labelledby='${billingId}']`);
	await expect(panel).toBeVisible();
});
