import { WarningOctagonIcon } from "@phosphor-icons/react/dist/csr/WarningOctagon";
import x from "@stylexjs/atoms";
import { Field } from "@/components/field/field";
import { Label } from "@/components/label/label";
import { tokens } from "@/theme/tokens.stylex";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Box, Grid, Stack } from "@/components/layout";
import { Text } from "@/components/text/text";

import {
	NumberField,
	type NumberFieldRootProps,
	type NumberFieldControlProps,
} from "./number-field";

type PlaygroundArgs = NumberFieldRootProps &
	Pick<NumberFieldControlProps, "inputWidth"> & {
		_label: string;
		_description: string;
		_error: string;
	};

const meta = {
	title: "Components/Number field",
	component: NumberField.Root,
	args: {
		_label: "Seats",
		_description: "Choose how many people can access this workspace.",
		defaultValue: 8,
		disabled: false,
		_error: "",
		min: 1,
		max: 100,
		readOnly: false,
		required: false,
		step: 1,
		size: "md",
		inputWidth: "12rem",
	},
	argTypes: {
		_label: { control: "text" },
		_description: { control: "text" },
		defaultValue: { control: "number" },
		disabled: { control: "boolean" },
		_error: { control: "text" },
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
				"_label",
				"_description",
				"defaultValue",
				"disabled",
				"_error",
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
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
	render: ({ _label, _description, _error, inputWidth, ...props }) => (
		<Box maxWidth="320px">
			<Field.Root
				key={`${props.defaultValue}-${props.disabled}-${_error}-${props.readOnly}-${props.size}-${inputWidth}`}
				disabled={props.disabled}
				invalid={Boolean(_error)}
			>
				<NumberField.Root {...props}>
					<NumberField.ScrubArea>
						<Label xstyle={x.cursor.inherit}>
							{_label}
							{props.required ? (
								<span aria-hidden {...stylex.props(styles.requiredMarker)}>
									*
								</span>
							) : null}
						</Label>
					</NumberField.ScrubArea>
					<NumberField.Control inputWidth={inputWidth} />
				</NumberField.Root>
				{_description ? <Field.Description>{_description}</Field.Description> : null}
				{_error ? (
					<Field.Error match>
						<WarningOctagonIcon aria-hidden size="1em" weight="duotone" />
						{_error}
					</Field.Error>
				) : null}
			</Field.Root>
		</Box>
	),
};

export const Formatting: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8} maxWidth="680px" orientation="horizontal" wrap="wrap">
			<Field.Root>
				<NumberField.Root
					defaultValue={1250}
					min={0}
					step={50}
					format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
				>
					<NumberField.ScrubArea>
						<Label xstyle={x.cursor.inherit}>Budget</Label>
					</NumberField.ScrubArea>
					<NumberField.Control inputWidth="11rem" />
				</NumberField.Root>
			</Field.Root>
			<Field.Root>
				<NumberField.Root
					defaultValue={0.75}
					min={0}
					max={1}
					step={0.05}
					format={{ style: "percent" }}
				>
					<NumberField.ScrubArea>
						<Label xstyle={x.cursor.inherit}>Completion</Label>
					</NumberField.ScrubArea>
					<NumberField.Control inputWidth="10rem" />
				</NumberField.Root>
			</Field.Root>
		</Stack>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8} maxWidth="680px" orientation="horizontal" wrap="wrap">
			<Field.Root>
				<NumberField.Root defaultValue={8} size="sm">
					<NumberField.ScrubArea>
						<Label xstyle={x.cursor.inherit}>Small</Label>
					</NumberField.ScrubArea>
					<NumberField.Control inputWidth="8rem" />
				</NumberField.Root>
			</Field.Root>
			<Field.Root>
				<NumberField.Root defaultValue={8} size="md">
					<NumberField.ScrubArea>
						<Label xstyle={x.cursor.inherit}>Medium</Label>
					</NumberField.ScrubArea>
					<NumberField.Control inputWidth="8rem" />
				</NumberField.Root>
			</Field.Root>
			<Field.Root>
				<NumberField.Root defaultValue={8} size="lg">
					<NumberField.ScrubArea>
						<Label xstyle={x.cursor.inherit}>Large</Label>
					</NumberField.ScrubArea>
					<NumberField.Control inputWidth="8rem" />
				</NumberField.Root>
			</Field.Root>
		</Stack>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid columns={2} gap={8} maxWidth="700px" xstyle={styles.stateGrid}>
			<StateSpecimen label="Empty">
				<Field.Root>
					<NumberField.Root min={1} max={100}>
						<NumberField.ScrubArea>
							<Label xstyle={x.cursor.inherit}>Seats</Label>
						</NumberField.ScrubArea>
						<NumberField.Control />
					</NumberField.Root>
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Default">
				<Field.Root>
					<NumberField.Root defaultValue={8} min={1} max={100}>
						<NumberField.ScrubArea>
							<Label xstyle={x.cursor.inherit}>Seats</Label>
						</NumberField.ScrubArea>
						<NumberField.Control />
					</NumberField.Root>
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Minimum">
				<Field.Root>
					<NumberField.Root defaultValue={1} min={1} max={100}>
						<NumberField.ScrubArea>
							<Label xstyle={x.cursor.inherit}>Seats</Label>
						</NumberField.ScrubArea>
						<NumberField.Control />
					</NumberField.Root>
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Maximum">
				<Field.Root>
					<NumberField.Root defaultValue={100} min={1} max={100}>
						<NumberField.ScrubArea>
							<Label xstyle={x.cursor.inherit}>Seats</Label>
						</NumberField.ScrubArea>
						<NumberField.Control />
					</NumberField.Root>
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Invalid">
				<Field.Root invalid>
					<NumberField.Root defaultValue={0}>
						<NumberField.ScrubArea>
							<Label xstyle={x.cursor.inherit}>Seats</Label>
						</NumberField.ScrubArea>
						<NumberField.Control />
					</NumberField.Root>
					<Field.Error match>
						<WarningOctagonIcon aria-hidden size="1em" weight="duotone" />
						Choose at least one seat.
					</Field.Error>
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Required">
				<Field.Root>
					<NumberField.Root defaultValue={8} required>
						<NumberField.ScrubArea>
							<Label xstyle={x.cursor.inherit}>
								Seats
								<span aria-hidden {...stylex.props(styles.requiredMarker)}>
									*
								</span>
							</Label>
						</NumberField.ScrubArea>
						<NumberField.Control />
					</NumberField.Root>
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Read-only">
				<Field.Root>
					<NumberField.Root defaultValue={8} readOnly>
						<NumberField.ScrubArea>
							<Label xstyle={x.cursor.inherit}>Seats</Label>
						</NumberField.ScrubArea>
						<NumberField.Control />
					</NumberField.Root>
					<Field.Description>Your plan fixes this limit.</Field.Description>
				</Field.Root>
			</StateSpecimen>
			<StateSpecimen label="Disabled">
				<Field.Root disabled>
					<NumberField.Root defaultValue={8}>
						<NumberField.ScrubArea>
							<Label xstyle={x.cursor.inherit}>Seats</Label>
						</NumberField.ScrubArea>
						<NumberField.Control />
					</NumberField.Root>
				</Field.Root>
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
	requiredMarker: { color: tokens["--fg-error"], marginInlineStart: tokens["--space-1"] },
	stateGrid: {
		gridTemplateColumns: {
			default: "repeat(2, minmax(0, 1fr))",
			"@media (max-width: 680px)": "1fr",
		},
	},
});
