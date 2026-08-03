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
import { color, radius, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import { Toggle, ToggleGroup, type ToggleVariant } from "./toggle";
import { firstToggleMarker, secondToggleMarker, thirdToggleMarker } from "./toggle-radius-testing.stylex";

const iconOptions = {
	None: undefined,
	Bell: <BellIcon aria-hidden weight="regular" />,
	"Bell slash": <BellSlashIcon aria-hidden weight="regular" />,
};

const meta = {
	title: "Components/Toggle",
	component: Toggle,
	args: {
		children: "Pin message",
		defaultPressed: false,
		disabled: false,
		icon: undefined,
		pressedIcon: undefined,
		variant: "ghost",
		size: "md",
		shape: "default",
	},
	argTypes: {
		children: { control: "text" },
		defaultPressed: { control: "boolean" },
		disabled: { control: "boolean" },
		variant: {
			control: "select",
			options: ["primary", "subtle", "secondary", "neutral", "ghost", "danger"],
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
	},
	parameters: {
		controls: {
			include: ["children", "defaultPressed", "disabled", "icon", "pressedIcon", "variant", "size", "shape"],
		},
	},
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => <Toggle key={`${args.defaultPressed}-${args.disabled}`} {...args} />,
};

const variants: ToggleVariant[] = ["primary", "subtle", "secondary", "neutral", "ghost", "danger"];

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
							icon={<BellIcon aria-hidden weight="regular" />}
							pressedIcon={<BellSlashIcon aria-hidden weight="regular" />}
							size={size}>
							Notifications
						</Toggle>
						<Toggle
							defaultPressed
							icon={<BellIcon aria-hidden weight="regular" />}
							pressedIcon={<BellSlashIcon aria-hidden weight="regular" />}
							size={size}>
							Notifications
						</Toggle>
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
					<Toggle aria-label="Align left" value="left">
						<TextAlignLeftIcon aria-hidden size={16} weight="regular" />
					</Toggle>
					<Toggle aria-label="Align center" value="center">
						<TextAlignCenterIcon aria-hidden size={16} weight="regular" />
					</Toggle>
					<Toggle aria-label="Align right" value="right">
						<TextAlignRightIcon aria-hidden size={16} weight="regular" />
					</Toggle>
				</ToggleGroup>
			</section>
			<section {...stylex.props(styles.section)}>
				<h2 {...stylex.props(styles.heading)}>Multiple selection</h2>
				<ToggleGroup multiple aria-label="Text formatting" defaultValue={["bold", "italic"]}>
					<Toggle aria-label="Bold" value="bold">
						<TextBIcon aria-hidden size={16} weight="regular" />
					</Toggle>
					<Toggle aria-label="Italic" value="italic">
						<TextItalicIcon aria-hidden size={16} weight="regular" />
					</Toggle>
					<Toggle aria-label="Underline" value="underline">
						<TextUnderlineIcon aria-hidden size={16} weight="regular" />
					</Toggle>
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
		gap: space.x8,
		display: "flex",
		flexDirection: "column",
	},
	section: {
		gap: space.x4,
		alignItems: "flex-start",
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
	variantRows: {
		gap: space.x5,
		display: "flex",
		flexDirection: "column",
	},
	variantRow: {
		gap: space.x3,
		display: "grid",
		gridTemplateColumns: "6rem minmax(0, 1fr)",
	},
	rowLabel: {
		alignSelf: "center",
		color: color.fgMuted,
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	row: {
		gap: space.x3,
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
	},
	horizontalFirst: {
		borderEndEndRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingAfter("[data-pressed]", secondToggleMarker)]: 0,
		},
		borderEndStartRadius: radius.md,
		borderStartEndRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingAfter("[data-pressed]", secondToggleMarker)]: 0,
		},
		borderStartStartRadius: radius.md,
	},
	horizontalSecond: {
		borderEndEndRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingAfter("[data-pressed]", thirdToggleMarker)]: 0,
		},
		borderEndStartRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingBefore("[data-pressed]", firstToggleMarker)]: 0,
		},
		borderStartEndRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingAfter("[data-pressed]", thirdToggleMarker)]: 0,
		},
		borderStartStartRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingBefore("[data-pressed]", firstToggleMarker)]: 0,
		},
	},
	horizontalThird: {
		borderEndEndRadius: radius.md,
		borderEndStartRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingBefore("[data-pressed]", secondToggleMarker)]: 0,
		},
		borderStartEndRadius: radius.md,
		borderStartStartRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingBefore("[data-pressed]", secondToggleMarker)]: 0,
		},
	},
	verticalFirst: {
		borderEndEndRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingAfter("[data-pressed]", secondToggleMarker)]: 0,
		},
		borderEndStartRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingAfter("[data-pressed]", secondToggleMarker)]: 0,
		},
		borderStartEndRadius: radius.md,
		borderStartStartRadius: radius.md,
	},
	verticalSecond: {
		borderEndEndRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingAfter("[data-pressed]", thirdToggleMarker)]: 0,
		},
		borderEndStartRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingAfter("[data-pressed]", thirdToggleMarker)]: 0,
		},
		borderStartEndRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingBefore("[data-pressed]", firstToggleMarker)]: 0,
		},
		borderStartStartRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingBefore("[data-pressed]", firstToggleMarker)]: 0,
		},
	},
	verticalThird: {
		borderEndEndRadius: radius.md,
		borderEndStartRadius: radius.md,
		borderStartEndRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingBefore("[data-pressed]", secondToggleMarker)]: 0,
		},
		borderStartStartRadius: {
			"[data-pressed]": 0,
			default: radius.md,
			[stylex.when.siblingBefore("[data-pressed]", secondToggleMarker)]: 0,
		},
	},
});
