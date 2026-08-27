import { Icon } from "@/components/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@/components/layout";
import { Text } from "@/components/text/text";
import { tokens } from "@/theme/tokens.stylex";
import { MeterGauge, type MeterGaugeSize } from "./meter-gauge";

const sizes = [16, 20, 32, 64, 128] as const satisfies readonly MeterGaugeSize[];

const meta = {
	title: "Components/MeterGauge",
	component: MeterGauge,
	args: {
		arc: "primary",
		label: "Storage used",
		showValue: true,
		size: 64,
		value: 64,
	},
	argTypes: {
		arc: {
			control: "inline-radio",
			options: ["primary", "equal"],
		},
		label: { control: "text" },
		showValue: { control: "boolean" },
		size: {
			control: "select",
			options: sizes,
		},
		value: {
			control: { max: 100, min: 0, step: 1, type: "range" },
		},
	},
	parameters: {
		controls: {
			include: ["value", "size", "arc", "showValue", "label"],
		},
	},
} satisfies Meta<typeof MeterGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={8}>
			<Stack gap={3}>
				<Text color="muted" size="1">
					Sizes
				</Text>
				<Stack align="center" gap={6} orientation="horizontal">
					{sizes.map((size) => (
						<MeterGauge aria-label={`${size} pixel gauge`} key={size} size={size} value={64} />
					))}
				</Stack>
			</Stack>

			<Stack gap={3}>
				<Text color="muted" size="1">
					Arc priority
				</Text>
				<Stack align="center" gap={6} orientation="horizontal">
					<MeterGauge aria-label="Primary arc priority" size={64} value={50} />
					<MeterGauge arc="equal" aria-label="Equal arc priority" size={64} value={50} />
				</Stack>
			</Stack>

			<Stack gap={3}>
				<Text color="muted" size="1">
					Custom content
				</Text>
				<MeterGauge
					aria-label="Quota available"
					fillColor={tokens["--fill-success"]}
					size={64}
					value={100}
				>
					<Icon.Checkmark width={"1.5em"} height={"1.5em"} />
				</MeterGauge>
			</Stack>
		</Stack>
	),
};
