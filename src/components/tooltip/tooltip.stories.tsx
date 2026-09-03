import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@/components/layout/layout";
import { Button, IconButton } from "@/components/button/button";
import { Text } from "@/components/text/text";
import { Tooltip } from "./tooltip";
import { Code } from "../code";

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
		<Stack align="center" p={12} justify="center">
			<Tooltip.Provider>
				<Tooltip.Root disabled={disabled} open>
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
					>
						More information about this setting
					</Tooltip.Popup>
				</Tooltip.Root>
			</Tooltip.Provider>
		</Stack>
	),
};

const popupSides: PopupSide[] = ["top", "bottom", "left", "right"];

export const Positioning: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack>
			<Tooltip.Provider>
				<Stack align="center" gap={8} orientation="horizontal" p={12}>
					{popupSides.map((side) => (
						<Tooltip.Root key={side} disableHoverablePopup>
							<Tooltip.Trigger render={<Button variant="secondary" />}>
								{capitalize(side)}
							</Tooltip.Trigger>
							<Tooltip.Popup positionerProps={{ side }}>{capitalize(side)} tooltip</Tooltip.Popup>
						</Tooltip.Root>
					))}
				</Stack>
			</Tooltip.Provider>
			<Text color="muted" size="2">
				<strong>Note:</strong> <Code>disableHoverablePopup</Code> is enabled to allow moving between
				tooltips in sequence. The current tooltip will close when moving to the next one.
			</Text>
		</Stack>
	),
};

const tooltipActions = [
	{ label: "Notifications", copy: "Review notifications", Icon: BellIcon },
	{ label: "Information", copy: "Read product information", Icon: InfoIcon },
	{ label: "Settings", copy: "Open workspace settings", Icon: GearIcon },
];

export const SharedGroup: Story = {
	render: ({ _side, _align, _closeDelay, _delay, disabled, _showArrow }) => (
		<Tooltip.Group
			arrowProps={_showArrow ? {} : undefined}
			disabled={disabled}
			positionerProps={{ side: _side, align: _align }}
			providerProps={{ closeDelay: _closeDelay, delay: _delay }}
		>
			<Stack align="center" gap={3}>
				<Text color="muted" size="1">
					Move focus or pointer between actions to see content cross-transition.
				</Text>
				<Stack gap={2} orientation="horizontal">
					{tooltipActions.map(({ label, copy, Icon }) => (
						<IconButton
							key={label}
							icon={<Icon aria-hidden />}
							label={label}
							shape="circle"
							tooltip={copy}
							variant="ghost"
						/>
					))}
				</Stack>
			</Stack>
		</Tooltip.Group>
	),
};

function capitalize(value: string) {
	return `${value[0].toUpperCase()}${value.slice(1)}`;
}
