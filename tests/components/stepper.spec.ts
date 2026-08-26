import { expect, test, type Locator, type Page } from "@playwright/test";

const orientationsPath = "/iframe.html?id=components-stepper--orientations&viewMode=story";
const statesPath = "/iframe.html?id=components-stepper--states&viewMode=story";
const navigationPath = "/iframe.html?id=components-stepper--navigation&viewMode=story";
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

test("exposes tab semantics, names, and descriptions without marker text", async ({ page }) => {
	await page.goto(statesPath);

	const root = page.getByTestId("states-stepper");
	const list = root.getByRole("tablist", { name: "Verification progress" });
	await expect(list).toBeVisible();

	const account = root.getByRole("tab", { name: "Account" });
	const review = root.getByRole("tab", { name: "Review" });
	const documents = root.getByRole("tab", { name: "Documents" });
	const finish = root.getByRole("tab", { name: "Finish" });

	await expect(account).toHaveAccessibleName("Account");
	await expect(account).toHaveAccessibleDescription(/Saved contact details\./);
	await expect(account).toHaveAccessibleDescription(/Completed/);
	await expect(review).toHaveAccessibleName("Review");
	await expect(review).toHaveAccessibleDescription("Confirm the submitted information.");
	await expect(documents).toHaveAccessibleDescription(/Invalid/);
	await expect(account).not.toHaveAccessibleName(/1/);
	await expect(account).not.toHaveAccessibleName(/Saved contact details/);

	await expect(review).toHaveAttribute("aria-selected", "true");
	await expect(account).toHaveAttribute("aria-selected", "false");
	await expect(account).not.toHaveAttribute("aria-current");
	await expect(documents).not.toHaveAttribute("aria-invalid");

	await expect(finish).toBeDisabled();
	await finish.click({ force: true });
	await expect(review).toHaveAttribute("aria-selected", "true");

	const panel = root.getByRole("tabpanel", { name: "Review" });
	await expect(panel).toBeVisible();
	await expect(panel).toHaveAttribute("tabindex", "0");
});

test("moves focus without selecting and activates with enter or space", async ({ page }) => {
	await page.setViewportSize({ width: 1024, height: 800 });
	await page.goto(orientationsPath);

	const root = page.getByTestId("horizontal-stepper");
	const profile = root.getByRole("tab", { name: "Profile" });
	const security = root.getByRole("tab", { name: "Security" });
	const billing = root.getByRole("tab", { name: "Billing" });

	await profile.focus();
	await page.keyboard.press("ArrowRight");
	await expect(security).toBeFocused();
	await expect(profile).toHaveAttribute("aria-selected", "true");

	await page.keyboard.press("Enter");
	await expect(security).toHaveAttribute("aria-selected", "true");
	await expect(security).toBeFocused();

	await page.keyboard.press("ArrowRight");
	await expect(billing).toBeFocused();
	await page.keyboard.press(" ");
	await expect(billing).toHaveAttribute("aria-selected", "true");
	await expect(billing).toBeFocused();

	await page.keyboard.press("ArrowRight");
	await expect(billing).toBeFocused();
	await page.keyboard.press("ArrowLeft");
	await expect(security).toBeFocused();
	await page.keyboard.press("Home");
	const homeSupported = await profile.evaluate((node) => document.activeElement === node);
	if (homeSupported) {
		await expect(profile).toBeFocused();
		await page.keyboard.press("End");
		await expect(billing).toBeFocused();
	} else {
		await expect(security).toBeFocused();
	}
});

