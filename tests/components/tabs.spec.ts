import { expect, test } from "../playwright";

const storyPath = "/iframe.html?id=components-tabs--orientations&viewMode=story";

for (const orientation of ["horizontal", "vertical"] as const) {
	test(`${orientation} tabs separate keyboard focus from panel selection`, async ({ page }) => {
		await page.goto(storyPath);
		const root = page.getByTestId(`${orientation}-underline-tabs`);
		const overview = root.getByRole("tab", { name: "Overview" });
		const projects = root.getByRole("tab", { name: "Projects" });

		await overview.focus();
		await overview.press(orientation === "vertical" ? "ArrowDown" : "ArrowRight");
		await expect(projects).toBeFocused();
		await expect(overview).toHaveAttribute("aria-selected", "true");
		await expect(root.getByRole("tabpanel", { name: "Overview" })).toBeVisible();

		await projects.press("Enter");
		await expect(projects).toHaveAttribute("aria-selected", "true");
		await expect(overview).toHaveAttribute("aria-selected", "false");
		await expect(root.getByRole("tabpanel", { name: "Projects" })).toBeVisible();
		await expect(root.getByRole("tabpanel", { name: "Overview" })).toBeHidden();
	});
}
