import { expect, test, type Page } from "@playwright/test";

const storyPath = "/iframe.html?id=design-system-theme-provider--contract&viewMode=story";
const checkboxStatesStoryPath =
	"/iframe.html?id=components-checkbox--states&viewMode=story&globals=mode:light;theme:mp";
const defaultPrimaryButtonStoryPath =
	"/iframe.html?id=components-button--playground&viewMode=story&globals=mode:light;theme:default";
const mpPrimaryButtonStoryPath =
	"/iframe.html?id=components-button--playground&viewMode=story&globals=mode:light;theme:mp";
const multipleRootsStoryPath = "/iframe.html?id=design-system-theme-provider--multiple-roots&viewMode=story";
const statusRampsStoryPath = "/iframe.html?id=design-system-theme-provider--status-ramps&viewMode=story";
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

test("custom render host merges semantics, refs, events, and theme state without a wrapper", async ({ page }) => {
	await page.goto(storyPath);
	const host = page.getByTestId("custom-theme-host");

	await expect(host).toBeVisible();
	await expect(page.getByRole("main", { name: "Custom theme host" })).toBeVisible();
	expect(await host.evaluate((element) => element.tagName)).toBe("MAIN");
	await expect(host).toHaveAttribute("aria-label", "Custom theme host");
	await expect(host).toHaveAttribute("data-theme", "mp");
	await expect(host).toHaveAttribute("data-mode", "light");
	await expect(host).toHaveCSS("color-scheme", "light");
	await expect(host).not.toHaveCSS("display", "contents");
	await expect(host.locator(":scope > [data-testid='custom-theme-content']")).toHaveCount(1);
	await expect(page.getByTestId("merged-refs")).toHaveText("true");
	const hostColor = await host.evaluate((element) => getComputedStyle(element).color);
	const warningColor = await page
		.getByTestId("warning-reference")
		.evaluate((element) => getComputedStyle(element).backgroundColor);
	expect(hostColor).toBe(warningColor);

	await host.click();
	await expect(page.getByTestId("merged-events")).toHaveText("1:1");
	await expect(host.getByTestId("theme-context").first()).toHaveAttribute("data-theme", "mp");
	await expect(host.getByTestId("theme-context").first()).toHaveAttribute("data-resolved-mode", "light");
});

test("semantic hosts preserve accessible structured content", async ({ page }) => {
	await page.goto(storyPath);
	const main = page.getByRole("main", { name: "Custom theme host" });
	const region = main.getByRole("region", { name: "Theme semantics" });

	await expect(region.getByRole("heading", { level: 2, name: "Theme semantics" })).toBeVisible();
	await expect(region.getByRole("list")).toBeVisible();
	await expect(region.getByRole("listitem")).toHaveCount(2);
	await expect(region.getByRole("table", { name: "Theme values" })).toBeVisible();
	await expect(region.getByRole("columnheader")).toHaveCount(2);
	await expect(region.getByRole("textbox", { name: "Theme label" })).toHaveValue("MP");
	await expect(main.getByRole("region", { name: "Nested default theme" })).toBeVisible();

	const fallback = page.getByTestId("fallback-theme-host");
	await expect(fallback).not.toHaveAttribute("role");
});

test("fallback host inherits the root theme and remains a normal div", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "dark" });
	await page.goto(storyPath);
	const host = page.getByTestId("fallback-theme-host");

	expect(await host.evaluate((element) => element.tagName)).toBe("DIV");
	await expect(host).toHaveAttribute("data-theme", "default");
	await expect(host).toHaveAttribute("data-mode", "system");
	await expect(host).toHaveCSS("color-scheme", "dark");
	await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
	await expect(host).not.toHaveCSS("display", "contents");
	await expect(host.getByTestId("theme-context")).toHaveAttribute("data-resolved-mode", "dark");
	await expect(page.getByTestId("outer-theme-context")).toHaveAttribute("data-resolved-mode", "dark");

	await page.emulateMedia({ colorScheme: "light" });
	await expect(host).toHaveCSS("color-scheme", "light");
	await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
	await expect(page.getByTestId("outer-theme-context")).toHaveAttribute("data-resolved-mode", "light");
});

