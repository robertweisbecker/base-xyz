import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { colors, space } from "@/styles/tokens.stylex";
import { Button } from "../button/button";
import { CloseButton } from "../button/close-button";
import { Link } from "../link/link";
import { ScrollArea } from "../scroll-area/scroll-area";
import { Text } from "../text/text";
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
	Link: <Link href="#details">View details</Link>,
};

const positionOptions = {
	None: undefined,
	Static: "static",
	Relative: "relative",
	Absolute: "absolute",
	Fixed: "fixed",
	Sticky: "sticky",
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
		position: undefined,
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
			options: ["accent", "danger", "warning", "success", "neutral"],
		},
		icon: {
			control: "select",
			mapping: iconOptions,
			options: Object.keys(iconOptions),
		},
		position: {
			control: "select",
			mapping: positionOptions,
			options: Object.keys(positionOptions),
		},
		insetTop: { control: "number" },
		insetStart: { control: "number" },
		insetEnd: { control: "number" },
		title: { control: "text" },
		variant: {
			control: "inline-radio",
			options: ["default", "banner"],
		},
		zIndex: { control: "number" },
	},
	parameters: {
		controls: {
			include: [
				"title",
				"description",
				"icon",
				"action",
				"hue",
				"variant",
				"alert",
				"position",
				"insetTop",
				"insetStart",
				"insetEnd",
				"zIndex",
			],
		},
	},
	decorators: [
		(Story, context) => (
			<div
				{...stylex.props(context.parameters.layout === "fullscreen" ? storyStyles.fullWidthFrame : storyStyles.frame)}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const hues: readonly CalloutHue[] = ["accent", "danger", "warning", "success", "neutral"];
const variants: readonly CalloutVariant[] = ["default", "banner"];

const examplesByHue: Record<CalloutHue, { description: string; icon: ReactNode; title: string }> = {
	accent: {
		description: "A new version is ready to install.",
		icon: <InfoIcon aria-hidden weight="duotone" />,
		title: "Update available",
	},
	danger: {
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
};

export const Variants: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.sections)}>
			{variants.map((variant) => (
				<section key={variant} {...stylex.props(storyStyles.section)}>
					<Text color="muted" size="1">
						{variant}
					</Text>
					<div {...stylex.props(storyStyles.stack)}>
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
					</div>
				</section>
			))}
		</div>
	),
};

export const Options: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.stack)}>
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
				hue="danger"
				icon={<WarningCircleIcon aria-hidden weight="duotone" />}
				variant="banner"
			/>
		</div>
	),
};

export const Positioning: Story = {
	parameters: {
		controls: { disable: true },
		layout: "fullscreen",
	},
	render: () => (
		<div {...stylex.props(storyStyles.positioningExamples)}>
			<section {...stylex.props(storyStyles.section)}>
				<Text color="muted" size="1">
					Absolute
				</Text>
				<ScrollArea
					disableFade
					contentStyle={storyStyles.absoluteStageContent}
					label="Absolute banner example"
					showScrollbar="always"
					style={storyStyles.positioningStage}>
					<Callout
						action={<CloseButton label="Dismiss workspace notice" />}
						description="This banner is anchored to the top of its containing surface."
						insetEnd={0}
						insetStart={0}
						insetTop={0}
						position="absolute"
						title="Workspace notice"
						variant="banner"
						zIndex={1}
					/>
					<div {...stylex.props(storyStyles.log)}>
						{Array.from({ length: 8 }, (_, index) => (
							<Text key={index} color="muted" size="2">
								Positioned content row {index + 1}
							</Text>
						))}
					</div>
				</ScrollArea>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<Text color="muted" size="1">
					Sticky
				</Text>
				<ScrollArea
					disableFade
					contentStyle={storyStyles.stickyStageContent}
					label="Sticky banner example"
					showScrollbar="always"
					style={storyStyles.positioningStage}>
					<Text size="2">Deployment log</Text>
					<Callout
						action={<CloseButton label="Dismiss live updates" />}
						description="New events will appear below."
						hue="neutral"
						insetTop={0}
						position="sticky"
						title="Live updates"
						variant="banner"
						zIndex={1}
					/>
					<div {...stylex.props(storyStyles.log)}>
						{Array.from({ length: 8 }, (_, index) => (
							<Text key={index} color="muted" size="2">
								Event {index + 1}
							</Text>
						))}
					</div>
				</ScrollArea>
			</section>
		</div>
	),
};

const storyStyles = stylex.create({
	frame: {
		maxWidth: "48rem",
		width: "100%",
	},
	fullWidthFrame: {
		width: "100%",
	},
	sections: {
		gap: space[8],
		display: "flex",
		flexDirection: "column",
	},
	section: {
		gap: space[2],
		display: "flex",
		flexDirection: "column",
	},
	stack: {
		gap: space[3],
		display: "flex",
		flexDirection: "column",
	},
	positioningExamples: {
		gap: space[8],
		paddingBlock: space[4],
		display: "flex",
		flexDirection: "column",
	},
	positioningStage: {
		borderColor: colors["--border"],
		borderStyle: "solid",
		borderWidth: "1px",
		height: "13rem",
	},
	absoluteStageContent: {
		paddingInline: space[4],
		paddingBlockEnd: space[4],
		paddingBlockStart: space[12],
		minHeight: "24rem",
	},
	stickyStageContent: {
		padding: space[3],
		gap: space[3],
		display: "flex",
		flexDirection: "column",
	},
	log: {
		gap: space[3],
		display: "flex",
		flexDirection: "column",
		minHeight: "18rem",
	},
});
