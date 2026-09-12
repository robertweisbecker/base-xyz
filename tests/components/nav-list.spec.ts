import { expect, test } from "../playwright";

const story = (name: string) =>
	`/iframe.html?id=components-navigation-nav-list--${name}&viewMode=story`;

test("links preserve current, disabled, and cancelled navigation", async ({ page }) => {
	await page.goto(story("states"));
	const overview = page.getByRole("link", { name: "Overview" });
	await expect(overview).toHaveAttribute("aria-current", "page");
	await expect(page.locator("a").filter({ hasText: "Unavailable" })).toHaveAttribute(
		"aria-disabled",
		"true",
	);
	await expect(page.locator("a").filter({ hasText: "Unavailable" })).not.toHaveAttribute("href");
	await page.getByLabel("Cancel activation").check();
	await overview.click();
	await expect(page.getByLabel("Click callbacks")).toHaveText("1");
	await expect(page.getByLabel("Navigation callbacks")).toHaveText("0");
	await page.getByLabel("Cancel activation").uncheck();
	await overview.click();
	await expect(page.getByLabel("Navigation callbacks")).toHaveText("1");
	await expect(page).toHaveURL(/#overview$/);
});

test("expanded collapsible and uncontrolled drilldown preserve disclosure callbacks", async ({
	page,
}) => {
	await page.goto(story("states"));
	const deploy = page.getByRole("button", { name: "Open deployment navigation" });
	await deploy.press("Enter");
	await expect(page.getByRole("link", { name: "Deployments" })).toBeVisible();
	await expect(page.getByLabel("Click callbacks")).toHaveText("1");
	await expect(page.getByLabel("Navigation callbacks")).toHaveText("0");
	await page.getByRole("button", { name: "Open account settings" }).click();
	await expect(page.getByRole("link", { name: "Members" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Back to Account" })).toBeFocused();
	await page.getByRole("button", { name: "Back to Account" }).click();
	await expect(page.getByRole("button", { name: "Open account settings" })).toBeFocused();
	await expect(page.getByLabel("Click callbacks")).toHaveText("2");
	await expect(page.getByLabel("Navigation callbacks")).toHaveText("0");
});

test("controlled drilldown waits for the supplied value and restores focus and scroll", async ({
	page,
}) => {
	await page.goto(story("drilldown"));
	await page.getByLabel("Defer navigation update").check();
	const opener = page.getByRole("button", { name: "Project settings", exact: true });
	await opener.scrollIntoViewIfNeeded();
	const scroller = page.getByTestId("account-scroll");
	const previousScroll = await scroller.evaluate((element) => element.scrollTop);
	expect(previousScroll).toBeGreaterThan(0);
	await opener.click();
	await expect(page.getByLabel("Requested navigation")).toHaveText("project forward 1");
	await expect(opener).toBeVisible();
	await expect(page.getByRole("link", { name: "Members" })).toHaveCount(0);
	await page.getByRole("button", { name: "Apply requested navigation" }).click();
	const back = page.getByRole("button", { name: "Back to Account navigation" });
	await expect(back).toBeFocused();
	await page.getByLabel("Defer navigation update").uncheck();
	await back.click();
	await expect(opener).toBeFocused();
	await expect(page.getByLabel("Requested navigation")).toHaveText("account back 2");
	await expect
		.poll(() => scroller.evaluate((element) => element.scrollTop))
		.toBeGreaterThan(previousScroll - 2);
	await expect
		.poll(() => scroller.evaluate((element) => element.scrollTop))
		.toBeLessThan(previousScroll + 2);
});

test("uncontrolled drilldown updates without a supplied value", async ({ page }) => {
	await page.goto(story("drilldown"));
	await page.getByLabel("Controlled navigation").uncheck();
	await page.getByLabel("Defer navigation update").check();
	await page.getByRole("button", { name: "Project settings", exact: true }).click();
	await expect(page.getByRole("link", { name: "Members" })).toBeVisible();
	await expect(page.getByLabel("Supplied navigation")).toHaveText("account");
});

test("icon popover history resets on reopen without changing outer controlled navigation", async ({
	page,
}) => {
	await page.goto(story("drilldown"));
	await page.getByLabel("Icon presentation").check();
	const opener = page.getByRole("button", { name: "Project settings", exact: true });
	await opener.click();
	await page.getByRole("button", { name: "Security settings", exact: true }).click();
	await expect(page.getByRole("link", { name: "Single sign-on" })).toBeVisible();
	await page.keyboard.press("Escape");
	await opener.click();
	await expect(page.getByRole("link", { name: "Members" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Single sign-on" })).toHaveCount(0);
	await expect(page.getByLabel("Supplied navigation")).toHaveText("account");
	await expect(page.getByLabel("Requested navigation")).toHaveText("account forward 0");
});

test("expanded Drawer remains open on disclosure and cancellation, then closes on navigation", async ({
	page,
}) => {
	await page.goto(story("in-drawer"));
	await page.getByRole("button", { name: "Open navigation" }).click();
	await page.getByRole("button", { name: "Deploy", exact: true }).click();
	await expect(page.getByRole("navigation", { name: "Drawer navigation" })).toBeVisible();
	await page.getByRole("link", { name: "Cancelled link" }).click();
	await expect(page.getByRole("navigation", { name: "Drawer navigation" })).toBeVisible();
	await page.getByRole("link", { name: "Deployments" }).click();
	await expect(page.getByRole("navigation", { name: "Drawer navigation" })).toHaveCount(0);
});

for (const presentation of ["expanded", "icon"] as const) {
	for (const [name, destination] of [
		["Open deployment navigation", "Deployments"],
		["Open account settings", "Members"],
	]) {
		test(`${presentation} ${name} preserves names, cancellation, disabled state, and activation`, async ({
			page,
		}) => {
			await page.goto(story("states"));
			if (presentation === "icon") await page.getByLabel("Icon presentation").check();
			const trigger = page.getByRole("button", { name, exact: true });
			await page.getByLabel("Cancel activation").check();
			await trigger.press("Enter");
			await expect(page.getByLabel("Click callbacks")).toHaveText("1");
			await expect(page.getByRole("link", { name: destination, exact: true })).toHaveCount(0);
			await expect(page.getByLabel("Navigation callbacks")).toHaveText("0");
			await page.getByLabel("Cancel activation").uncheck();
			await page.getByLabel("Disable triggers").check();
			await expect(trigger).toBeDisabled();
			await trigger.dispatchEvent("click");
			await expect(page.getByLabel("Click callbacks")).toHaveText("1");
			await expect(page.getByRole("link", { name: destination, exact: true })).toHaveCount(0);
			await page.getByLabel("Disable triggers").uncheck();
			await trigger.press("Space");
			await expect(page.getByRole("link", { name: destination, exact: true })).toBeVisible();
			await expect(page.getByLabel("Click callbacks")).toHaveText("2");
			await expect(page.getByLabel("Navigation callbacks")).toHaveText("0");
			if (presentation === "icon") {
				await expect(trigger).toHaveAttribute("aria-expanded", "true");
				await page.keyboard.press("Escape");
				await expect(trigger).toBeFocused();
				await expect(trigger).toHaveAttribute("aria-expanded", "false");
			}
		});
	}
}

test("panel replacement and removal keep only current navigation across presentations", async ({
	page,
}) => {
	await page.goto(story("states"));
	await page.getByLabel("Icon presentation").check();
	const trigger = page.getByRole("button", { name: "Open deployment navigation" });
	await trigger.click();
	await expect(page.getByRole("link", { name: "Deployments" })).toBeVisible();
	await page.keyboard.press("Escape");
	await page.getByLabel("Available navigation").selectOption("workers");
	await trigger.click();
	await expect(page.getByRole("link", { name: "Workers" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Deployments" })).toHaveCount(0);
	await page.keyboard.press("Escape");
	await page.getByLabel("Available navigation").selectOption("none");
	await trigger.click();
	await expect(page.getByRole("link", { name: "Workers" })).toHaveCount(0);
	await page.keyboard.press("Escape");
	await page.getByLabel("Icon presentation").uncheck();
	await trigger.click();
	await expect(page.getByRole("link", { name: /Workers|Deployments/ })).toHaveCount(0);
	await page.getByLabel("Available navigation").selectOption("deployments");
	await expect(page.getByRole("link", { name: "Deployments" })).toBeVisible();
	await page.getByLabel("Icon presentation").check();
	await trigger.click();
	await expect(page.getByRole("link", { name: "Deployments" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Workers" })).toHaveCount(0);
});

for (const [triggerName, linkName] of [
	["Deploy", "Deployments"],
	["Project settings", "Members"],
]) {
	test(`icon Drawer stays open for ${triggerName} disclosure and closes on child navigation`, async ({
		page,
	}) => {
		await page.goto(story("in-drawer"));
		await page.getByLabel("Icon presentation").check();
		await page.getByRole("button", { name: "Open navigation" }).click();
		await page.getByRole("button", { name: triggerName, exact: true }).click();
		await expect(page.getByRole("navigation", { name: "Drawer navigation" })).toBeVisible();
		await page.getByRole("link", { name: linkName, exact: true }).click();
		await expect(page.getByRole("navigation", { name: "Drawer navigation" })).toHaveCount(0);
	});
}
