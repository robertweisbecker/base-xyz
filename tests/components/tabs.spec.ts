import { expect, test, type Locator, type Page } from "@playwright/test";

const storyPath = "/iframe.html?id=components-tabs--orientations&viewMode=story";
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

test("positions the underline indicator on the bordered edge", async ({ page }) => {
	await page.goto(storyPath);

	const horizontalRoot = page.getByTestId("horizontal-underline-tabs");
	const verticalRoot = page.getByTestId("vertical-underline-tabs");

	await expectIndicatorOnBorderedEdge(horizontalRoot, "horizontal", "Overview");
	const inactiveHorizontalTab = horizontalRoot.getByRole("tab", { name: "Projects" });
	await inactiveHorizontalTab.hover();
	await expect(inactiveHorizontalTab).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
	await horizontalRoot.getByRole("tab", { name: "Projects" }).click();
	await expectIndicatorOnBorderedEdge(horizontalRoot, "horizontal", "Projects");

	await expectIndicatorOnBorderedEdge(verticalRoot, "vertical", "Overview");
	await verticalRoot.getByRole("tab", { name: "Projects" }).click();
	await expectIndicatorOnBorderedEdge(verticalRoot, "vertical", "Projects");
});

test("removes indicator movement when reduced motion is requested", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto(storyPath);

	const indicator = page
		.getByTestId("horizontal-underline-tabs")
		.getByRole("tablist")
		.locator(":scope > span")
		.last();

	await expect
		.poll(async () =>
			Number.parseFloat(
				await indicator.evaluate((element) => getComputedStyle(element).transitionDuration),
			),
		)
		.toBeLessThanOrEqual(0.00001);
});

async function expectIndicatorOnBorderedEdge(
	root: Locator,
	orientation: "horizontal" | "vertical",
	name: string,
) {
	const list = root.getByRole("tablist");
	const tab = root.getByRole("tab", { name });
	const indicator = list.locator(":scope > span").last();

	await expect(tab).toHaveAttribute("data-active", "");
	await expect
		.poll(async () => {
			const [listBox, indicatorBox] = await Promise.all([
				list.boundingBox(),
				indicator.boundingBox(),
			]);

			if (listBox === null || indicatorBox === null) return false;

			if (orientation === "horizontal") {
				return (
					Math.abs(indicatorBox.y + indicatorBox.height - (listBox.y + listBox.height)) <= 0.25 &&
					Math.abs(indicatorBox.height - 3) <= 0.25
				);
			}

			return (
				Math.abs(indicatorBox.x + indicatorBox.width - (listBox.x + listBox.width)) <= 0.25 &&
				Math.abs(indicatorBox.width - 3) <= 0.25
			);
		})
		.toBe(true);
}