test("nested MP overrides stay scoped away from the default sibling", async ({ page }) => {
	await page.goto(storyPath);
	const customAccent = await page
		.getByTestId("custom-accent")
		.evaluate((element) => getComputedStyle(element).backgroundColor);
	const fallbackAccent = await page
		.getByTestId("fallback-accent")
		.evaluate((element) => getComputedStyle(element).backgroundColor);
	const nestedDefaultAccent = await page
		.getByTestId("nested-default-accent")
		.evaluate((element) => getComputedStyle(element).backgroundColor);
	const defaultLightAccent = await page
		.getByTestId("default-light-accent")
		.evaluate((element) => getComputedStyle(element).backgroundColor);
	const customError = await page
		.getByTestId("custom-error-s1")
		.evaluate((element) => getComputedStyle(element).backgroundColor);
	const nestedDefaultError = await page
		.getByTestId("nested-default-error-s1")
		.evaluate((element) => getComputedStyle(element).backgroundColor);
	const defaultLightError = await page
		.getByTestId("default-light-error-s1")
		.evaluate((element) => getComputedStyle(element).backgroundColor);
	const bodyPortalAccent = await page
		.getByTestId("body-portal-accent")
		.evaluate((element) => getComputedStyle(element).backgroundColor);
	const nestedPortalAccent = await page
		.getByTestId("nested-portal-accent")
		.evaluate((element) => getComputedStyle(element).backgroundColor);

	expect(customAccent).not.toBe(fallbackAccent);
	expect(nestedDefaultAccent).toBe(defaultLightAccent);
	expect(customError).not.toBe(defaultLightError);
	expect(nestedDefaultError).toBe(defaultLightError);
	expect(bodyPortalAccent).toBe(fallbackAccent);
	expect(nestedPortalAccent).toBe(customAccent);
	await expect(page.getByTestId("nested-default-host")).toHaveAttribute("data-mode", "light");
	await expect(page.getByTestId("nested-default-host").getByTestId("theme-context")).toHaveAttribute(
		"data-theme",
		"default",
	);
	await expect(page.locator("html")).toHaveAttribute("data-theme", "default");
	await expect(page.locator("html")).toHaveAttribute("data-mode", "system");
});

test("consumer CSS custom-property overrides still affect token-backed spacing", async ({ page }) => {
	await page.goto(storyPath);
	const content = page.getByTestId("custom-theme-content");

	await expect(content).toHaveCSS("gap", "8px");
	await page.addStyleTag({ content: '[data-testid="custom-theme-host"] { --space-2: 19px; }' });
	await expect(content).toHaveCSS("gap", "19px");
});

test("document theme ownership survives independent roots unmounting out of order", async ({ page }) => {
	await page.goto(multipleRootsStoryPath);
	await expect(page.getByTestId("first-independent-root")).toBeVisible();
	await expect(page.getByTestId("second-independent-root")).toBeVisible();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "mp");
	await expect(page.locator("html")).toHaveAttribute("data-mode", "light");

	await page.getByRole("button", { name: "Unmount first root" }).click();
	await expect(page.getByTestId("first-independent-root")).toHaveCount(0);
	await expect(page.getByTestId("second-independent-root")).toBeVisible();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "mp");
	await expect(page.locator("html")).toHaveAttribute("data-mode", "light");

	await page.getByRole("button", { name: "Unmount second root" }).click();
	await expect(page.getByTestId("second-independent-root")).toHaveCount(0);
	await expect(page.locator("html")).toHaveAttribute("data-theme", "default");
	await expect(page.locator("html")).toHaveAttribute("data-mode", "system");
});

