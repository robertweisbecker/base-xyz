import x from "@stylexjs/atoms";
import {
	Button,
	Checkbox,
	Field,
	Fieldset,
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
					<Field.Root name="region" xstyle={x.width["fit-content"]}>
						<Select.Root<string> defaultValue="iad1" items={regionItems}>
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
					</Field.Root>
				</Grid>
				<Fieldset.Root>
					<Fieldset.Legend>Environment visibility</Fieldset.Legend>
					<Field.Root name="visibility" mt={3}>
						<RadioGroup defaultValue="preview">
							<Stack gap={3}>
								<Field.Item>
									<Stack
										render={<Label variant="item" />}
										orientation="horizontal"
										align="start"
										gap={2}
									>
										<Radio value="private" />
										Private
									</Stack>
									<Field.Description>
										Only invited workspace members can access it.
									</Field.Description>
								</Field.Item>
								<Field.Item>
									<Stack
										render={<Label variant="item" />}
										orientation="horizontal"
										align="start"
										gap={2}
									>
										<Radio value="preview" />
										Preview
									</Stack>
									<Field.Description>
										Anyone with a signed preview link can access it.
									</Field.Description>
								</Field.Item>
							</Stack>
						</RadioGroup>
					</Field.Root>
				</Fieldset.Root>
				<Field.Root name="description">
					<Label>Description</Label>
					<Textarea
						maxRows={6}
						minRows={3}
						placeholder="Used for pull request previews and design reviews."
					/>
					<Field.Description>
						Shown to teammates when they select this environment.
					</Field.Description>
				</Field.Root>
				<Stack gap={3}>
					<Field.Root name="automatic-rollback">
						<Stack orientation="horizontal" align="center" justify="space-between" gap={4}>
							<Stack gap={1}>
								<Label>Automatic rollback</Label>
								<Field.Description>
									Keep one successful deployment ready for immediate rollback.
								</Field.Description>
							</Stack>
							<Switch defaultChecked />
						</Stack>
					</Field.Root>
					<Field.Root name="workspace-defaults">
						<Stack render={<Label variant="item" />} orientation="horizontal" align="start" gap={2}>
							<Checkbox defaultChecked />
							Apply workspace defaults
						</Stack>
						<Field.Description>Use the workspace retention and access policies.</Field.Description>
					</Field.Root>
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
