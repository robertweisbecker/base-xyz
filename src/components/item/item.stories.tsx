import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { BlueprintIcon } from "@phosphor-icons/react/dist/csr/Blueprint";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { FolderOpenIcon } from "@phosphor-icons/react/dist/csr/FolderOpen";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Avatar } from "@/components/avatar/avatar";
import { Badge } from "@/components/badge/badge";
import { Box, Stack } from "@/components/layout/layout";
import { Separator } from "@/components/separator/separator";
import { Text } from "@/components/text/text";
import { Item, type ItemDescriptionLayout, type ItemProps, type ItemVariant } from "./item";

const startSlotOptions = {
	None: undefined,
	Blueprint: <BlueprintIcon aria-hidden size="1.25em" weight="duotone" />,
	Folder: <FolderOpenIcon aria-hidden size="1.25em" weight="duotone" />,
	Avatar: <Avatar initials="AL" name="Ada Lovelace" shape="rounded" size={8} />,
};

const endSlotOptions = {
	None: undefined,
	Badge: (
		<Badge hue="accent" size="sm" variant="subtle">
			Beta
		</Badge>
	),
	Copy: <CopyIcon aria-hidden size="1em" />,
	Arrow: <ArrowRightIcon aria-hidden size="1em" />,
	Kbd: (
		<Text color="muted" render={<kbd />} size="1">
			⌘K
		</Text>
	),
};

const descriptionLayouts = [
	"stack",
	"inline",
	"inline-wrap",
] as const satisfies readonly ItemDescriptionLayout[];
const itemVariants = ["default", "embedded"] as const satisfies readonly ItemVariant[];

type ItemStoryArgs = ItemProps & {
	_startSlot: keyof typeof startSlotOptions;
	_endSlot: keyof typeof endSlotOptions;
};

const meta = {
	title: "Components/Item",
	component: Item,
	args: {
		_endSlot: "Badge",
		_startSlot: "Blueprint",
		description: "Organize files, tasks, and collaborators in one place.",
		descriptionLayout: "stack",
		label: "Projects",
		variant: "default",
	},
	argTypes: {
		_endSlot: {
			control: "select",
			options: Object.keys(endSlotOptions),
		},
		_startSlot: {
			control: "select",
			options: Object.keys(startSlotOptions),
		},
		description: { control: "text" },
		descriptionLayout: {
			control: "inline-radio",
			options: descriptionLayouts,
		},
		endSlot: { control: false },
		label: { control: "text" },
		variant: { control: "inline-radio", options: itemVariants },
		render: { control: false },
		startSlot: { control: false },
	},
	decorators: [
		(Story) => (
			<Box xstyle={storyStyles.frame}>
				<Story />
			</Box>
		),
	],
	parameters: {
		controls: {
			include: ["label", "description", "descriptionLayout", "variant", "_startSlot", "_endSlot"],
		},
		docs: {
			description: {
				component:
					"A closed media-row layout for a leading visual, label, optional description, and trailing slot. Not a selectable menu item — Menu owns those rows.",
			},
		},
	},
} satisfies Meta<ItemStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: ({ _endSlot, _startSlot, description, descriptionLayout, label, variant }) => (
		<Item
			description={description}
			descriptionLayout={descriptionLayout}
			endSlot={endSlotOptions[_endSlot]}
			label={label}
			startSlot={startSlotOptions[_startSlot]}
			variant={variant}
		/>
	),
};

export const Layouts: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={6}>
			{descriptionLayouts.map((layout) => (
				<Stack key={layout} gap={2}>
					<Text color="muted" size="1">
						{layout}
					</Text>
					<Item
						description={
							layout === "inline-wrap"
								? "A longer supporting line that can continue onto the next row when space is tight."
								: "Supporting detail for the primary label."
						}
						descriptionLayout={layout}
						endSlot={
							<Badge hue="neutral" size="sm" variant="subtle">
								Optional
							</Badge>
						}
						label="Item label"
						startSlot={<BlueprintIcon aria-hidden size="1.25em" weight="duotone" />}
					/>
				</Stack>
			))}
		</Stack>
	),
};

export const Examples: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={6}>
			<Stack gap={2}>
				<Text color="muted" size="1">
					Settings row
				</Text>
				<Item
					description="Invite teammates and manage workspace roles."
					endSlot={
						<Badge hue="accent" size="sm" variant="subtle">
							Admin
						</Badge>
					}
					label="Members"
					startSlot={<FolderOpenIcon aria-hidden size="1.25em" weight="duotone" />}
				/>
			</Stack>
			<Separator />
			<Stack gap={2}>
				<Text color="muted" size="1">
					Avatar media
				</Text>
				<Item
					description="Last active 2 hours ago"
					descriptionLayout="inline"
					endSlot={<ArrowRightIcon aria-hidden size="1em" />}
					label="Ada Lovelace"
					startSlot={<Avatar initials="AL" name="Ada Lovelace" shape="rounded" size={8} />}
				/>
			</Stack>
			<Separator />
			<Stack gap={2}>
				<Text color="muted" size="1">
					Link row
				</Text>
				<Item
					description="Overview of your account and recent activity."
					label="Dashboard"
					render={<a href="#dashboard" />}
					startSlot={<BlueprintIcon aria-hidden size="1.25em" weight="duotone" />}
					endSlot={<ArrowRightIcon aria-hidden size="1em" />}
				/>
			</Stack>
			<Separator />
			<Stack gap={2}>
				<Text color="muted" size="1">
					Label only
				</Text>
				<Item label="Notifications" endSlot={<CopyIcon aria-hidden size="1em" />} />
			</Stack>
			<Separator />
			<Stack gap={2}>
				<Text color="muted" size="1">
					Inline wrap
				</Text>
				<Item
					description="Use when a short meta string should sit beside the label and continue onto the next line if needed."
					descriptionLayout="inline-wrap"
					label="Workspace storage"
					startSlot={<FolderOpenIcon aria-hidden size="1.25em" weight="duotone" />}
				/>
			</Stack>
		</Stack>
	),
};

const storyStyles = stylex.create({
	frame: {
		maxWidth: "28rem",
	},
});
