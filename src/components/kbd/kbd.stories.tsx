import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Badge } from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { Box, Stack } from "@/components/layout";
import { Tabs } from "@/components/tabs/tabs";
import { Text } from "@/components/text/text";
import { Tooltip } from "@/components/tooltip/tooltip";
import { tokens } from "@/theme/tokens.stylex";
import { Kbd, KbdGroup } from "./kbd";

const meta = {
	title: "Components/Kbd",
	component: Kbd,
	args: {
		children: "⌘ K",
		size: "md",
		variant: "default",
	},
	argTypes: {
		children: { control: "text" },
		size: {
			control: "inline-radio",
			options: ["sm", "md"],
		},
		variant: {
			control: "inline-radio",
			options: ["default", "inverse", "outline", "plain"],
		},
	},
	parameters: {
		controls: {
			include: ["children", "size", "variant"],
		},
	},
	decorators: [
		(Story) => (
			<Box maxWidth="32rem" width="full">
				<Story />
			</Box>
		),
	],
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Group: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<KbdGroup>
			<Kbd>⌘</Kbd>
			<Kbd>⇧</Kbd>
			<Kbd>P</Kbd>
		</KbdGroup>
	),
};

export const Composition: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={8}>
			<Stack align="start" gap={3}>
				<Text color="muted" size="1">
					Tooltip shortcut
				</Text>
				<Tooltip.Provider>
					<Tooltip.Root defaultOpen>
						<Tooltip.Trigger render={<Button variant="secondary">Show keyboard shortcut</Button>} />
						<Tooltip.Popup>
							<span {...stylex.props(storyStyles.tooltipContent)}>
								Open command menu
								<Kbd me={-0.5} size="sm" variant="inverse">
									⌘K
								</Kbd>
							</span>
						</Tooltip.Popup>
					</Tooltip.Root>
				</Tooltip.Provider>
			</Stack>

			<Stack align="start" gap={3}>
				<Text color="muted" size="1">
					Button end slot
				</Text>
				<Button endSlot={<Kbd>⌘K</Kbd>} variant="secondary">
					Open command menu
				</Button>
			</Stack>

			<Stack align="start" gap={3}>
				<Text color="muted" size="1">
					Tabs end slot
				</Text>
				<Tabs.Root defaultValue="overview">
					<Tabs.List>
						<Tabs.Tab endSlot={<Kbd>⌘1</Kbd>} value="overview">
							Overview
						</Tabs.Tab>
						<Tabs.Tab value="settings">Settings</Tabs.Tab>
					</Tabs.List>
					<Tabs.Content>
						<Tabs.Panel value="overview">
							<Text>Workspace stats and recent activity.</Text>
						</Tabs.Panel>
						<Tabs.Panel value="settings">
							<Text>Workspace preferences and permissions.</Text>
						</Tabs.Panel>
					</Tabs.Content>
				</Tabs.Root>
			</Stack>

			<Stack align="start" gap={3}>
				<Text color="muted" size="1">
					Badge w/ Kbd
				</Text>
				<Badge variant="elevated" pe={0.5}>
					View actions <Kbd size="sm">⌘K</Kbd>
				</Badge>
			</Stack>
		</Stack>
	),
};

const storyStyles = stylex.create({
	tooltipContent: {
		gap: tokens["--space-1"],
		alignItems: "center",
		display: "inline-flex",
	},
});
