import { expect, test, type Page } from "@playwright/test";

const storyUrl = "/iframe.html?id=components-command-palette--shortcut-arbitration&viewMode=story";
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

test("two-root ownership, callback stability, and cleanup handoff", async ({ page }) => {
	await page.goto(storyUrl);
	await expect(page.getByRole("button", { name: "Rerender callbacks" })).toBeVisible();

	await page.getByRole("button", { name: "Rerender callbacks" }).click();
	await expect(page.getByTestId("rerender-count")).toHaveText("Rerenders: 1");

	await page.keyboard.press("Control+K");
	await expect(page.getByRole("dialog", { name: "Second command palette" })).toBeVisible();
	await expect(page.getByTestId("first-open-count")).toHaveText("First opens: 0");
	await expect(page.getByTestId("second-open-count")).toHaveText("Second opens: 1");

	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog", { name: "Second command palette" })).toBeHidden();
	await page.getByRole("button", { name: "Unmount second palette" }).click();

	await page.keyboard.press("Control+K");
	await expect(page.getByRole("dialog", { name: "First command palette" })).toBeVisible();
	await expect(page.getByTestId("first-open-count")).toHaveText("First opens: 1");
	await expect(page.getByTestId("second-open-count")).toHaveText("Second opens: 1");
});

test("held-key repeat does not toggle twice", async ({ page }) => {
	await page.goto(storyUrl);
	await expect(page.getByRole("button", { name: "Rerender callbacks" })).toBeVisible();
	await page.keyboard.down("Control");
	try {
		await page.keyboard.down("k");
		await expect(page.getByRole("dialog", { name: "Second command palette" })).toBeVisible();

		await page.keyboard.down("k");
		await expect(page.getByRole("dialog", { name: "Second command palette" })).toBeVisible();
		await expect(page.getByTestId("second-open-count")).toHaveText("Second opens: 1");
	} finally {
		await page.keyboard.up("k");
		await page.keyboard.up("Control");
	}
});

test("an already-prevented focused event does not invoke a palette", async ({ page }) => {
	await page.goto(storyUrl);
	const input = page.getByRole("textbox", { name: "Reserved shortcut input" });
	await input.focus();
	await input.press("Control+K");

	await expect(page.getByTestId("first-open-count")).toHaveText("First opens: 0");
	await expect(page.getByTestId("second-open-count")).toHaveText("Second opens: 0");
	await expect(page.getByRole("dialog", { name: "First command palette" })).toBeHidden();
	await expect(page.getByRole("dialog", { name: "Second command palette" })).toBeHidden();
});
