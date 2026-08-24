import * as stylex from "@stylexjs/stylex";
import { Button, Checkbox, Grid, Radio, RadioGroup, Select, Stack, Switch, Textarea, TextField } from "@/components";
import { breakpoints } from "@/styles/constants.stylex";
import { ExperimentPage, ExperimentSection } from "./experiment-page";

const regionItems = [
	{ label: "Washington, D.C., USA", value: "iad1" },
	{ label: "Frankfurt, Germany", value: "fra1" },
	{ label: "Tokyo, Japan", value: "hnd1" },
];

export function InputsPage() {
	return (
		<ExperimentPage
			description="Form controls composed into complete tasks, with labels, guidance, validation, and practical defaults."
			title="Inputs">
			<ExperimentSection
				description="A product-shaped form exercises text entry, selection, options, and submission together."
				title="Create an environment">
				<form onSubmit={(event) => event.preventDefault()}>
					<Stack gap={6}>
						<Grid gap={4} xstyle={styles.fieldGrid}>
							<TextField
								description="Used in deployment URLs and CLI commands."
								label="Environment name"
								name="environment-name"
								placeholder="Preview"
								required
							/>
							<Select.Root<string> defaultValue="iad1" items={regionItems} name="region">
								<Select.Label>Primary region</Select.Label>
								<Select.Trigger />
								<Select.Popup>
									<Select.List>
										{regionItems.map((item) => (
											<Select.Item key={item.value} value={item.value}>
												{item.label}
											</Select.Item>
										))}
									</Select.List>
								</Select.Popup>
							</Select.Root>
						</Grid>
						<RadioGroup
							defaultValue="preview"
							description="Controls who can access deployments in this environment."
							label="Environment visibility"
							name="visibility">
							<Radio value="private" label="Private" description="Only invited workspace members can access it." />
							<Radio value="preview" label="Preview" description="Anyone with a signed preview link can access it." />
						</RadioGroup>
						<Textarea
							description="Shown to teammates when they select this environment."
							label="Description"
							maxRows={6}
							minRows={3}
							name="description"
							placeholder="Used for pull request previews and design reviews."
						/>
						<Stack gap={3}>
							<Switch
								defaultChecked
								description="Keep one successful deployment ready for immediate rollback."
								label="Automatic rollback"
								name="automatic-rollback"
							/>
							<Checkbox
								defaultChecked
								description="Use the workspace retention and access policies."
								label="Apply workspace defaults"
								name="workspace-defaults"
							/>
						</Stack>
						<Stack align="center" gap={3} justify="end" orientation="horizontal">
							<Button type="button" variant="secondary">Cancel</Button>
							<Button type="submit">Create environment</Button>
						</Stack>
					</Stack>
				</form>
			</ExperimentSection>

			<ExperimentSection
				description="Keep invalid, read-only, and disabled treatments visible together during component changes."
				title="Field states">
				<Grid gap={4} xstyle={styles.fieldGrid}>
					<TextField error="Use lowercase letters, numbers, and hyphens only." label="Invalid slug" defaultValue="Design Review" />
					<TextField description="Generated after the first production deployment." disabled label="Production hostname" value="app.example.com" />
				</Grid>
			</ExperimentSection>
		</ExperimentPage>
	);
}

const styles = stylex.create({
	fieldGrid: {
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[breakpoints.sm]: "repeat(2, minmax(0, 1fr))",
		},
	},
});
