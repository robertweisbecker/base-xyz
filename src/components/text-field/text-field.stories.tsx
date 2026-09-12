import type { Meta, StoryObj } from "@storybook/react-vite";
import x from "@stylexjs/atoms";
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/button/button";
import { Field } from "@/components/field/field";
import { Label } from "@/components/label/label";
import { Code } from "@/components/code/code";
import { Combobox } from "@/components/combobox/combobox-field";
import { Box, Grid, Stack } from "@/components/layout/layout";
import { NumberField } from "@/components/number-field/number-field";
import { Select } from "@/components/select/select";
import { Text } from "@/components/text/text";
import { Textarea } from "@/components/textarea/textarea";
import { tokens } from "@/theme/tokens.stylex";
import { TextField } from "./text-field";

const meta = {
	title: "Components/Text field",
	component: TextField,
	args: {
		"aria-label": "Workspace name",
		placeholder: "e.g. Acme Studio",
		defaultValue: "",
		disabled: false,
		"aria-invalid": false,
		readOnly: false,
		required: false,
		size: "md",
		type: "text",
	},
	argTypes: {
		"aria-label": { control: "text" },
		placeholder: { control: "text" },
		defaultValue: { control: "text" },
		disabled: { control: "boolean" },
		"aria-invalid": { control: "boolean" },
		readOnly: { control: "boolean" },
		required: { control: "boolean" },
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
		type: { control: "select", options: ["text", "email", "password", "search", "url"] },
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
				"size",
				"type",
			],
		},
	},
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<Box maxWidth="360px">
			<TextField
				key={`${args.defaultValue}-${args.disabled}-${args.readOnly}-${args.size}-${args.type}`}
				{...args}
			/>
		</Box>
	),
};

export const Composition: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Field.Root xstyle={[x.flexDirection.row, x.alignItems.center, x.gap(tokens["--space-3"])]}>
			<Label>Workspace name</Label>
			<TextField placeholder="e.g. Acme Studio" />
		</Field.Root>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid gap={8} maxWidth="800px" xstyle={styles.stateGrid}>
			<StateSpecimen label="Default">
				<Field.Root>
					<Label>Workspace name</Label>
					<TextField placeholder="e.g. Acme Studio" />
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Filled" attribute="data-filled">
				<Field.Root>
					<Label>Workspace name</Label>
					<TextField defaultValue="Design Ops" />
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Focused" attribute="autoFocus">
				<Field.Root>
					<Label>Workspace name</Label>
					<TextField defaultValue="Design Ops" autoFocus />
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Invalid" attribute="data-invalid">
				<Field.Root invalid>
					<Label>Workspace name</Label>
					<TextField defaultValue="ab" />
					<Field.Error match>Use at least three characters.</Field.Error>
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Required" attribute="required">
				<Field.Root>
					<Label>Workspace name</Label>
					<TextField placeholder="e.g. Acme Studio" required />
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Readonly, filled" attribute="readonly">
				<Field.Root>
					<Label>Workspace name</Label>
					<TextField defaultValue="Design Ops" readOnly />
					<Field.Description>Workspace names cannot be edited in this view.</Field.Description>
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Readonly, empty" attribute="readonly">
				<Field.Root>
					<Label>Workspace name</Label>
					<TextField placeholder="e.g. Acme Studio" readOnly />
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Disabled" attribute="data-disabled">
				<Field.Root disabled>
					<Label>Workspace name</Label>
					<TextField defaultValue="Design Ops" />
					<Field.Description>Workspace names are managed by an administrator.</Field.Description>
				</Field.Root>
			</StateSpecimen>
		</Grid>
	),
};

export const Controlled: Story = {
	parameters: { controls: { disable: true } },
	render: () => <ControlledTextField />,
};

