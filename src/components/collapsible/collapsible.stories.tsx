import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "@/components/code-block/code-block";
import { Heading } from "@/components/heading/heading";
import { Box, Stack } from "@/components/layout/layout";
import { Separator } from "@/components/separator/separator";
import { Collapsible, type CollapsibleTriggerSize, type CollapsibleTriggerVariant } from "./collapsible";

type StoryArgs = {
	defaultOpen: boolean;
	disabled: boolean;
	_hiddenUntilFound: boolean;
	_iconSide: "start" | "end";
	_size: CollapsibleTriggerSize;
	_variant: CollapsibleTriggerVariant;
};

const meta = {
	title: "Components/Collapsible",
	args: {
		defaultOpen: false,
		disabled: false,
		_hiddenUntilFound: false,
		_iconSide: "end",
		_size: "md",
		_variant: "default",
	},
	argTypes: {
		defaultOpen: { control: "boolean" },
		disabled: { control: "boolean" },
		_hiddenUntilFound: { control: "boolean" },
		_iconSide: { control: "inline-radio", options: ["start", "end"] },
		_size: { control: "select", options: ["xs", "sm", "md", "lg"] },
		_variant: { control: "select", options: ["default", "link"] },
	},
	decorators: [
		(Story) => (
			<Box maxWidth="520px">
				<Story />
			</Box>
		),
	],
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

export const Playground: Story = {
	render: ({ defaultOpen, disabled, _hiddenUntilFound, _iconSide, _size, _variant }) => (
		<Collapsible.Root
			key={`${defaultOpen}-${disabled}-${_hiddenUntilFound}-${_iconSide}-${_size}-${_variant}`}
			defaultOpen={defaultOpen}
			disabled={disabled}>
			<Collapsible.Trigger size={_size} variant={_variant}>
				{_iconSide === "start" ? <Collapsible.Icon side="start" /> : null}
				Deployment details
				{_iconSide === "end" ? <Collapsible.Icon /> : null}
			</Collapsible.Trigger>
			<Collapsible.Panel hiddenUntilFound={_hiddenUntilFound}>
				<Collapsible.Content>
					<span>Production · US West</span>
					<span>Last deployed 12 minutes ago</span>
				</Collapsible.Content>
			</Collapsible.Panel>
		</Collapsible.Root>
	),
};

export const Examples: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8}>
			<ExampleSection title="Basic">
				<Example label="Request details">
					The request reads project metadata and does not modify your workspace.
				</Example>
			</ExampleSection>
			<Separator />
			<ExampleSection title="Default open">
				<Example defaultOpen label="Included files">
					<span>release-notes.md</span>
					<span>migration-guide.md</span>
				</Example>
			</ExampleSection>
			<Separator />
			<ExampleSection title="Leading icon">
				<Collapsible.Root>
					<Collapsible.Trigger size="xs">
						<Collapsible.Icon side="start" />
						Permission details
					</Collapsible.Trigger>
					<Collapsible.Panel>
						<Collapsible.Content>
							<CodeBlock>{'{ "permission": "project:read" }'}</CodeBlock>
						</Collapsible.Content>
					</Collapsible.Panel>
				</Collapsible.Root>
			</ExampleSection>
			<Separator />
			<ExampleSection title="Link">
				<Example label="Show deployment details" variant="link">
					Production · US West
				</Example>
			</ExampleSection>
			<Separator />
			<ExampleSection title="Nested">
				<Collapsible.Root>
					<Collapsible.Trigger>
						Advanced options
						<Collapsible.Icon />
					</Collapsible.Trigger>
					<Collapsible.Panel>
						<Collapsible.Content>
							<Example label="Environment variables">
								Two variables will be inherited from the production environment.
							</Example>
						</Collapsible.Content>
					</Collapsible.Panel>
				</Collapsible.Root>
			</ExampleSection>
			<Separator />
			<ExampleSection title="Disabled">
				<Example disabled label="Activity summary">
					Activity is unavailable while the workspace is offline.
				</Example>
			</ExampleSection>
		</Stack>
	),
};

function ExampleSection({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<Stack align="start" gap={4}>
			<Heading size="1" color="muted" fontWeight="regular">
				{title}
			</Heading>
			{children}
		</Stack>
	);
}

function Example({
	children,
	defaultOpen,
	disabled,
	label,
	variant,
}: {
	children: React.ReactNode;
	defaultOpen?: boolean;
	disabled?: boolean;
	label: string;
	variant?: CollapsibleTriggerVariant;
}) {
	return (
		<Collapsible.Root defaultOpen={defaultOpen} disabled={disabled}>
			<Collapsible.Trigger variant={variant}>
				{label}
				<Collapsible.Icon />
			</Collapsible.Trigger>
			<Collapsible.Panel>
				<Collapsible.Content>{children}</Collapsible.Content>
			</Collapsible.Panel>
		</Collapsible.Root>
	);
}
