import { Select as BaseSelect } from "@base-ui/react/select";
import {
	IconArrowClockwise,
	IconArrowCounterClockwise,
	IconChevronsUpDown,
	IconCode,
	IconCodeBlock,
	IconCopy,
	IconItalic,
	IconLink,
	IconListBullet,
	IconListOrdered,
	IconPaperclip,
	IconTextAlignCenter,
	IconTextAlignEnd,
	IconTextAlignStart,
	IconTextBold,
	IconTextBoldInactive,
	IconTextStrikethrough,
	IconTextUnderline,
} from "fyicons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { CopyButton } from "@/blocks/copy-button/copy-button";
import { IconButton } from "@/components/button/button";
import { Icon } from "@/components/icons";
import { Grid, Stack } from "@/components/layout/layout";
import { Menu } from "@/components/menu/menu";
import { Select } from "@/components/select/select";
import { Text } from "@/components/text/text";
import { Toggle, ToggleGroup } from "@/components/toggle/toggle";
import { breakpoints } from "@/styles/constants.stylex";
import { Toolbar } from "./toolbar";

const meta = {
	title: "Components/Toolbar",
	component: Toolbar.Root,
	args: {
		orientation: "horizontal",
		disabled: false,
		loopFocus: true,
		variant: "surface",
	},
	argTypes: {
		orientation: {
			control: "inline-radio",
			options: ["horizontal", "vertical"],
		},
		disabled: { control: "boolean" },
		loopFocus: { control: "boolean" },
		variant: {
			control: "inline-radio",
			options: ["surface", "unstyled"],
		},
	},
	parameters: {
		controls: {
			include: ["orientation", "disabled", "loopFocus", "variant"],
		},
	},
} satisfies Meta<typeof Toolbar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<Toolbar.Root {...args} aria-label="Response actions">
			<Toolbar.Group aria-label="Formatting">
				<Toolbar.Button
					render={
						<Toggle
							icon={<IconTextBoldInactive size="1em" aria-hidden />}
							label="Bold"
							pressedIcon={<IconTextBold size="1em" aria-hidden />}
							value="bold"
						/>
					}
				/>
				<Toolbar.Button
					render={
						<Toggle icon={<IconItalic size="1em" aria-hidden />} label="Italic" value="italic" />
					}
				/>
				<Toolbar.Button
					render={
						<Toggle
							icon={<IconTextUnderline size="1em" aria-hidden />}
							label="Underline"
							value="underline"
						/>
					}
				/>
				<Toolbar.Button
					render={
						<Toggle
							icon={<IconTextStrikethrough size="1em" aria-hidden />}
							label="Strikethrough"
							value="strikethrough"
						/>
					}
				/>
			</Toolbar.Group>
			<Toolbar.Separator />
			<Toolbar.Group aria-label="Insert options">
				<Toolbar.Button
					render={
						<IconButton
							variant="ghost"
							icon={<IconLink size="1em" aria-hidden />}
							label="Insert link"
						/>
					}
				/>
				<Toolbar.Button
					render={
						<IconButton
							variant="ghost"
							icon={<IconPaperclip size="1em" aria-hidden />}
							label="Attach file"
						/>
					}
				/>
			</Toolbar.Group>
			<Toolbar.Separator />
			<Toolbar.Group aria-label="Actions" render={<ToggleGroup />}>
				<Toolbar.Button
					render={
						<Toggle
							icon={<IconListBullet size="1em" aria-hidden />}
							label="Bulleted list"
							value="unordered"
						/>
					}
				/>
				<Toolbar.Button
					render={
						<Toggle
							icon={<IconListOrdered size="1em" aria-hidden />}
							label="Numbered list"
							value="ordered"
						/>
					}
				/>
			</Toolbar.Group>
			<Toolbar.Separator />
			<Toolbar.Group aria-label="Copy options">
				<Toolbar.Button
					render={
						<IconButton
							variant="ghost"
							icon={<IconCode size="1em" aria-hidden />}
							label="Inline code"
						/>
					}
				/>
				<Toolbar.Button
					render={
						<IconButton
							variant="ghost"
							icon={<IconCodeBlock size="1em" aria-hidden />}
							label="Code block"
						/>
					}
				/>
			</Toolbar.Group>
			<Toolbar.Button render={<CopyButton value="Copy" variant="ghost" />} />

			<Toolbar.Link href="#activity">Activity</Toolbar.Link>
		</Toolbar.Root>
	),
};

