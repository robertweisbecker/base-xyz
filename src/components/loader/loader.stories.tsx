import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { Loader, type LoaderProps } from "./loader";

type LoaderStoryArgs = LoaderProps & {
	_color: string;
	_fontSize: number;
};

const meta = {
	title: "Components/Loader",
	component: Loader,
	args: {
		"aria-label": "Loading",
		_color: "#1677ff",
		_fontSize: 24,
	},
	argTypes: {
		"aria-label": { control: "text" },
		_color: { control: "color", name: "color" },
		_fontSize: {
			control: { type: "range", min: 8, max: 64, step: 1 },
			name: "fontSize",
		},
	},
	parameters: {
		controls: {
			include: ["aria-label", "_fontSize", "_color"],
		},
	},
} satisfies Meta<LoaderStoryArgs>;

export default meta;
type Story = StoryObj<LoaderStoryArgs>;

export const Playground: Story = {
	render: ({ _color, _fontSize, ...props }) => (
		<span style={{ color: _color, fontSize: _fontSize }}>
			<Loader {...props} />
		</span>
	),
};

export const Examples: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={4}>
			<Text size="1" color="muted">
				Loader inherits font-size and color:
			</Text>
			<Text size="1" render={<Stack align="center" gap={2} orientation="horizontal" />}>
				<Loader aria-hidden /> Loading (12px)
			</Text>

			<Text size="3" render={<Stack align="center" gap={2} orientation="horizontal" />} color="accent">
				<Loader aria-hidden /> Loading (16px)
			</Text>

			<Text size="6" render={<Stack align="center" gap={3} orientation="horizontal" />} color="error">
				<Loader aria-hidden /> Loading (24px)
			</Text>
		</Stack>
	),
};
