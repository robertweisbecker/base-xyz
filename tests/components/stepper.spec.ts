import { expect, test, type Locator, type Page } from "@playwright/test";

const controlledPath = "/iframe.html?id=components-stepper--controlled&viewMode=story";
const orientationsPath = "/iframe.html?id=components-stepper--orientations&viewMode=story";
const statesPath = "/iframe.html?id=components-stepper--states&viewMode=story";
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

test("uses Base UI tab semantics without custom naming relationships", async ({ page }) => {
	await page.goto(statesPath);

	const root = page.getByTestId("states-stepper");
	const list = root.getByRole("tablist", { name: "Verification progress" });
	const account = root.getByRole("tab", { name: /Account Saved contact details\. Completed/ });
	const review = root.getByRole("tab", { name: "Review Confirm the submitted information." });
	const finish = root.getByRole("tab", { name: "Finish Unlocks after billing is complete." });

	await expect(list).toBeVisible();
	await expect(account).not.toHaveAttribute("aria-labelledby");
	await expect(account).not.toHaveAttribute("aria-describedby");
	await expect(account).not.toHaveAccessibleName(/1/);
	await expect(review).toHaveAttribute("aria-selected", "true");
	await expect(finish).toBeDisabled();
	await expect(root.getByRole("tabpanel", { name: /Review Confirm the submitted information/ })).toBeVisible();
	await expect(root.getByRole("tabpanel", { name: /Account Saved contact details/ })).toBeHidden();
});

test("keeps Base UI manual keyboard navigation in both orientations", async ({ page }) => {
	await page.setViewportSize({ width: 1024, height: 800 });
	await page.goto(orientationsPath);

	const horizontal = page.getByTestId("horizontal-stepper");
	const profile = horizontal.getByRole("tab", { name: /Profile/ });
	const security = horizontal.getByRole("tab", { name: /Security/ });
	await profile.focus();
	await page.keyboard.press("ArrowRight");
	await expect(security).toBeFocused();
	await expect(profile).toHaveAttribute("aria-selected", "true");
	await page.keyboard.press("Enter");
	await expect(security).toHaveAttribute("aria-selected", "true");

	const vertical = page.getByTestId("vertical-stepper");
	const verticalList = vertical.getByRole("tablist");
	const verticalSecurity = vertical.getByRole("tab", { name: /Security/ });
	await expect(verticalList).toHaveAttribute("aria-orientation", "vertical");
	await verticalSecurity.focus();
	await page.keyboard.press("ArrowDown");
	await expect(vertical.getByRole("tab", { name: /Billing/ })).toBeFocused();

	await page.setViewportSize({ width: 360, height: 800 });
	await expect(verticalList).not.toHaveAttribute("aria-orientation");
	await verticalSecurity.focus();
	await page.keyboard.press("ArrowRight");
	await expect(vertical.getByRole("tab", { name: /Billing/ })).toBeFocused();
	await expect.poll(async () => markerIsAboveTitle(verticalSecurity)).toBe(true);
});

test("leaves locking and pagination under external control", async ({ page }) => {
	await page.goto(controlledPath);

	const billing = page.getByRole("tab", { name: /Billing/ });
	const continueButton = page.getByRole("button", { name: "Continue" });
	await expect(billing).toBeDisabled();
	await continueButton.click();
	await expect(page.getByRole("tab", { name: /Security/ })).toHaveAttribute("aria-selected", "true");
	await expect(continueButton).toBeDisabled();

	await page.getByRole("button", { name: "Unlock billing" }).click();
	await expect(billing).toBeEnabled();
	await continueButton.click();
	await expect(billing).toHaveAttribute("aria-selected", "true");
	await expect(page.getByRole("tabpanel", { name: /Billing/ })).toBeVisible();
});

test("places content and connector fill for horizontal and vertical layouts", async ({ page }) => {
	await page.setViewportSize({ width: 1024, height: 900 });
	await page.goto(orientationsPath);

	const horizontal = page.getByTestId("horizontal-stepper");
	await expect.poll(async () => markerIsAboveTitle(horizontal.getByRole("tab", { name: /Security/ }))).toBe(true);
	await expect.poll(async () => connectorMeetsCurrentMarker(horizontal)).toBe(true);

	const vertical = page.getByTestId("vertical-stepper");
	await expect.poll(async () => markerIsLeftOfTitle(vertical.getByRole("tab", { name: /Security/ }))).toBe(true);
	await expect.poll(async () => contentIsBesideList(vertical)).toBe(true);
	await expect.poll(async () => connectorMeetsCurrentMarker(vertical)).toBe(true);

	await page.setViewportSize({ width: 360, height: 800 });
	await expect.poll(async () => contentIsBelowList(vertical)).toBe(true);
});

async function markerIsAboveTitle(tab: Locator) {
	const marker = tab.locator("[aria-hidden]").first();
	const title = tab.locator("span").filter({ hasText: /Profile|Security|Billing/ }).nth(1);
	const [markerBox, titleBox] = await Promise.all([marker.boundingBox(), title.boundingBox()]);
	return markerBox != null && titleBox != null && markerBox.y + markerBox.height <= titleBox.y + 1;
}

async function markerIsLeftOfTitle(tab: Locator) {
	const marker = tab.locator("[aria-hidden]").first();
	const title = tab.locator("span").filter({ hasText: /Profile|Security|Billing/ }).nth(1);
	const [markerBox, titleBox] = await Promise.all([marker.boundingBox(), title.boundingBox()]);
	return markerBox != null && titleBox != null && markerBox.x + markerBox.width <= titleBox.x + 1;
}

async function contentIsBesideList(root: Locator) {
	const [listBox, panelBox] = await Promise.all([root.getByRole("tablist").boundingBox(), root.getByRole("tabpanel").boundingBox()]);
	return listBox != null && panelBox != null && panelBox.x >= listBox.x + listBox.width - 1;
}

async function contentIsBelowList(root: Locator) {
	const [listBox, panelBox] = await Promise.all([root.getByRole("tablist").boundingBox(), root.getByRole("tabpanel").boundingBox()]);
	return listBox != null && panelBox != null && panelBox.y >= listBox.y + listBox.height - 1;
}

async function connectorMeetsCurrentMarker(root: Locator) {
	const currentMarker = root.getByRole("tab", { selected: true }).locator("[aria-hidden]").first();
	const [markerBox, fillBox] = await Promise.all([
		currentMarker.boundingBox(),
		root.getByRole("tablist").locator(":scope > [role='presentation']").boundingBox(),
	]);
	if (markerBox == null || fillBox == null) return false;
	const horizontal = fillBox.width >= fillBox.height;
	const markerCenter = horizontal ? markerBox.x + markerBox.width / 2 : markerBox.y + markerBox.height / 2;
	const fillEdge = horizontal ? fillBox.x + fillBox.width : fillBox.y + fillBox.height;
	return Math.abs(markerCenter - fillEdge) <= 2;
}
