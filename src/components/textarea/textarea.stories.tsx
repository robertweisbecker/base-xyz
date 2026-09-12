import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/button/button";
import { Field } from "@/components/field/field";
import { Form } from "@/components/form/form";
import { Label } from "@/components/label/label";
import { Box, Grid, Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { Textarea } from "./textarea";

const meta = {
	title: "Components/Textarea",
	component: Textarea,
	args: {
		"aria-label": "Project update",
		placeholder: "What changed?",
		defaultValue: "",
		disabled: false,
		"aria-invalid": false,
		readOnly: false,
		required: false,
		rows: 5,
		minRows: undefined,
		maxRows: undefined,
		size: "md",
	},
	argTypes: {
		"aria-label": { control: "text" },
		placeholder: { control: "text" },
		defaultValue: { control: "text" },
		disabled: { control: "boolean" },
		"aria-invalid": { control: "boolean" },
		readOnly: { control: "boolean" },
		required: { control: "boolean" },
		rows: { control: { type: "number", min: 2, max: 12, step: 1 } },
		minRows: { control: { type: "number", min: 1, max: 12, step: 1 } },
		maxRows: { control: { type: "number", min: 1, max: 20, step: 1 } },
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
	},
	parameters: {
		controls: {
			include: [
				"aria-label",
				"placeholder",
				"defaultValue",
				"disabled",
				"aria-invalid",
				"readOnly",
				"required",
				"rows",
				"minRows",
				"maxRows",
				"size",
			],
		},
	},
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<Box maxWidth="420px">
			<Textarea
				key={`${args.defaultValue}-${args.disabled}-${args.readOnly}-${args.rows}-${args.minRows}-${args.maxRows}-${args.size}`}
				{...args}
			/>
		</Box>
	),
};

export const Resizing: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid gap={8} maxWidth="900px" xstyle={styles.responsiveGrid}>
			<StateSpecimen label="Rows only">
				<Field.Root>
					<Label>Project update</Label>
					<Textarea
						rows={2}
						defaultValue={"The native rows height remains fixed while extra content scrolls."}
					/>
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Minimum rows only">
				<Field.Root>
					<Label>Project update</Label>
					<Textarea
						rows={2}
						minRows={3}
						defaultValue={
							"The textarea grows with content and never becomes shorter than three rows."
						}
					/>
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Maximum rows only">
				<Field.Root>
					<Label>Project update</Label>
					<Textarea
						rows={2}
						maxRows={4}
						defaultValue={
							"The textarea grows from its rows value up to four rows, then scrolls as more content is added."
						}
					/>
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Minimum and maximum rows">
				<Field.Root>
					<Label>Project update</Label>
					<Textarea
						minRows={2}
						maxRows={4}
						defaultValue={"The textarea grows between its two configured row limits."}
					/>
				</Field.Root>
			</StateSpecimen>
		</Grid>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid gap={8} maxWidth="900px" xstyle={styles.responsiveGrid}>
			<StateSpecimen label="Default">
				<Field.Root>
					<Label>Project update</Label>
					<Textarea placeholder="What changed?" />
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Filled">
				<Field.Root>
					<Label>Project update</Label>
					<Textarea defaultValue="The new navigation is ready for review." />
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Invalid">
				<Field.Root invalid>
					<Label>Project update</Label>
					<Textarea defaultValue="Draft" />
					<Field.Error match>Add at least 20 characters.</Field.Error>
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Required">
				<Field.Root>
					<Label>Project update</Label>
					<Textarea placeholder="What changed?" required />
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Readonly, filled">
				<Field.Root>
					<Label>Project update</Label>
					<Textarea defaultValue="This update has already been published." readOnly />
					<Field.Description>Published updates cannot be edited.</Field.Description>
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Readonly, empty">
				<Field.Root>
					<Label>Project update</Label>
					<Textarea placeholder="What changed?" readOnly />
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Disabled">
				<Field.Root disabled>
					<Label>Project update</Label>
					<Textarea defaultValue="Updates are disabled for archived projects." disabled={false} />
				</Field.Root>
			</StateSpecimen>
		</Grid>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={6} maxWidth="420px">
			<Field.Root>
				<Label>Small</Label>
				<Textarea defaultValue="Small textarea" rows={2} size="sm" />
			</Field.Root>
			<Field.Root>
				<Label>Medium</Label>
				<Textarea defaultValue="Medium textarea" rows={2} size="md" />
			</Field.Root>
			<Field.Root>
				<Label>Large</Label>
				<Textarea defaultValue="Large textarea" rows={2} size="lg" />
			</Field.Root>
		</Stack>
	),
};

export const Controlled: Story = {
	parameters: { controls: { disable: true } },
	render: () => <ControlledUpdate />,
};

function ControlledUpdate() {
	const [value, setValue] = useState("The release is ready.");
	const [submitted, setSubmitted] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	return (
		<Form<{ update: string }> onFormSubmit={(values) => setSubmitted(values.update)}>
			<Stack gap={3} maxWidth="420px">
				<Field.Root name="update" validationMode="onChange">
					<Label>Release summary</Label>
					<Textarea
						ref={textareaRef}
						value={value}
						onChange={(event) => {
							const nextValue = event.currentTarget.value.trimStart();
							if (nextValue.length <= 120) setValue(nextValue);
						}}
						minRows={2}
						maxRows={4}
						required
					/>
					<Field.Description>
						Leading spaces are removed. Updates are limited to 120 characters.
					</Field.Description>
					<Field.Error />
					<Field.Validity>
						{(state) => <output aria-label="Validated update">{String(state.value ?? "")}</output>}
					</Field.Validity>
				</Field.Root>
				<Stack orientation="horizontal" gap={2}>
					<Button type="submit">Save update</Button>
					<Button
						type="button"
						variant="secondary"
						onClick={() => setValue("The release is ready.")}
					>
						Reset update
					</Button>
					<Button type="button" variant="secondary" onClick={() => textareaRef.current?.focus()}>
						Edit update
					</Button>
				</Stack>
				<output aria-label="Submitted update">{submitted}</output>
			</Stack>
		</Form>
	);
}

function StateSpecimen({ children, label }: { children: ReactNode; label: string }) {
	return (
		<Stack gap={3}>
			<Text color="muted" size="1">
				{label}
			</Text>
			{children}
		</Stack>
	);
}

const styles = stylex.create({
	responsiveGrid: {
		gridTemplateColumns: {
			default: "repeat(2, minmax(0, 1fr))",
			"@media (max-width: 760px)": "1fr",
		},
	},
});
