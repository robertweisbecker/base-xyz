import { expect, test, type Page } from "@playwright/test";

const storyPath = "/iframe.html?id=experimental-math-expression-field--examples&viewMode=story";
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

test("keeps the raw expression while typing and evaluates on blur", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Amount" });
	await expect(input).toHaveValue("12");

	await input.fill("");
	await input.pressSequentially("100 / 5");
	await expect(input).toHaveValue("100 / 5");
	await input.blur();
	await expect(input).toHaveValue("20");

	await input.fill("-(2.5 + 1.5) * 2");
	await input.blur();
	await expect(input).toHaveValue("-8");

	await input.fill("0.1 + 0.2");
	await input.blur();
	await expect(input).toHaveValue("0.3");
});

test("keeps invalid expressions visible with an error", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Amount" });

	await input.fill("2 +");
	await input.blur();
	await expect(input).toHaveValue("2 +");
	await expect(input).toHaveAttribute("aria-invalid", "true");
	await expect(page.getByText("Enter a valid math expression")).toBeVisible();

	await input.fill("1 / 0");
	await expect(input).not.toHaveAttribute("aria-invalid", "true");
	await input.blur();
	await expect(input).toHaveValue("1 / 0");
	await expect(input).toHaveAttribute("aria-invalid", "true");
});

test("reverts the draft on Escape", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Amount" });
	await input.fill("5 + 5");
	await input.press("Escape");
	await expect(input).toHaveValue("12");
	await expect(input).not.toHaveAttribute("aria-invalid", "true");
});

test("commits on Enter before the form submits", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Quantity" });
	await input.fill("6 * 7");
	await input.press("Enter");
	await expect(input).toHaveValue("42");
	await expect(page.getByText("Not submitted")).toBeVisible();

	await input.press("Enter");
	await expect(page.getByText("Submitted: 42")).toBeVisible();
});

test("clamps committed values to min and max", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Clamped amount" });
	await input.fill("2 * 100");
	await input.blur();
	await expect(input).toHaveValue("50");

	await input.fill("-10");
	await input.blur();
	await expect(input).toHaveValue("0");
});

test("blocks committing an empty draft when required", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Required amount" });
	await input.fill("");
	await input.blur();
	await expect(input).toHaveValue("");
	await expect(input).toHaveAttribute("aria-invalid", "true");
	await expect(page.getByText("Enter a value")).toBeVisible();
});

test("preserves the draft across controlled rerenders and skips unchanged commits", async ({ page }) => {
	await page.goto(storyPath);
	const input = page.getByRole("textbox", { name: "Controlled amount" });
	const tick = page.getByText(/^Tick: /);
	const commits = page.getByText(/^Commits: /);
	await expect(input).toHaveValue("10");

	await input.fill("");
	await input.pressSequentially("1+2");
	const initialTick = (await tick.textContent()) ?? "";
	await expect(tick).not.toHaveText(initialTick);
	await expect(input).toHaveValue("1+2");

	await input.blur();
	await expect(input).toHaveValue("3");
	await expect(commits).toHaveText("Commits: 1");

	await page.getByRole("button", { name: "Set to 42" }).click();
	await expect(input).toHaveValue("42");
	await expect(commits).toHaveText("Commits: 1");

	await input.fill("42 + 0");
	await input.blur();
	await expect(input).toHaveValue("42");
	await expect(commits).toHaveText("Commits: 1");
});

test("keeps disabled and read-only fields inert", async ({ page }) => {
	await page.goto(storyPath);
	await expect(page.getByRole("textbox", { name: "Disabled" })).toBeDisabled();
	const readOnly = page.getByRole("textbox", { name: "Read-only" });
	await expect(readOnly).toHaveJSProperty("readOnly", true);
	await expect(readOnly).toHaveValue("20");
});
