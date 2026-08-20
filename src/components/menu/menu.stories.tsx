import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowSquareOutIcon } from "@phosphor-icons/react/dist/csr/ArrowSquareOut";
import { ArchiveIcon } from "@phosphor-icons/react/dist/csr/Archive";
import { BookOpenIcon } from "@phosphor-icons/react/dist/csr/BookOpen";
import { ChatCircleIcon } from "@phosphor-icons/react/dist/csr/ChatCircle";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { CreditCardIcon } from "@phosphor-icons/react/dist/csr/CreditCard";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/csr/EnvelopeSimple";
import { FilePlusIcon } from "@phosphor-icons/react/dist/csr/FilePlus";
import { GaugeIcon } from "@phosphor-icons/react/dist/csr/Gauge";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { LifebuoyIcon } from "@phosphor-icons/react/dist/csr/Lifebuoy";
import { LinkSimpleIcon } from "@phosphor-icons/react/dist/csr/LinkSimple";
import { PencilSimpleIcon } from "@phosphor-icons/react/dist/csr/PencilSimple";
import { RepeatIcon } from "@phosphor-icons/react/dist/csr/Repeat";
import { ShareNetworkIcon } from "@phosphor-icons/react/dist/csr/ShareNetwork";
import { SignOutIcon } from "@phosphor-icons/react/dist/csr/SignOut";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { textStyles } from "@/components/text/text.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { Button } from "@/components/button/button";
import { Menu } from "./menu";
import type { MenuItemSize, MenuItemVariant } from "./menu.types";
import { menuItemStyles, menuItemVariantStyles } from "./menu-item.stylex";
import { Text } from "@/components/text/text";

type MenuStoryArgs = {
	_side: "top" | "right" | "bottom" | "left";
	_align: "start" | "center" | "end";
	defaultOpen: boolean;
	_showShortcuts: boolean;
	_showSelectionItems: boolean;
	_disabledItem: boolean;
	_itemVariant: MenuItemVariant;
	size: MenuItemSize;
};

const meta = {
	title: "Components/Menu",
	args: {
		_side: "bottom",
		_align: "start",
		defaultOpen: true,
		_showShortcuts: true,
		_showSelectionItems: true,
		_disabledItem: true,
		_itemVariant: "default",
		size: "md",
	},
	argTypes: {
		_side: {
			control: "inline-radio",
			options: ["top", "right", "bottom", "left"],
		},
		_align: {
			control: "inline-radio",
			options: ["start", "center", "end"],
		},
		defaultOpen: { control: "boolean" },
		_showShortcuts: { control: "boolean" },
		_showSelectionItems: { control: "boolean" },
		_disabledItem: { control: "boolean" },
		_itemVariant: { control: "select", options: ["default", "primary", "error"] },
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
	},
} satisfies Meta<MenuStoryArgs>;

export default meta;
type Story = StoryObj<MenuStoryArgs>;

