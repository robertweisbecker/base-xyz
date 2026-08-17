import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

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
		<div {...stylex.props(storyStyles.variantGroups)}>
			{variants.map((variant) => (
				<section key={variant} {...stylex.props(storyStyles.variantGroup)}>
					<h2 {...stylex.props(storyStyles.heading)}>{variant}</h2>
					<div {...stylex.props(storyStyles.row)}>
						{hues.map((hue) => (
							<Badge key={hue} hue={hue} variant={variant}>
								{hue}
							</Badge>
						))}
					</div>
				</section>
			))}
		</div>
	),
};

export const SizesAndShapes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.variantGroups)}>
			{shapes.map((shape) => {
				const iconOnly = shape === "circle" || shape === "square";

				return (
					<section key={shape} {...stylex.props(storyStyles.variantGroup)}>
						<h2 {...stylex.props(storyStyles.heading)}>{shape}</h2>
						<div {...stylex.props(storyStyles.row)}>
							{(["sm", "md"] as const).map((size) => (
								<div key={size} {...stylex.props(storyStyles.specimen)}>
									<span {...stylex.props(storyStyles.gridHeader)}>{size}</span>
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
								</div>
							))}
						</div>
					</section>
				);
			})}
		</div>
	),
};

export const Options: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.sections)}>
			<section {...stylex.props(storyStyles.section)}>
				<span {...stylex.props(storyStyles.rowLabel)}>Width</span>
				<Badge data-testid="full-width-badge" width="full">
					Full-width badge
				</Badge>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<span {...stylex.props(storyStyles.rowLabel)}>Slots</span>
				<div {...stylex.props(storyStyles.row)}>
					<Badge hue="success" startSlot={<CheckCircleIcon aria-hidden weight="fill" />}>
						Approved
					</Badge>
					<Badge endSlot={<WarningIcon aria-hidden weight="fill" />} hue="warning" startSlot={<Icon.Dot />}>
						Review requested
					</Badge>
				</div>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<span {...stylex.props(storyStyles.rowLabel)}>Icon only</span>
				<div {...stylex.props(storyStyles.row)}>
					<Badge label="Approved" shape="circle" startSlot={<CheckCircleIcon aria-hidden weight="fill" />} />
					<Badge
						hue="warning"
						label="Needs attention"
						shape="square"
						startSlot={<WarningIcon aria-hidden weight="fill" />}
					/>
				</div>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<span {...stylex.props(storyStyles.rowLabel)}>As a link</span>
				<Badge hue="accent" render={<a href="#release-notes" />}>
					View release notes
				</Badge>
			</section>
		</div>
	),
};

export const TruncationTooltip: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.truncationFrame)}>
			<div {...stylex.props(storyStyles.truncationRow)}>
				<span {...stylex.props(storyStyles.rowLabel)}>Status</span>
				<Badge hue="accent" startSlot={<CheckCircleIcon aria-hidden weight="fill" />}>
					Approved for the upcoming production release
				</Badge>
			</div>
			<p {...stylex.props(storyStyles.hint)}>Hover or focus the truncated badge to read its full text.</p>
		</div>
	),
};

const storyStyles = stylex.create({
	section: {
		gap: tokens["--space-4"],
		display: "flex",
		flexDirection: "column",
	},
	sections: {
		gap: tokens["--space-6"],
		display: "flex",
		flexDirection: "column",
	},
	heading: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-regular"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		textTransform: "capitalize",
	},
	variantGroups: {
		gap: tokens["--space-5"],
		display: "flex",
		flexDirection: "column",
	},
	variantGroup: {
		gap: tokens["--space-2"],
		display: "flex",
		flexDirection: "column",
	},
	specimen: {
		gap: tokens["--space-2"],
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
	},
	gridHeader: {
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	rowLabel: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	row: {
		gap: tokens["--space-3"],
		alignItems: "center",
		display: "flex",
	},
	truncationFrame: {
		gap: tokens["--space-3"],
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
		resize: "horizontal",
		maxWidth: "180px",
	},
	truncationRow: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		maxWidth: "100%",
		minWidth: 0,
	},
	hint: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
});
