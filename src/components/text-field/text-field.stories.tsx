import type { Meta, StoryObj } from "@storybook/react-vite";
import x from "@stylexjs/atoms";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
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
		label: "Workspace name",
		placeholder: "e.g. Acme Studio",
		description: "This appears in shared project links.",
		defaultValue: "",
		disabled: false,
		error: "",
		readOnly: false,
		required: false,
		size: "md",
		type: "text",
	},
	argTypes: {
		label: { control: "text" },
		placeholder: { control: "text" },
		description: { control: "text" },
		defaultValue: { control: "text" },
		disabled: { control: "boolean" },
		error: { control: "text" },
		readOnly: { control: "boolean" },
		required: { control: "boolean" },
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
		type: { control: "select", options: ["text", "email", "password", "search", "url"] },
	},
	parameters: {
		controls: {
			include: [
				"label",
				"placeholder",
				"description",
				"defaultValue",
				"disabled",
				"error",
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
				key={`${args.defaultValue}-${args.disabled}-${args.error}-${args.readOnly}-${args.size}-${args.type}`}
				{...args}
			/>
		</Box>
	),
};

export const WrapperLayout: Story = {
	parameters: { controls: { disable: true } },
	render: (args) => (
		<TextField
			{...args}
			xstyle={[x.display.flex, x.flexDirection.row, x.gap(tokens["--space-3"])]}
		/>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid gap={8} maxWidth="800px" xstyle={styles.stateGrid}>
			<StateSpecimen label="Default">
				<TextField label="Workspace name" placeholder="e.g. Acme Studio" />
			</StateSpecimen>
			<StateSpecimen label="Filled" attribute="data-filled">
				<TextField label="Workspace name" defaultValue="Design Ops" />
			</StateSpecimen>
			<StateSpecimen label="Focused" attribute="autoFocus">
				<TextField label="Workspace name" defaultValue="Design Ops" autoFocus />
			</StateSpecimen>
			<StateSpecimen label="Invalid" attribute="data-invalid">
				<TextField
					label="Workspace name"
					defaultValue="ab"
					error="Use at least three characters."
				/>
			</StateSpecimen>
			<StateSpecimen label="Required" attribute="required">
				<TextField label="Workspace name" placeholder="e.g. Acme Studio" required />
			</StateSpecimen>
			<StateSpecimen label="Readonly, filled" attribute="readonly">
				<TextField
					label="Workspace name"
					defaultValue="Design Ops"
					readOnly
					description="Workspace names cannot be edited in this view."
				/>
			</StateSpecimen>
			<StateSpecimen label="Readonly, empty" attribute="readonly">
				<TextField label="Workspace name" placeholder="e.g. Acme Studio" readOnly />
			</StateSpecimen>
			<StateSpecimen label="Disabled" attribute="data-disabled">
				<TextField
					label="Workspace name"
					defaultValue="Design Ops"
					disabled
					description="Workspace names are managed by an administrator."
				/>
			</StateSpecimen>
		</Grid>
	),
};

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
						<TextField label="Text field" defaultValue="Shared control surface" size={size} />
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