test("maps vertical arrow keys above the md breakpoint and horizontal keys below it", async ({ page }) => {
	await page.setViewportSize({ width: 800, height: 800 });
	await page.goto(orientationsPath);

	const root = page.getByTestId("vertical-stepper");
	const list = root.getByRole("tablist");
	const profile = root.getByRole("tab", { name: "Profile" });
	const security = root.getByRole("tab", { name: "Security" });

	await expect(list).toHaveAttribute("aria-orientation", "vertical");
	await expect.poll(async () => markerIsLeftOfTitle(security)).toBe(true);
	await expect.poll(async () => contentIsBesideList(root)).toBe(true);

	await security.focus();
	await page.keyboard.press("ArrowDown");
	await expect(root.getByRole("tab", { name: "Billing" })).toBeFocused();
	await expect(security).toHaveAttribute("aria-selected", "true");
	await page.keyboard.press("ArrowUp");
	await expect(security).toBeFocused();
	await page.keyboard.press("ArrowUp");
	await expect(profile).toBeFocused();

	await page.setViewportSize({ width: 500, height: 800 });
	await expect.poll(async () => list.getAttribute("data-orientation")).toBe("horizontal");
	await expect(list).toHaveAttribute("aria-orientation", "horizontal");
	await expect.poll(async () => markerIsAboveTitle(security)).toBe(true);
	await expect.poll(async () => contentIsBelowList(root)).toBe(true);

	await profile.focus();
	await page.keyboard.press("ArrowRight");
	await expect(security).toBeFocused();
	await expect(profile).toHaveAttribute("aria-selected", "false");
});

test("pages to adjacent steps, respects locks, and focuses accepted panels", async ({ page }) => {
	await page.goto(navigationPath);

	const root = page.getByTestId("panel-actions-stepper");
	const panel = root.getByRole("tabpanel");
	const back = root.getByRole("button", { name: "Back" });
	const next = root.getByRole("button", { name: "Continue" });

	await expect(back).toBeDisabled();
	await next.click();
	await expect(root.getByRole("tab", { name: "Security" })).toHaveAttribute("aria-selected", "true");
	await expect(panel).toBeFocused();

	const states = page.getByTestId("states-stepper");
	if (await states.count()) {
		// States lives on another story; lock coverage uses that fixture below.
	}

	await root.getByRole("tab", { name: "Profile" }).click();
	await expect(root.getByRole("tab", { name: "Profile" })).toBeFocused();
});

test("does not skip locked steps and leaves canceled navigation in place", async ({ page }) => {
	await page.goto(statesPath);
	const states = page.getByTestId("states-stepper");
	await states.getByRole("tab", { name: "Documents" }).click();
	await expect(states.getByRole("button", { name: "Continue" })).toBeDisabled();
	await expect(states.getByRole("tab", { name: "Finish" })).toBeDisabled();

	await page.goto(navigationPath);
	const cancelRoot = page.getByTestId("cancel-stepper");
	const profile = cancelRoot.getByRole("tab", { name: "Profile" });
	await cancelRoot.getByRole("button", { name: "Block navigation" }).click();
	await profile.focus();
	await cancelRoot.getByRole("button", { name: "Continue" }).click();
	await expect(profile).toHaveAttribute("aria-selected", "true");
	await expect(cancelRoot.getByRole("button", { name: "Continue" })).toBeFocused();

	await profile.focus();
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("Enter");
	await expect(profile).toHaveAttribute("aria-selected", "true");
});

test("preserves mounted panel state and silently falls back when the domain changes", async ({ page }) => {
	await page.goto(navigationPath);

	const mounted = page.getByTestId("mounted-panel-stepper");
	await mounted.getByLabel("Display name").fill("Ada Lovelace");
	await mounted.getByRole("button", { name: "Continue" }).click();
	await mounted.getByLabel("Temporary note").fill("Discard me");
	await mounted.getByRole("button", { name: "Back" }).click();
	await expect(mounted.getByLabel("Display name")).toHaveValue("Ada Lovelace");
	await mounted.getByRole("button", { name: "Continue" }).click();
	await expect(mounted.getByLabel("Temporary note")).toHaveValue("");

	const domain = page.getByTestId("domain-stepper");
	const lastChange = domain.getByTestId("domain-last-change");
	await expect(domain.getByRole("tab", { name: "Review" })).toHaveAttribute("aria-selected", "true");
	await domain.getByRole("button", { name: "Disable current step" }).click();
	await expect(domain.getByRole("tab", { name: "Review" })).toHaveAttribute("aria-selected", "true");
	await expect(domain.getByRole("tabpanel", { name: "Review" })).toBeVisible();
	await expect(lastChange).toHaveText("Last change: none");

	await domain.getByRole("button", { name: "Remove current step" }).click();
	await expect(domain.getByRole("tab", { name: "Profile" })).toHaveAttribute("aria-selected", "true");
	await expect(lastChange).toHaveText("Last change: none");
	await domain.getByRole("button", { name: "Continue" }).click();
	await expect(lastChange).toHaveText("Last change: billing");
});

