import { Icon } from "@/components/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Stack } from "@/components/layout/layout";
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
			<section {...stylex.props(storyStyles.section)}>
				<Text color="muted" size="1">
					Sizes
				</Text>
				<div {...stylex.props(storyStyles.row)}>
					{sizes.map((size) => (
						<MeterGauge aria-label={`${size} pixel gauge`} key={size} size={size} value={64} />
					))}
				</div>
			</section>

			<section {...stylex.props(storyStyles.section)}>
				<Text color="muted" size="1">
					Arc priority
				</Text>
				<div {...stylex.props(storyStyles.row)}>
					<MeterGauge aria-label="Primary arc priority" size={64} value={50} />
					<MeterGauge arc="equal" aria-label="Equal arc priority" size={64} value={50} />
				</div>
			</section>

			<section {...stylex.props(storyStyles.section)}>
				<Text color="muted" size="1">
					Custom content
				</Text>
				<MeterGauge aria-label="Quota available" fillColor={tokens["--fill-success"]} size={64} value={100}>
					<Icon.Checkmark width={"1.5em"} height={"1.5em"} />
				</MeterGauge>
			</section>
		</Stack>
	),
};

const storyStyles = stylex.create({
	row: {
		gap: tokens["--space-6"],
		alignItems: "center",
		display: "flex",
	},
	section: {
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
	},
});
