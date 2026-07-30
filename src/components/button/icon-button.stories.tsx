import { PencilSimpleIcon } from "@phosphor-icons/react/dist/csr/PencilSimple";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { color, space } from "@/styles/tokens.stylex";
import { fontSize, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import { IconButton } from "./button";

const iconOptions = {
	Add: <PlusIcon aria-hidden weight="bold" />,
	Edit: <PencilSimpleIcon aria-hidden weight="bold" />,
	Delete: <TrashIcon aria-hidden weight="bold" />,
};

const sizes = ["xs", "sm", "md", "lg"] as const;

const meta = {
	title: "Components/Icon button",
	component: IconButton,
	args: {
		disabled: false,
		icon: iconOptions.Add,
		label: "Add item",
		shape: "square",
		size: "md",
		tooltip: "Add item",
		variant: "neutral",
	},
	argTypes: {
		disabled: { control: "boolean" },
		icon: {
			control: "select",
			mapping: iconOptions,
			options: Object.keys(iconOptions),
		},
		label: { control: "text" },
		shape: { control: "inline-radio", options: ["circle", "square"] },
		size: { control: "inline-radio", options: sizes },
		tooltip: { control: "text" },
		variant: {
			control: "select",
			options: ["primary", "subtle", "secondary", "neutral", "ghost", "danger"],
		},
	},
	parameters: {
		controls: {
			include: ["icon", "label", "variant", "size", "shape", "tooltip", "disabled"],
		},
	},
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SizesAndShapes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.options)}>
			{(["square", "circle"] as const).map((shape) => (
				<section key={shape} {...stylex.props(storyStyles.section)}>
					<span {...stylex.props(storyStyles.label)}>{shape}</span>
					<div {...stylex.props(storyStyles.row)}>
						{sizes.map((size) => (
							<div key={size} {...stylex.props(storyStyles.specimen)}>
								<span {...stylex.props(storyStyles.label)}>{size}</span>
								<IconButton
									icon={<PlusIcon aria-hidden weight="bold" />}
									label={`Add item (${size}, ${shape})`}
									shape={shape}
									size={size}
									variant="neutral"
								/>
							</div>
						))}
					</div>
				</section>
			))}
		</div>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.options)}>
			<section {...stylex.props(storyStyles.section)}>
				<span {...stylex.props(storyStyles.label)}>Enabled</span>
				<IconButton icon={<PencilSimpleIcon aria-hidden weight="bold" />} label="Edit project" variant="neutral" />
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<span {...stylex.props(storyStyles.label)}>Disabled</span>
				<IconButton disabled icon={<PencilSimpleIcon aria-hidden weight="bold" />} label="Edit project" variant="neutral" />
			</section>
		</div>
	),
};

const storyStyles = stylex.create({
	options: {
		gap: space.x6,
		display: "flex",
		flexDirection: "column",
	},
	section: {
		gap: space.x2,
		display: "flex",
		flexDirection: "column",
	},
	label: {
		color: color.fgMuted,
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
		textTransform: "capitalize",
	},
	row: {
		gap: space.x3,
		alignItems: "flex-end",
		display: "flex",
	},
	specimen: {
		gap: space.x2,
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
	},
});
