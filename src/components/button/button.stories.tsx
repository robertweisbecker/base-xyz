import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { color, space } from "@/styles/tokens.stylex";
import { fontSize, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import { Button } from "./button";

const iconOptions = {
	None: undefined,
	Add: <PlusIcon aria-hidden weight="bold" />,
	Continue: <ArrowRightIcon aria-hidden weight="bold" />,
};

const meta = {
	title: "Components/Button",
	component: Button,
	args: {
		children: "Create project",
		disabled: false,
		endSlot: undefined,
		variant: "primary",
		size: "md",
		shape: "default",
		startSlot: undefined,
	},
	argTypes: {
		children: { control: "text" },
		disabled: { control: "boolean" },
		variant: {
			control: "select",
			options: ["primary", "subtle", "secondary", "neutral", "ghost", "danger"],
		},
		size: { control: "select", options: ["xs", "sm", "md", "lg"] },
		shape: { control: "select", options: ["default", "pill", "circle", "square"] },
		endSlot: {
			control: "select",
			mapping: iconOptions,
			options: Object.keys(iconOptions),
		},
		render: { control: false },
		startSlot: {
			control: "select",
			mapping: iconOptions,
			options: Object.keys(iconOptions),
		},
	},
	parameters: {
		controls: {
			include: ["children", "variant", "size", "shape", "startSlot", "endSlot", "disabled"],
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const sizes = ["xs", "sm", "md", "lg"] as const;

export const SizesAndIcons: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.variantRows)}>
			{sizes.map((size) => (
				<section key={size} {...stylex.props(storyStyles.variantRow)}>
					<span {...stylex.props(storyStyles.rowLabel)}>{size}</span>
					<div {...stylex.props(storyStyles.row)}>
						<Button size={size}>Create project</Button>
						<Button size={size} startSlot={<PlusIcon aria-hidden weight="bold" />} variant="secondary">
							Create project
						</Button>
						<Button size={size} endSlot={<ArrowRightIcon aria-hidden weight="bold" />} variant="neutral">
							Continue
						</Button>
					</div>
				</section>
			))}
		</div>
	),
};

const variants = ["primary", "subtle", "secondary", "neutral", "ghost", "danger"] as const;

export const Variants: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.row)}>
			{variants.map((variant) => (
				<Button key={variant} variant={variant}>
					{variant}
				</Button>
			))}
		</div>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.variantRows)}>
			<section {...stylex.props(storyStyles.variantRow)}>
				<span {...stylex.props(storyStyles.rowLabel)}>Enabled</span>
				<Button>Create project</Button>
			</section>
			<section {...stylex.props(storyStyles.variantRow)}>
				<span {...stylex.props(storyStyles.rowLabel)}>Disabled</span>
				<Button disabled>Create project</Button>
			</section>
		</div>
	),
};

const storyStyles = stylex.create({
	variantRows: {
		gap: space.x5,
		display: "flex",
		flexDirection: "column",
	},
	variantRow: {
		gap: space.x2,
		display: "flex",
		flexDirection: "column",
	},
	rowLabel: {
		color: color.fgMuted,
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
		textTransform: "capitalize",
	},
	row: {
		gap: space.x3,
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
	},
});