export const Playground: Story = {
	render: ({ _side, _align, defaultOpen, _showShortcuts, _showSelectionItems, _disabledItem, _itemVariant, size }) => (
		<Menu.Root
			key={`${_side}-${_align}-${defaultOpen}-${_showShortcuts}-${_showSelectionItems}-${_disabledItem}-${_itemVariant}-${size}`}
			defaultOpen={defaultOpen}
			size={size}>
			<Menu.Trigger render={<Button endSlot={<Menu.TriggerIcon />} variant="neutral" />}>Open menu</Menu.Trigger>
			<Menu.Popup positionerProps={{ side: _side, align: _align }}>
				<Menu.Item variant={_itemVariant}>
					<Menu.ItemIcon>
						<FilePlusIcon size={16} weight="regular" />
					</Menu.ItemIcon>
					<Menu.ItemLabel>New file</Menu.ItemLabel>
					{_showShortcuts ? <Menu.ItemShortcut>⌘N</Menu.ItemShortcut> : null}
				</Menu.Item>
				<Menu.Item variant={_itemVariant}>
					<Menu.ItemIcon>
						<CopyIcon size={16} weight="regular" />
					</Menu.ItemIcon>
					<Menu.ItemLabel>Duplicate</Menu.ItemLabel>
					{_showShortcuts ? <Menu.ItemShortcut>⌘D</Menu.ItemShortcut> : null}
				</Menu.Item>
				<Menu.Item disabled={_disabledItem} variant={_itemVariant}>
					<Menu.ItemIcon>
						<ArchiveIcon size={16} weight="regular" />
					</Menu.ItemIcon>
					<Menu.ItemLabel>Move to archive</Menu.ItemLabel>
				</Menu.Item>
				{_showSelectionItems ? (
					<>
						<Menu.Separator />
						<Menu.Group>
							<Menu.GroupLabel>View</Menu.GroupLabel>
							<Menu.CheckboxItem defaultChecked>
								<Menu.ItemLabel>Show sidebar</Menu.ItemLabel>
							</Menu.CheckboxItem>
						</Menu.Group>
						<Menu.Separator />
						<Menu.Group>
							<Menu.GroupLabel>Sort by</Menu.GroupLabel>
							<Menu.RadioGroup defaultValue="updated">
								<Menu.RadioItem value="updated">
									<Menu.ItemLabel>Last updated</Menu.ItemLabel>
								</Menu.RadioItem>
								<Menu.RadioItem value="name">
									<Menu.ItemLabel>Name</Menu.ItemLabel>
								</Menu.RadioItem>
							</Menu.RadioGroup>
						</Menu.Group>
					</>
				) : null}
			</Menu.Popup>
		</Menu.Root>
	),
};

export const ItemVariants: Story = {
	parameters: {
		controls: { disable: true },
		docs: {
			story: {
				height: "520px",
				inline: false,
			},
		},
	},
	render: () => (
		<Menu.Root defaultOpen>
			<Menu.Trigger render={<Button endSlot={<Menu.TriggerIcon />} variant="neutral" />}>Item variants</Menu.Trigger>
			<Menu.Popup positionerProps={{ align: "start" }} style={storyStyles.itemVariantsMenu}>
				<Menu.Group>
					<Menu.GroupLabel>Actions</Menu.GroupLabel>
					<Menu.Item>
						<Menu.ItemIcon>
							<FilePlusIcon size={16} weight="duotone" />
						</Menu.ItemIcon>
						<Menu.ItemLabel>Default item</Menu.ItemLabel>
						<Menu.ItemShortcut>⌘N</Menu.ItemShortcut>
					</Menu.Item>
					<Menu.Item variant="primary">
						<Menu.ItemIcon>
							<PencilSimpleIcon size={16} weight="duotone" />
						</Menu.ItemIcon>
						<Menu.ItemLabel>Primary item</Menu.ItemLabel>
						<Menu.ItemShortcut>⌘R</Menu.ItemShortcut>
					</Menu.Item>
					<Menu.Item disabled>
						<Menu.ItemIcon>
							<ArchiveIcon size={16} weight="duotone" />
						</Menu.ItemIcon>
						<Menu.ItemLabel>Disabled item</Menu.ItemLabel>
					</Menu.Item>
					<Menu.Item variant="error">
						<Menu.ItemIcon>
							<TrashIcon size={16} weight="duotone" />
						</Menu.ItemIcon>
						<Menu.ItemLabel>Error item</Menu.ItemLabel>
					</Menu.Item>
				</Menu.Group>
				<Menu.Separator />
				<Menu.Group>
					<Menu.GroupLabel>Links and nested items</Menu.GroupLabel>
					<Menu.LinkItem href="#documentation">
						<Menu.ItemIcon>
							<BookOpenIcon size={16} weight="duotone" />
						</Menu.ItemIcon>
						<Menu.ItemLabel>Link item</Menu.ItemLabel>
						<Menu.ItemShortcut>
							<ArrowSquareOutIcon aria-hidden size={14} weight="regular" />
						</Menu.ItemShortcut>
					</Menu.LinkItem>
					<Menu.SubmenuRoot>
						<Menu.SubmenuTrigger>
							<Menu.ItemIcon>
								<ShareNetworkIcon size={16} weight="duotone" />
							</Menu.ItemIcon>
							<Menu.ItemLabel>Submenu trigger</Menu.ItemLabel>
						</Menu.SubmenuTrigger>
						<Menu.Popup positionerProps={{ align: "start", side: "inline-end" }}>
							<Menu.Item>
								<Menu.ItemIcon>
									<LinkSimpleIcon size={16} weight="duotone" />
								</Menu.ItemIcon>
								<Menu.ItemLabel>Copy link</Menu.ItemLabel>
							</Menu.Item>
							<Menu.Item>
								<Menu.ItemIcon>
									<EnvelopeSimpleIcon size={16} weight="duotone" />
								</Menu.ItemIcon>
								<Menu.ItemLabel>Email</Menu.ItemLabel>
							</Menu.Item>
						</Menu.Popup>
					</Menu.SubmenuRoot>
				</Menu.Group>
				<Menu.Separator />
				<Menu.CollapsibleGroup defaultOpen>
					<Menu.CollapsibleGroupTrigger>
						<Menu.ItemIcon>
							<GaugeIcon size={16} weight="duotone" />
						</Menu.ItemIcon>
						<Menu.ItemLabel>Collapsible group trigger</Menu.ItemLabel>
					</Menu.CollapsibleGroupTrigger>
					<Menu.CollapsibleGroupPanel>
						<Menu.CheckboxItem defaultChecked>
							<Menu.ItemLabel>Checkbox item</Menu.ItemLabel>
							<Menu.ItemShortcut>On</Menu.ItemShortcut>
						</Menu.CheckboxItem>
						<Menu.RadioGroup defaultValue="compact">
							<Menu.RadioItem value="compact">
								<Menu.ItemLabel>Radio item selected</Menu.ItemLabel>
							</Menu.RadioItem>
							<Menu.RadioItem value="comfortable">
								<Menu.ItemLabel>Radio item</Menu.ItemLabel>
							</Menu.RadioItem>
						</Menu.RadioGroup>
					</Menu.CollapsibleGroupPanel>
				</Menu.CollapsibleGroup>
			</Menu.Popup>
		</Menu.Root>
	),
};

