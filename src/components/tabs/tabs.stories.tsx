import { FolderSimpleIcon } from "@phosphor-icons/react/dist/csr/FolderSimple";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Box, Grid, Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { Tabs, type TabsSize, type TabsVariant } from "./tabs";

const iconOptions = {
	None: undefined,
	Folder: <FolderSimpleIcon aria-hidden weight="duotone" />,
	Settings: <GearIcon aria-hidden weight="duotone" />,
};

type TabsPlaygroundArgs = {
	activateOnFocus: boolean;
	defaultValue: string;
	disabled: boolean;
	endSlot: ReactNode;
	orientation: "horizontal" | "vertical";
	size: TabsSize;
	startSlot: ReactNode;
	variant: TabsVariant;
};

type ExampleTabsProps = Partial<TabsPlaygroundArgs>;

const meta = {
	title: "Components/Tabs",
	component: Tabs.Root,
	args: {
		activateOnFocus: false,
		defaultValue: "overview",
		disabled: false,
		endSlot: undefined,
		orientation: "horizontal",
		size: "md",
		startSlot: <FolderSimpleIcon aria-hidden weight="duotone" />,
		variant: "default",
	},
	argTypes: {
		activateOnFocus: { control: "boolean" },
		defaultValue: {
			control: "select",
			options: ["overview", "projects", "account"],
		},
		disabled: { control: "boolean" },
		endSlot: {
			control: "select",
			mapping: iconOptions,
			options: Object.keys(iconOptions),
		},
		orientation: {
			control: "inline-radio",
			options: ["horizontal", "vertical"],
		},
		size: {
			control: "inline-radio",
			options: ["sm", "md", "lg"],
		},
		startSlot: {
			control: "select",
			mapping: iconOptions,
			options: Object.keys(iconOptions),
		},
		variant: {
			control: "inline-radio",
			options: ["default", "underline"],
		},
	},
	parameters: {
		controls: {
			include: [
				"activateOnFocus",
				"defaultValue",
				"disabled",
				"endSlot",
				"orientation",
				"size",
				"startSlot",
				"variant",
			],
		},
	},
	decorators: [
		(Story) => (
			<Box maxWidth="48rem" width="100%">
				<Story />
			</Box>
		),
	],
} satisfies Meta<TabsPlaygroundArgs>;

export default meta;
type Story = StoryObj<TabsPlaygroundArgs>;

export const Playground: Story = {
	render: (args) => <ExampleTabs {...args} />,
};

export const Variants: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={6}>
			<Stack gap={2} minWidth={0}>
				<Text color="muted" size="1">
					Default
				</Text>
				<ExampleTabs />
			</Stack>
			<Stack gap={2} minWidth={0}>
				<Text color="muted" size="1">
					Underline
				</Text>
				<ExampleTabs variant="underline" />
			</Stack>
		</Stack>
	),
};

export const Sizes: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={6}>
			{(["sm", "md", "lg"] as const).map((size) => (
				<Stack key={size} gap={2} minWidth={0}>
					<Text color="muted" size="1">
						{size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
					</Text>
					<Tabs.Root defaultValue="overview" size={size}>
						<Tabs.List>
							<Tabs.Tab value="overview">Overview</Tabs.Tab>
							<Tabs.Tab value="projects">Projects</Tabs.Tab>
							<Tabs.Tab value="account">Account</Tabs.Tab>
						</Tabs.List>
					</Tabs.Root>
				</Stack>
			))}
		</Stack>
	),
};

export const Orientations: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Grid gap={8} xstyle={storyStyles.orientationGrid}>
			<Stack data-testid="horizontal-underline-tabs" gap={2} minWidth={0}>
				<Text color="muted" size="1">
					Horizontal
				</Text>
				<ExampleTabs variant="underline" />
			</Stack>
			<Stack data-testid="vertical-underline-tabs" gap={2} minWidth={0}>
				<Text color="muted" size="1">
					Vertical
				</Text>
				<ExampleTabs orientation="vertical" variant="underline" />
			</Stack>
		</Grid>
	),
};

export const States: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Tabs.Root defaultValue="selected">
			<Tabs.List>
				<Tabs.Tab startSlot={<FolderSimpleIcon aria-hidden weight="duotone" />} value="selected">
					Selected
				</Tabs.Tab>
				<Tabs.Tab startSlot={<GearIcon aria-hidden weight="duotone" />} value="unselected">
					Unselected
				</Tabs.Tab>
				<Tabs.Tab disabled value="disabled">
					Disabled
				</Tabs.Tab>
			</Tabs.List>
		</Tabs.Root>
	),
};

function ExampleTabs({
	activateOnFocus = false,
	defaultValue = "overview",
	disabled = false,
	endSlot,
	orientation = "horizontal",
	size = "md",
	startSlot,
	variant = "default",
}: ExampleTabsProps) {
	return (
		<Tabs.Root
			key={`${defaultValue}-${orientation}-${size}-${variant}`}
			defaultValue={defaultValue}
			orientation={orientation}
			size={size}
			variant={variant}
		>
			<Tabs.List activateOnFocus={activateOnFocus}>
				<Tabs.Tab endSlot={endSlot} startSlot={startSlot} value="overview">
					Overview
				</Tabs.Tab>
				<Tabs.Tab value="projects">Projects</Tabs.Tab>
				<Tabs.Tab disabled={disabled} value="account">
					Account
				</Tabs.Tab>
			</Tabs.List>
			<Tabs.Content>
				<Tabs.Panel value="overview">
					<Text>Workspace stats and recent activity.</Text>
				</Tabs.Panel>
				<Tabs.Panel value="projects">
					<Text>Milestones, deadlines, and project ownership.</Text>
				</Tabs.Panel>
				<Tabs.Panel value="account">
					<Text>Profile details and account preferences.</Text>
				</Tabs.Panel>
			</Tabs.Content>
		</Tabs.Root>
	);
}

const storyStyles = stylex.create({
	orientationGrid: {
		gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
	},
});
