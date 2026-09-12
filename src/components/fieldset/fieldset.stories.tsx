import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useId, useState } from "react";
import {
	Button,
	Checkbox,
	CheckboxGroup,
	Field,
	Fieldset,
	Form,
	Grid,
	Label,
	Radio,
	RadioGroup,
	Stack,
	TextField,
} from "@/components";
import { breakpoints } from "@/styles/constants.stylex";

type FieldsetStoryArgs = { disabled: boolean; _legend: string };

const meta = {
	title: "Components/Fieldset",
	component: Fieldset.Root,
	args: { disabled: false, _legend: "Contact details" },
	argTypes: { disabled: { control: "boolean" }, _legend: { control: "text" } },
	parameters: { controls: { include: ["_legend", "disabled"] } },
} satisfies Meta<FieldsetStoryArgs>;

export default meta;
type Story = StoryObj<FieldsetStoryArgs>;

export const Playground: Story = {
	render: function Render({ _legend, disabled }) {
		const [submitted, setSubmitted] = useState("");
		return (
			<Form<{ firstName?: string; lastName?: string }>
				onFormSubmit={(values) => setSubmitted(JSON.stringify(values))}
			>
				<Stack gap={4} maxWidth="600px">
					<Fieldset.Root disabled={disabled}>
						<Fieldset.Legend>{_legend}</Fieldset.Legend>
						<Grid gap={4} mt={3} xstyle={styles.contactColumns}>
							<Field.Root name="firstName">
								<Label>First name</Label>
								<TextField defaultValue="Alex" required />
								<Field.Error match="valueMissing">Enter your first name.</Field.Error>
							</Field.Root>
							<Field.Root name="lastName">
								<Label>Last name</Label>
								<TextField defaultValue="Morgan" required />
								<Field.Error match="valueMissing">Enter your last name.</Field.Error>
							</Field.Root>
						</Grid>
					</Fieldset.Root>
					<Button type="submit">Save contact names</Button>
					<output aria-label="Submitted contact names">{submitted}</output>
				</Stack>
			</Form>
		);
	},
};

export const Composition: Story = {
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story:
					"Fieldset names each group. A single named Field owns its aggregate value, and Field.Item scopes each option's label and description. Grid and Stack arrange the option content independently of the controls.",
			},
		},
	},
	render: function Render() {
		const channelsLegendId = useId();
		const [submitted, setSubmitted] = useState("");
		return (
			<Form<{ channels: string[]; access: string }>
				onFormSubmit={(values) => setSubmitted(JSON.stringify(values))}
			>
				<Stack gap={6} maxWidth="520px">
					<Fieldset.Root>
						<Fieldset.Legend id={channelsLegendId}>Notification channels</Fieldset.Legend>
						<Field.Root
							name="channels"
							mt={3}
							validate={(value) =>
								Array.isArray(value) && value.length > 0
									? null
									: "Choose at least one notification channel."
							}
						>
							<Field.Description>Choose how to receive project updates.</Field.Description>
							<CheckboxGroup aria-labelledby={channelsLegendId}>
								<Stack gap={4}>
									<Field.Item>
										<Grid gap={4} align="center" xstyle={styles.optionColumns}>
											<Stack gap={1}>
												<Label variant="item">Email updates</Label>
												<Field.Description>A summary sent to your account email.</Field.Description>
											</Stack>
											<Checkbox value="email" />
										</Grid>
									</Field.Item>
									<Field.Item>
										<Grid gap={4} align="center" xstyle={styles.optionColumns}>
											<Stack gap={1}>
												<Label variant="item">Push notifications</Label>
												<Field.Description>Timely alerts on your current device.</Field.Description>
											</Stack>
											<Checkbox value="push" />
										</Grid>
									</Field.Item>
								</Stack>
							</CheckboxGroup>
							<Field.Error />
						</Field.Root>
					</Fieldset.Root>
					<Fieldset.Root>
						<Fieldset.Legend>Default access</Fieldset.Legend>
						<Field.Root name="access" mt={3}>
							<Field.Description>Choose one role for new project members.</Field.Description>
							<RadioGroup defaultValue="viewer">
								<Stack gap={4}>
									<Field.Item>
										<Grid gap={4} align="center" xstyle={styles.optionColumns}>
											<Stack gap={1}>
												<Label variant="item">Viewer</Label>
												<Field.Description>Read projects and follow deployments.</Field.Description>
											</Stack>
											<Radio value="viewer" />
										</Grid>
									</Field.Item>
									<Field.Item>
										<Grid gap={4} align="center" xstyle={styles.optionColumns}>
											<Stack gap={1}>
												<Label variant="item">Editor</Label>
												<Field.Description>Create and update project content.</Field.Description>
											</Stack>
											<Radio value="editor" />
										</Grid>
									</Field.Item>
								</Stack>
							</RadioGroup>
						</Field.Root>
					</Fieldset.Root>
					<Button type="submit">Save team preferences</Button>
					<output aria-label="Submitted team preferences">{submitted}</output>
				</Stack>
			</Form>
		);
	},
};

const styles = stylex.create({
	contactColumns: {
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[breakpoints.sm]: "repeat(2, minmax(0, 1fr))",
		},
	},
	optionColumns: { gridTemplateColumns: "minmax(0, 1fr) auto" },
});
