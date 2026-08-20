import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Heading } from "@/components/heading/heading";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";

import { Badge } from "./badge";
import { Icon } from "../icons";

const iconOptions = {
	None: undefined,
	Check: <CheckCircleIcon aria-hidden weight="fill" />,
	Warning: <WarningIcon aria-hidden weight="fill" />,
};

const meta = {
	title: "Components/Badge",
	component: Badge,
	args: {
		children: "In progress",
		endSlot: undefined,
		hue: "neutral",
		startSlot: undefined,
		shape: "default",
		size: "md",
		variant: "subtle",
	},
	argTypes: {
		variant: {
			control: "inline-radio",
			options: ["subtle", "elevated", "solid"],
		},
		hue: {
			control: "inline-radio",
			options: ["neutral", "accent", "error", "warning", "success"],
		},
		size: {
			control: "inline-radio",
			options: ["xs", "sm", "md"],
		},
		shape: {
			control: "select",
			options: ["default", "pill"],
		},
		startSlot: {
			control: "select",
			options: Object.keys(iconOptions),
			mapping: iconOptions,
		},
		children: { control: "text" },
		endSlot: {
			control: "select",
			options: Object.keys(iconOptions),
			mapping: iconOptions,
		},
		render: { control: false },
		tooltip: { control: false },
	},
	parameters: {
		controls: {
			include: ["children", "variant", "hue", "size", "shape", "startSlot", "endSlot"],
		},
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const variants = ["subtle", "elevated", "solid"] as const;
const shapes = ["default", "pill", "circle", "square"] as const;
const hues = ["neutral", "accent", "error", "warning", "success"] as const;

export const Variants: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={5}>
			{variants.map((variant) => (
				<Stack align="start" gap={2} key={variant}>
					<Heading size="1" color="muted" fontWeight="regular">
						{variant}
					</Heading>
					<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
						{hues.map((hue) => (
							<Badge key={hue} hue={hue} variant={variant}>
								{hue}
							</Badge>
						))}
					</Stack>
				</Stack>
			))}
		</Stack>
	),
};

export const SizesAndShapes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={5}>
			{shapes.map((shape) => {
				const iconOnly = shape === "circle" || shape === "square";

				return (
					<Stack align="start" gap={2} key={shape}>
						<Heading size="1" color="muted" fontWeight="regular">
							{shape}
						</Heading>
						<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
							{(["sm", "md"] as const).map((size) => (
								<Stack align="start" gap={2} key={size}>
									<Text size="1" color="muted">
										{size}
									</Text>
									{iconOnly ? (
										<Badge
											hue="accent"
											label={`${size} ${shape} status`}
											shape={shape}
											size={size}
											startSlot={<CheckCircleIcon aria-hidden weight="fill" />}
										/>
									) : (
										<Badge hue="accent" shape={shape} size={size}>
											In progress
										</Badge>
									)}
								</Stack>
							))}
						</Stack>
					</Stack>
				);
			})}
		</Stack>
	),
};

export const Options: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={6}>
			<Stack align="start" gap={4}>
				<Text size="1" color="muted">
					Width
				</Text>
				<Badge data-testid="full-width-badge" width="full">
					Full-width badge
				</Badge>
			</Stack>
			<Stack align="start" gap={4}>
				<Text size="1" color="muted">
					Slots
				</Text>
				<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
					<Badge hue="success" startSlot={<CheckCircleIcon aria-hidden weight="fill" />}>
						Approved
					</Badge>
					<Badge endSlot={<WarningIcon aria-hidden weight="fill" />} hue="warning" startSlot={<Icon.Dot />}>
						Review requested
					</Badge>
				</Stack>
			</Stack>
			<Stack align="start" gap={4}>
				<Text size="1" color="muted">
					Icon only
				</Text>
				<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
					<Badge label="Approved" shape="circle" startSlot={<CheckCircleIcon aria-hidden weight="fill" />} />
					<Badge
						hue="warning"
						label="Needs attention"
						shape="square"
						startSlot={<WarningIcon aria-hidden weight="fill" />}
					/>
				</Stack>
			</Stack>
			<Stack align="start" gap={4}>
				<Text size="1" color="muted">
					As a link
				</Text>
				<Badge hue="accent" render={<a href="#release-notes" />}>
					View release notes
				</Badge>
			</Stack>
		</Stack>
	),
};

export const TruncationTooltip: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack align="start" gap={3} style={storyStyles.truncationFrame}>
			<Stack align="center" gap={2} orientation="horizontal" style={storyStyles.truncationRow}>
				<Text size="1" color="muted">
					Status
				</Text>
				<Badge hue="accent" startSlot={<CheckCircleIcon aria-hidden weight="fill" />}>
					Approved for the upcoming production release
				</Badge>
			</Stack>
			<Text size="1" color="muted">
				Hover or focus the truncated badge to read its full text.
			</Text>
		</Stack>
	),
};

const storyStyles = stylex.create({
	truncationFrame: {
		resize: "horizontal",
		maxWidth: "180px",
	},
	truncationRow: {
		maxWidth: "100%",
		minWidth: 0,
	},
});
