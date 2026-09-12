import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useId, useRef, useState } from "react";
import {
	Button,
	Field,
	Form,
	Grid,
	InputGroup,
	Label,
	Stack,
	Switch,
	Text,
	Textarea,
	TextField,
	type FieldRootActions,
	type FormValidationMode,
} from "@/components";
import { breakpoints } from "@/styles/constants.stylex";

type FieldStoryArgs = {
	disabled: boolean;
	invalid: boolean;
	validationMode: FormValidationMode;
	_label: string;
	_description: string;
};

const meta = {
	title: "Components/Field",
	component: Field.Root,
	args: {
		disabled: false,
		invalid: false,
		validationMode: "onBlur",
		_label: "Project name",
		_description: "Visible to everyone in your workspace.",
	},
	argTypes: {
		disabled: { control: "boolean" },
		invalid: { control: "boolean" },
		validationMode: { control: "inline-radio", options: ["onSubmit", "onBlur", "onChange"] },
		_label: { control: "text" },
		_description: { control: "text" },
	},
	parameters: {
		controls: { include: ["_label", "_description", "disabled", "invalid", "validationMode"] },
	},
} satisfies Meta<FieldStoryArgs>;

export default meta;
type Story = StoryObj<FieldStoryArgs>;

export const Playground: Story = {
	render: ({ _label, _description, ...args }) => (
		<Field.Root {...args} name="project" xstyle={styles.playground}>
			<Label>{_label}</Label>
			<TextField required />
			{_description && <Field.Description>{_description}</Field.Description>}
			<Field.Error match={args.invalid || undefined}>Enter a project name.</Field.Error>
		</Field.Root>
	),
};

export const Composition: Story = {
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story:
					"Each Field owns one value while its children choose the layout. The textarea removes leading whitespace through its native onChange callback; submission contains the accepted value. Its caller-owned supporting text is combined with Field descriptions and errors.",
			},
		},
	},
	render: function Render() {
		const writingHintId = useId();
		const websiteRef = useRef<HTMLInputElement>(null);
		const [description, setDescription] = useState("");
		const [website, setWebsite] = useState("design.example");
		const [submitted, setSubmitted] = useState("");
		return (
			<Form<{ slug: string; description: string; website: string; alerts: boolean }>
				onFormSubmit={(values) => setSubmitted(JSON.stringify(values))}
			>
				<Stack gap={6} maxWidth="760px">
					<Field.Root name="slug">
						<Grid gap={4} align="start" xstyle={styles.fieldColumns}>
							<Stack gap={1}>
								<Label>Project slug</Label>
								<Field.Description>Used in deployment URLs and CLI commands.</Field.Description>
							</Stack>
							<Stack gap={1}>
								<TextField defaultValue="design-system" required />
								<Field.Error match="valueMissing">Enter a project slug.</Field.Error>
							</Stack>
						</Grid>
					</Field.Root>
					<Field.Root name="description">
						<Grid gap={4} align="start" xstyle={styles.fieldColumns}>
							<Stack gap={1}>
								<Label>Project description</Label>
								<Field.Description>Visible to workspace members.</Field.Description>
								<Text id={writingHintId} size="1" color="muted">
									Write one or two sentences about the project.
								</Text>
							</Stack>
							<Stack gap={2}>
								<Textarea
									aria-describedby={writingHintId}
									value={description}
									onChange={(event) => setDescription(event.currentTarget.value.trimStart())}
									minRows={3}
									maxRows={6}
									required
								/>
								<Text size="1" color="muted">
									{description.length} characters. Leading spaces are removed.
								</Text>
								<Field.Error match="valueMissing">Enter a project description.</Field.Error>
							</Stack>
						</Grid>
					</Field.Root>
					<Field.Root name="website">
						<Grid gap={4} align="start" xstyle={styles.fieldColumns}>
							<Stack gap={1}>
								<Label>Project website</Label>
								<Field.Description>Link to the project's documentation.</Field.Description>
							</Stack>
							<InputGroup.Root>
								<InputGroup.Addon>https://</InputGroup.Addon>
								<InputGroup.Input ref={websiteRef} value={website} onValueChange={setWebsite} />
								<InputGroup.Actions>
									<Button
										type="button"
										size="sm"
										variant="ghost"
										onClick={() => {
											setWebsite("");
											websiteRef.current?.focus();
										}}
									>
										Clear
									</Button>
								</InputGroup.Actions>
							</InputGroup.Root>
						</Grid>
					</Field.Root>
					<Field.Root name="alerts">
						<Stack orientation="horizontal" align="center" justify="space-between" gap={4}>
							<Stack gap={1}>
								<Label>Deployment alerts</Label>
								<Field.Description>
									Let your team know when a release needs attention, with a link to the deployment
									logs.
								</Field.Description>
							</Stack>
							<Switch defaultChecked />
						</Stack>
					</Field.Root>
					<Stack align="start" gap={3}>
						<Button type="submit">Save project settings</Button>
						<output aria-label="Submitted project settings">{submitted}</output>
					</Stack>
				</Stack>
			</Form>
		);
	},
};

export const Validation: Story = {
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story:
					"Field actions validate without submission. Matched errors choose the message, and Field.Validity supplies the public validation result for custom presentation.",
			},
		},
	},
	render: function Render() {
		const actionsRef = useRef<FieldRootActions>(null);
		const inputRef = useRef<HTMLInputElement>(null);
		return (
			<Stack gap={4} maxWidth="440px">
				<Field.Root name="slug" actionsRef={actionsRef} validationMode="onChange">
					<Label>Deployment slug</Label>
					<TextField ref={inputRef} required pattern={"[a-z][a-z0-9\\-]*"} />
					<Field.Description>
						Start with a lowercase letter. Use letters, numbers, and hyphens.
					</Field.Description>
					<Field.Error match="valueMissing">Enter a deployment slug.</Field.Error>
					<Field.Error match="patternMismatch">
						<Field.Validity>
							{({ value }) => <>“{String(value)}” does not follow the slug format.</>}
						</Field.Validity>
					</Field.Error>
					<Field.Validity>
						{({ validity }) => (
							<output aria-label="Slug validity">
								{validity.valid === null
									? "Not yet validated"
									: validity.valid
										? "Ready to use"
										: "Needs correction"}
							</output>
						)}
					</Field.Validity>
				</Field.Root>
				<Stack orientation="horizontal" wrap="wrap" gap={2}>
					<Button type="button" onClick={() => actionsRef.current?.validate()}>
						Validate slug
					</Button>
					<Button type="button" variant="secondary" onClick={() => inputRef.current?.focus()}>
						Edit slug
					</Button>
				</Stack>
			</Stack>
		);
	},
};

const styles = stylex.create({
	playground: { maxWidth: "400px" },
	fieldColumns: {
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[breakpoints.sm]: "minmax(10rem, 1fr) minmax(0, 2fr)",
		},
	},
});
