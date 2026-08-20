import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Box, Grid, Stack } from "@/components/layout";
import { Text } from "@/components/text/text";

import { NumberField } from "./number-field";

const meta = {
	title: "Components/Number field",
	component: NumberField,
	args: {
		label: "Seats",
		description: "Choose how many people can access this workspace.",
		defaultValue: 8,
		disabled: false,
		error: "",
		min: 1,
		max: 100,
		readOnly: false,
		required: false,
		step: 1,
		size: "md",
		inputWidth: "12rem",
	},
	argTypes: {
		label: { control: "text" },
		description: { control: "text" },
		defaultValue: { control: "number" },
		disabled: { control: "boolean" },
		error: { control: "text" },
		format: { control: false },
		locale: { control: false },
		max: { control: "number" },
		min: { control: "number" },
		onValueChange: { control: false },
		onValueCommitted: { control: false },
		readOnly: { control: "boolean" },
		required: { control: "boolean" },
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
		step: { control: "number" },
		inputWidth: {
			control: "text",
			description: 'Use "fill" or any CSS width such as "10ch" or "80px".',
		},
	},
	parameters: {
		controls: {
			include: [
				"label",
				"description",
				"defaultValue",
				"disabled",
				"error",
				"min",
				"max",
				"readOnly",
				"required",
				"step",
				"size",
				"inputWidth",
			],
		},
	},
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<Box maxWidth="320px">
			<NumberField
				key={`${args.defaultValue}-${args.disabled}-${args.error}-${args.readOnly}-${args.size}-${args.inputWidth}`}
				{...args}
			/>
		</Box>
	),
};

export const Formatting: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8} maxWidth="680px" orientation="horizontal" wrap="wrap">
			<NumberField
				label="Budget"
				defaultValue={1250}
				min={0}
				step={50}
				format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
				inputWidth="11rem"
			/>
			<NumberField
				label="Completion"
				defaultValue={0.75}
				min={0}
				max={1}
				step={0.05}
				format={{ style: "percent" }}
				inputWidth="10rem"
			/>
		</Stack>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8} maxWidth="680px" orientation="horizontal" wrap="wrap">
			<NumberField label="Small" defaultValue={8} size="sm" inputWidth="8rem" />
			<NumberField label="Medium" defaultValue={8} size="md" inputWidth="8rem" />
			<NumberField label="Large" defaultValue={8} size="lg" inputWidth="8rem" />
		</Stack>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid columns={2} gap={8} maxWidth="700px" style={styles.stateGrid}>
			<StateSpecimen label="Empty">
				<NumberField label="Seats" min={1} max={100} />
			</StateSpecimen>
			<StateSpecimen label="Default">
				<NumberField label="Seats" defaultValue={8} min={1} max={100} />
			</StateSpecimen>
			<StateSpecimen label="Minimum">
				<NumberField label="Seats" defaultValue={1} min={1} max={100} />
			</StateSpecimen>
			<StateSpecimen label="Maximum">
				<NumberField label="Seats" defaultValue={100} min={1} max={100} />
			</StateSpecimen>
			<StateSpecimen label="Invalid">
				<NumberField label="Seats" defaultValue={0} error="Choose at least one seat." />
			</StateSpecimen>
			<StateSpecimen label="Required">
				<NumberField label="Seats" defaultValue={8} required />
			</StateSpecimen>
			<StateSpecimen label="Read-only">
				<NumberField label="Seats" defaultValue={8} readOnly description="Your plan fixes this limit." />
			</StateSpecimen>
			<StateSpecimen label="Disabled">
				<NumberField label="Seats" defaultValue={8} disabled />
			</StateSpecimen>
		</Grid>
	),
};

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
	stateGrid: {
		gridTemplateColumns: {
			default: "repeat(2, minmax(0, 1fr))",
			"@media (max-width: 680px)": "1fr",
		},
	},
});