function ControlledTextField() {
	const [value, setValue] = useState("design-system");
	const [submitted, setSubmitted] = useState("");
	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				setSubmitted(String(new FormData(event.currentTarget).get("project") ?? ""));
			}}
		>
			<Stack gap={3} maxWidth="360px">
				<TextField
					aria-label="Project slug"
					name="project"
					required
					value={value}
					onValueChange={setValue}
				/>
				<Text size="1" color="muted">
					Current value: {value}
				</Text>
				<Stack orientation="horizontal" gap={2}>
					<Button type="submit">Save project</Button>
					<Button type="button" variant="secondary" onClick={() => setValue("design-system")}>
						Reset value
					</Button>
				</Stack>
				<output aria-label="Submitted project">{submitted}</output>
			</Stack>
		</form>
	);
}

export const FieldFamilyParity: Story = {
	name: "Field family sizing",
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Box pb={2} xstyle={styles.familyOverflow}>
			<style>{`
				[data-field-family-control] > * > :first-child {
					clip: rect(0 0 0 0);
					clip-path: inset(50%);
					height: 1px;
					overflow: hidden;
					position: absolute;
					white-space: nowrap;
					width: 1px;
				}
			`}</style>
			<Grid align="start" gap={6} xstyle={styles.familyGrid}>
				<span aria-hidden />
				{FIELD_SIZES.map((size) => (
					<Text key={size} fontWeight="semibold" size="2" textAlign="center" wrap="nowrap">
						{size}
					</Text>
				))}
				<FamilyRow label="Text field">
					{(size) => (
						<TextField aria-label="Text field" defaultValue="Shared control surface" size={size} />
					)}
				</FamilyRow>
				<FamilyRow label="Textarea">
					{(size) => (
						<Textarea label="Textarea" defaultValue="Shared control surface" size={size} />
					)}
				</FamilyRow>
				<FamilyRow label="Number field">
					{(size) => (
						<NumberField label="Number field" defaultValue={8} size={size} inputWidth="fill" />
					)}
				</FamilyRow>
				<FamilyRow label="Select">
					{(size) => (
						<Select.Root<string>
							defaultValue="React"
							items={[{ label: "React", value: "React" }]}
							size={size}
						>
							<Select.Label>Select</Select.Label>
							<Select.Trigger />
							<Select.Popup>
								<Select.List>
									<Select.Item value="React">React</Select.Item>
								</Select.List>
							</Select.Popup>
						</Select.Root>
					)}
				</FamilyRow>
				<FamilyRow label="Combobox">
					{(size) => (
						<Combobox.Root items={["React"]} size={size}>
							<Combobox.Label>Combobox</Combobox.Label>
							<Combobox.InputGroup>
								<Combobox.Input placeholder="Shared control surface" />
							</Combobox.InputGroup>
							<Combobox.Popup>
								<Combobox.List>
									<Combobox.Item value="React">React</Combobox.Item>
								</Combobox.List>
							</Combobox.Popup>
						</Combobox.Root>
					)}
				</FamilyRow>
			</Grid>
		</Box>
	),
};

const FIELD_SIZES = ["sm", "md", "lg"] as const;

function FamilyRow({
	children,
	label,
}: {
	children: (size: (typeof FIELD_SIZES)[number]) => ReactNode;
	label: string;
}) {
	return (
		<>
			<Text fontWeight="semibold" mt={2} size="2" wrap="nowrap">
				{label}
			</Text>
			{FIELD_SIZES.map((size) => (
				<Box key={size} data-field-family-control minWidth={0}>
					{children(size)}
				</Box>
			))}
		</>
	);
}

function StateSpecimen({
	attribute,
	children,
	label,
}: {
	attribute?: string;
	children: ReactNode;
	label: string;
}) {
	return (
		<Stack gap={3}>
			<Stack align="baseline" gap={2} justify="space-between" orientation="horizontal">
				<Text color="muted" size="1">
					{label}
				</Text>
				{attribute ? <Code>{attribute}</Code> : null}
			</Stack>
			{children}
		</Stack>
	);
}

const styles = stylex.create({
	stateGrid: {
		gridTemplateColumns: {
			default: "repeat(2, minmax(0, 1fr))",
			"@media (max-width: 760px)": "1fr",
		},
	},
	familyOverflow: {
		overflowX: "auto",
	},
	familyGrid: {
		gridTemplateColumns: "max-content repeat(3, minmax(16rem, 1fr))",
		minWidth: "58rem",
	},
});
