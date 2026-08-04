import { PencilSimpleIcon } from "@phosphor-icons/react/dist/csr/PencilSimple";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

import { IconButton } from "./button";

const iconOptions = {
	Add: <PlusIcon aria-hidden weight="bold" />,
	Edit: <PencilSimpleIcon aria-hidden weight="bold" />,
	Delete: <TrashIcon aria-hidden weight="bold" />,
};

const sizes = ["xs", "sm", "md", "lg"] as const;
const variants = ["primary", "subtle", "secondary", "neutral", "ghost", "plain", "error"] as const;

const meta = {
	title: "Components/Button/Icon button",
	component: IconButton,
	args: {
		disabled: false,
		icon: iconOptions.Add,
		label: "Add item",
		loading: false,
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
		loading: { control: "boolean" },
		shape: { control: "inline-radio", options: ["circle", "square"] },
		size: { control: "inline-radio", options: sizes },
		tooltip: { control: "text" },
		variant: {
			control: "select",
			options: variants,
		},
	},
	parameters: {
		controls: {
			include: ["icon", "label", "variant", "size", "shape", "tooltip", "disabled", "loading"],
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
		<div {...stylex.props(storyStyles.stateGrid)}>
			{variants.map((variant) => (
				<section key={variant} {...stylex.props(storyStyles.stateColumn)}>
					<span {...stylex.props(storyStyles.label)}>{variant}</span>
					<div {...stylex.props(storyStyles.stateSpecimen)}>
						<span {...stylex.props(storyStyles.label)}>Enabled</span>
						<IconButton
							icon={<PencilSimpleIcon aria-hidden weight="bold" />}
							label={`Edit project (${variant})`}
							variant={variant}
						/>
					</div>
					<div {...stylex.props(storyStyles.stateSpecimen)}>
						<span {...stylex.props(storyStyles.label)}>Disabled</span>
						<IconButton
							disabled
							icon={<PencilSimpleIcon aria-hidden weight="bold" />}
							label={`Edit project (${variant}, disabled)`}
							variant={variant}
						/>
					</div>
					<div {...stylex.props(storyStyles.stateSpecimen)}>
						<span {...stylex.props(storyStyles.label)}>Loading</span>
						<IconButton
							icon={<PencilSimpleIcon aria-hidden weight="bold" />}
							label={`Edit project (${variant}, loading)`}
							loading
							variant={variant}
						/>
					</div>
				</section>
			))}
		</div>
	),
};

const storyStyles = stylex.create({
	options: {
		gap: tokens["--space-6"],
		display: "flex",
		flexDirection: "column",
	},
	section: {
		gap: tokens["--space-2"],
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
	},
	label: {
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		textTransform: "capitalize",
	},
	row: {
		gap: tokens["--space-3"],
		alignItems: "flex-end",
		display: "flex",
	},
	specimen: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
	},
	stateGrid: {
		gap: tokens["--space-6"],
		display: "grid",
		gridTemplateColumns: "repeat(7, max-content)",
		paddingBlockEnd: tokens["--space-2"],
		maxWidth: "100%",
		overflowX: "auto",
	},
	stateColumn: {
		gap: tokens["--space-5"],
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
	},
	stateSpecimen: {
		gap: tokens["--space-2"],
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
	},
});
