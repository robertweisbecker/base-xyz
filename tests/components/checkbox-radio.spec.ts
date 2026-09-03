import { expect, test, type Page } from "../playwright";

const checkboxStates = "/iframe.html?id=components-checkbox--states&viewMode=story";
const radioStates = "/iframe.html?id=components-radio--states&viewMode=story";

async function computedControlStyle(
	page: Page,
	role: "checkbox" | "radio",
	name: string,
	property: "backgroundColor" | "borderColor" | "transform",
) {
	const cssProperty = property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
	return page.getByRole(role, { name, exact: true }).evaluate((element, styleProperty) => {
		return getComputedStyle(element).getPropertyValue(styleProperty);
	}, cssProperty);
}

async function resolvedControlToken(
	page: Page,
	role: "checkbox" | "radio",
	name: string,
	token: string,
) {
	return page.getByRole(role, { name, exact: true }).evaluate((element, tokenName) => {
		const previousBackground = element.style.backgroundColor;
		element.style.backgroundColor = `var(${tokenName})`;
		const value = getComputedStyle(element).backgroundColor;
		element.style.backgroundColor = previousBackground;
		return value;
	}, token);
}

test("Checkbox label hover and press feedback reaches the control", async ({ page }) => {
	await page.goto(checkboxStates);

	const label = page.getByText("Unchecked", { exact: true });
	const restingBackground = await computedControlStyle(
		page,
		"checkbox",
		"Unchecked",
		"backgroundColor",
	);
	const restingTransform = await computedControlStyle(page, "checkbox", "Unchecked", "transform");

	await label.hover();
	await expect
		.poll(() => computedControlStyle(page, "checkbox", "Unchecked", "backgroundColor"))
		.not.toBe(restingBackground);

	await page.mouse.down();
	await expect
		.poll(() => computedControlStyle(page, "checkbox", "Unchecked", "transform"))
		.not.toBe(restingTransform);
	await page.mouse.up();
});

test("Selected Checkbox and indeterminate controls retain the primary hover fill", async ({
	page,
}) => {
	await page.goto(checkboxStates);

	for (const name of ["Checked", "Indeterminate"]) {
		const primaryHover = await resolvedControlToken(page, "checkbox", name, "--bg-primary-hover");
		await page.getByText(name, { exact: true }).hover();
		await expect
			.poll(() => computedControlStyle(page, "checkbox", name, "backgroundColor"))
			.toBe(primaryHover);
	}
});

test("Checkbox disabled and read-only labels stay visually inert", async ({ page }) => {
	await page.goto(checkboxStates);

	for (const name of ["Disabled", "Read-only"]) {
		const restingBackground = await computedControlStyle(page, "checkbox", name, "backgroundColor");
		const restingTransform = await computedControlStyle(page, "checkbox", name, "transform");
		await page.getByText(name, { exact: true }).hover();
		await expect(computedControlStyle(page, "checkbox", name, "backgroundColor")).resolves.toBe(
			restingBackground,
		);
		await page.mouse.down();
		await expect(computedControlStyle(page, "checkbox", name, "transform")).resolves.toBe(
			restingTransform,
		);
		await page.mouse.up();
	}
});

test("Radio label hover and press feedback reaches the control", async ({ page }) => {
	await page.goto(radioStates);

	const label = page.getByText("Pro", { exact: true });
	const radio = page.getByRole("radio", { name: "Pro", exact: true });
	const restingBackground = await radio.evaluate(
		(element) => getComputedStyle(element).backgroundColor,
	);
	const restingTransform = await radio.evaluate((element) => getComputedStyle(element).transform);

	await label.hover();
	await expect
		.poll(() => radio.evaluate((element) => getComputedStyle(element).backgroundColor))
		.not.toBe(restingBackground);

	await page.mouse.down();
	await expect
		.poll(() => radio.evaluate((element) => getComputedStyle(element).transform))
		.not.toBe(restingTransform);
	await page.mouse.up();
});

test("Selected Radio retains the primary hover fill", async ({ page }) => {
	await page.goto(radioStates);
	const primaryHover = await resolvedControlToken(page, "radio", "Free", "--bg-primary-hover");
	await page.getByText("Free", { exact: true }).hover();
	await expect
		.poll(() => computedControlStyle(page, "radio", "Free", "backgroundColor"))
		.toBe(primaryHover);
});

test("Radio disabled and read-only labels stay visually inert", async ({ page }) => {
	await page.goto(radioStates);

	for (const name of ["Ultra", "Pro+"]) {
		const radio = page.getByRole("radio", { name });
		const restingBackground = await radio.evaluate(
			(element) => getComputedStyle(element).backgroundColor,
		);
		const restingTransform = await radio.evaluate((element) => getComputedStyle(element).transform);
		await page.getByText(name, { exact: true }).hover();
		await expect(
			radio.evaluate((element) => getComputedStyle(element).backgroundColor),
		).resolves.toBe(restingBackground);
		await page.mouse.down();
		await expect(radio.evaluate((element) => getComputedStyle(element).transform)).resolves.toBe(
			restingTransform,
		);
		await page.mouse.up();
	}
});

test("Checkbox and Radio state stories expose their practical state matrices", async ({ page }) => {
	await page.goto(checkboxStates);
	await expect(page.getByRole("checkbox")).toHaveCount(13);
	await expect(page.getByRole("checkbox", { name: "Disabled", exact: true })).toBeDisabled();
	await expect(page.getByRole("checkbox", { name: "Invalid", exact: true })).toHaveAttribute(
		"aria-invalid",
		"true",
	);

	await page.goto(radioStates);
	await expect(page.getByRole("radio")).toHaveCount(10);
	await expect(page.getByRole("radio", { name: "Ultra", exact: true })).toBeDisabled();
	await expect(page.getByRole("radio", { name: "Pro+", exact: true })).toHaveAttribute(
		"data-readonly",
		"",
	);
});
