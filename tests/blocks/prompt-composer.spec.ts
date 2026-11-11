import { expect, test, type Locator } from "../playwright";

const storyPath = "/iframe.html?id=blocks-ai-prompt-composer--examples&viewMode=story";

async function controlsAreBelow(composer: Locator) {
	const input = await composer.getByRole("textbox").boundingBox();
	const send = await composer.getByRole("button", { name: "Send message" }).boundingBox();
	return input !== null && send !== null && send.y >= input.y + input.height;
}

test("adapts to wrapping, newlines, and available width without losing the draft or focus", async ({
	page,
}) => {
	await page.goto(storyPath);
	const composer = page.getByTestId("adaptive-prompt-composer");
	const input = composer.getByRole("textbox");
	await input.fill("Hello");
	await expect.poll(() => controlsAreBelow(composer)).toBe(false);

	const wrapped = "Please review the component changes and explain their impact. ".repeat(3);
	await input.fill(wrapped);
	await expect.poll(() => controlsAreBelow(composer)).toBe(true);
	await expect(input).toBeFocused();
	await expect(input).toHaveValue(wrapped);

	await input.fill("Hello");
	await expect.poll(() => controlsAreBelow(composer)).toBe(false);
	await input.press("Shift+Enter");
	await expect(input).toHaveValue("Hello\n");
	await expect.poll(() => controlsAreBelow(composer)).toBe(true);

	await input.fill("Hello");
	await page.setViewportSize({ width: 320, height: 800 });
	await expect.poll(() => controlsAreBelow(composer)).toBe(true);
	await expect(input).toHaveValue("Hello");
	await page.setViewportSize({ width: 1280, height: 800 });
	await expect.poll(() => controlsAreBelow(composer)).toBe(false);

	await input.press("Enter");
	await expect(composer.getByText("Submitted: Hello", { exact: true })).toBeVisible();
	await expect(input).toHaveValue("");
	await expect(composer.getByRole("button", { name: "Send message" })).toBeDisabled();

	const stacked = page.getByTestId("stacked-prompt-composer");
	await stacked.getByRole("textbox").fill("Hello");
	await expect.poll(() => controlsAreBelow(stacked)).toBe(true);
});

for (const [width, rows] of [
	[1280, 12],
	[390, 6],
]) {
	test(`grows to ${rows} rows at ${width}px, then scrolls and shrinks back`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto(storyPath);
		const composer = page.getByTestId("growing-prompt-composer");
		const input = composer.getByRole("textbox");
		await input.fill("");
		const initialHeight = await input.evaluate((element) => element.clientHeight);
		await input.fill(Array.from({ length: rows + 5 }, () => "Prompt line").join("\n"));
		await expect
			.poll(() =>
				input.evaluate((element) => {
					const css = getComputedStyle(element);
					return Math.round(
						(element.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom)) /
							parseFloat(css.lineHeight),
					);
				}),
			)
			.toBe(rows);
		await expect
			.poll(() => input.evaluate((element) => element.scrollHeight > element.clientHeight))
			.toBe(true);
		await expect(composer.getByRole("button", { name: "Send message" })).toBeVisible();
		await input.fill("");
		await expect.poll(() => input.evaluate((element) => element.clientHeight)).toBe(initialHeight);
	});
}