export const Composition: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid align="start" gap={8} xstyle={storyParts.sections}>
			<Stack align="start" gap={3}>
				<Text color="muted" size="1">
					Editing controls
				</Text>
				<EditingToolbar />
			</Stack>
			<Stack align="start" gap={3}>
				<Text color="muted" size="1">
					Menus and selects
				</Text>
				<PopupToolbar />
			</Stack>
		</Grid>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid align="start" gap={8} xstyle={storyParts.sections}>
			<Stack align="start" gap={3}>
				<Text color="muted" size="1">
					Disabled toolbar
				</Text>
				<CompactToolbar disabled />
			</Stack>
			<Stack align="start" gap={3}>
				<Text color="muted" size="1">
					Disabled group
				</Text>
				<Toolbar.Root aria-label="List actions">
					<Toolbar.Group disabled aria-label="List formatting">
						<Toolbar.Button aria-label="Bulleted list">
							<IconListBullet aria-hidden size={16} />
						</Toolbar.Button>
						<Toolbar.Button aria-label="Copy">
							<IconCopy aria-hidden size={16} />
						</Toolbar.Button>
					</Toolbar.Group>
					<Toolbar.Separator />
					<Toolbar.Button aria-label="More actions">
						<Icon.More aria-hidden />
					</Toolbar.Button>
				</Toolbar.Root>
			</Stack>
		</Grid>
	),
};

function EditingToolbar() {
	return (
		<Toolbar.Root aria-label="Document actions">
			<Toolbar.Group aria-label="History">
				<Toolbar.Button aria-label="Undo">
					<IconArrowCounterClockwise aria-hidden size={16} />
				</Toolbar.Button>
				<Toolbar.Button aria-label="Redo">
					<IconArrowClockwise aria-hidden size={16} />
				</Toolbar.Button>
			</Toolbar.Group>
			<Toolbar.Separator />
			<Toolbar.Group aria-label="Text alignment" render={<ToggleGroup defaultValue={["left"]} />}>
				<Toolbar.Button
					render={
						<Toggle
							icon={<IconTextAlignStart size="1em" aria-hidden />}
							label="Align left"
							value="left"
						/>
					}
				/>
				<Toolbar.Button
					render={
						<Toggle
							icon={<IconTextAlignCenter size="1em" aria-hidden />}
							label="Align center"
							value="center"
						/>
					}
				/>
				<Toolbar.Button
					render={
						<Toggle
							icon={<IconTextAlignEnd size="1em" aria-hidden />}
							label="Align right"
							value="right"
						/>
					}
				/>
			</Toolbar.Group>
			<Toolbar.Separator />
			<Toolbar.Input aria-label="Find command" placeholder="Find command" />
		</Toolbar.Root>
	);
}

function PopupToolbar() {
	return (
		<Toolbar.Root aria-label="Editor options">
			<BaseSelect.Root defaultValue="balanced">
				<Toolbar.Button
					aria-label="Response length"
					xstyle={storyParts.selectButton}
					render={<BaseSelect.Trigger />}
				>
					<BaseSelect.Value />
					<BaseSelect.Icon>
						<IconChevronsUpDown aria-hidden size={14} />
					</BaseSelect.Icon>
				</Toolbar.Button>
				<Select.Popup>
					<Select.List>
						<Select.Item value="concise">Concise</Select.Item>
						<Select.Item value="balanced">Balanced</Select.Item>
						<Select.Item value="detailed">Detailed</Select.Item>
					</Select.List>
				</Select.Popup>
			</BaseSelect.Root>
			<Toolbar.Separator />
			<Menu.Root>
				<Toolbar.Button aria-label="More actions" render={<Menu.Trigger />}>
					<Icon.More aria-hidden />
				</Toolbar.Button>
				<Menu.Popup positionerProps={{ align: "end" }}>
					<Menu.Item>
						<Menu.ItemLabel>Duplicate</Menu.ItemLabel>
					</Menu.Item>
					<Menu.Item>
						<Menu.ItemLabel>Move to project</Menu.ItemLabel>
					</Menu.Item>
					<Menu.Separator />
					<Menu.Item variant="error">
						<Menu.ItemLabel>Remove</Menu.ItemLabel>
					</Menu.Item>
				</Menu.Popup>
			</Menu.Root>
		</Toolbar.Root>
	);
}

function CompactToolbar({ disabled }: { disabled?: boolean }) {
	return (
		<Toolbar.Root aria-label="List actions" disabled={disabled}>
			<Toolbar.Button aria-label="Bulleted list">
				<IconListBullet aria-hidden size={16} />
			</Toolbar.Button>
			<Toolbar.Button aria-label="Copy">
				<IconCopy aria-hidden size={16} />
			</Toolbar.Button>
			<Toolbar.Separator />
			<Toolbar.Button aria-label="More actions">
				<Icon.More aria-hidden />
			</Toolbar.Button>
		</Toolbar.Root>
	);
}

const storyParts = stylex.create({
	sections: {
		gridTemplateColumns: {
			default: "1fr",
			[breakpoints.sm]: "repeat(2, minmax(0, max-content))",
		},
	},
	selectButton: {
		justifyContent: "space-between",
		minWidth: "8rem",
	},
});
