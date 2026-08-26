import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Stack } from "@/components/layout/layout";
import { Separator } from "@/components/separator/separator";
import { Text } from "@/components/text/text";
import { List, type ListItemProps, type ListRootProps } from ".";

const markerOptions = {
	None: undefined,
	Arrow: <ArrowRightIcon aria-hidden weight="bold" />,
	Check: <CheckCircleIcon aria-hidden weight="duotone" />,
	Information: <InfoIcon aria-hidden weight="duotone" />,
};

type ListStoryArgs = ListRootProps & Pick<ListItemProps, "marker">;

const meta = {
	title: "Components/List",
	component: List.Root,
	args: {
		color: "default",
		marker: undefined,
		ordered: false,
		size: "2",
	},
	argTypes: {
		children: { control: false },
		color: {
			control: "select",
			options: ["default", "subtle", "muted", "accent", "error", "success", "warning", "inherit"],
		},
		marker: {
			control: "select",
			mapping: markerOptions,
			options: Object.keys(markerOptions),
		},
		ordered: { control: "boolean" },
		size: { control: "select", options: ["1", "2", "3", "4", "5", "6", "7", "8", "9"] },
	},
	parameters: {
		controls: {
			include: ["ordered", "size", "color", "marker"],
		},
		docs: {
			description: {
				component:
					"A semantic ordered or unordered list with restrained markers, nested marker differentiation, and inheritable typography defaults. A custom marker on a direct List.Item child makes its root unordered; wrapper components should set ordered to false.",
			},
		},
	},
	decorators: [
		(Story) => (
			<Box maxWidth="36rem">
				<Story />
			</Box>
		),
	],
} satisfies Meta<ListStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: ({ marker, ...args }) => (
		<List.Root data-testid="list-playground" {...args}>
			<List.Item marker={marker}>Write the release notes.</List.Item>
			<List.Item>Run the accessibility checks.</List.Item>
			<List.Item>Publish the package.</List.Item>
		</List.Root>
	),
};

export const Examples: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={6}>
			<Example label="Unordered and nested">
				<List.Root data-testid="unordered-list-example">
					<List.Item>Install dependencies.</List.Item>
					<List.Item>
						Configure the project.
						<List.Root>
							<List.Item>Choose the theme.</List.Item>
							<List.Item>
								Enable integrations.
								<List.Root>
									<List.Item>Add error reporting.</List.Item>
									<List.Item>Add analytics.</List.Item>
								</List.Root>
							</List.Item>
						</List.Root>
					</List.Item>
					<List.Item>Start the development server.</List.Item>
				</List.Root>
			</Example>
			<Separator />
			<Example label="Ordered and nested">
				<List.Root data-testid="ordered-list-example" ordered>
					<List.Item>Draft the proposal.</List.Item>
					<List.Item>
						Collect feedback.
						<List.Root ordered>
							<List.Item>Review product requirements.</List.Item>
							<List.Item>Review technical constraints.</List.Item>
						</List.Root>
					</List.Item>
					<List.Item>Approve the final scope.</List.Item>
				</List.Root>
			</Example>
			<Separator />
			<Example label="Custom item markers">
				<List.Root data-testid="custom-marker-list-example" size="3">
					<List.Item marker={<CheckCircleIcon aria-hidden weight="duotone" />}>TypeScript passes.</List.Item>
					<List.Item marker={<CheckCircleIcon aria-hidden weight="duotone" />} color="success">
						The production build completed successfully, including a deliberately long line that wraps beneath its text rather
						than beneath the icon marker.
					</List.Item>
					<List.Item marker={<ArrowRightIcon aria-hidden weight="bold" />} fontWeight="semibold">
						Ready to publish.
					</List.Item>
				</List.Root>
			</Example>
		</Stack>
	),
};

function Example({ children, label }: { children: React.ReactNode; label: string }) {
	return (
		<Stack gap={2}>
			<Text color="muted" size="1">
				{label}
			</Text>
			{children}
		</Stack>
	);
}