export const SharedRowParity: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.parityGrid)}>
			{(["Menu source", "Select borrower", "Combobox borrower"] as const).map((owner, index) => (
				<section key={owner} {...stylex.props(storyStyles.paritySection)}>
					<span {...stylex.props(textStyles.supporting)}>{owner}</span>
					<div
						data-highlighted={index === 1 ? "" : undefined}
						{...stylex.props(menuItemStyles.item, menuItemVariantStyles.default, storyStyles.parityRow)}>
						<span aria-hidden {...stylex.props(menuItemStyles.indicator)} />
						<span {...stylex.props(menuItemStyles.label)}>Shared selectable row</span>
					</div>
				</section>
			))}
		</div>
	),
};

const positioningPlacements: Array<Pick<MenuStoryArgs, "_side" | "_align">> = [
	{ _side: "top", _align: "start" },
	{ _side: "bottom", _align: "start" },
	{ _side: "top", _align: "center" },
	{ _side: "bottom", _align: "center" },
	{ _side: "top", _align: "end" },
	{ _side: "bottom", _align: "end" },
	{ _side: "right", _align: "start" },
	{ _side: "left", _align: "start" },
	{ _side: "right", _align: "center" },
	{ _side: "left", _align: "center" },
	{ _side: "right", _align: "end" },
	{ _side: "left", _align: "end" },
];

export const Positioning: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.positioningGrid)}>
			{positioningPlacements.map(({ _side, _align }) => (
				<div key={`${_side}-${_align}`} {...stylex.props(storyStyles.positioningCell)}>
					<PositionedMenu _side={_side} _align={_align} />
				</div>
			))}
		</div>
	),
};

