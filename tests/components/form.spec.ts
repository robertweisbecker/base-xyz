import { expect, test, type Locator } from "../playwright";

const storyPath = (story: string) => `/iframe.html?id=components-${story}&viewMode=story`;

async function expectSubmittedValues(
	output: Locator,
	values: Record<string, string | boolean | string[]>,
) {
	await expect.poll(async () => JSON.parse((await output.textContent()) || "null")).toEqual(values);
}

test("composed fields retain labels, descriptions, errors, values, and action focus", async ({
	page,
}) => {
	await page.goto(storyPath("field--composition"));
	const slug = page.getByRole("textbox", { name: "Project slug", exact: true });
	const description = page.getByRole("textbox", { name: "Project description", exact: true });
	const website = page.getByRole("textbox", { name: "Project website", exact: true });
	const alerts = page.getByRole("switch", { name: "Deployment alerts", exact: true });
	const submit = page.getByRole("button", { name: "Save project settings", exact: true });

	await page.getByText("Project slug", { exact: true }).click();
	await expect(slug).toBeFocused();
	await slug.fill("shared-project");
	await slug.press("Tab");
	await expect(description).toBeFocused();
	await expect(description).toHaveAccessibleDescription(/Visible to workspace members/);
	await expect(description).toHaveAccessibleDescription(/Write one or two sentences/);

	await submit.click();
	await expect(description).toBeFocused();
	await expect(description).toHaveAttribute("aria-invalid", "true");
	await expect(description).toHaveAccessibleDescription(/Enter a project description/);
	await description.fill("Shared components for the workspace.");
	await page.getByRole("button", { name: "Clear", exact: true }).click();
	await expect(website).toHaveValue("");
	await expect(website).toBeFocused();
	await page.getByText("Deployment alerts", { exact: true }).click();
	await expect(alerts).not.toBeChecked();
	await submit.click();
	await expectSubmittedValues(
		page.getByRole("status", { name: "Submitted project settings", exact: true }),
		{
			slug: "shared-project",
			description: "Shared components for the workspace.",
			website: "",
			alerts: false,
		},
	);
});

test("controlled textarea validity and submission follow the consumer's accepted value", async ({
	page,
}) => {
	await page.goto(storyPath("textarea--controlled"));
	const input = page.getByRole("textbox", { name: "Release summary", exact: true });
	const validity = page.getByRole("status", { name: "Validated update", exact: true });
	const accepted = "Ready for release.";

	await input.fill(`   ${accepted}`);
	await expect(input).toHaveValue(accepted);
	await expect(validity).toHaveText(accepted);
	await input.fill("x".repeat(121));
	await expect(input).toHaveValue(accepted);
	await expect(validity).toHaveText(accepted);
	await page.getByRole("button", { name: "Save update", exact: true }).click();
	await expect(page.getByRole("status", { name: "Submitted update", exact: true })).toHaveText(
		accepted,
	);
});

test("field timing overrides the form and invalid submissions focus the first invalid control", async ({
	page,
}) => {
	await page.goto(storyPath("form--validation"));
	const email = page.getByRole("textbox", { name: "Contact email", exact: true });
	const confirmation = page.getByRole("textbox", { name: "Confirm email", exact: true });
	const submit = page.getByRole("button", { name: "Save contact details", exact: true });
	const output = page.getByRole("status", { name: "Submitted contact details", exact: true });

	await email.fill("invalid-email");
	await confirmation.fill("other@example.com");
	await expect(email).not.toHaveAttribute("aria-invalid", "true");
	await email.focus();
	await expect(confirmation).toHaveAttribute("aria-invalid", "true");
	await expect(confirmation).toHaveAccessibleDescription(/email addresses must match/);
	await submit.click();
	await expect(email).toBeFocused();
	await expect(output).toHaveText("");

	await email.fill("");
	await submit.click();
	await expect(email).toBeFocused();
	await expect(email).toHaveAccessibleDescription(/Enter your contact email/);
	await expect(output).toHaveText("");
	await email.fill("alex@example.com");
	await confirmation.fill("alex@example.com");
	await submit.click();
	await expectSubmittedValues(output, {
		email: "alex@example.com",
		confirmation: "alex@example.com",
	});
});

test("external errors clear on correction and Form actions validate without submitting", async ({
	page,
}) => {
	await page.goto(storyPath("form--external-errors"));
	const input = page.getByRole("textbox", { name: "Workspace address", exact: true });
	const output = page.getByRole("status", { name: "Submitted workspace", exact: true });

	await page.getByRole("button", { name: "Show external error", exact: true }).click();
	await expect(input).toHaveAttribute("aria-invalid", "true");
	await expect(input).toHaveAccessibleDescription(/workspace address is already in use/);
	await input.fill("new-team");
	await expect(input).not.toHaveAttribute("aria-invalid", "true");
	await expect(input).not.toHaveAccessibleDescription(/workspace address is already in use/);
	await input.fill("");
	await page.getByRole("button", { name: "Validate form", exact: true }).click();
	await expect(input).toHaveAttribute("aria-invalid", "true");
	await expect(output).toHaveText("");
	await input.fill("new-team");
	await page.getByRole("button", { name: "Validate workspace", exact: true }).click();
	await expect(input).not.toHaveAttribute("aria-invalid", "true");
	await expect(output).toHaveText("");
	await page.getByRole("button", { name: "Save workspace", exact: true }).click();
	await expectSubmittedValues(output, { workspace: "new-team" });
});

