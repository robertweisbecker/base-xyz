import { PencilSimpleIcon } from "@phosphor-icons/react/dist/csr/PencilSimple";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
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
		<Stack gap={6}>
			{(["square", "circle"] as const).map((shape) => (
				<Stack align="start" gap={2} key={shape}>
					<Text size="1" color="muted">
						{shape}
					</Text>
					<Stack align="end" gap={3} orientation="horizontal" wrap="wrap">
						{sizes.map((size) => (
							<Stack align="center" gap={2} key={size}>
								<Text size="1" color="muted">
									{size}
								</Text>
								<IconButton
									icon={<PlusIcon aria-hidden weight="bold" />}
									label={`Add item (${size}, ${shape})`}
									shape={shape}
									size={size}
									variant="neutral"
								/>
							</Stack>
						))}
					</Stack>
				</Stack>
			))}
		</Stack>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.stateGrid)}>
			{variants.map((variant) => (
				<Stack align="start" gap={5} key={variant}>
					<Text size="1" color="muted">
						{variant}
					</Text>
					<StateSpecimen label="Enabled">
						<IconButton
							icon={<PencilSimpleIcon aria-hidden weight="bold" />}
							label={`Edit project (${variant})`}
							variant={variant}
						/>
					</StateSpecimen>
					<StateSpecimen label="Disabled">
						<IconButton
							disabled
							icon={<PencilSimpleIcon aria-hidden weight="bold" />}
							label={`Edit project (${variant}, disabled)`}
							variant={variant}
						/>
					</StateSpecimen>
					<StateSpecimen label="Loading">
						<IconButton
							icon={<PencilSimpleIcon aria-hidden weight="bold" />}
							label={`Edit project (${variant}, loading)`}
							loading
							variant={variant}
						/>
					</StateSpecimen>
				</Stack>
			))}
		</div>
	),
};

function StateSpecimen({ children, label }: { children: React.ReactNode; label: string }) {
	return (
		<Stack align="start" gap={2}>
			<Text size="1" color="muted">
				{label}
			</Text>
			{children}
		</Stack>
	);
}

const storyStyles = stylex.create({
	stateGrid: {
		gap: tokens["--space-6"],
		display: "grid",
		gridTemplateColumns: "repeat(7, max-content)",
		paddingBlockEnd: tokens["--space-2"],
		maxWidth: "100%",
		overflowX: "auto",
	},
});
