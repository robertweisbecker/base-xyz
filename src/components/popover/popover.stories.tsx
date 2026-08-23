import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Button } from "@/components/button/button";
import { Box, Grid, Stack } from "@/components/layout/layout";
import { createPopoverHandle } from "@/components/popup-handles";
import { Text } from "@/components/text/text";
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
		<Box display="grid" xstyle={storyParts.stage}>
			<Popover.Root>
				<Popover.Trigger render={<Button variant="secondary" />}>Open {_side}</Popover.Trigger>
				<Popover.Popup
					arrowProps={_showArrow ? {} : undefined}
					positionerProps={{ side: _side, align: _align }}
					showClose={_showClose}>
					<PopoverViewportDemo />
				</Popover.Popup>
			</Popover.Root>
		</Box>
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
		<Grid gap={4} xstyle={storyParts.positioningGrid}>
			{positioningPlacements.map(({ side, align }) => (
				<Box display="flex" key={`${side}-${align}`} xstyle={storyParts.positioningCell}>
					<Popover.Root>
						<Popover.Trigger render={<Button size="sm" variant="secondary" />}>
							{`${side[0].toUpperCase()}${side.slice(1)} · ${align}`}
						</Popover.Trigger>
						<Popover.Popup positionerProps={{ side, align }} xstyle={storyParts.narrowPopup}>
							<PopoverViewportDemo />
						</Popover.Popup>
					</Popover.Root>
				</Box>
			))}
		</Grid>
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
		<Stack align="center" gap={3}>
			<Text color="muted" size="1">
				Open one popover, then move between the shared triggers.
			</Text>
			<Stack gap={2} orientation="horizontal" wrap="wrap">
				{sharedPanels.map(({ label, title, description }) => (
					<Popover.Trigger
						key={label}
						handle={sharedPopover}
						payload={{ title, description }}
						render={<Button size="sm" variant="secondary" />}>
						{label}
					</Popover.Trigger>
				))}
			</Stack>
			<Popover.Root handle={sharedPopover}>
				{({ payload }) => (
					<Popover.Popup
						arrowProps={_showArrow ? {} : undefined}
						positionerProps={{ side: _side, align: _align, xstyle: popupMotionStyles.movingPositioner }}
						showClose={_showClose}
						xstyle={popupMotionStyles.movingPopup}>
						<Popover.Viewport>
							<Popover.Title>{payload?.title}</Popover.Title>
							<Popover.Description>{payload?.description}</Popover.Description>
						</Popover.Viewport>
					</Popover.Popup>
				)}
			</Popover.Root>
		</Stack>
	),
};

const storyParts = stylex.create({
	stage: {
		alignItems: "center",
		height: "360px",
		justifyItems: "center",
		width: "min(720px, calc(100vw - 48px))",
	},
	positioningGrid: {
		paddingBlock: "10rem",
		gridTemplateColumns: {
			default: "repeat(2, minmax(0, 1fr))",
			"@media (max-width: 900px)": "1fr",
		},
		width: "min(1120px, calc(100vw - 48px))",
	},
	positioningCell: {
		alignItems: "center",
		justifyContent: "center",
		minHeight: "15rem",
		minWidth: 0,
	},
	narrowPopup: {
		maxWidth: "17rem",
	},
});
