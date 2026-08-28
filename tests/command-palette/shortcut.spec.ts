import { expect, test } from "../playwright";

const storyUrl = "/iframe.html?id=components-command-palette--shortcut-arbitration&viewMode=story";

test("two-root ownership, callback stability, and cleanup handoff", async ({ page }) => {
	await page.goto(storyUrl);
	await expect(page.getByTestId("command-rerender")).toBeVisible();

	await page.getByTestId("command-rerender").click();
	await expect(page.getByTestId("rerender-count")).toHaveAttribute("data-value", "1");

	await page.keyboard.press("Control+K");
	await expect(page.getByRole("dialog")).toBeVisible();
	await expect(page.getByTestId("first-open-count")).toHaveAttribute("data-value", "0");
	await expect(page.getByTestId("second-open-count")).toHaveAttribute("data-value", "1");

	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog")).toHaveCount(0);
	await page.getByTestId("command-unmount-second").click();

	await page.keyboard.press("Control+K");
	await expect(page.getByRole("dialog")).toBeVisible();
	await expect(page.getByTestId("first-open-count")).toHaveAttribute("data-value", "1");
	await expect(page.getByTestId("second-open-count")).toHaveAttribute("data-value", "1");
});

test("held-key repeat does not toggle twice", async ({ page }) => {
	await page.goto(storyUrl);
	await expect(page.getByTestId("command-rerender")).toBeVisible();
	await page.keyboard.down("Control");
	try {
		await page.keyboard.down("k");
		await expect(page.getByRole("dialog")).toBeVisible();

		await page.keyboard.down("k");
		await expect(page.getByRole("dialog")).toBeVisible();
		await expect(page.getByTestId("second-open-count")).toHaveAttribute("data-value", "1");
	} finally {
		await page.keyboard.up("k");
		await page.keyboard.up("Control");
	}
});

test("an already-prevented focused event does not invoke a palette", async ({ page }) => {
	await page.goto(storyUrl);
	const input = page.getByTestId("command-reserved-input");
	await input.focus();
	await input.press("Control+K");

	await expect(page.getByTestId("first-open-count")).toHaveAttribute("data-value", "0");
	await expect(page.getByTestId("second-open-count")).toHaveAttribute("data-value", "0");
	await expect(page.getByRole("dialog")).toHaveCount(0);
});