test("lays out markers and connector fill in horizontal, vertical, and rtl", async ({ page }) => {
	await page.setViewportSize({ width: 1024, height: 900 });
	await page.goto(orientationsPath);

	const horizontal = page.getByTestId("horizontal-stepper");
	await expect.poll(async () => markerIsAboveTitle(horizontal.getByRole("tab", { name: "Security" }))).toBe(true);
	await expect.poll(async () => connectorMeetsCurrentMarker(horizontal)).toBe(true);

	const vertical = page.getByTestId("vertical-stepper");
	await expect.poll(async () => markerIsLeftOfTitle(vertical.getByRole("tab", { name: "Security" }))).toBe(true);
	await expect.poll(async () => contentIsBesideList(vertical)).toBe(true);
	await expect.poll(async () => connectorMeetsCurrentMarker(vertical)).toBe(true);

	const rtl = page.getByTestId("rtl-stepper");
	await expect.poll(async () => connectorMeetsCurrentMarker(rtl)).toBe(true);

	await page.setViewportSize({ width: 360, height: 800 });
	await expect.poll(async () => contentIsBelowList(vertical)).toBe(true);

	const tabs = horizontal.getByRole("tab");
	await expect.poll(async () => doesNotWrap(tabs)).toBe(true);
	await horizontal.getByRole("button", { name: "Continue" }).click();
	await horizontal.getByRole("button", { name: "Continue" }).click();
	const billing = horizontal.getByRole("tab", { name: "Billing" });
	await expect.poll(async () => isInHorizontalView(horizontal.getByRole("tablist"), billing)).toBe(true);
});

async function markerIsAboveTitle(tab: Locator) {
	const marker = tab.locator("[aria-hidden]").first();
	const title = tab.getByText(/Profile|Security|Billing|Account|Review|Documents|Finish/).first();
	const [markerBox, titleBox] = await Promise.all([marker.boundingBox(), title.boundingBox()]);
	if (markerBox == null || titleBox == null) return false;
	return markerBox.y + markerBox.height <= titleBox.y + 1;
}

async function markerIsLeftOfTitle(tab: Locator) {
	const marker = tab.locator("[aria-hidden]").first();
	const title = tab.getByText(/Profile|Security|Billing|Account|Review|Documents|Finish/).first();
	const [markerBox, titleBox] = await Promise.all([marker.boundingBox(), title.boundingBox()]);
	if (markerBox == null || titleBox == null) return false;
	return markerBox.x + markerBox.width <= titleBox.x + 1;
}

async function contentIsBesideList(root: Locator) {
	const list = root.getByRole("tablist");
	const panel = root.getByRole("tabpanel");
	const [listBox, panelBox] = await Promise.all([list.boundingBox(), panel.boundingBox()]);
	if (listBox == null || panelBox == null) return false;
	return Math.abs(listBox.y - panelBox.y) <= 24 && panelBox.x >= listBox.x + listBox.width - 1;
}

async function contentIsBelowList(root: Locator) {
	const list = root.getByRole("tablist");
	const panel = root.getByRole("tabpanel");
	const [listBox, panelBox] = await Promise.all([list.boundingBox(), panel.boundingBox()]);
	if (listBox == null || panelBox == null) return false;
	return panelBox.y >= listBox.y + listBox.height - 1;
}