export const MenuTypes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column", gap: 8 }}>
			<section>
				<Text my={2} color="subtle">
					Actions
				</Text>
				<MenuExample trigger="Project actions">
					<Menu.Item variant="primary">
						<Menu.ItemIcon>
							<PencilSimpleIcon size={16} weight="duotone" />
						</Menu.ItemIcon>
						<Menu.ItemLabel>Rename</Menu.ItemLabel>
					</Menu.Item>
					<Menu.Item>
						<Menu.ItemIcon>
							<CopyIcon size={16} weight="duotone" />
						</Menu.ItemIcon>
						<Menu.ItemLabel>Duplicate</Menu.ItemLabel>
					</Menu.Item>
					<Menu.Separator />
					<Menu.Item variant="error">
						<Menu.ItemIcon>
							<TrashIcon size={16} weight="duotone" />
						</Menu.ItemIcon>
						<Menu.ItemLabel>Delete</Menu.ItemLabel>
					</Menu.Item>
				</MenuExample>
			</section>
			<section>
				<Text my={2} color="subtle">
					Links
				</Text>
				<MenuExample trigger="Resources">
					<Menu.LinkItem href="#documentation">
						<Menu.ItemIcon>
							<BookOpenIcon size={16} weight="duotone" />
						</Menu.ItemIcon>
						<Menu.ItemLabel>Documentation</Menu.ItemLabel>
					</Menu.LinkItem>
					<Menu.LinkItem href="#support">
						<Menu.ItemIcon>
							<LifebuoyIcon size={16} weight="duotone" />
						</Menu.ItemIcon>
						<Menu.ItemLabel>Support</Menu.ItemLabel>
					</Menu.LinkItem>
				</MenuExample>
			</section>
			<section>
				<Text my={2} color="subtle">
					Submenu
				</Text>
				<MenuExample trigger="Project actions">
					<Menu.Item>
						<Menu.ItemIcon>
							<PencilSimpleIcon size={16} weight="duotone" />
						</Menu.ItemIcon>
						<Menu.ItemLabel>Rename</Menu.ItemLabel>
					</Menu.Item>
					<Menu.Item>
						<Menu.ItemIcon>
							<CopyIcon size={16} weight="duotone" />
						</Menu.ItemIcon>
						<Menu.ItemLabel>Duplicate</Menu.ItemLabel>
					</Menu.Item>
					<Menu.SubmenuRoot>
						<Menu.SubmenuTrigger openOnHover>
							<Menu.ItemIcon>
								<ShareNetworkIcon size={16} weight="duotone" />
							</Menu.ItemIcon>
							<Menu.ItemLabel>Share</Menu.ItemLabel>
						</Menu.SubmenuTrigger>
						<Menu.Popup positionerProps={{ align: "start", side: "inline-end" }}>
							<Menu.Item>
								<Menu.ItemIcon>
									<LinkSimpleIcon size={16} weight="duotone" />
								</Menu.ItemIcon>
								<Menu.ItemLabel>Copy link</Menu.ItemLabel>
							</Menu.Item>
							<Menu.Item>
								<Menu.ItemIcon>
									<EnvelopeSimpleIcon size={16} weight="duotone" />
								</Menu.ItemIcon>
								<Menu.ItemLabel>Email</Menu.ItemLabel>
							</Menu.Item>
							<Menu.Item>
								<Menu.ItemIcon>
									<ChatCircleIcon size={16} weight="duotone" />
								</Menu.ItemIcon>
								<Menu.ItemLabel>Messages</Menu.ItemLabel>
							</Menu.Item>
						</Menu.Popup>
					</Menu.SubmenuRoot>
				</MenuExample>
			</section>
			<section>
				<Text my={2} color="subtle">
					Radio items
				</Text>
				<MenuExample trigger="Sort by">
					<Menu.Group>
						<Menu.GroupLabel>Sort by</Menu.GroupLabel>
						<Menu.RadioGroup defaultValue="updated">
							<Menu.RadioItem value="updated">
								<Menu.ItemLabel>Last updated</Menu.ItemLabel>
							</Menu.RadioItem>
							<Menu.RadioItem value="name">
								<Menu.ItemLabel>Name</Menu.ItemLabel>
							</Menu.RadioItem>
							<Menu.RadioItem value="created">
								<Menu.ItemLabel>Date created</Menu.ItemLabel>
							</Menu.RadioItem>
						</Menu.RadioGroup>
					</Menu.Group>
				</MenuExample>
			</section>
			<section>
				<Text my={2} color="subtle">
					Checkbox items
				</Text>
				<MenuExample trigger="View options">
					<Menu.Group>
						<Menu.GroupLabel>Panels</Menu.GroupLabel>
						<Menu.CheckboxItem defaultChecked>
							<Menu.ItemLabel>Sidebar</Menu.ItemLabel>
						</Menu.CheckboxItem>
						<Menu.CheckboxItem>
							<Menu.ItemLabel>Minimap</Menu.ItemLabel>
						</Menu.CheckboxItem>
						<Menu.CheckboxItem defaultChecked>
							<Menu.ItemLabel>Status bar</Menu.ItemLabel>
						</Menu.CheckboxItem>
					</Menu.Group>
				</MenuExample>
			</section>
			<section>
				<Text my={2} color="subtle">
					Switch items
				</Text>
				<MenuExample trigger="Preferences">
					<Menu.Group>
						<Menu.GroupLabel>Preferences</Menu.GroupLabel>
						<Menu.SwitchItem defaultChecked>
							<Menu.ItemLabel>Auto save</Menu.ItemLabel>
						</Menu.SwitchItem>
						<Menu.SwitchItem>
							<Menu.ItemLabel>Notifications</Menu.ItemLabel>
						</Menu.SwitchItem>
						<Menu.SwitchItem defaultChecked>
							<Menu.ItemLabel>Dark mode</Menu.ItemLabel>
						</Menu.SwitchItem>
					</Menu.Group>
				</MenuExample>
			</section>
			<section>
				<Text my={2} color="subtle">
					Complex
				</Text>
				<MenuExample trigger="File options">
					<Menu.Group>
						<Menu.GroupLabel>Actions</Menu.GroupLabel>
						<Menu.Item>
							<Menu.ItemIcon>
								<PencilSimpleIcon size={16} weight="duotone" />
							</Menu.ItemIcon>
							<Menu.ItemLabel>Rename</Menu.ItemLabel>
						</Menu.Item>
						<Menu.Item>
							<Menu.ItemIcon>
								<CopyIcon size={16} weight="duotone" />
							</Menu.ItemIcon>
							<Menu.ItemLabel>Duplicate</Menu.ItemLabel>
						</Menu.Item>
					</Menu.Group>
					<Menu.Separator />
					<Menu.Group>
						<Menu.GroupLabel>View</Menu.GroupLabel>
						<Menu.CheckboxItem defaultChecked>
							<Menu.ItemLabel>Sidebar</Menu.ItemLabel>
						</Menu.CheckboxItem>
						<Menu.CheckboxItem>
							<Menu.ItemLabel>Minimap</Menu.ItemLabel>
						</Menu.CheckboxItem>
					</Menu.Group>
					<Menu.Separator />
					<Menu.Group>
						<Menu.GroupLabel>Sort by</Menu.GroupLabel>
						<Menu.RadioGroup defaultValue="name">
							<Menu.RadioItem value="name">
								<Menu.ItemLabel>Name</Menu.ItemLabel>
							</Menu.RadioItem>
							<Menu.RadioItem value="updated">
								<Menu.ItemLabel>Last updated</Menu.ItemLabel>
							</Menu.RadioItem>
						</Menu.RadioGroup>
					</Menu.Group>
				</MenuExample>
			</section>
		</div>
	),
};

