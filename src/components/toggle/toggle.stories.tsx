import {
	IconBell,
	IconBellSlash,
	IconItalic,
	IconPin,
	IconPinFill,
	IconTextAlignCenter,
	IconTextAlignEnd,
	IconTextAlignStart,
	IconTextBold,
	IconTextBoldInactive,
	IconTextUnderline,
} from "fyicons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Heading } from "@/components/heading/heading";
import { Grid, Stack } from "@/components/layout/layout";
import { Separator } from "@/components/separator/separator";
import { Text } from "@/components/text/text";
import { Toggle, ToggleGroup, type ToggleProps, type ToggleVariant } from "./toggle";

const iconOptions = {
	None: undefined,
	Pin: <IconPin size="1em" aria-hidden />,
	"Pin Fill": <IconPinFill size="1em" aria-hidden />,
	Bell: <IconBell size="1em" aria-hidden />,
	"Bell slash": <IconBellSlash size="1em" aria-hidden />,
};

const variants: ToggleVariant[] = [
	"primary",
	"subtle",
	"secondary",
	"neutral",
	"ghost",
	"plain",
	"error",
];

type TogglePlaygroundArgs = ToggleProps & {
	_appearance: "button" | "iconButton";
	_join: boolean;
	_multiple: boolean;
	_orientation: "horizontal" | "vertical";
};

function TogglePlaygroundPreview({
	_appearance = "button",
	_join = false,
	_multiple = false,
	_orientation = "horizontal",
	children,
	icon,
	label,
	pressedIcon,
	shape,
	startSlot,
	tooltip,
	...args
}: TogglePlaygroundArgs) {
	const singleToggle =
		_appearance === "iconButton" ? (
			<Toggle
				key={`${args.defaultPressed}-${args.disabled}-icon`}
				{...args}
				icon={icon ?? iconOptions.Pin}
				label={label || "Notifications"}
				pressedIcon={pressedIcon}
				shape={shape === "circle" || shape === "square" ? shape : "square"}
				tooltip={tooltip}
			/>
		) : (
			<Toggle
				key={`${args.defaultPressed}-${args.disabled}-button`}
				{...args}
				pressedIcon={pressedIcon}
				shape={shape}
				startSlot={startSlot}
			>
				{children}
			</Toggle>
		);

	return (
		<Stack gap={8}>
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Toggle
				</Heading>
				{singleToggle}
			</Stack>
			<Separator />
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Toggle group
				</Heading>
				<ToggleGroup
					key={`${_join}-${_multiple}-${_orientation}-${args.variant}-${args.size}`}
					aria-label={_multiple ? "Text formatting" : "Text alignment"}
					defaultValue={_multiple ? ["italic", "underline"] : ["center"]}
					join={_join}
					multiple={_multiple}
					orientation={_orientation}
				>
					{_multiple ? (
						<FormattingToggles variant={args.variant} />
					) : (
						<AlignmentToggles variant={args.variant} />
					)}
				</ToggleGroup>
			</Stack>
		</Stack>
	);
}

function AlignmentToggles({ variant }: { variant?: ToggleVariant }) {
	return (
		<>
			<Toggle
				icon={<IconTextAlignStart size="1em" aria-hidden />}
				label="Align left"
				value="left"
				variant={variant}
			/>
			<Toggle
				icon={<IconTextAlignCenter size="1em" aria-hidden />}
				label="Align center"
				value="center"
				variant={variant}
			/>
			<Toggle
				icon={<IconTextAlignEnd size="1em" aria-hidden />}
				label="Align right"
				value="right"
				variant={variant}
			/>
		</>
	);
}

function FormattingToggles({ variant }: { variant?: ToggleVariant }) {
	return (
		<>
			<Toggle
				icon={<IconTextBoldInactive size="1em" aria-hidden />}
				pressedIcon={<IconTextBold size="1em" aria-hidden />}
				label="Bold"
				value="bold"
				variant={variant}
			/>
			<Toggle
				icon={<IconItalic size="1em" aria-hidden />}
				label="Italic"
				value="italic"
				variant={variant}
			/>
			<Toggle
				icon={<IconTextUnderline size="1em" aria-hidden />}
				label="Underline"
				value="underline"
				variant={variant}
			/>
		</>
	);
}

function SegmentToggles({ variant }: { variant?: ToggleVariant }) {
	return (
		<>
			<Toggle value="left" variant={variant}>
				Left
			</Toggle>
			<Toggle value="center" variant={variant}>
				Center
			</Toggle>
			<Toggle value="right" variant={variant}>
				Right
			</Toggle>
		</>
	);
}

const meta = {
	title: "Components/Toggle",
	component: Toggle,
	render: TogglePlaygroundPreview,
	args: {
		_appearance: "button",
		_join: true,
		_multiple: false,
		_orientation: "horizontal",
		children: "Pin message",
		defaultPressed: false,
		disabled: false,
		pressedIcon: iconOptions["Pin Fill"],
		startSlot: iconOptions.Pin,
		variant: "ghost",
		size: "md",
		shape: "default",
	},
	argTypes: {
		_appearance: {
			control: "inline-radio",
			options: ["button", "iconButton"],
			name: "Appearance",
		},
		_join: { control: "boolean", name: "join" },
		_multiple: { control: "boolean", name: "multiple" },
		_orientation: {
			control: "inline-radio",
			options: ["horizontal", "vertical"],
			name: "orientation",
		},
		children: { control: "text" },
		defaultPressed: { control: "boolean" },
		disabled: { control: "boolean" },
		label: { control: "text" },
		variant: {
			control: "select",
			options: ["primary", "subtle", "secondary", "neutral", "ghost", "plain", "error"],
		},
		size: { control: "select", options: ["xs", "sm", "md", "lg"] },
		shape: { control: "select", options: ["default", "pill", "circle", "square"] },
		icon: {
			control: "select",
			options: Object.keys(iconOptions),
			mapping: iconOptions,
		},
		pressedIcon: {
			control: "select",
			options: Object.keys(iconOptions),
			mapping: iconOptions,
		},
		startSlot: {
			control: "select",
			options: Object.keys(iconOptions),
			mapping: iconOptions,
		},
		tooltip: { control: "text" },
	},
	parameters: {
		controls: {
			include: [
				"_appearance",
				"_join",
				"_multiple",
				"_orientation",
				"children",
				"defaultPressed",
				"disabled",
				"icon",
				"label",
				"pressedIcon",
				"startSlot",
				"tooltip",
				"variant",
				"size",
				"shape",
			],
		},
	},
} satisfies Meta<TogglePlaygroundArgs>;

