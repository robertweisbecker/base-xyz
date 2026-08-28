import { expect, test as base } from "@playwright/test";

export { expect } from "@playwright/test";
export type { Locator, Page } from "@playwright/test";

export const test = base.extend<{ browserDiagnostics: void }>({
	browserDiagnostics: [
		async ({ page }, use) => {
			const errors: string[] = [];
			page.on("console", (message) => {
				if (message.type() === "error") errors.push(`console: ${message.text()}`);
			});
			page.on("pageerror", (error) => {
				errors.push(`page: ${error.message}`);
			});

			await use();

			expect(errors, "browser diagnostics").toEqual([]);
		},
		{ auto: true },
	],
});