export const CollapsibleGroup: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Menu.Root>
			<Menu.Trigger render={<Button endSlot={<Menu.TriggerIcon />} variant="neutral" />}>Account</Menu.Trigger>
			<Menu.Popup positionerProps={{ align: "start" }} style={storyStyles.accountMenu}>
				<Menu.Item>
					<Menu.ItemIcon>
						<CreditCardIcon size={16} weight="duotone" />
					</Menu.ItemIcon>
					<Menu.ItemLabel>Billing</Menu.ItemLabel>
				</Menu.Item>
				<Menu.Separator />
				<Menu.CollapsibleGroup defaultOpen>
					<Menu.CollapsibleGroupTrigger>
						<Menu.ItemIcon>
							<GaugeIcon size={16} weight="duotone" />
						</Menu.ItemIcon>
						<Menu.ItemLabel>Usage remaining</Menu.ItemLabel>
					</Menu.CollapsibleGroupTrigger>
					<Menu.CollapsibleGroupPanel>
						<Menu.Item closeOnClick={false}>
							<Menu.ItemLabel>Weekly</Menu.ItemLabel>
							<Menu.ItemShortcut>93% Aug 3</Menu.ItemShortcut>
						</Menu.Item>
						<Menu.LinkItem href="#upgrade">
							<Menu.ItemLabel>Upgrade for more usage</Menu.ItemLabel>
							<Menu.ItemShortcut>
								<ArrowSquareOutIcon aria-hidden size={14} weight="regular" />
							</Menu.ItemShortcut>
						</Menu.LinkItem>
						<Menu.SubmenuRoot>
							<Menu.SubmenuTrigger>
								<Menu.ItemLabel>1 available reset</Menu.ItemLabel>
							</Menu.SubmenuTrigger>
							<Menu.Popup positionerProps={{ align: "start", side: "inline-end" }}>
								<Menu.Item>
									<Menu.ItemIcon>
										<RepeatIcon size={16} weight="duotone" />
									</Menu.ItemIcon>
									<Menu.ItemLabel>Use reset</Menu.ItemLabel>
								</Menu.Item>
								<Menu.Item>
									<Menu.ItemLabel>Reset details</Menu.ItemLabel>
								</Menu.Item>
							</Menu.Popup>
						</Menu.SubmenuRoot>
						<Menu.LinkItem href="#usage">
							<Menu.ItemLabel>Learn more</Menu.ItemLabel>
							<Menu.ItemShortcut>
								<ArrowSquareOutIcon aria-hidden size={14} weight="regular" />
							</Menu.ItemShortcut>
						</Menu.LinkItem>
					</Menu.CollapsibleGroupPanel>
				</Menu.CollapsibleGroup>
				<Menu.Separator />
				<Menu.Item>
					<Menu.ItemIcon>
						<GearIcon size={16} weight="duotone" />
					</Menu.ItemIcon>
					<Menu.ItemLabel>Settings</Menu.ItemLabel>
					<Menu.ItemShortcut>⌘,</Menu.ItemShortcut>
				</Menu.Item>
				<Menu.Item variant="error">
					<Menu.ItemIcon>
						<SignOutIcon size={16} weight="duotone" />
					</Menu.ItemIcon>
					<Menu.ItemLabel>Log out</Menu.ItemLabel>
				</Menu.Item>
			</Menu.Popup>
		</Menu.Root>
	),
};

