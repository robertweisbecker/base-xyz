import { Select as BaseSelect } from "@base-ui/react/select";
import { ArrowClockwiseIcon } from "@phosphor-icons/react/dist/csr/ArrowClockwise";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react/dist/csr/ArrowCounterClockwise";
import { CaretUpDownIcon } from "@phosphor-icons/react/dist/csr/CaretUpDown";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { ListBulletsIcon } from "@phosphor-icons/react/dist/csr/ListBullets";
import { TextAlignCenterIcon } from "@phosphor-icons/react/dist/csr/TextAlignCenter";
import { TextAlignLeftIcon } from "@phosphor-icons/react/dist/csr/TextAlignLeft";
import { TextAlignRightIcon } from "@phosphor-icons/react/dist/csr/TextAlignRight";
import { TextBIcon } from "@phosphor-icons/react/dist/csr/TextB";
import { TextItalicIcon } from "@phosphor-icons/react/dist/csr/TextItalic";
import { TextUnderlineIcon } from "@phosphor-icons/react/dist/csr/TextUnderline";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { breakpoints } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

import { Menu } from "@/components/menu/menu";
import { Select } from "@/components/select/select";
import { Toolbar } from "./toolbar";
import { CopyButton } from "@/blocks/copy-button/copy-button";
import { TextStrikethroughIcon } from "@phosphor-icons/react/dist/ssr/TextStrikethrough";
import { LinkIcon, ListNumbersIcon, PaperclipIcon, CodeIcon, CodeBlockIcon } from "@phosphor-icons/react";
import { IconButton } from "@/components/button/button";
import { Toggle, ToggleGroup } from "@/components/toggle/toggle";
import { Icon } from "@/components/icons";
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
							icon={<TextBIcon aria-hidden weight="regular" />}
							label="Bold"
							pressedIcon={<TextBIcon aria-hidden weight="bold" />}
							value="bold"
						/>
					}
				/>
				<Toolbar.Button
					render={<Toggle icon={<TextItalicIcon aria-hidden weight="regular" />} label="Italic" value="italic" />}
				/>
				<Toolbar.Button
					render={
						<Toggle icon={<TextUnderlineIcon aria-hidden weight="regular" />} label="Underline" value="underline" />
					}
				/>
				<Toolbar.Button
					render={
						<Toggle
							icon={<TextStrikethroughIcon aria-hidden weight="regular" />}
							label="Strikethrough"
							value="strikethrough"
						/>
					}
				/>
			</Toolbar.Group>
			<Toolbar.Separator />
			<Toolbar.Group aria-label="Insert options">
				<Toolbar.Button
					render={<IconButton variant="ghost" icon={<LinkIcon aria-hidden weight="regular" />} label="Insert link" />}
				/>
				<Toolbar.Button
					render={
						<IconButton variant="ghost" icon={<PaperclipIcon aria-hidden weight="regular" />} label="Attach file" />
					}
				/>
			</Toolbar.Group>
			<Toolbar.Separator />
			<Toolbar.Group aria-label="Actions" render={<ToggleGroup />}>
				<Toolbar.Button
					render={
						<Toggle icon={<ListBulletsIcon aria-hidden weight="regular" />} label="Bulleted list" value="unordered" />
					}
				/>
				<Toolbar.Button
					render={
						<Toggle icon={<ListNumbersIcon aria-hidden weight="regular" />} label="Numbered list" value="ordered" />
					}
				/>
			</Toolbar.Group>
			<Toolbar.Separator />
			<Toolbar.Group aria-label="Copy options">
				<Toolbar.Button
					render={<IconButton variant="ghost" icon={<CodeIcon aria-hidden weight="regular" />} label="Inline code" />}
				/>
				<Toolbar.Button
					render={
						<IconButton variant="ghost" icon={<CodeBlockIcon aria-hidden weight="regular" />} label="Code block" />
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
		<div {...stylex.props(storyParts.sections)}>
			<section {...stylex.props(storyParts.section)}>
				<h2 {...stylex.props(storyParts.heading)}>Editing controls</h2>
				<EditingToolbar />
			</section>
			<section {...stylex.props(storyParts.section)}>
				<h2 {...stylex.props(storyParts.heading)}>Menus and selects</h2>
				<PopupToolbar />
			</section>
		</div>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyParts.sections)}>
			<section {...stylex.props(storyParts.section)}>
				<h2 {...stylex.props(storyParts.heading)}>Disabled toolbar</h2>
				<CompactToolbar disabled />
			</section>
			<section {...stylex.props(storyParts.section)}>
				<h2 {...stylex.props(storyParts.heading)}>Disabled group</h2>
				<Toolbar.Root aria-label="List actions">
					<Toolbar.Group disabled aria-label="List formatting">
						<Toolbar.Button aria-label="Bulleted list">
							<ListBulletsIcon aria-hidden size={16} weight="regular" />
						</Toolbar.Button>
						<Toolbar.Button aria-label="Copy">
							<CopyIcon aria-hidden size={16} weight="regular" />
						</Toolbar.Button>
					</Toolbar.Group>
					<Toolbar.Separator />
					<Toolbar.Button aria-label="More actions">
						<Icon.More aria-hidden />
					</Toolbar.Button>
				</Toolbar.Root>
			</section>
		</div>
	),
};

function EditingToolbar() {
	return (
		<Toolbar.Root aria-label="Document actions">
			<Toolbar.Group aria-label="History">
				<Toolbar.Button aria-label="Undo">
					<ArrowCounterClockwiseIcon aria-hidden size={16} weight="regular" />
				</Toolbar.Button>
				<Toolbar.Button aria-label="Redo">
					<ArrowClockwiseIcon aria-hidden size={16} weight="regular" />
				</Toolbar.Button>
			</Toolbar.Group>
			<Toolbar.Separator />
			<Toolbar.Group aria-label="Text alignment" render={<ToggleGroup defaultValue={["left"]} />}>
				<Toolbar.Button
					render={<Toggle icon={<TextAlignLeftIcon aria-hidden weight="regular" />} label="Align left" value="left" />}
				/>
				<Toolbar.Button
					render={
						<Toggle icon={<TextAlignCenterIcon aria-hidden weight="regular" />} label="Align center" value="center" />
					}
				/>
				<Toolbar.Button
					render={
						<Toggle icon={<TextAlignRightIcon aria-hidden weight="regular" />} label="Align right" value="right" />
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
				<Toolbar.Button aria-label="Response length" style={storyParts.selectButton} render={<BaseSelect.Trigger />}>
					<BaseSelect.Value />
					<BaseSelect.Icon>
						<CaretUpDownIcon aria-hidden size={14} weight="regular" />
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
				<ListBulletsIcon aria-hidden size={16} weight="regular" />
			</Toolbar.Button>
			<Toolbar.Button aria-label="Copy">
				<CopyIcon aria-hidden size={16} weight="regular" />
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
		gap: tokens["--space-8"],
		alignItems: "flex-start",
		display: "grid",
		gridTemplateColumns: {
			default: "1fr",
			[breakpoints.sm]: "repeat(2, minmax(0, max-content))",
		},
	},
	section: {
		gap: tokens["--space-3"],
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
	},
	selectButton: {
		justifyContent: "space-between",
		minWidth: "8rem",
	},
});
