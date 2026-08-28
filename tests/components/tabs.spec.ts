import { expect, test, type Locator } from "../playwright";

const storyPath = "/iframe.html?id=components-tabs--orientations&viewMode=story";

test("keeps the underline indicator on the selected tab's bordered edge", async ({ page }) => {
	await page.goto(storyPath);

	const horizontalRoot = page.getByTestId("horizontal-underline-tabs");
	const verticalRoot = page.getByTestId("vertical-underline-tabs");

	await expectIndicatorOnBorderedEdge(horizontalRoot, "horizontal", 0);
	await horizontalRoot.getByRole("tab").nth(1).click();
	await expectIndicatorOnBorderedEdge(horizontalRoot, "horizontal", 1);

	await expectIndicatorOnBorderedEdge(verticalRoot, "vertical", 0);
	await verticalRoot.getByRole("tab").nth(1).click();
	await expectIndicatorOnBorderedEdge(verticalRoot, "vertical", 1);
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
	selectedIndex: number,
) {
	const list = root.getByRole("tablist");
	const tab = root.getByRole("tab").nth(selectedIndex);
	const indicator = list.locator(":scope > span").last();

	await expect(tab).toHaveAttribute("aria-selected", "true");
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
