import { expect, test, type Locator, type Page } from "../playwright";

const storyPath = "/iframe.html?id=blocks-copy-button--examples&viewMode=story";

async function clickAndExpectCopy(page: Page, button: Locator, value: string) {
	await button.click();
	await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(value);
	const successToast = page.getByRole("dialog").filter({ hasText: "Copied!" }).first();
	await expect(successToast).toBeVisible();
}

test("labeled and icon-only buttons copy their values and show success feedback", async ({
	page,
}) => {
	await page.goto(storyPath);
	await page.context().grantPermissions(["clipboard-read", "clipboard-write"], {
		origin: new URL(page.url()).origin,
	});

	const labeledButton = page.getByRole("button", { name: "Copy install command" });
	const iconOnlyButton = page.getByRole("button", { name: "Copy project ID" });
	const successToasts = page.getByRole("dialog").filter({ hasText: "Copied!" });
	await expect(labeledButton).toBeVisible();
	await expect(iconOnlyButton).toBeVisible();

	await clickAndExpectCopy(page, labeledButton, "pnpm add @base-ui/react");
	await expect(successToasts).toHaveCount(1);
	await clickAndExpectCopy(page, iconOnlyButton, "project_4f28ac");
	await expect(successToasts).toHaveCount(2);
});
