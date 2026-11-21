import type { createAgent } from "@ui-sdk/react/agent";
import { expect, test, type Page } from "../playwright";

const story = "/iframe.html?id=experimental-emoji-picker--";

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		Object.assign(globalThis, { __UI_SDK_STRICT__: true });
	});
});

test("search enters a single grid tab stop and every arrow follows rows", async ({ page }) => {
	await page.goto(`${story}playground&viewMode=story`);
	const search = page.getByRole("searchbox", { name: "Search emoji" });
	const cells = page.getByRole("gridcell");
	await search.focus();
	await search.press("ArrowDown");
	await expect(cells.nth(0)).toBeFocused();
	await expect(page.locator('[role="gridcell"][tabindex="0"]')).toHaveCount(1);
	await page.keyboard.press("ArrowRight");
	await expect(cells.nth(1)).toBeFocused();
	await page.keyboard.press("ArrowDown");
	await expect(cells.nth(8)).toBeFocused();
	await page.keyboard.press("ArrowLeft");
	await expect(cells.nth(7)).toBeFocused();
	await page.keyboard.press("ArrowUp");
	await expect(cells.nth(0)).toBeFocused();
	await expect(page.getByRole("gridcell", { selected: true })).toHaveCount(0);
	await page.keyboard.press("ArrowLeft");
	await expect(cells.nth(0)).toBeFocused();
	await page.keyboard.press("End");
	await expect(cells.nth(6)).toBeFocused();
	await page.keyboard.press("Home");
	await expect(cells.nth(0)).toBeFocused();
	await page.keyboard.press("Control+End");
	await expect(cells.last()).toBeFocused();
	await page.keyboard.press("Control+Home");
	await expect(cells.first()).toBeFocused();
	await page.keyboard.press("Escape");
	await expect(search).toBeFocused();
	await search.press("Tab");
	await expect(cells.first()).toBeFocused();
	await page.keyboard.press("Tab");
	await expect(cells.first()).not.toBeFocused();
});

test("search filters by keyword, handles empty results and a short final row", async ({ page }) => {
	await page.goto(`${story}playground&viewMode=story`);
	const search = page.getByRole("searchbox", { name: "Search emoji" });
	await expect(search).toBeVisible();
	const searchBounds = await search.boundingBox();
	await search.fill("face");
	expect(await search.boundingBox()).toEqual(searchBounds);
	const cells = page.getByRole("gridcell");
	await search.press("ArrowDown");
	await page.keyboard.press("End");
	await page.keyboard.press("ArrowDown");
	await expect(cells.last()).toBeFocused();
	await search.fill("not-an-emoji");
	await search.press("ArrowDown");
	await expect(cells).toHaveCount(0);
	await expect(search).toBeFocused();
	await expect(page.getByText("No emoji found", { exact: true })).toBeVisible();
	expect(await search.boundingBox()).toEqual(searchBounds);
	await page.getByRole("button", { name: "Clear search" }).click();
	await expect(search).toHaveValue("");
	await expect(search).toBeFocused();
	expect(await search.boundingBox()).toEqual(searchBounds);
	await search.fill("not-an-emoji");
	await search.press("Escape");
	await expect(search).toHaveValue("");
	await expect(cells.first()).toBeVisible();
	await search.fill("launch");
	await expect(cells).toHaveCount(1);
	expect(await search.boundingBox()).toEqual(searchBounds);
	await expect(cells).toHaveAccessibleName("Rocket");
	await search.press("ArrowDown");
	await expect(cells).toBeFocused();
});

test("Enter, Space and click select and announce without selecting on focus", async ({ page }) => {
	await page.goto(`${story}playground&viewMode=story`);
	const search = page.getByRole("searchbox", { name: "Search emoji" });
	await search.fill("rocket");
	await search.press("ArrowDown");
	const rocket = page.getByRole("gridcell", { name: "Rocket" });
	await expect(rocket).toHaveAttribute("aria-selected", "false");
	await page.keyboard.press("Enter");
	await expect(rocket).toHaveAttribute("aria-selected", "true");
	await expect(page.getByRole("status")).toHaveText("Rocket selected");
	const repeatedAnnouncement = page.getByRole("status").evaluate(
		(region) =>
			new Promise<boolean>((resolve) => {
				const observer = new MutationObserver(() => {
					observer.disconnect();
					clearTimeout(timeout);
					resolve(true);
				});
				const timeout = setTimeout(() => {
					observer.disconnect();
					resolve(false);
				}, 2000);
				observer.observe(region, { childList: true, subtree: true, characterData: true });
			}),
	);
	await page.keyboard.press("Enter");
	expect(await repeatedAnnouncement, "repeated selection is announced again").toBe(true);

	await page.keyboard.press("Escape");
	await search.fill("coffee");
	await search.press("ArrowDown");
	await page.keyboard.press("Space");
	await expect(page.getByRole("gridcell", { name: "Hot beverage" })).toHaveAttribute(
		"aria-selected",
		"true",
	);
	await expect(page.getByRole("status")).toHaveText("Hot beverage selected");
	await search.fill("heart");
	await page.getByRole("gridcell", { name: "Red heart", exact: true }).click();
	await expect(page.getByRole("status")).toHaveText("Red heart selected");
	await expect(page.getByRole("gridcell", { selected: true })).toHaveCount(1);
});

