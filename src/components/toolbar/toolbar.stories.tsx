import { Select as BaseSelect } from "@base-ui/react/select";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { ArrowClockwiseIcon } from "@phosphor-icons/react/dist/csr/ArrowClockwise";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react/dist/csr/ArrowCounterClockwise";
import { CaretUpDownIcon } from "@phosphor-icons/react/dist/csr/CaretUpDown";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { DotsThreeIcon } from "@phosphor-icons/react/dist/csr/DotsThree";
import { ListBulletsIcon } from "@phosphor-icons/react/dist/csr/ListBullets";
import { ShareNetworkIcon } from "@phosphor-icons/react/dist/csr/ShareNetwork";
import { TextAlignCenterIcon } from "@phosphor-icons/react/dist/csr/TextAlignCenter";
import { TextAlignLeftIcon } from "@phosphor-icons/react/dist/csr/TextAlignLeft";
import { TextAlignRightIcon } from "@phosphor-icons/react/dist/csr/TextAlignRight";
import { TextBIcon } from "@phosphor-icons/react/dist/csr/TextB";
import { TextItalicIcon } from "@phosphor-icons/react/dist/csr/TextItalic";
import { TextUnderlineIcon } from "@phosphor-icons/react/dist/csr/TextUnderline";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { breakpoints } from "@/styles/constants.stylex";
import { color, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import * as Menu from "../menu/menu";
import * as Select from "../select/select";
import * as Toolbar from "./toolbar";

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
				<Toolbar.Button aria-label="Bold" render={<BaseToggle />} value="bold">
					<TextBIcon aria-hidden size={16} weight="regular" />
				</Toolbar.Button>
				<Toolbar.Button aria-label="Italic" render={<BaseToggle />} value="italic">
					<TextItalicIcon aria-hidden size={16} weight="regular" />
				</Toolbar.Button>
				<Toolbar.Button aria-label="Underline" render={<BaseToggle />} value="underline">
					<TextUnderlineIcon aria-hidden size={16} weight="regular" />
				</Toolbar.Button>
			</Toolbar.Group>
			<Toolbar.Separator />
			<Toolbar.Button>
				<CopyIcon aria-hidden size={16} weight="regular" />
				Copy
			</Toolbar.Button>
			<Toolbar.Button aria-label="Share">
				<ShareNetworkIcon aria-hidden size={16} weight="regular" />
			</Toolbar.Button>
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
						<DotsThreeIcon aria-hidden size={18} weight="regular" />
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
			<BaseToggleGroup aria-label="Text alignment" defaultValue={["left"]}>
				<Toolbar.Group>
					<Toolbar.Button aria-label="Align left" render={<BaseToggle />} value="left">
						<TextAlignLeftIcon aria-hidden size={16} weight="regular" />
					</Toolbar.Button>
					<Toolbar.Button aria-label="Align center" render={<BaseToggle />} value="center">
						<TextAlignCenterIcon aria-hidden size={16} weight="regular" />
					</Toolbar.Button>
					<Toolbar.Button aria-label="Align right" render={<BaseToggle />} value="right">
						<TextAlignRightIcon aria-hidden size={16} weight="regular" />
					</Toolbar.Button>
				</Toolbar.Group>
			</BaseToggleGroup>
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
					<DotsThreeIcon aria-hidden size={18} weight="regular" />
				</Toolbar.Button>
				<Menu.Popup positionerProps={{ align: "end" }}>
					<Menu.Item>
						<Menu.ItemLabel>Duplicate</Menu.ItemLabel>
					</Menu.Item>
					<Menu.Item>
						<Menu.ItemLabel>Move to project</Menu.ItemLabel>
					</Menu.Item>
					<Menu.Separator />
					<Menu.Item variant="danger">
						<Menu.ItemLabel>Remove</Menu.ItemLabel>
					</Menu.Item>
				</Menu.Popup>
			</Menu.Root>
		</Toolbar.Root>
	);
}

function CompactToolbar({
	disabled,
}: {
	disabled?: boolean;
}) {
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
				<DotsThreeIcon aria-hidden size={18} weight="regular" />
			</Toolbar.Button>
		</Toolbar.Root>
	);
}

const storyParts = stylex.create({
	sections: {
		gap: space[8],
		alignItems: "flex-start",
		display: "grid",
		gridTemplateColumns: {
			default: "1fr",
			[breakpoints.sm]: "repeat(2, minmax(0, max-content))",
		},
	},
	section: {
		gap: space[3],
		display: "flex",
		flexDirection: "column",
	},
	heading: {
		margin: 0,
		color: color.fgMuted,
		fontSize: fontSize.x1,
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	selectButton: {
		justifyContent: "space-between",
		minWidth: "8rem",
	},
});
