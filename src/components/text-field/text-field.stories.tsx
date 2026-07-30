import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { textColorStyles, textStyles, textWeightStyles } from "@/components/text/text.stylex";
import { space } from "@/styles/tokens.stylex";
import { ComboboxField } from "../combobox/combobox-field";
import { NumberField } from "../number-field/number-field";
import * as Select from "../select/select";
import { Textarea } from "../textarea/textarea";
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
		<div {...stylex.props(styles.defaultFrame)}>
			<TextField
				key={`${args.defaultValue}-${args.disabled}-${args.error}-${args.readOnly}-${args.size}-${args.type}`}
				{...args}
			/>
		</div>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.stateGrid)}>
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
				<TextField label="Workspace name" defaultValue="ab" error="Use at least three characters." />
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
		</div>
	),
};

export const FieldFamilyParity: Story = {
	name: "Field family sizing",
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.familyStack)}>
			{(["sm", "md", "lg"] as const).map((size) => (
				<section key={size} {...stylex.props(styles.familySection)}>
					<h2 {...stylex.props(textStyles.body, textWeightStyles.semibold)}>{size}</h2>
					<TextField label="Text field" defaultValue="Shared control surface" size={size} />
					<Textarea label="Textarea" defaultValue="Shared control surface" size={size} />
					<NumberField label="Number field" defaultValue={8} size={size} width="fill" />
					<Select.Root<string> defaultValue="React" items={[{ label: "React", value: "React" }]}>
						<Select.Label>Select</Select.Label>
						<Select.Trigger size={size} />
						<Select.Popup>
							<Select.List>
								<Select.Item value="React">React</Select.Item>
							</Select.List>
						</Select.Popup>
					</Select.Root>
					<ComboboxField label="Combobox" items={["React"]} placeholder="Shared control surface" size={size} />
				</section>
			))}
		</div>
	),
};

function StateSpecimen({ attribute, children, label }: { attribute?: string; children: ReactNode; label: string }) {
	return (
		<section {...stylex.props(styles.stateSpecimen)}>
			<div {...stylex.props(styles.stateHeader)}>
				<h2 {...stylex.props(textStyles.body, textWeightStyles.semibold, styles.stateTitle)}>{label}</h2>
				{attribute ? (
					<code {...stylex.props(textStyles.supporting, textColorStyles.muted, styles.stateAttribute)}>
						{attribute}
					</code>
				) : null}
			</div>
			{children}
		</section>
	);
}

const styles = stylex.create({
	defaultFrame: {
		maxWidth: "360px",
	},
	stateGrid: {
		gap: space.x8,
		display: "grid",
		gridTemplateColumns: {
			default: "repeat(2, minmax(0, 1fr))",
			"@media (max-width: 760px)": "1fr",
		},
		maxWidth: "800px",
	},
	stateSpecimen: {
		gap: space.x3,
		display: "flex",
		flexDirection: "column",
	},
	stateHeader: {
		gap: space.x2,
		alignItems: "baseline",
		display: "flex",
		justifyContent: "space-between",
	},
	stateTitle: {
		margin: 0,
	},
	stateAttribute: {
	},
	familyStack: {
		gap: space.x8,
		display: "flex",
		flexDirection: "column",
		maxWidth: "48rem",
	},
	familySection: {
		gap: space.x4,
		display: "grid",
		gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
	},
});
