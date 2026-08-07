import {
	BellIcon,
	GearIcon,
	MagnifyingGlassIcon,
	PlusCircleIcon,
	UserCircleIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { Text } from "@/components/text/text";
import { tokens } from "@/theme/tokens.stylex";
import { CommandPalette } from "./command-palette";
type CommandAction = {
	id: string;
	description: string;
	group: string;
	icon: React.ReactNode;
	keywords: string;
	shortcut?: string;
	title: string;
};

type CommandGroup = {
	id: string;
	items: CommandAction[];
	label: string;
};

const commandGroups: CommandGroup[] = [
	{
		id: "suggestions",
		label: "Suggestions",
		items: [
			{
				id: "new-project",
				title: "Create project",
				description: "Start from an empty workspace.",
				group: "Suggestions",
				keywords: "new add worker application",
				shortcut: "N",
				icon: <PlusCircleIcon aria-hidden />,
			},
			{
				id: "search-docs",
				title: "Search documentation",
				description: "Find component APIs and patterns.",
				group: "Suggestions",
				keywords: "docs help reference",
				shortcut: "/",
				icon: <MagnifyingGlassIcon aria-hidden />,
			},
		],
	},
	{
		id: "settings",
		label: "Settings",
		items: [
			{
				id: "profile",
				title: "Open profile",
				description: "Manage account details and avatars.",
				group: "Settings",
				keywords: "user account person",
				icon: <UserCircleIcon aria-hidden />,
			},
			{
				id: "notifications",
				title: "Notification preferences",
				description: "Choose which events send alerts.",
				group: "Settings",
				keywords: "alerts messages bell",
				icon: <BellIcon aria-hidden />,
			},
			{
				id: "workspace-settings",
				title: "Workspace settings",
				description: "Configure project defaults.",
				group: "Settings",
				keywords: "preferences configure",
				shortcut: "⌘,",
				icon: <GearIcon aria-hidden />,
			},
		],
	},
];

const meta = {
	title: "Components/Command palette",
	component: CommandPalette.Root,
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<typeof CommandPalette.Root>;

export default meta;
type Story = StoryObj;

export const Playground: Story = {
	render: () => <CommandPaletteExample shortcut />,
};

export const Inline: Story = {
	render: () => (
		<div {...stylex.props(storyParts.inlineFrame)}>
			<CommandPalette.Root inline items={commandGroups} itemToStringValue={commandToStringValue}>
				<CommandPalette.Input placeholder="Search inline commands…" />
				<CommandResults />
				<CommandPalette.Empty />
			</CommandPalette.Root>
		</div>
	),
};

function CommandPaletteExample({ shortcut = false }: { shortcut?: boolean }) {
	const [selectedCommand, setSelectedCommand] = useState<string | null>(null);

	function handleSelect(command: CommandAction) {
		setSelectedCommand(command.title);
	}

	return (
		<div {...stylex.props(storyParts.example)}>
			<CommandPalette.Root
				shortcut={shortcut}
				trigger={<CommandPalette.Trigger startSlot={<MagnifyingGlassIcon aria-hidden />} />}
				items={commandGroups}
				itemToStringValue={commandToStringValue}>
				<CommandPalette.Input placeholder="Search actions, settings, and docs…" />
				<CommandResults onSelect={handleSelect} />
				<CommandPalette.Empty />
				<CommandPalette.Footer>
					<span {...stylex.props(storyParts.footerHint)}>
						<CommandPalette.Shortcut>↑↓</CommandPalette.Shortcut>
						Navigate
					</span>
					<span {...stylex.props(storyParts.footerHint)}>
						<CommandPalette.Shortcut>↵</CommandPalette.Shortcut>
						Select
					</span>
				</CommandPalette.Footer>
			</CommandPalette.Root>
			<Text color="muted" size="2" aria-live="polite">
				{selectedCommand ? `Last selected: ${selectedCommand}` : "Open the palette or press command K."}
			</Text>
		</div>
	);
}

function CommandResults({ onSelect }: { onSelect?: (command: CommandAction) => void }) {
	return (
		<CommandPalette.List>
			{(group: CommandGroup) => (
				<CommandPalette.Group key={group.id} items={group.items}>
					<CommandPalette.GroupLabel>{group.label}</CommandPalette.GroupLabel>
					<CommandPalette.Items>
						{(command: CommandAction) => (
							<CommandPalette.Item
								key={command.id}
								value={command}
								startSlot={command.icon}
								description={command.description}
								shortcut={command.shortcut}
								endSlot={!command.shortcut ? "Recently visited" : undefined}
								onClick={() => onSelect?.(command)}>
								{command.title}
							</CommandPalette.Item>
						)}
					</CommandPalette.Items>
				</CommandPalette.Group>
			)}
		</CommandPalette.List>
	);
}

/** Filters by command title (item name). Groups use their label. */
function commandToStringValue(item: CommandAction | CommandGroup) {
	if ("title" in item) {
		return item.title;
	}
	return item.label;
}

const storyParts = stylex.create({
	example: {
		gap: tokens["--space-3"],
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
	},
	inlineFrame: {
		width: "min(100%, 680px)",
	},
	footerHint: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "inline-flex",
	},
});
