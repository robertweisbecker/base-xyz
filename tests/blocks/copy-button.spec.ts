import { expect, test, type Locator, type Page } from "../playwright";

const storyPath = "/iframe.html?id=blocks-copy-button--examples&viewMode=story";

async function expectCopied(button: Locator) {
	const icons = button.locator('span[aria-hidden="true"] > span');
	await expect(icons).toHaveCount(2);
	await expect(icons.nth(0)).toHaveCSS("opacity", "0");
	await expect(icons.nth(1)).toHaveCSS("opacity", "1");
}

async function expectNotCopied(button: Locator) {
	const icons = button.locator('span[aria-hidden="true"] > span');
	await expect(icons.nth(0)).toHaveCSS("opacity", "1");
	await expect(icons.nth(1)).toHaveCSS("opacity", "0");
}

async function clickAndReset(page: Page, button: Locator) {
	await button.click();
	await expectCopied(button);
	await expect(page.getByText("Copied!", { exact: true })).toBeVisible();

	await page.clock.runFor(1600);
	await expectNotCopied(button);
}

test("labeled and icon-only buttons enter copied state on first click and reset after success", async ({
	page,
}) => {
	await page.context().grantPermissions(["clipboard-write"], {
		origin: "http://127.0.0.1:6204",
	});
	await page.clock.install();
	await page.goto(storyPath);

	const labeledButton = page.getByRole("button", { name: "Copy install command" });
	const iconOnlyButton = page.getByRole("button", { name: "Copy project ID" });
	await expect(labeledButton).toBeVisible();
	await expect(iconOnlyButton).toBeVisible();
	await expectNotCopied(labeledButton);
	await expectNotCopied(iconOnlyButton);

	await clickAndReset(page, labeledButton);
	await clickAndReset(page, iconOnlyButton);
});
