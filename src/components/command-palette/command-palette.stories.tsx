import {
	BookOpenTextIcon,
	CirclesThreePlusIcon,
	MagnifyingGlassIcon,
	NotificationIcon,
	ToolboxIcon,
	UserCircleGearIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Kbd } from "@/components/kbd/kbd";
import { Box, Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
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
				icon: <CirclesThreePlusIcon weight="duotone" aria-hidden />,
			},
			{
				id: "search-docs",
				title: "Search documentation",
				description: "Find component APIs and patterns.",
				group: "Suggestions",
				keywords: "docs help reference",
				shortcut: "/",
				icon: <BookOpenTextIcon weight="duotone" aria-hidden />,
			},
		],
	},
	{
		id: "settings",
		label: "Settings",
		items: [
			{
				id: "profile",
				title: "Edit profile",
				description: "Manage account details and preferences.",
				group: "Settings",
				keywords: "user account person",
				icon: <UserCircleGearIcon weight="duotone" aria-hidden />,
			},
			{
				id: "notifications",
				title: "Notification preferences",
				description: "Choose which events send alerts.",
				group: "Settings",
				keywords: "alerts messages bell",
				icon: <NotificationIcon weight="duotone" aria-hidden />,
			},
			{
				id: "workspace-settings",
				title: "Workspace settings",
				description: "Configure project defaults.",
				group: "Settings",
				keywords: "preferences configure",
				shortcut: "⌘,",
				icon: <ToolboxIcon weight="duotone" aria-hidden />,
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
		<Box width="min(100%, 680px)">
			<CommandPalette.Root inline items={commandGroups} itemToStringValue={commandToStringValue}>
				<CommandPalette.Input placeholder="Search inline commands…" />
				<CommandResults />
				<CommandPalette.Empty />
			</CommandPalette.Root>
		</Box>
	),
};

export const ShortcutArbitration: Story = {
	render: () => <ShortcutArbitrationFixture />,
};

function ShortcutArbitrationFixture() {
	const [firstOpen, setFirstOpen] = useState(false);
	const [secondOpen, setSecondOpen] = useState(false);
	const [firstOpens, setFirstOpens] = useState(0);
	const [secondOpens, setSecondOpens] = useState(0);
	const [rerenderCount, setRerenderCount] = useState(0);
	const [secondMounted, setSecondMounted] = useState(true);

	function handleFirstOpenChange(open: boolean) {
		setFirstOpen(open);
		if (open) {
			setFirstOpens((count) => count + 1);
		}
	}

	function handleSecondOpenChange(open: boolean) {
		setSecondOpen(open);
		if (open) {
			setSecondOpens((count) => count + 1);
		}
	}

	function handleReservedShortcut(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key.toLocaleLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
		}
	}

	return (
		<Stack align="start" gap={3}>
			<Stack align="center" gap={2} orientation="horizontal" wrap="wrap">
				<button
					data-testid="command-rerender"
					type="button"
					onClick={() => setRerenderCount((count) => count + 1)}
				>
					Rerender callbacks
				</button>
				<Text data-testid="rerender-count" data-value={rerenderCount} size="2">
					Rerenders: {rerenderCount}
				</Text>
			</Stack>
			<button
				data-testid="command-unmount-second"
				type="button"
				onClick={() => setSecondMounted(false)}
				disabled={!secondMounted}
			>
				Unmount second palette
			</button>
			<input
				aria-label="Reserved shortcut input"
				data-testid="command-reserved-input"
				onKeyDown={handleReservedShortcut}
			/>
			<Stack align="center" gap={2} orientation="horizontal" wrap="wrap">
				<Text data-testid="first-open-count" data-value={firstOpens} size="2">
					First opens: {firstOpens}
				</Text>
				<Text data-testid="second-open-count" data-value={secondOpens} size="2">
					Second opens: {secondOpens}
				</Text>
			</Stack>
			<CommandPalette.Root
				label="First command palette"
				open={firstOpen}
				onOpenChange={handleFirstOpenChange}
				shortcut
				items={commandGroups}
				itemToStringValue={commandToStringValue}
			>
				<CommandPalette.Input />
				<CommandResults />
				<CommandPalette.Empty />
			</CommandPalette.Root>
			{secondMounted ? (
				<CommandPalette.Root
					label="Second command palette"
					open={secondOpen}
					onOpenChange={handleSecondOpenChange}
					shortcut
					items={commandGroups}
					itemToStringValue={commandToStringValue}
				>
					<CommandPalette.Input />
					<CommandResults />
					<CommandPalette.Empty />
				</CommandPalette.Root>
			) : null}
		</Stack>
	);
}

function CommandPaletteExample({ shortcut = false }: { shortcut?: boolean }) {
	const [selectedCommand, setSelectedCommand] = useState<string | null>(null);

	function handleSelect(command: CommandAction) {
		setSelectedCommand(command.title);
	}

	return (
		<Stack align="start" gap={3}>
			<CommandPalette.Root
				shortcut={shortcut}
				trigger={
					<CommandPalette.Trigger startSlot={<MagnifyingGlassIcon weight="bold" aria-hidden />} />
				}
				items={commandGroups}
				itemToStringValue={commandToStringValue}
			>
				<CommandPalette.Input placeholder="Search actions, settings, and docs…" />
				<CommandResults onSelect={handleSelect} />
				<CommandPalette.Empty />
				<CommandPalette.Footer>
					<Text render={<Stack align="center" gap={2} orientation="horizontal" />} size="2">
						<Kbd size="sm">↑↓</Kbd>
						Navigate
					</Text>
					<Text render={<Stack align="center" gap={2} orientation="horizontal" />} size="2">
						<Kbd size="sm">↵</Kbd>
						Select
					</Text>
				</CommandPalette.Footer>
			</CommandPalette.Root>
			<Text color="muted" size="2" aria-live="polite">
				{selectedCommand
					? `Last selected: ${selectedCommand}`
					: "Open the palette or press command K."}
			</Text>
		</Stack>
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
								onClick={() => onSelect?.(command)}
							>
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
