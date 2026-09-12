import { expect, test, type Page } from "../playwright";

test.use({ permissions: ["clipboard-read", "clipboard-write"] });

const copyButtonStory = "/iframe.html?id=components-copy-button--examples&viewMode=story";

async function expectFeedback(page: Page, status: "success" | "error") {
	const feedback = page.getByRole("dialog");
	await expect(feedback).toBeVisible();
	await expect(feedback).toHaveAttribute("data-status", status);
	await expect(feedback).toHaveAccessibleName(/\S/);
	await expect(feedback).toContainText(/\S/);
}

test("labeled control copies its value and announces success", async ({ page }) => {
	await page.goto(copyButtonStory);
	await page.getByRole("button", { name: "Copy install command", exact: true }).click();
	await expect
		.poll(() => page.evaluate(() => navigator.clipboard.readText()))
		.toBe("pnpm add @base-ui/react");
	await expectFeedback(page, "success");
});

test("icon-only control keeps its accessible name and copies its value", async ({ page }) => {
	await page.goto(copyButtonStory);
	await page.getByRole("button", { name: "Copy project ID", exact: true }).click();
	await expect
		.poll(() => page.evaluate(() => navigator.clipboard.readText()))
		.toBe("project_4f28ac");
	await expectFeedback(page, "success");
});

test("Breadcrumbs.Copy copies the current breadcrumb link", async ({ page }) => {
	await page.goto("/iframe.html?id=components-breadcrumbs--playground&viewMode=story");
	await page.getByRole("button", { name: "Copy breadcrumb link", exact: true }).click();
	await expect
		.poll(() => page.evaluate(() => navigator.clipboard.readText()))
		.toBe("/docs/getting-started");
	await expectFeedback(page, "success");
});

test("Breadcrumbs.Clipboard retains its supported copy behavior", async ({ page }) => {
	await page.goto("/iframe.html?id=components-breadcrumbs--examples&viewMode=story");
	await page.getByRole("button", { name: "Copy breadcrumb link", exact: true }).click();
	await expect
		.poll(() => page.evaluate(() => navigator.clipboard.readText()))
		.toBe("/docs/getting-started");
	await expectFeedback(page, "success");
});

test("a prevented caller click leaves the clipboard unchanged without success feedback", async ({
	page,
}) => {
	await page.goto(copyButtonStory);
	await page.evaluate(() => navigator.clipboard.writeText("Keep this clipboard value"));
	const writeAttempts = await page.evaluateHandle(() => {
		const values: string[] = [];
		const writeText = navigator.clipboard.writeText.bind(navigator.clipboard);
		Object.defineProperty(navigator.clipboard, "writeText", {
			configurable: true,
			value: (value: string) => {
				values.push(value);
				return writeText(value);
			},
		});
		return values;
	});
	await page.getByRole("button", { name: "Copy restricted token", exact: true }).click();
	await expect
		.poll(() => page.evaluate(() => navigator.clipboard.readText()))
		.toBe("Keep this clipboard value");
	expect(await writeAttempts.jsonValue()).toEqual([]);
	await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("a rejected clipboard write announces failure", async ({ page }) => {
	await page.addInitScript(() => {
		Object.defineProperty(navigator.clipboard, "writeText", {
			configurable: true,
			value: () => Promise.reject(new DOMException("Clipboard access denied", "NotAllowedError")),
		});
	});
	await page.goto(copyButtonStory);
	await page.getByRole("button", { name: "Copy install command", exact: true }).click();
	await expectFeedback(page, "error");
});
