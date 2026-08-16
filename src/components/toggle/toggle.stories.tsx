import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { BellSlashIcon } from "@phosphor-icons/react/dist/csr/BellSlash";
import { TextAlignCenterIcon } from "@phosphor-icons/react/dist/csr/TextAlignCenter";
import { TextAlignLeftIcon } from "@phosphor-icons/react/dist/csr/TextAlignLeft";
import { TextAlignRightIcon } from "@phosphor-icons/react/dist/csr/TextAlignRight";
import { TextBIcon } from "@phosphor-icons/react/dist/csr/TextB";
import { TextItalicIcon } from "@phosphor-icons/react/dist/csr/TextItalic";
import { TextUnderlineIcon } from "@phosphor-icons/react/dist/csr/TextUnderline";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

import { Toggle, ToggleGroup, type ToggleProps, type ToggleVariant } from "./toggle";
import { firstToggleMarker, secondToggleMarker, thirdToggleMarker } from "./toggle-radius-testing.stylex";
import { PushPinSimpleIcon } from "@phosphor-icons/react/dist/csr/PushPinSimple";

const iconOptions = {
	None: undefined,
	Pin: <PushPinSimpleIcon aria-hidden />,
	"Pin Fill": <PushPinSimpleIcon aria-hidden weight="duotone" />,
	Bell: <BellIcon aria-hidden />,
	"Bell slash": <BellSlashIcon aria-hidden weight="duotone" />,
};

type TogglePlaygroundArgs = ToggleProps & {
	_appearance: "button" | "iconButton";
};

function TogglePlaygroundPreview({
	_appearance = "button",
	children,
	icon,
	label,
	pressedIcon,
	shape,
	startSlot,
	tooltip,
	...args
}: TogglePlaygroundArgs) {
	if (_appearance === "iconButton") {
		return (
			<Toggle
				key={`${args.defaultPressed}-${args.disabled}-icon`}
				{...args}
				icon={icon ?? iconOptions.Pin}
				label={label || "Notifications"}
				pressedIcon={pressedIcon}
				shape={shape === "circle" || shape === "square" ? shape : "square"}
				tooltip={tooltip}
			/>
		);
	}

	return (
		<Toggle
			key={`${args.defaultPressed}-${args.disabled}-button`}
			{...args}
			pressedIcon={pressedIcon}
			shape={shape}
			startSlot={startSlot}>
			{children}
		</Toggle>
	);
}

const meta = {
	title: "Components/Toggle",
	component: Toggle,
	render: TogglePlaygroundPreview,
	args: {
		_appearance: "button",
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
		children: { control: "text" },
		defaultPressed: { control: "boolean" },
		disabled: { control: "boolean" },
		label: { control: "text" },
		variant: {
			control: "select",
			options: ["primary", "subtle", "secondary", "neutral", "ghost", "error"],
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

const variants: ToggleVariant[] = ["primary", "subtle", "secondary", "neutral", "ghost", "error"];

export const Variants: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.variantRows)}>
			{variants.map((variant) => (
				<div key={variant} {...stylex.props(styles.variantRow)}>
					<span {...stylex.props(styles.rowLabel)}>{variant}</span>
					<div {...stylex.props(styles.row)}>
						<Toggle variant={variant}>Off</Toggle>
						<Toggle variant={variant} defaultPressed>
							On
						</Toggle>
					</div>
				</div>
			))}
		</div>
	),
};

export const SizesAndIcons: Story = {
	name: "Sizes and icons",
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.variantRows)}>
			{(["xs", "sm", "md", "lg"] as const).map((size) => (
				<div key={size} {...stylex.props(styles.variantRow)}>
					<span {...stylex.props(styles.rowLabel)}>
						{size === "xs" ? "Extra small" : size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
					</span>
					<div {...stylex.props(styles.row)}>
						<Toggle
							startSlot={<BellSlashIcon aria-hidden />}
							pressedIcon={<BellIcon aria-hidden weight="duotone" />}
							size={size}>
							Notifications
						</Toggle>
						<Toggle
							defaultPressed
							startSlot={<BellSlashIcon aria-hidden />}
							pressedIcon={<BellIcon aria-hidden weight="duotone" />}
							size={size}>
							Notifications
						</Toggle>
						<Toggle
							icon={<BellSlashIcon aria-hidden weight="regular" />}
							label="Notifications"
							pressedIcon={<BellIcon aria-hidden weight="duotone" />}
							size={size}
						/>
						<Toggle
							defaultPressed
							icon={<BellSlashIcon aria-hidden />}
							label="Notifications"
							pressedIcon={<BellIcon aria-hidden weight="duotone" />}
							size={size}
						/>
					</div>
				</div>
			))}
		</div>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.story)}>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(styles.heading)}>Selection</h2>
				<div {...stylex.props(styles.row)}>
					<Toggle>Off</Toggle>
					<Toggle defaultPressed>On</Toggle>
				</div>
			</section>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(styles.heading)}>Disabled</h2>
				<div {...stylex.props(styles.row)}>
					<Toggle disabled>Disabled off</Toggle>
					<Toggle defaultPressed disabled>
						Disabled on
					</Toggle>
				</div>
			</section>
		</div>
	),
};

