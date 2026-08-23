import type { Meta, StoryObj } from "@storybook/react-vite";
import x from "@stylexjs/atoms";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { InfoTip, type InfoTipProps } from "./info-tip";

const sizes = ["xs", "sm", "md", "lg"] as const;

const meta = {
	title: "Components/Info tip",
	component: InfoTip,
	args: {
		content: "This setting applies to everyone in the workspace.",
		help: false,
		size: "sm",
	} satisfies Partial<InfoTipProps>,
	argTypes: {
		content: { control: "text" },
		help: { control: "boolean" },
		size: { control: "inline-radio", options: sizes },
	},
	parameters: {
		controls: {
			include: ["content", "help", "size"],
		},
	},
	decorators: [
		(Story) => (
			<Stack align="center" justify="center" p={8}>
				<Story />
			</Stack>
		),
	],
} satisfies Meta<typeof InfoTip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={5}>
			{[
				{ help: false, label: "Information" },
				{ help: true, label: "Help" },
			].map((option) => (
				<Stack key={option.label} align="center" gap={4} orientation="horizontal">
					<Text color="muted" size="1" xstyle={x.minWidth("5rem")}>
						{option.label}
					</Text>
					<Stack align="center" gap={3} wrap="wrap">
						{sizes.map((size) => (
							<InfoTip
								key={size}
								content={`${option.label} (${size})`}
								help={option.help}
								size={size}
							/>
						))}
					</Stack>
				</Stack>
			))}
			<Stack align="center" gap={4} orientation="horizontal">
				<Text color="muted" size="1" xstyle={x.minWidth("5rem")}>
					Rich content
				</Text>
				<InfoTip
					help
					content={
						<Stack gap={1}>
							<Text fontWeight="medium">Workspace visibility</Text>
							<Text color="muted">Only members of this workspace can view the project.</Text>
						</Stack>
					}
				/>
			</Stack>
		</Stack>
	),
};
