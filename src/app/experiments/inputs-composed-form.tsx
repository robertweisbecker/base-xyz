import {
	Button,
	Checkbox,
	Field,
	Grid,
	Label,
	Radio,
	RadioGroup,
	Select,
	Stack,
	Switch,
	Textarea,
	TextField,
} from "@/components";
import { inputsPageStyles as styles } from "./inputs-page.styles";

const regionItems = [
	{ label: "Washington, D.C., USA", value: "iad1" },
	{ label: "Frankfurt, Germany", value: "fra1" },
	{ label: "Tokyo, Japan", value: "hnd1" },
];

export function EnvironmentForm() {
	return (
		<form onSubmit={(event) => event.preventDefault()}>
			<Stack gap={6}>
				<Grid gap={4} xstyle={styles.formFieldGrid}>
					<Field.Root name="environment-name">
						<Label>Environment name</Label>
						<TextField placeholder="Preview" required />
						<Field.Description>Used in deployment URLs and CLI commands.</Field.Description>
					</Field.Root>
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
				<RadioGroup defaultValue="preview" label="Environment visibility" name="visibility">
					<Radio
						value="private"
						label="Private"
						description="Only invited workspace members can access it."
					/>
					<Radio
						value="preview"
						label="Preview"
						description="Anyone with a signed preview link can access it."
					/>
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
					<Button type="button" variant="secondary">
						Cancel
					</Button>
					<Button type="submit">Create environment</Button>
				</Stack>
			</Stack>
		</form>
	);
}
