import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { colors, space } from "@/styles/tokens.stylex";
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
		loading: false,
		loadingText: "Loading…",
		variant: "primary",
		size: "md",
		shape: "default",
		startSlot: undefined,
	},
	argTypes: {
		children: { control: "text" },
		disabled: { control: "boolean" },
		loading: { control: "boolean" },
		loadingText: { control: "text" },
		variant: {
			control: "select",
			options: ["primary", "subtle", "secondary", "neutral", "ghost", "plain", "danger"],
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
			include: [
				"children",
				"variant",
				"size",
				"shape",
				"startSlot",
				"endSlot",
				"disabled",
				"loading",
				"loadingText",
			],
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const FullWidth: Story = {
	args: {
		children: "Continue",
		width: "full",
	},
	parameters: { controls: { disable: true } },
};

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

const variants = ["primary", "subtle", "secondary", "neutral", "ghost", "plain", "danger"] as const;

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
	render: () => <ButtonStates />,
};

function ButtonStates() {
	const [loading, setLoading] = useState(false);

	return (
		<div {...stylex.props(storyStyles.states)}>
			<Button size="md" variant="secondary" onClick={() => setLoading((current) => !current)}>
				{loading ? "Stop loading" : "Start loading"}
			</Button>
			<div {...stylex.props(storyStyles.stateGrid)}>
				{variants.map((variant) => (
					<section key={variant} {...stylex.props(storyStyles.stateColumn)}>
						<span {...stylex.props(storyStyles.rowLabel)}>{variant}</span>
						<div {...stylex.props(storyStyles.stateSpecimen)}>
							<span {...stylex.props(storyStyles.rowLabel)}>Enabled</span>
							<Button size="md" variant={variant}>
								Create project
							</Button>
						</div>
						<div {...stylex.props(storyStyles.stateSpecimen)}>
							<span {...stylex.props(storyStyles.rowLabel)}>Disabled</span>
							<Button disabled size="md" variant={variant}>
								Create project
							</Button>
						</div>
						<div {...stylex.props(storyStyles.stateSpecimen)}>
							<span {...stylex.props(storyStyles.rowLabel)}>Default loading text</span>
							<Button loading={loading} size="md" variant={variant}>
								Create project
							</Button>
						</div>
						<div {...stylex.props(storyStyles.stateSpecimen)}>
							<span {...stylex.props(storyStyles.rowLabel)}>Custom loading text</span>
							<Button
								loading={loading}
								loadingText="Creating…"
								size="md"
								startSlot={<PlusIcon aria-hidden weight="bold" />}
								variant={variant}>
								Create project
							</Button>
						</div>
						<div {...stylex.props(storyStyles.stateSpecimen)}>
							<span {...stylex.props(storyStyles.rowLabel)}>Loader only</span>
							<Button loading={loading} loadingText="" size="md" variant={variant}>
								Create project
							</Button>
						</div>
					</section>
				))}
			</div>
		</div>
	);
}

const storyStyles = stylex.create({
	variantRows: {
		gap: space[5],
		display: "flex",
		flexDirection: "column",
	},
	variantRow: {
		gap: space[2],
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
	},
	states: {
		gap: space[6],
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
		maxWidth: "100%",
	},
	stateGrid: {
		gap: space[6],
		display: "grid",
		gridTemplateColumns: "repeat(7, max-content)",
		paddingBlockEnd: space[2],
		maxWidth: "100%",
		overflowX: "auto",
	},
	stateColumn: {
		gap: space[5],
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
	},
	stateSpecimen: {
		gap: space[2],
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
	},
	rowLabel: {
		color: colors["--text-muted"],
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	row: {
		gap: space[3],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
	},
});