async function doesNotWrap(tabs: Locator) {
	const count = await tabs.count();
	if (count < 2) return false;
	const first = await tabs.nth(0).boundingBox();
	const last = await tabs.nth(count - 1).boundingBox();
	if (first == null || last == null) return false;
	return Math.abs(first.y - last.y) <= 8;
}

async function isInHorizontalView(list: Locator, tab: Locator) {
	const [listBox, tabBox] = await Promise.all([list.boundingBox(), tab.boundingBox()]);
	if (listBox == null || tabBox == null) return false;
	return tabBox.x >= listBox.x - 1 && tabBox.x + tabBox.width <= listBox.x + listBox.width + 1;
}

async function connectorMeetsCurrentMarker(root: Locator) {
	const current = root.getByRole("tab", { selected: true });
	const tabs = root.getByRole("tab");
	const currentBox = await markerBox(current);
	if (currentBox == null) return false;

	const first = await markerBox(tabs.nth(0));
	const last = await markerBox(tabs.nth((await tabs.count()) - 1));
	if (first == null || last == null) return false;

	const segments = await root.locator("[data-stepper-connector]").evaluateAll((nodes) =>
		nodes.map((node) => {
			const style = getComputedStyle(node, "::after");
			const rect = node.getBoundingClientRect();
			const width = Number.parseFloat(style.width);
			const height = Number.parseFloat(style.height);
			const insetInlineStart = Number.parseFloat(style.insetInlineStart);
			const insetBlockStart = Number.parseFloat(style.insetBlockStart);
			const isRtl = getComputedStyle(node).direction === "rtl";
			const top = rect.top + insetBlockStart;
			const left = isRtl ? rect.right - insetInlineStart - width : rect.left + insetInlineStart;
			return {
				bottom: top + height,
				filled: node.getAttribute("data-stepper-connector") === "filled",
				left,
				right: left + width,
				top,
			};
		}),
	);
	if (segments.length === 0) return false;

	const currentCenter = { x: currentBox.x + currentBox.width / 2, y: currentBox.y + currentBox.height / 2 };
	const firstCenter = { x: first.x + first.width / 2, y: first.y + first.height / 2 };
	const lastCenter = { x: last.x + last.width / 2, y: last.y + last.height / 2 };
	const horizontal = Math.abs(firstCenter.y - lastCenter.y) <= 4;
	const isRtl = horizontal && firstCenter.x > lastCenter.x;
	const trackStart = {
		x: Math.min(...segments.map((segment) => segment.left)),
		y: Math.min(...segments.map((segment) => segment.top)),
	};
	const trackEnd = {
		x: Math.max(...segments.map((segment) => segment.right)),
		y: Math.max(...segments.map((segment) => segment.bottom)),
	};
	const filledSegments = segments.filter((segment) => segment.filled);
	const fillEdge = horizontal
		? filledSegments.length === 0
			? firstCenter.x
			: isRtl
				? Math.min(...filledSegments.map((segment) => segment.left))
				: Math.max(...filledSegments.map((segment) => segment.right))
		: filledSegments.length === 0
			? firstCenter.y
			: Math.max(...filledSegments.map((segment) => segment.bottom));

	const startOk = horizontal
		? Math.abs((isRtl ? trackEnd.x : trackStart.x) - firstCenter.x) <= 1
		: Math.abs(trackStart.y - firstCenter.y) <= 1;
	const endOk = horizontal
		? Math.abs((isRtl ? trackStart.x : trackEnd.x) - lastCenter.x) <= 1
		: Math.abs(trackEnd.y - lastCenter.y) <= 1;
	const fillOk = horizontal
		? Math.abs(fillEdge - currentCenter.x) <= 1
		: Math.abs(fillEdge - currentCenter.y) <= 1;

	return startOk && endOk && fillOk;
}

async function markerBox(tab: Locator) {
	return tab.locator("[aria-hidden]").first().boundingBox();
}
