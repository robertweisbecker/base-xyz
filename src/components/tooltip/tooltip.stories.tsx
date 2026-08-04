import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

import { Button, IconButton } from "../button/button";
import { createTooltipHandle } from "../popup-handles";
import * as Tooltip from "./tooltip";

type PopupSide = "top" | "right" | "bottom" | "left";
type PopupAlign = "start" | "center" | "end";
type StoryArgs = {
	_side: PopupSide;
	_align: PopupAlign;
	_closeDelay: number;
	_delay: number;
	disabled: boolean;
	_showArrow: boolean;
	_showClose: boolean;
};

const meta = {
	title: "Components/Tooltip",
	args: {
		_side: "top",
		_align: "center",
		_closeDelay: 400,
		_delay: 150,
		disabled: false,
		_showArrow: false,
		_showClose: false,
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
		_closeDelay: { control: { type: "number", min: 0, step: 50 } },
		_delay: { control: { type: "number", min: 0, step: 50 } },
		disabled: { control: "boolean" },
		_showArrow: { control: "boolean" },
		_showClose: { control: "boolean" },
	},
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

export const Playground: Story = {
	render: ({ _side, _align, _closeDelay, _delay, disabled, _showArrow, _showClose }) => (
		<div {...stylex.props(storyParts.stage)}>
			<Tooltip.Provider>
				<Tooltip.Root disabled={disabled}>
					<Tooltip.Trigger
						closeDelay={_closeDelay}
						delay={_delay}
						render={
							<IconButton
								icon={<InfoIcon aria-hidden />}
								label="More information"
								shape="circle"
								tooltip={false}
								variant="ghost"
							/>
						}
					/>
					<Tooltip.Popup
						arrowProps={_showArrow ? {} : undefined}
						positionerProps={{ side: _side, align: _align }}
						showClose={_showClose}>
						More information about this setting
					</Tooltip.Popup>
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>
	),
};

const popupSides: PopupSide[] = ["top", "right", "bottom", "left"];

export const Positioning: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyParts.positioningStage)}>
			<Tooltip.Provider>
				<div {...stylex.props(storyParts.positioningRow)}>
					{popupSides.map((side) => (
						<div key={side} {...stylex.props(storyParts.positioningCell)}>
							<Tooltip.Root>
								<Tooltip.Trigger render={<Button size="sm" variant="neutral" />}>{capitalize(side)}</Tooltip.Trigger>
								<Tooltip.Popup positionerProps={{ side }}>{capitalize(side)} tooltip</Tooltip.Popup>
							</Tooltip.Root>
						</div>
					))}
				</div>
			</Tooltip.Provider>
		</div>
	),
};

const sharedTooltip = createTooltipHandle<string>();
const tooltipActions = [
	{ label: "Notifications", copy: "Review notifications", Icon: BellIcon },
	{ label: "Information", copy: "Read product information", Icon: InfoIcon },
	{ label: "Settings", copy: "Open workspace settings", Icon: GearIcon },
];

export const SharedGroup: Story = {
	render: ({ _side, _align, _closeDelay, _delay, disabled, _showArrow }) => (
		<Tooltip.Provider>
			<div {...stylex.props(storyParts.stack)}>
				<p {...stylex.props(storyParts.hint)}>Move focus or pointer between actions to see content cross-transition.</p>
				<div {...stylex.props(storyParts.group)}>
					{tooltipActions.map(({ label, copy, Icon }) => (
						<Tooltip.Trigger
							key={label}
							closeDelay={_closeDelay}
							delay={_delay}
							handle={sharedTooltip}
							payload={copy}
							render={
								<IconButton icon={<Icon aria-hidden />} label={label} shape="circle" tooltip={false} variant="ghost" />
							}
						/>
					))}
				</div>
				<Tooltip.Root disabled={disabled} handle={sharedTooltip}>
					{({ payload }) => (
						<Tooltip.Popup arrowProps={_showArrow ? {} : undefined} positionerProps={{ side: _side, align: _align }}>
							<Tooltip.Viewport>{payload}</Tooltip.Viewport>
						</Tooltip.Popup>
					)}
				</Tooltip.Root>
			</div>
		</Tooltip.Provider>
	),
};

const storyParts = stylex.create({
	stage: {
		alignItems: "center",
		display: "grid",
		justifyItems: "center",
		height: "320px",
		width: "min(640px, calc(100vw - 48px))",
	},
	positioningStage: {
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		minHeight: "320px",
		width: "min(720px, calc(100vw - 48px))",
	},
	positioningRow: {
		gap: tokens["--space-6"],
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
	},
	positioningCell: {
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		minHeight: "5rem",
		minWidth: "5rem",
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
	group: {
		gap: tokens["--space-2"],
		display: "flex",
	},
});

function capitalize(value: string) {
	return `${value[0].toUpperCase()}${value.slice(1)}`;
}