test("horizontal navigation follows RTL and cancellation prevents selection", async ({ page }) => {
	await page.goto(`${story}right-to-left&viewMode=story`);
	await page.getByRole("searchbox").press("ArrowDown");
	await page.keyboard.press("ArrowLeft");
	await expect(page.getByRole("gridcell").nth(1)).toBeFocused();
	await page.keyboard.press("ArrowRight");
	await expect(page.getByRole("gridcell").first()).toBeFocused();
	await page.goto(`${story}cancellation&viewMode=story`);
	await page.getByRole("gridcell", { name: "Rocket" }).click();
	await expect(page.getByRole("gridcell", { selected: true })).toHaveCount(0);
	await expect(page.getByRole("status")).toBeEmpty();
});

type Agent = ReturnType<typeof createAgent>;
type ToolResult = Awaited<ReturnType<Agent["act"]>> | Awaited<ReturnType<Agent["query"]>>;
type Tool = { name: string; execute: (input: object) => Promise<ToolResult> };
declare global {
	interface Window {
		emojiTools: Map<string, Tool>;
	}
}
async function callTool(page: Page, name: string, input: object = {}) {
	return page.evaluate(
		async ({ name, input }) => {
			const tool = window.emojiTools.get(name);
			if (!tool) throw new Error(`Missing WebMCP tool: ${name}`);
			return tool.execute(input);
		},
		{ name, input },
	);
}

test("WebMCP discovers named controls and chooses from discovered results", async ({ page }) => {
	await page.addInitScript(() => {
		window.emojiTools = new Map();
		Object.defineProperty(document, "modelContext", {
			configurable: true,
			value: {
				registerTool: async (tool: Tool) => {
					window.emojiTools.set(tool.name, tool);
				},
				unregisterTool: (name: string) => {
					window.emojiTools.delete(name);
				},
			},
		});
	});
	await page.goto(`${story}playground&viewMode=story`);
	await expect(page.getByRole("gridcell").first()).toBeVisible();
	const snapshot = await callTool(page, "snapshot");
	if (!Array.isArray(snapshot)) throw new Error("Expected agent components");
	for (const entry of snapshot) expect(entry.label).toBeTruthy();
	expect(snapshot).toEqual(
		expect.arrayContaining([
			expect.objectContaining({ label: "Emoji picker", actions: ["choose"] }),
			expect.objectContaining({ label: "Search emoji" }),
		]),
	);
	const searchResult = await callTool(page, "act", {
		steps: [{ ref: "Search emoji", action: "setValue", args: ["launch"] }],
	});
	expect(searchResult).toMatchObject({ ok: true });
	await expect(page.getByRole("searchbox")).toHaveValue("launch");
	await expect(page.getByRole("gridcell")).toHaveCount(1);
	const results = await callTool(page, "query", { within: "Emoji picker" });
	expect(results).toEqual(
		expect.arrayContaining([expect.objectContaining({ items: expect.any(Array) })]),
	);
	if (!Array.isArray(results)) throw new Error("Expected discovered choices");
	const choice = results.flatMap((result) => result.items ?? [])[0];
	expect(choice).toBeTruthy();
	const chosen = await callTool(page, "act", {
		steps: [{ ref: "Emoji picker", action: "choose", args: [choice.label ?? choice.value] }],
	});
	expect(chosen).toMatchObject({ ok: true });
	await expect(page.getByRole("gridcell", { name: "Rocket" })).toHaveAttribute(
		"aria-selected",
		"true",
	);
	await expect(page.getByRole("status")).toHaveText("Rocket selected");
	// An agent filtering away the focused cell must not strand focus on the page.
	await page.getByRole("searchbox").press("ArrowDown");
	await callTool(page, "act", {
		steps: [{ ref: "Search emoji", action: "setValue", args: ["no match"] }],
	});
	await expect(page.getByRole("searchbox")).toBeFocused();
});
