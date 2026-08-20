import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@/components/layout/layout";
import { Button, IconButton } from "@/components/button/button";
import { createTooltipHandle } from "@/components/popup-handles";
import { Text } from "@/components/text/text";
import { Tooltip } from "./tooltip";

type PopupSide = "top" | "right" | "bottom" | "left";
type PopupAlign = "start" | "center" | "end";
type StoryArgs = {
	_side: PopupSide;
	_align: PopupAlign;
	_closeDelay: number;
	_delay: number;
	disabled: boolean;
	_showArrow: boolean;
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
	},
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

export const Playground: Story = {
	render: ({ _side, _align, _closeDelay, _delay, disabled, _showArrow }) => (
		<Stack align="center" height="320px" justify="center" width="min(640px, calc(100vw - 48px))">
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
					<Tooltip.Popup arrowProps={_showArrow ? {} : undefined} positionerProps={{ side: _side, align: _align }}>
						More information about this setting
					</Tooltip.Popup>
				</Tooltip.Root>
			</Tooltip.Provider>
		</Stack>
	),
};

const popupSides: PopupSide[] = ["top", "right", "bottom", "left"];

export const Positioning: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack align="center" justify="center" minHeight="320px" width="min(720px, calc(100vw - 48px))">
			<Tooltip.Provider>
				<Stack align="center" gap={6} orientation="horizontal" justify="center">
					{popupSides.map((side) => (
						<Stack key={side} align="center" justify="center" minHeight="5rem" minWidth="5rem">
							<Tooltip.Root>
								<Tooltip.Trigger render={<Button size="sm" variant="neutral" />}>{capitalize(side)}</Tooltip.Trigger>
								<Tooltip.Popup positionerProps={{ side }}>{capitalize(side)} tooltip</Tooltip.Popup>
							</Tooltip.Root>
						</Stack>
					))}
				</Stack>
			</Tooltip.Provider>
		</Stack>
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
			<Stack align="center" gap={3}>
				<Text color="muted" size="1">
					Move focus or pointer between actions to see content cross-transition.
				</Text>
				<Stack gap={2} orientation="horizontal">
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
				</Stack>
				<Tooltip.Root disabled={disabled} handle={sharedTooltip}>
					{({ payload }) => (
						<Tooltip.Popup arrowProps={_showArrow ? {} : undefined} positionerProps={{ side: _side, align: _align }}>
							<Tooltip.Viewport>{payload}</Tooltip.Viewport>
						</Tooltip.Popup>
					)}
				</Tooltip.Root>
			</Stack>
		</Tooltip.Provider>
	),
};

function capitalize(value: string) {
	return `${value[0].toUpperCase()}${value.slice(1)}`;
}