test("Field actions and matched errors expose custom validity through public state", async ({
	page,
}) => {
	await page.goto(storyPath("field--validation"));
	const input = page.getByRole("textbox", { name: "Deployment slug", exact: true });
	const validity = page.getByRole("status", { name: "Slug validity", exact: true });

	await page.getByRole("button", { name: "Validate slug", exact: true }).click();
	await expect(validity).toHaveText("Needs correction");
	await expect(input).toHaveAccessibleDescription(/Enter a deployment slug/);
	await input.fill("Bad Slug");
	await expect(input).toHaveAccessibleDescription(/“Bad Slug” does not follow the slug format/);
	await input.fill("valid-slug");
	await expect(validity).toHaveText("Ready to use");
	await expect(input).not.toHaveAttribute("aria-invalid", "true");
	await page.getByRole("button", { name: "Edit slug", exact: true }).click();
	await expect(input).toBeFocused();
});

test("standalone controls preserve native labeling and successful FormData values", async ({
	page,
}) => {
	await page.goto(storyPath("form--native-submission"));
	const name = page.getByRole("textbox", { name: "Your name", exact: true });
	const replicas = page.getByRole("textbox", { name: "Preview replicas", exact: true });
	const updates = page.getByRole("checkbox", { name: "Send product updates", exact: true });
	const submit = page.getByRole("button", { name: "Submit native controls", exact: true });
	const output = page.getByRole("status", { name: "Native control values", exact: true });

	await page.getByText("Your name", { exact: true }).click();
	await expect(name).toBeFocused();
	await name.fill("Alex");
	await page.getByRole("textbox", { name: "Notes", exact: true }).fill("First line\nSecond line");
	await page.getByText("Preview replicas", { exact: true }).click();
	await expect(replicas).toBeFocused();
	await replicas.fill("3");
	await replicas.press("Tab");
	await page.getByText("Send product updates", { exact: true }).click();
	await expect(updates).toBeChecked();
	await submit.click();
	await expectSubmittedValues(output, {
		name: "Alex",
		notes: "First line\nSecond line",
		replicas: "3",
		updates: "subscribed",
	});
	await updates.press("Space");
	await expect(updates).not.toBeChecked();
	await submit.click();
	await expectSubmittedValues(output, {
		name: "Alex",
		notes: "First line\nSecond line",
		replicas: "3",
	});
});

test("Form forwards native onSubmit after field validation", async ({ page }) => {
	await page.goto(storyPath("form--native-submission"));
	const input = page.getByRole("textbox", { name: "Project name", exact: true });
	const submit = page.getByRole("button", { name: "Submit with onSubmit", exact: true });
	const output = page.getByRole("status", { name: "Native Form values", exact: true });

	await submit.click();
	await expect(input).toBeFocused();
	await expect(output).toHaveText("");
	await input.fill("Shared project");
	await submit.click();
	await expectSubmittedValues(output, { project: "Shared project" });
});

test("native actions receive FormData and reset uncontrolled inputs after success", async ({
	page,
}) => {
	await page.goto(storyPath("form--native-action"));
	const input = page.getByRole("textbox", { name: "Feedback", exact: true });
	const submit = page.getByRole("button", { name: "Send feedback", exact: true });
	const output = page.getByRole("status", { name: "Action values", exact: true });

	await submit.click();
	await expect(input).toBeFocused();
	await expect(output).toHaveText("");
	await input.fill("The settings are easy to use.");
	await submit.click();
	await expectSubmittedValues(output, { feedback: "The settings are easy to use." });
	await expect(input).toHaveValue("");
});

test("option layouts preserve group names, aggregate validation, keyboard selection, and values", async ({
	page,
}) => {
	await page.goto(storyPath("fieldset--composition"));
	const channels = page.locator('[role="group"]');
	const access = page.getByRole("radiogroup", { name: "Default access", exact: true });
	const email = channels.getByRole("checkbox", { name: "Email updates", exact: true });
	const submit = page.getByRole("button", { name: "Save team preferences", exact: true });
	const output = page.getByRole("status", { name: "Submitted team preferences", exact: true });

	await expect(channels).toHaveAccessibleName("Notification channels");
	await expect(email).toHaveAccessibleDescription(/summary sent to your account email/);
	await submit.click();
	await expect(email).toBeFocused();
	await expect(
		page.getByText("Choose at least one notification channel.", { exact: true }),
	).toBeVisible();
	await expect(output).toHaveText("");
	await page.getByText("Email updates", { exact: true }).click();
	await expect(email).toBeChecked();
	const viewer = access.getByRole("radio", { name: "Viewer", exact: true });
	const editor = access.getByRole("radio", { name: "Editor", exact: true });
	await viewer.press("ArrowDown");
	await expect(editor).toBeFocused();
	await expect(editor).toBeChecked();
	await submit.click();
	await expectSubmittedValues(output, { channels: ["email"], access: "editor" });
});

test("Fieldset preserves independent named values and excludes its disabled fields", async ({
	page,
}) => {
	await page.goto(storyPath("fieldset--playground"));
	const firstName = page.getByRole("textbox", { name: "First name", exact: true });
	const lastName = page.getByRole("textbox", { name: "Last name", exact: true });
	const submit = page.getByRole("button", { name: "Save contact names", exact: true });
	const output = page.getByRole("status", { name: "Submitted contact names", exact: true });

	await firstName.fill("Sam");
	await lastName.fill("Rivera");
	await submit.click();
	await expectSubmittedValues(output, { firstName: "Sam", lastName: "Rivera" });
	await page.goto(`${storyPath("fieldset--playground")}&args=disabled:true`);
	await expect(firstName).toBeDisabled();
	await expect(lastName).toBeDisabled();
	await submit.click();
	await expectSubmittedValues(output, {});
});
