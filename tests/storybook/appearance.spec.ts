import { expect, test } from "@playwright/test";

// Hold back the application bundles: the backdrop must be correct before React
// or a story module can run. Empty modules intentionally prevent app rendering.
for (const [name, path, colorScheme] of [
	["system dark preview", "/iframe.html?id=components-button--playground", "dark"],
	[
		"explicit dark preview",
		"/iframe.html?id=components-button--playground&globals=appearance:dark",
		"light",
	],
	["system dark manager", "/?path=/story/components-button--playground", "dark"],
] as const) {
	test(`${name} paints a dark background before bundles load`, async ({ page }) => {
		await page.emulateMedia({ colorScheme });
		await page.route(/\.m?js(?:\?|$)/, (route) =>
			route.fulfill({ contentType: "text/javascript", body: "" }),
		);
		await page.goto(path);
		const surfaces = page.locator("body, .sb-preparing-story, .sb-preparing-docs");
		for (const surface of await surfaces.all()) {
			const background = await surface.evaluate((element) => {
				const context = document.createElement("canvas").getContext("2d")!;
				// Start with the browser canvas, then composite ancestor backgrounds.
				// Transparent loading layers over a dark page are valid too.
				const canvasColor = document.createElement("span");
				canvasColor.style.color = "Canvas";
				document.documentElement.append(canvasColor);
				context.fillStyle = getComputedStyle(canvasColor).color;
				context.fillRect(0, 0, 1, 1);
				canvasColor.remove();
				const ancestors: Element[] = [];
				for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement)
					ancestors.unshift(ancestor);
				for (const ancestor of ancestors) {
					context.fillStyle = getComputedStyle(ancestor).backgroundColor;
					context.fillRect(0, 0, 1, 1);
				}
				return [...context.getImageData(0, 0, 1, 1).data];
			});
			expect(Math.max(...background.slice(0, 3)), "dark page backdrop").toBeLessThan(64);
		}
	});
}
