import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import type { Meta, StoryObj } from "@storybook/react-vite";
import x from "@stylexjs/atoms";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Button } from "@/components/button/button";
import { CloseButton } from "@/components/button/close-button";
import { Box, Stack } from "@/components/layout/layout";
import { Link } from "@/components/link/link";
import { ScrollArea } from "@/components/scroll-area/scroll-area";
import { Text } from "@/components/text/text";
import { tokens } from "@/theme/tokens.stylex";
import { Callout, type CalloutHue, type CalloutVariant } from "./callout";

const iconOptions = {
	None: undefined,
	Information: <InfoIcon aria-hidden weight="duotone" />,
	Success: <CheckCircleIcon aria-hidden weight="duotone" />,
	Warning: <WarningIcon aria-hidden weight="duotone" />,
};

const actionOptions = {
	None: undefined,
	Button: (
		<Button size="sm" variant="secondary">
			Review
		</Button>
	),
	Close: <CloseButton label="Dismiss callout" />,
	Link: (
		<Link href="#details" color="inherit">
			View details
		</Link>
	),
};

const meta = {
	title: "Components/Callout",
	component: Callout,
	args: {
		action: undefined,
		alert: false,
		description: "A new version is ready to install.",
		hue: "accent",
		icon: <InfoIcon aria-hidden weight="duotone" />,
		title: "Update available",
		variant: "default",
	},
	argTypes: {
		action: {
			control: "select",
			mapping: actionOptions,
			options: Object.keys(actionOptions),
		},
		alert: { control: "boolean" },
		description: { control: "text" },
		hue: {
			control: "inline-radio",
			options: ["accent", "error", "warning", "success", "neutral"],
		},
		icon: {
			control: "select",
			mapping: iconOptions,
			options: Object.keys(iconOptions),
		},
		title: { control: "text" },
		variant: {
			control: "inline-radio",
			options: ["default", "banner"],
		},
	},
	parameters: {
		controls: {
			include: ["title", "description", "icon", "action", "hue", "variant", "alert"],
		},
	},
	decorators: [
		(Story, context) => (
			<Box width="100%" maxWidth={context.parameters.layout === "fullscreen" ? undefined : "48rem"}>
				<Story />
			</Box>
		),
	],
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const hues: readonly CalloutHue[] = ["accent", "error", "warning", "success", "neutral"];
const variants: readonly CalloutVariant[] = ["default", "banner"];

const examplesByHue = {
	accent: {
		description: "A new version is ready to install.",
		icon: <InfoIcon aria-hidden weight="duotone" />,
		title: "Update available",
	},
	error: {
		description: "We couldn't save your changes. Please try again.",
		icon: <WarningCircleIcon aria-hidden weight="duotone" />,
		title: "Save failed",
	},
	warning: {
		description: "Your session will expire in five minutes.",
		icon: <WarningIcon aria-hidden weight="duotone" />,
		title: "Session expiring",
	},
	success: {
		description: "The production release completed successfully.",
		icon: <CheckCircleIcon aria-hidden weight="duotone" />,
		title: "Deployment complete",
	},
	neutral: {
		description: "This service will be unavailable for ten minutes.",
		icon: <InfoIcon aria-hidden weight="duotone" />,
		title: "Maintenance scheduled",
	},
} satisfies Record<CalloutHue, { description: string; icon: ReactNode; title: string }>;

export const Variants: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8}>
			{variants.map((variant) => (
				<Stack align="start" gap={2} key={variant}>
					<Text color="muted" size="1">
						{variant}
					</Text>
					<Stack gap={3}>
						{hues.map((hue) => {
							const example = examplesByHue[hue];

							return (
								<Callout
									action={
										variant === "banner" ? (
											<CloseButton label={`Dismiss ${example.title}`} />
										) : undefined
									}
									key={hue}
									description={example.description}
									hue={hue}
									icon={example.icon}
									title={example.title}
									variant={variant}
								/>
							);
						})}
					</Stack>
				</Stack>
			))}
		</Stack>
	),
};

export const Options: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={3}>
			<Callout
				action={
					<Button size="sm" variant="secondary">
						Review changes
					</Button>
				}
				description="A new version is ready to install."
				hue="accent"
				icon={<InfoIcon aria-hidden weight="duotone" />}
				title="Update available"
			/>
			<Callout
				description="Background synchronization has completed."
				hue="success"
				icon={<CheckCircleIcon aria-hidden weight="duotone" />}
			/>
			<Callout
				action={<CloseButton label="Dismiss save error" />}
				alert
				description="We couldn't save your changes."
				hue="error"
				icon={<WarningCircleIcon aria-hidden weight="duotone" />}
				variant="banner"
			/>
		</Stack>
	),
};

export const Positioning: Story = {
	parameters: {
		controls: { disable: true },
		layout: "fullscreen",
	},
	render: () => (
		<Stack gap={8} py={4}>
			<Stack align="start" gap={2}>
				<Text color="muted" size="1">
					Absolute
				</Text>
				<ScrollArea
					disableFade
					label="Absolute banner example"
					showScrollbar="always"
					xstyle={storyStyles.positioningStage}
				>
					<div
						{...stylex.props(
							x.paddingInline(tokens["--space-4"]),
							x.paddingBottom(tokens["--space-4"]),
							x.paddingTop(tokens["--space-12"]),
							x.minHeight("24rem"),
						)}
					>
						<Callout
							action={<CloseButton label="Dismiss workspace notice" />}
							description="This banner is anchored to the top of its containing surface."
							title="Workspace notice"
							variant="banner"
							xstyle={[
								x.insetInlineEnd._0,
								x.insetInlineStart._0,
								x.position.absolute,
								x.top._0,
								x.width["100%"],
								x.zIndex._1,
							]}
						/>
						<Stack gap={3} xstyle={storyStyles.log}>
							{Array.from({ length: 8 }, (_, index) => (
								<Text key={index} color="muted" size="2">
									Positioned content row {index + 1}
								</Text>
							))}
						</Stack>
					</div>
				</ScrollArea>
			</Stack>
			<Stack align="start" gap={2}>
				<Text color="muted" size="1">
					Sticky
				</Text>
				<ScrollArea
					disableFade
					label="Sticky banner example"
					showScrollbar="always"
					xstyle={storyStyles.positioningStage}
				>
					<div
						{...stylex.props(
							x.padding(tokens["--space-3"]),
							x.gap(tokens["--space-3"]),
							x.display.flex,
							x.flexDirection.column,
						)}
					>
						<Text size="2">Deployment log</Text>
						<Callout
							action={<CloseButton label="Dismiss live updates" />}
							description="New events will appear below."
							hue="neutral"
							title="Live updates"
							variant="banner"
							xstyle={[x.position.sticky, x.top._0, x.width["100%"], x.zIndex._1]}
						/>
						<Stack gap={3} xstyle={storyStyles.log}>
							{Array.from({ length: 8 }, (_, index) => (
								<Text key={index} color="muted" size="2">
									Event {index + 1}
								</Text>
							))}
						</Stack>
					</div>
				</ScrollArea>
			</Stack>
		</Stack>
	),
};

const storyStyles = stylex.create({
	positioningStage: {
		borderColor: tokens["--border"],
		borderStyle: "solid",
		borderWidth: "1px",
		height: "13rem",
	},
	log: {
		minHeight: "18rem",
	},
});