test("MP status ramps use the supplied light-mode colors", async ({ page }) => {
	await page.goto(statusRampsStoryPath);

	const ramps = {
		error: ["rgb(255, 225, 214)", "rgb(255, 225, 214)", "rgb(255, 117, 87)", "rgb(204, 51, 43)", "rgb(204, 51, 43)"],
		success: ["rgb(242, 248, 248)", "rgb(207, 244, 240)", "rgb(9, 214, 204)", "rgb(0, 203, 193)", "rgb(0, 115, 108)"],
		warning: ["rgb(248, 247, 245)", "rgb(255, 235, 190)", "rgb(255, 191, 44)", "rgb(241, 182, 50)", "rgb(218, 107, 22)"],
	} as const;
	const steps = ["s1", "c1", "p1", "p2", "t1"] as const;

	for (const [ramp, lightColors] of Object.entries(ramps)) {
		for (const [index, step] of steps.entries()) {
			const selector = `[data-ramp="${ramp}"] [data-step="${step}"]`;
			await expect(page.getByTestId("mp-light-ramps").locator(selector)).toHaveCSS(
				"background-color",
				lightColors[index],
			);
		}
	}
});

test("MP error semantics style invalid checkboxes", async ({ page }) => {
	await page.goto(checkboxStatesStoryPath);

	await expect(page.getByRole("checkbox", { name: "Invalid", exact: true })).toHaveCSS(
		"border-color",
		"rgb(204, 51, 43)",
	);
	await expect(page.getByRole("checkbox", { name: "Invalid, checked", exact: true })).toHaveCSS(
		"background-color",
		"rgb(255, 117, 87)",
	);
});

test("MP loads and applies the Apercu font family", async ({ page }) => {
	await page.goto(defaultPrimaryButtonStoryPath);
	const defaultFontFamily = await page.locator("body").evaluate((element) => getComputedStyle(element).fontFamily);
	expect(defaultFontFamily.startsWith("Apercu")).toBe(false);

	await page.goto(checkboxStatesStoryPath);

	const loadedFaces = await page.evaluate(async () => ({
		bold: (await document.fonts.load('700 16px "Apercu"')).length,
		boldItalic: (await document.fonts.load('italic 700 16px "Apercu"')).length,
		medium: (await document.fonts.load('500 16px "Apercu"')).length,
		mediumItalic: (await document.fonts.load('italic 500 16px "Apercu"')).length,
		regular: (await document.fonts.load('400 16px "Apercu"')).length,
	}));
	const fontFamily = await page.locator("body").evaluate((element) => getComputedStyle(element).fontFamily);

	expect(loadedFaces).toEqual({ bold: 1, boldItalic: 1, medium: 1, mediumItalic: 1, regular: 1 });
	expect(fontFamily.startsWith("Apercu")).toBe(true);
});

test("MP removes primary button resting and pressed shadows", async ({ page }) => {
	const zeroShadow = "rgba(0, 0, 0, 0) 0px 0px 0px 0px";

	await page.goto(defaultPrimaryButtonStoryPath);
	const defaultButton = page.getByRole("button", { name: "Create project" });
	const defaultShadow = await defaultButton.evaluate((element) => getComputedStyle(element).boxShadow);
	await defaultButton.evaluate((element) => element.setAttribute("data-pressed", ""));

	expect(defaultShadow).not.toBe("none");
	await expect
		.poll(() => defaultButton.evaluate((element) => getComputedStyle(element).boxShadow))
		.not.toBe(defaultShadow);
	await expect(defaultButton).not.toHaveCSS("box-shadow", "none");

	await page.goto(mpPrimaryButtonStoryPath);
	const mpButton = page.getByRole("button", { name: "Create project" });
	await expect(mpButton).toHaveCSS("box-shadow", zeroShadow);
	await mpButton.evaluate((element) => element.setAttribute("data-pressed", ""));
	await expect(mpButton).toHaveCSS("box-shadow", zeroShadow);
});
