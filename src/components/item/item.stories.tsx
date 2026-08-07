import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { BlueprintIcon } from "@phosphor-icons/react/dist/csr/Blueprint";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { FolderOpenIcon } from "@phosphor-icons/react/dist/csr/FolderOpen";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";
import { Avatar } from "@/components/avatar/avatar";
import { Badge } from "@/components/badge/badge";
import { Separator } from "@/components/separator/separator";
import { Text } from "@/components/text/text";
import { Item, type ItemDescriptionLayout, type ItemProps } from "./item";

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

const descriptionLayouts = ["stack", "inline", "inline-wrap"] as const satisfies readonly ItemDescriptionLayout[];

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
		render: { control: false },
		startSlot: { control: false },
	},
	decorators: [
		(Story) => (
			<div {...stylex.props(storyStyles.frame)}>
				<Story />
			</div>
		),
	],
	parameters: {
		controls: {
			include: ["label", "description", "descriptionLayout", "_startSlot", "_endSlot"],
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
	render: ({ _endSlot, _startSlot, description, descriptionLayout, label }) => (
		<Item
			description={description}
			descriptionLayout={descriptionLayout}
			endSlot={endSlotOptions[_endSlot]}
			label={label}
			startSlot={startSlotOptions[_startSlot]}
		/>
	),
};

export const Layouts: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.stack)}>
			{descriptionLayouts.map((layout) => (
				<section key={layout}>
					<h2 {...stylex.props(storyStyles.heading)}>{layout}</h2>
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
				</section>
			))}
		</div>
	),
};

export const Examples: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.stack)}>
			<section>
				<h2 {...stylex.props(storyStyles.heading)}>Settings row</h2>
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
			</section>
			<Separator />
			<section>
				<h2 {...stylex.props(storyStyles.heading)}>Avatar media</h2>
				<Item
					description="Last active 2 hours ago"
					descriptionLayout="inline"
					endSlot={<ArrowRightIcon aria-hidden size="1em" />}
					label="Ada Lovelace"
					startSlot={<Avatar initials="AL" name="Ada Lovelace" shape="rounded" size={8} />}
				/>
			</section>
			<Separator />
			<section>
				<h2 {...stylex.props(storyStyles.heading)}>Link row</h2>
				<Item
					description="Overview of your account and recent activity."
					label="Dashboard"
					render={<a href="#dashboard" />}
					startSlot={<BlueprintIcon aria-hidden size="1.25em" weight="duotone" />}
					endSlot={<ArrowRightIcon aria-hidden size="1em" />}
				/>
			</section>
			<Separator />
			<section>
				<h2 {...stylex.props(storyStyles.heading)}>Label only</h2>
				<Item label="Notifications" endSlot={<CopyIcon aria-hidden size="1em" />} />
			</section>
			<Separator />
			<section>
				<h2 {...stylex.props(storyStyles.heading)}>Inline wrap</h2>
				<Item
					description="Use when a short meta string should sit beside the label and continue onto the next line if needed."
					descriptionLayout="inline-wrap"
					label="Workspace storage"
					startSlot={<FolderOpenIcon aria-hidden size="1.25em" weight="duotone" />}
				/>
			</section>
		</div>
	),
};

const storyStyles = stylex.create({
	frame: {
		maxWidth: "28rem",
	},
	stack: {
		gap: tokens["--space-6"],
		display: "flex",
		flexDirection: "column",
	},
	heading: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-regular"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		marginBlockEnd: tokens["--space-2"],
	},
});