export const Groups: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.story)}>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(styles.heading)}>Single selection</h2>
				<ToggleGroup aria-label="Text alignment" defaultValue={["left"]}>
					<Toggle icon={<TextAlignLeftIcon aria-hidden weight="bold" />} label="Align left" value="left" />
					<Toggle icon={<TextAlignCenterIcon aria-hidden weight="bold" />} label="Align center" value="center" />
					<Toggle icon={<TextAlignRightIcon aria-hidden weight="bold" />} label="Align right" value="right" />
				</ToggleGroup>
			</section>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(styles.heading)}>Multiple selection</h2>
				<ToggleGroup multiple aria-label="Text formatting" defaultValue={["bold", "italic"]}>
					<Toggle icon={<TextBIcon aria-hidden weight="bold" />} label="Bold" value="bold" />
					<Toggle icon={<TextItalicIcon aria-hidden weight="bold" />} label="Italic" value="italic" />
					<Toggle icon={<TextUnderlineIcon aria-hidden weight="bold" />} label="Underline" value="underline" />
				</ToggleGroup>
			</section>
		</div>
	),
};

export const RadiusTesting: Story = {
	name: "Radius testing",
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.story)}>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(styles.heading)}>Horizontal</h2>
				<ToggleGroup aria-label="Horizontal radius testing" defaultValue={["two"]}>
					<Toggle
						className={stylex.props(firstToggleMarker).className}
						style={styles.horizontalFirst}
						value="one"
						variant="secondary">
						One
					</Toggle>
					<Toggle
						className={stylex.props(secondToggleMarker).className}
						style={styles.horizontalSecond}
						value="two"
						variant="secondary">
						Two
					</Toggle>
					<Toggle
						className={stylex.props(thirdToggleMarker).className}
						style={styles.horizontalThird}
						value="three"
						variant="secondary">
						Three
					</Toggle>
				</ToggleGroup>
			</section>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(styles.heading)}>Vertical</h2>
				<ToggleGroup aria-label="Vertical radius testing" defaultValue={["two"]} orientation="vertical">
					<Toggle
						className={stylex.props(firstToggleMarker).className}
						style={styles.verticalFirst}
						value="one"
						variant="secondary">
						One
					</Toggle>
					<Toggle
						className={stylex.props(secondToggleMarker).className}
						style={styles.verticalSecond}
						value="two"
						variant="secondary">
						Two
					</Toggle>
					<Toggle
						className={stylex.props(thirdToggleMarker).className}
						style={styles.verticalThird}
						value="three"
						variant="secondary">
						Three
					</Toggle>
				</ToggleGroup>
			</section>
		</div>
	),
};

const styles = stylex.create({
	story: {
		gap: tokens["--space-8"],
		display: "flex",
		flexDirection: "column",
	},
	section: {
		gap: tokens["--space-4"],
		alignItems: "flex-start",
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
	variantRows: {
		gap: tokens["--space-5"],
		display: "flex",
		flexDirection: "column",
	},
	variantRow: {
		gap: tokens["--space-3"],
		display: "grid",
		gridTemplateColumns: "6rem minmax(0, 1fr)",
	},
	rowLabel: {
		alignSelf: "center",
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	row: {
		gap: tokens["--space-3"],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
	},
	horizontalFirst: {
		borderEndEndRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingAfter("[data-pressed]", secondToggleMarker)]: 0,
		},
		borderEndStartRadius: tokens["--radius-md"],
		borderStartEndRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingAfter("[data-pressed]", secondToggleMarker)]: 0,
		},
		borderStartStartRadius: tokens["--radius-md"],
	},
	horizontalSecond: {
		borderEndEndRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingAfter("[data-pressed]", thirdToggleMarker)]: 0,
		},
		borderEndStartRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingBefore("[data-pressed]", firstToggleMarker)]: 0,
		},
		borderStartEndRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingAfter("[data-pressed]", thirdToggleMarker)]: 0,
		},
		borderStartStartRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingBefore("[data-pressed]", firstToggleMarker)]: 0,
		},
	},
	horizontalThird: {
		borderEndEndRadius: tokens["--radius-md"],
		borderEndStartRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingBefore("[data-pressed]", secondToggleMarker)]: 0,
		},
		borderStartEndRadius: tokens["--radius-md"],
		borderStartStartRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingBefore("[data-pressed]", secondToggleMarker)]: 0,
		},
	},
	verticalFirst: {
		borderEndEndRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingAfter("[data-pressed]", secondToggleMarker)]: 0,
		},
		borderEndStartRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingAfter("[data-pressed]", secondToggleMarker)]: 0,
		},
		borderStartEndRadius: tokens["--radius-md"],
		borderStartStartRadius: tokens["--radius-md"],
	},
	verticalSecond: {
		borderEndEndRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingAfter("[data-pressed]", thirdToggleMarker)]: 0,
		},
		borderEndStartRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingAfter("[data-pressed]", thirdToggleMarker)]: 0,
		},
		borderStartEndRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingBefore("[data-pressed]", firstToggleMarker)]: 0,
		},
		borderStartStartRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingBefore("[data-pressed]", firstToggleMarker)]: 0,
		},
	},
	verticalThird: {
		borderEndEndRadius: tokens["--radius-md"],
		borderEndStartRadius: tokens["--radius-md"],
		borderStartEndRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingBefore("[data-pressed]", secondToggleMarker)]: 0,
		},
		borderStartStartRadius: {
			"[data-pressed]": 0,
			default: tokens["--radius-md"],
			[stylex.when.siblingBefore("[data-pressed]", secondToggleMarker)]: 0,
		},
	},
});
