import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Stack } from "@/components/layout";
import { Meter } from "./meter";

const meta = {
	title: "Components/Meter",
	component: Meter.Root,
	args: {
		value: 64,
		variant: "bar",
	},
	argTypes: {
		format: { control: false },
		getAriaValueText: { control: false },
		locale: { control: false },
		variant: { control: false },
		value: {
			control: { type: "range", min: 0, max: 100, step: 1 },
		},
	},
	parameters: {
		controls: {
			include: ["value", "min", "max", "low", "high", "optimum"],
		},
	},
	decorators: [
		(Story) => (
			<Box maxWidth="28rem" width="full">
				<Story />
			</Box>
		),
	],
	render: (args) => (
		<Meter.Root {...args}>
			<Meter.Label>Storage used</Meter.Label>
			<Meter.Value />
			<Meter.Track>
				<Meter.Indicator />
			</Meter.Track>
		</Meter.Root>
	),
} satisfies Meta<typeof Meter.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const confidenceThresholds = {
	high: 2,
	low: 1,
	optimum: 3,
} as const;

export const Playground: Story = {
	args: {
		high: 80,
		low: 50,
		optimum: 20,
	},
};

export const Variants: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8}>
			<Meter.Root value={64}>
				<Meter.Label>Storage used</Meter.Label>
				<Meter.Value />
				<Meter.Track>
					<Meter.Indicator />
				</Meter.Track>
			</Meter.Root>
			<Meter.Root
				{...confidenceThresholds}
				aria-valuetext="High confidence"
				max={3}
				value={3}
				variant="segmented"
			>
				<Meter.Label>High confidence</Meter.Label>
				<Meter.Track>
					<Meter.Indicator />
				</Meter.Track>
			</Meter.Root>
			<Meter.Root
				{...confidenceThresholds}
				aria-valuetext="Needs review"
				max={3}
				value={2}
				variant="segmented"
			>
				<Meter.Label>Switch to vanilla_madagascar</Meter.Label>
				<Meter.Value>{() => "Needs review"}</Meter.Value>
				<Meter.Track>
					<Meter.Indicator />
				</Meter.Track>
			</Meter.Root>
			<Meter.Root
				{...confidenceThresholds}
				aria-valuetext="No signal"
				max={3}
				value={0}
				variant="segmented"
			>
				<Meter.Label>Full restock across every SKU</Meter.Label>
				<Meter.Value>{() => "No signal"}</Meter.Value>
				<Meter.Track>
					<Meter.Indicator />
				</Meter.Track>
			</Meter.Root>
		</Stack>
	),
};

export const RangesAndThresholds: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8}>
			<Meter.Root value={0}>
				<Meter.Label>Empty range</Meter.Label>
				<Meter.Value />
				<Meter.Track>
					<Meter.Indicator />
				</Meter.Track>
			</Meter.Root>
			<Meter.Root aria-valuetext="18 of 25 seats used" max={25} value={18}>
				<Meter.Label>Seats in use</Meter.Label>
				<Meter.Value>{() => "18 of 25"}</Meter.Value>
				<Meter.Track>
					<Meter.Indicator />
				</Meter.Track>
			</Meter.Root>
			<Meter.Root high={80} low={50} max={100} optimum={20} value={35}>
				<Meter.Label>Healthy storage use</Meter.Label>
				<Meter.Value />
				<Meter.Track>
					<Meter.Indicator />
				</Meter.Track>
			</Meter.Root>
			<Meter.Root high={80} low={50} max={100} optimum={20} value={65}>
				<Meter.Label>Storage use approaching capacity</Meter.Label>
				<Meter.Value />
				<Meter.Track>
					<Meter.Indicator />
				</Meter.Track>
			</Meter.Root>
			<Meter.Root high={80} low={50} max={100} optimum={20} value={90}>
				<Meter.Label>Storage use over threshold</Meter.Label>
				<Meter.Value />
				<Meter.Track>
					<Meter.Indicator />
				</Meter.Track>
			</Meter.Root>
			<Meter.Root value={100}>
				<Meter.Label>Full range</Meter.Label>
				<Meter.Value />
				<Meter.Track>
					<Meter.Indicator />
				</Meter.Track>
			</Meter.Root>
		</Stack>
	),
};
