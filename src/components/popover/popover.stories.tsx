import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

import { Button } from "@/components/button/button";
import { createPopoverHandle } from "@/components/popup-handles";
import { Popover } from "./popover";
import { popupMotionStyles } from "./popover.stylex";

type PopupSide = "top" | "right" | "bottom" | "left";
type PopupAlign = "start" | "center" | "end";
type StoryArgs = {
	_side: PopupSide;
	_align: PopupAlign;
	_showArrow: boolean;
	_showClose: boolean;
};

const meta = {
	title: "Components/Popover",
	args: {
		_side: "bottom",
		_align: "center",
		_showArrow: false,
		_showClose: true,
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
		_showArrow: { control: "boolean" },
		_showClose: { control: "boolean" },
	},
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

function PopoverViewportDemo() {
	return (
		<>
			<Popover.Title>Notifications</Popover.Title>
			<Popover.Description>You are all caught up. New activity will appear here.</Popover.Description>
		</>
	);
}

export const Playground: Story = {
	render: ({ _side, _align, _showArrow, _showClose }) => (
		<div {...stylex.props(storyParts.stage)}>
			<Popover.Root>
				<Popover.Trigger render={<Button variant="secondary" />}>Open {_side}</Popover.Trigger>
				<Popover.Popup
					arrowProps={_showArrow ? {} : undefined}
					positionerProps={{ side: _side, align: _align }}
					showClose={_showClose}>
					<PopoverViewportDemo />
				</Popover.Popup>
			</Popover.Root>
		</div>
	),
};

const positioningPlacements: Array<{ side: PopupSide; align: PopupAlign }> = [
	{ side: "top", align: "start" },
	{ side: "bottom", align: "start" },
	{ side: "top", align: "center" },
	{ side: "bottom", align: "center" },
	{ side: "top", align: "end" },
	{ side: "bottom", align: "end" },
	{ side: "right", align: "start" },
	{ side: "left", align: "start" },
	{ side: "right", align: "center" },
	{ side: "left", align: "center" },
	{ side: "right", align: "end" },
	{ side: "left", align: "end" },
];

export const Positioning: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyParts.positioningGrid)}>
			{positioningPlacements.map(({ side, align }) => (
				<div key={`${side}-${align}`} {...stylex.props(storyParts.positioningCell)}>
					<Popover.Root>
						<Popover.Trigger render={<Button size="sm" variant="secondary" />}>
							{formatPosition(side, align)}
						</Popover.Trigger>
						<Popover.Popup positionerProps={{ side, align }} style={storyParts.narrowPopup}>
							<PopoverViewportDemo />
						</Popover.Popup>
					</Popover.Root>
				</div>
			))}
		</div>
	),
};

type SharedPopoverPayload = {
	title: string;
	description: string;
};

const sharedPopover = createPopoverHandle<SharedPopoverPayload>();
const sharedPanels: Array<SharedPopoverPayload & { label: string }> = [
	{
		label: "Inbox",
		title: "Inbox zero!",
		description: "No unread messages.",
	},
	{
		label: "Mentions",
		title: "Two mentions",
		description: "Alex mentioned you in Design critique and Release planning.",
	},
	{
		label: "Updates",
		title: "Product updates",
		description: "StyleX Lab was updated a few seconds ago.",
	},
];

export const SharedTriggers: Story = {
	render: ({ _side, _align, _showArrow, _showClose }) => (
		<div {...stylex.props(storyParts.stack)}>
			<p {...stylex.props(storyParts.hint)}>Open one popover, then move between the shared triggers.</p>
			<div {...stylex.props(storyParts.triggerGroup)}>
				{sharedPanels.map(({ label, title, description }) => (
					<Popover.Trigger
						key={label}
						handle={sharedPopover}
						payload={{ title, description }}
						render={<Button size="sm" variant="secondary" />}>
						{label}
					</Popover.Trigger>
				))}
			</div>
			<Popover.Root handle={sharedPopover}>
				{({ payload }) => (
					<Popover.Popup
						arrowProps={_showArrow ? {} : undefined}
						positionerProps={{ side: _side, align: _align, style: popupMotionStyles.movingPositioner }}
						showClose={_showClose}
						style={popupMotionStyles.movingPopup}>
						<Popover.Viewport>
							<Popover.Title>{payload?.title}</Popover.Title>
							<Popover.Description>{payload?.description}</Popover.Description>
						</Popover.Viewport>
					</Popover.Popup>
				)}
			</Popover.Root>
		</div>
	),
};

const storyParts = stylex.create({
	stage: {
		alignItems: "center",
		display: "grid",
		justifyItems: "center",
		height: "360px",
		width: "min(720px, calc(100vw - 48px))",
	},
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
		minHeight: "15rem",
		minWidth: 0,
	},
	narrowPopup: {
		maxWidth: "17rem",
	},
	stack: {
		gap: tokens["--space-3"],
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
	},
	hint: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	triggerGroup: {
		gap: tokens["--space-2"],
		display: "flex",
		flexWrap: "wrap",
	},
});

function formatPosition(side: PopupSide, align: PopupAlign) {
	return `${side[0].toUpperCase()}${side.slice(1)} · ${align}`;
}
