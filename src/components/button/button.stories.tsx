import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { tokens } from "@/theme/tokens.stylex";

import { Button } from "./button";

const iconOptions = {
	None: undefined,
	Add: <PlusIcon aria-hidden />,
	Continue: <ArrowRightIcon aria-hidden />,
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
			options: ["primary", "subtle", "secondary", "neutral", "ghost", "plain", "error"],
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
			include: ["children", "variant", "size", "shape", "startSlot", "endSlot", "disabled", "loading", "loadingText"],
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
		<Stack gap={5}>
			{sizes.map((size) => (
				<Stack align="start" gap={2} key={size}>
					<Text size="1" color="muted">
						{size}
					</Text>
					<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
						<Button size={size}>Create project</Button>
						<Button size={size} startSlot={<PlusIcon aria-hidden weight="bold" />} variant="secondary">
							Create project
						</Button>
						<Button size={size} endSlot={<ArrowRightIcon aria-hidden weight="bold" />} variant="neutral">
							Continue
						</Button>
					</Stack>
				</Stack>
			))}
		</Stack>
	),
};

const variants = ["primary", "subtle", "secondary", "neutral", "ghost", "plain", "error"] as const;

export const Variants: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
			{variants.map((variant) => (
				<Button key={variant} variant={variant}>
					{variant}
				</Button>
			))}
		</Stack>
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
		<Stack align="start" gap={6} maxWidth="100%">
			<Button size="md" variant="secondary" onClick={() => setLoading((current) => !current)}>
				{loading ? "Stop loading" : "Start loading"}
			</Button>
			<div {...stylex.props(storyStyles.stateGrid)}>
				{variants.map((variant) => (
					<Stack align="start" gap={5} key={variant}>
						<Text size="1" color="muted">
							{variant}
						</Text>
						<StateSpecimen label="Enabled">
							<Button size="md" variant={variant}>
								Create project
							</Button>
						</StateSpecimen>
						<StateSpecimen label="Disabled">
							<Button disabled size="md" variant={variant}>
								Create project
							</Button>
						</StateSpecimen>
						<StateSpecimen label="Default loading text">
							<Button loading={loading} size="md" variant={variant}>
								Create project
							</Button>
						</StateSpecimen>
						<StateSpecimen label="Custom loading text">
							<Button
								loading={loading}
								loadingText="Creating…"
								size="md"
								startSlot={<PlusIcon aria-hidden weight="bold" />}
								variant={variant}>
								Create project
							</Button>
						</StateSpecimen>
						<StateSpecimen label="Loader only">
							<Button loading={loading} loadingText="" size="md" variant={variant}>
								Create project
							</Button>
						</StateSpecimen>
					</Stack>
				))}
			</div>
		</Stack>
	);
}

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
