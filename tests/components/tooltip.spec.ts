import { expect, test } from "../playwright";

const sharedGroupPath = "/iframe.html?id=components-tooltip--shared-group&viewMode=story";
const childPopoversPath =
	"/iframe.html?id=components-navigation-sidebar--child-popovers&viewMode=story";
const endSidebarPath =
	"/iframe.html?id=components-navigation-sidebar--playground&viewMode=story&args=defaultCollapsed:true;side:end";

test("shares one tooltip across grouped icon buttons", async ({ page }) => {
	await page.goto(sharedGroupPath);

	const notifications = page.getByRole("button", { name: "Notifications" });
	const information = page.getByRole("button", { name: "Information" });
	const popup = page.locator('[data-slot="tooltip-popup"]');

	await notifications.focus();
	await expect(popup).toBeVisible();
	await expect(popup.locator("[data-current]")).toContainText("Review notifications");
	await expect(notifications).toHaveAccessibleName("Notifications");

	await information.focus();
	await expect(page.locator('[data-slot="tooltip-popup"]')).toHaveCount(1);
	await expect(popup.locator("[data-current]")).toContainText("Read product information");
	await expect(information).toHaveAccessibleName("Information");

	await information.click();
	await expect(popup).toBeHidden();
});

test("keeps collapsed child navigation on its popover interaction", async ({ page }) => {
	await page.goto(childPopoversPath);

	const navigation = page.getByRole("navigation", { name: "Collapsed primary" });
	const deploy = navigation.getByRole("button", { name: "Deploy" });

	await deploy.focus();
	await page.waitForTimeout(300);
	await expect(page.locator('[data-slot="tooltip-popup"]')).toHaveCount(0);

	await deploy.click();
	await expect(page.getByRole("link", { name: "Deployments" })).toBeVisible();
});

test("positions collapsed end-side navigation tooltips toward the content", async ({ page }) => {
	await page.goto(endSidebarPath);

	const navigation = page.getByRole("navigation", { name: "Primary" });
	await navigation.getByRole("link", { name: "Overview" }).focus();

	await expect(page.locator('[data-slot="tooltip-popup"]')).toHaveAttribute("data-side", "left");
});

test("removes shared tooltip motion when reduced motion is requested", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto(sharedGroupPath);
	await page.getByRole("button", { name: "Notifications" }).focus();

	const popup = page.locator('[data-slot="tooltip-popup"]');
	await expect(popup).toBeVisible();
	await expect
		.poll(async () =>
			Number.parseFloat(
				await popup.evaluate((element) => getComputedStyle(element).transitionDuration),
			),
		)
		.toBeLessThanOrEqual(0.00001);
});