export default meta;
type Story = StoryObj<TogglePlaygroundArgs>;

export const Playground: Story = {};

export const Variants: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={5}>
			{variants.map((variant) => (
				<Grid key={variant} align="center" gap={3} xstyle={styles.variantRow}>
					<Text color="muted" size="1">
						{variant}
					</Text>
					<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
						<Toggle variant={variant}>Off</Toggle>
						<Toggle variant={variant} defaultPressed>
							On
						</Toggle>
					</Stack>
				</Grid>
			))}
		</Stack>
	),
};

export const SizesAndIcons: Story = {
	name: "Sizes and icons",
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={5}>
			{(["xs", "sm", "md", "lg"] as const).map((size) => (
				<Grid key={size} align="center" gap={3} xstyle={styles.variantRow}>
					<Text color="muted" size="1">
						{size === "xs"
							? "Extra small"
							: size === "sm"
								? "Small"
								: size === "md"
									? "Medium"
									: "Large"}
					</Text>
					<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
						<Toggle
							startSlot={<IconBellSlash size="1em" aria-hidden />}
							pressedIcon={<IconBell size="1em" aria-hidden />}
							size={size}
						>
							Notifications
						</Toggle>
						<Toggle
							defaultPressed
							startSlot={<IconBellSlash size="1em" aria-hidden />}
							pressedIcon={<IconBell size="1em" aria-hidden />}
							size={size}
						>
							Notifications
						</Toggle>
						<Toggle
							icon={<IconBellSlash size="1em" aria-hidden />}
							label="Notifications"
							pressedIcon={<IconBell size="1em" aria-hidden />}
							size={size}
						/>
						<Toggle
							defaultPressed
							icon={<IconBellSlash size="1em" aria-hidden />}
							label="Notifications"
							pressedIcon={<IconBell size="1em" aria-hidden />}
							size={size}
						/>
					</Stack>
				</Grid>
			))}
		</Stack>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8}>
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Selection
				</Heading>
				<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
					<Toggle>Off</Toggle>
					<Toggle defaultPressed>On</Toggle>
				</Stack>
			</Stack>
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Disabled
				</Heading>
				<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
					<Toggle disabled>Disabled off</Toggle>
					<Toggle defaultPressed disabled>
						Disabled on
					</Toggle>
				</Stack>
			</Stack>
		</Stack>
	),
};

export const Groups: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8}>
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Single selection
				</Heading>
				<ToggleGroup aria-label="Text alignment" defaultValue={["left"]}>
					<AlignmentToggles />
				</ToggleGroup>
			</Stack>
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Multiple selection
				</Heading>
				<ToggleGroup multiple aria-label="Text formatting" defaultValue={["bold", "italic"]}>
					<FormattingToggles />
				</ToggleGroup>
			</Stack>
			<Separator />
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Joined, single selection
				</Heading>
				<Stack gap={5}>
					{variants.map((variant) => (
						<Grid key={variant} align="center" gap={3} xstyle={styles.variantRow}>
							<Text color="muted" size="1">
								{variant}
							</Text>
							<ToggleGroup aria-label={`${variant} alignment`} defaultValue={["center"]} join>
								<SegmentToggles variant={variant} />
							</ToggleGroup>
						</Grid>
					))}
				</Stack>
			</Stack>
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Joined, multiple selection
				</Heading>
				<Stack gap={5}>
					{variants.map((variant) => (
						<Grid key={variant} align="center" gap={3} xstyle={styles.variantRow}>
							<Text color="muted" size="1">
								{variant}
							</Text>
							<ToggleGroup
								multiple
								aria-label={`${variant} formatting`}
								defaultValue={["italic", "underline"]}
								join
							>
								<FormattingToggles variant={variant} />
							</ToggleGroup>
						</Grid>
					))}
				</Stack>
			</Stack>
			<Separator />
			<Stack align="start" gap={4}>
				<Heading size="1" color="muted" fontWeight="regular">
					Joined, vertical
				</Heading>
				<Stack gap={5} orientation="horizontal" wrap="wrap">
					<ToggleGroup
						aria-label="Vertical alignment"
						defaultValue={["center"]}
						join
						orientation="vertical"
					>
						<SegmentToggles variant="secondary" />
					</ToggleGroup>
					<ToggleGroup
						multiple
						aria-label="Vertical formatting"
						defaultValue={["italic", "underline"]}
						join
						orientation="vertical"
					>
						<FormattingToggles variant="secondary" />
					</ToggleGroup>
				</Stack>
			</Stack>
		</Stack>
	),
};

const styles = stylex.create({
	variantRow: {
		gridTemplateColumns: "6rem minmax(0, 1fr)",
	},
});
