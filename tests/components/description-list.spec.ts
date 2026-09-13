import { expect, test, type Locator } from "../playwright";

const playgroundPath = "/iframe.html?id=components-description-list--playground&viewMode=story";
const orientationsPath = "/iframe.html?id=components-description-list--orientations&viewMode=story";
const examplesPath = "/iframe.html?id=components-description-list--examples&viewMode=story";

type Box = { x: number; y: number; width: number; height: number; right: number; bottom: number };

async function getBox(locator: Locator): Promise<Box> {
	const result = await locator.boundingBox();
	if (!result) throw new Error("Expected fixture element to have layout geometry");
	return { ...result, right: result.x + result.width, bottom: result.y + result.height };
}

async function setWrapperWidth(wrapper: Locator, width: string) {
	await wrapper.evaluate((node, nextWidth) => {
		if (!(node instanceof HTMLElement)) throw new Error("Expected an HTML wrapper fixture");
		node.style.width = nextWidth;
	}, width);
}

function overlap(a: Box, b: Box) {
	return a.x < b.right && b.x < a.right && a.y < b.bottom && b.y < a.bottom;
}

function sharesRow(a: Box, b: Box) {
	return a.y < b.bottom && b.y < a.bottom;
}

test("renders native groups and caller supplied contextual action names", async ({ page }) => {
	await page.goto(playgroundPath);

	const root = page.locator("dl").first();
	const item = root.locator(":scope > div").first();
	await expect(item.locator(":scope > dt")).toHaveCount(1);
	await expect(item.locator(":scope > dd")).toHaveCount(2);
	await expect(root.getByRole("link")).toHaveAccessibleName("Change workspace name");

	await page.goto(examplesPath);
	const examples = page.getByTestId("description-examples");
	await expect(examples.getByText("workspace_identifier_01J8F5Z3NQ7P3C2L9V8K6M4A1B")).toBeVisible();
	await expect(examples.getByText("Pro", { exact: true })).toBeVisible();
});

test("preserves multiple terms and values without overlapping rendered children", async ({
	page,
}) => {
	await page.goto(examplesPath);

	const group = page.getByTestId("description-multiple-group");
	await expect(group.locator(":scope > dt")).toHaveCount(2);
	await expect(group.locator(":scope > dd")).toHaveCount(3);
	await expect(group.locator(":scope > dt").nth(0)).toHaveText("Primary region");
	await expect(group.locator(":scope > dd").nth(1)).toHaveText("US East");

	const children = group.locator(":scope > dt, :scope > dd");
	const boxes = await Promise.all(
		Array.from({ length: await children.count() }, (_, index) => getBox(children.nth(index))),
	);
	for (let first = 0; first < boxes.length; first += 1) {
		for (let second = first + 1; second < boxes.length; second += 1) {
			expect(overlap(boxes[first], boxes[second])).toBe(false);
		}
	}
});

test("horizontal layout follows wrapper width and keeps actions with the label row", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1200, height: 800 });
	await page.goto(orientationsPath);

	const wrapper = page.getByTestId("description-horizontal");
	const item = wrapper.locator(":scope dl > div").first();
	const label = item.locator(":scope > dt");
	const value = item.locator(":scope > dd").first();
	const action = item.locator(":scope > dd").nth(1);

	await setWrapperWidth(wrapper, "25rem");
	const wideLabel = await getBox(label);
	const wideValue = await getBox(value);
	const wideAction = await getBox(action);
	expect(wideValue.x).toBeGreaterThan(wideLabel.x);
	expect(wideAction.x).toBeGreaterThan(wideValue.x);
	expect(sharesRow(wideLabel, wideValue)).toBe(true);
	expect(sharesRow(wideLabel, wideAction)).toBe(true);

	await setWrapperWidth(wrapper, "18rem");
	const narrowLabel = await getBox(label);
	const narrowValue = await getBox(value);
	const narrowAction = await getBox(action);
	expect(narrowValue.y).toBeGreaterThanOrEqual(narrowLabel.bottom - 1);
	expect(sharesRow(narrowLabel, narrowAction)).toBe(true);
});

test("grid changes from distinct columns to equal full rows at the wrapper threshold", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1200, height: 800 });
	await page.goto(orientationsPath);

	const wrapper = page.getByTestId("description-grid");
	const items = wrapper.locator(":scope dl > div");

	await setWrapperWidth(wrapper, "40rem");
	const wideFirst = await getBox(items.nth(0));
	const wideSecond = await getBox(items.nth(1));
	expect(wideSecond.x).toBeGreaterThan(wideFirst.x);

	await setWrapperWidth(wrapper, "18rem");
	const narrow = await Promise.all([0, 1, 2].map((index) => getBox(items.nth(index))));
	for (const item of narrow.slice(1)) {
		expect(Math.abs(item.x - narrow[0].x)).toBeLessThan(1);
		expect(Math.abs(item.width - narrow[0].width)).toBeLessThan(1);
	}
	for (let index = 1; index < narrow.length; index += 1) {
		expect(narrow[index].y).toBeGreaterThanOrEqual(narrow[index - 1].bottom - 1);
	}
});

test("vertical layout stays stacked while labels and actions share their first row", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1200, height: 800 });
	await page.goto(orientationsPath);

	const wrapper = page.getByTestId("description-vertical");
	const item = wrapper.locator(":scope dl > div").first();
	const label = item.locator(":scope > dt");
	const value = item.locator(":scope > dd").first();
	const action = item.locator(":scope > dd").nth(1);

	for (const width of ["40rem", "18rem"]) {
		await setWrapperWidth(wrapper, width);
		const labelBox = await getBox(label);
		const valueBox = await getBox(value);
		const actionBox = await getBox(action);
		expect(valueBox.y).toBeGreaterThanOrEqual(labelBox.bottom - 1);
		expect(sharesRow(labelBox, actionBox)).toBe(true);
	}
});

test("root margins and override precedence stay on the root", async ({ page }) => {
	await page.goto(examplesPath);
	const root = page.getByTestId("description-examples");

	for (const prop of ["m", "mx", "my", "mt", "mb", "ms", "me"]) {
		await expect(root).not.toHaveAttribute(prop);
	}
	await expect
		.poll(() => root.evaluate((node) => getComputedStyle(node).marginBlockStart))
		.not.toBe("0px");
	const xstyleRoot = page.getByTestId("description-xstyle-override");
	const nativeRoot = page.getByTestId("description-native-override");
	await expect
		.poll(() => xstyleRoot.evaluate((node) => getComputedStyle(node).rowGap))
		.toBe("20px");
	await expect.poll(() => nativeRoot.evaluate((node) => getComputedStyle(node).rowGap)).toBe("2px");
});
