import { expect, test } from "../playwright";

const storyPath =
	"/iframe.html?id=foundations-commit-safe-refs-verification--playground&viewMode=story";

test("remeasures scroll fade when axis and content identity change", async ({ page }) => {
	await page.goto(storyPath);

	const target = page.getByTestId("scroll-fade-target");
	await expect(target).toHaveAttribute("data-overflowing", "true");

	await page.getByTestId("scroll-fade-toggle-axis").click();
	await expect(target).toHaveAttribute("data-axis", "x");
	await expect(target).toHaveAttribute("data-overflowing", "false");

	await page.getByTestId("scroll-fade-toggle-content").click();
	await expect(target).toHaveAttribute("data-overflowing", "true");
});

test("updates textarea constraints after mount and cleans up when disabled", async ({ page }) => {
	await page.goto(storyPath);

	const textarea = page.getByTestId("textarea-target");
	await expect(textarea).not.toHaveAttribute("style", /height/);

	await page.getByTestId("textarea-enable").click();
	await expect(textarea).toHaveAttribute("style", /height/);
	const enabledHeight = await textarea.evaluate((element) => element.clientHeight);

	await page.getByTestId("textarea-increase-min").click();
	await expect
		.poll(() => textarea.evaluate((element) => element.clientHeight))
		.toBeGreaterThan(enabledHeight);

	await page.getByTestId("textarea-set-max").click();
	await textarea.fill("First line\nSecond line\nThird line\nFourth line");
	await expect(textarea).toHaveCSS("overflow-y", "auto");

	await page.getByTestId("textarea-disable").click();
	await expect(textarea).not.toHaveAttribute("style", /height/);
	await expect(textarea).not.toHaveAttribute("style", /overflow-y/);
});

test("preserves InlineEdit lifetime modes and latest delayed callbacks", async ({ page }) => {
	await page.goto(storyPath);

	const uncontrolled = page.getByTestId("inline-uncontrolled-root");
	await page.getByTestId("inline-uncontrolled-prop").click();
	await uncontrolled.getByRole("button", { name: "Edit uncontrolled value" }).click();
	await expect(uncontrolled).toHaveAttribute("data-editing", "");

	const controlled = page.getByTestId("inline-controlled-root");
	await controlled.getByRole("button", { name: "Edit controlled value" }).click();
	await controlled.getByRole("button", { name: "Save" }).click();
	await expect(controlled).toHaveAttribute("data-pending", "");
	await page.getByTestId("inline-replace-callback").click();
	await expect(page.getByTestId("inline-last-callback")).toHaveText("2:confirm", {
		timeout: 30_000,
	});

	await page.getByTestId("inline-controlled-prop").click();
	await controlled.getByRole("button", { name: "Edit controlled value" }).click();
	await expect(controlled).not.toHaveAttribute("data-editing", "");
});

test("does not settle an unmounted InlineEdit confirmation", async ({ page }) => {
	await page.goto(storyPath);

	const controlled = page.getByTestId("inline-controlled-root");
	await controlled.getByRole("button", { name: "Edit controlled value" }).click();
	const callbackBeforeConfirm = page.getByTestId("inline-last-callback");
	await expect(callbackBeforeConfirm).toHaveText("1:edit");
	await controlled.getByRole("button", { name: "Save" }).click();
	await expect(controlled).toHaveAttribute("data-pending", "");
	await page.getByTestId("inline-unmount").click();
	await expect(controlled).toHaveCount(0);
	await expect(page.getByTestId("inline-confirmation-settled")).toHaveText("settled", {
		timeout: 30_000,
	});
	await expect(callbackBeforeConfirm).toHaveText("1:edit");
});