function PositionedMenu({ _side, _align }: Pick<MenuStoryArgs, "_side" | "_align">) {
	return (
		<Menu.Root>
			<Menu.Trigger render={<Button endSlot={<Menu.TriggerIcon />} size="sm" variant="neutral" />}>
				{`${_side[0].toUpperCase()}${_side.slice(1)} · ${_align}`}
			</Menu.Trigger>
			<Menu.Popup positionerProps={{ side: _side, align: _align }}>
				<Menu.Item>
					<Menu.ItemLabel>Rename</Menu.ItemLabel>
				</Menu.Item>
				<Menu.Item>
					<Menu.ItemLabel>Duplicate</Menu.ItemLabel>
				</Menu.Item>
				<Menu.Separator />
				<Menu.Item variant="error">
					<Menu.ItemLabel>Delete</Menu.ItemLabel>
				</Menu.Item>
			</Menu.Popup>
		</Menu.Root>
	);
}

function MenuExample({ children, trigger }: { children: ReactNode; trigger: string }) {
	return (
		<Menu.Root>
			<Menu.Trigger render={<Button endSlot={<Menu.TriggerIcon />} variant="neutral" />}>{trigger}</Menu.Trigger>
			<Menu.Popup positionerProps={{ align: "start" }}>{children}</Menu.Popup>
		</Menu.Root>
	);
}

const storyStyles = stylex.create({
	positioningGrid: {
		gap: tokens["--space-4"],
		paddingBlock: "10rem",
		display: "grid",
		gridTemplateColumns: {
			default: "repeat(2, minmax(0, 1fr))",
			"@media (max-width: 900px)": "1fr",
		},
		width: "min(1120px, calc(100vw - 48px))",
	},
	positioningCell: {
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		minHeight: "14rem",
		minWidth: 0,
	},
	accountMenu: {
		width: "20rem",
	},
	itemVariantsMenu: {
		width: "22rem",
	},
	parityGrid: {
		gap: tokens["--space-6"],
		display: "grid",
		gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
		maxWidth: "54rem",
	},
	paritySection: {
		gap: tokens["--space-2"],
		display: "flex",
		flexDirection: "column",
	},
	parityRow: {
		width: "100%",
	},
});
