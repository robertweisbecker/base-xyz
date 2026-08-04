import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

import { createLinkPreviewHandle } from "../popup-handles";
import { popupMotionStyles } from "../popover/popover.stylex";
import * as LinkPreview from "./link-preview";
import { Link } from "../link/link";

type PopupSide = "top" | "right" | "bottom" | "left";
type PopupAlign = "start" | "center" | "end";
type StoryArgs = {
	_side: PopupSide;
	_align: PopupAlign;
	_delay: number;
	_showArrow: boolean;
};

const meta = {
	title: "Components/Link preview",
	args: {
		_side: "top",
		_align: "center",
		_delay: 100,
		_showArrow: false,
	},
	argTypes: {
		_side: {
			control: "inline-radio",
			options: ["top", "right", "bottom", "left"],
		},
		_align: {
			control: "inline-radio",
			options: ["start", "center", "end"],
		},
		_delay: {
			control: { type: "number", min: 0, step: 50 },
		},
		_showArrow: { control: "boolean" },
	},
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

function PreviewContent({ title, description }: PreviewPayload) {
	return (
		<LinkPreview.Content>
			<LinkPreview.Title>{title}</LinkPreview.Title>
			<LinkPreview.Description>{description}</LinkPreview.Description>
		</LinkPreview.Content>
	);
}

export const Playground: Story = {
	render: ({ _side, _align, _delay, _showArrow }) => (
		<div {...stylex.props(storyParts.stage)}>
			<p {...stylex.props(storyParts.copy)}>
				Read more about{" "}
				<LinkPreview.Root>
					<LinkPreview.Trigger
						delay={_delay}
						render={<Link href="https://base-ui.com/react/overview/about" external />}>
						Base UI
					</LinkPreview.Trigger>
					<LinkPreview.Popup arrowProps={_showArrow ? {} : undefined} positionerProps={{ side: _side, align: _align }}>
						<PreviewContent
							title="Base UI"
							description="An unstyled React component library for building accessible interfaces."
						/>
					</LinkPreview.Popup>
				</LinkPreview.Root>{" "}
				and its primitives.
			</p>
		</div>
	),
};

type PreviewPayload = {
	title: string;
	description: string;
};

const sharedPreview = createLinkPreviewHandle<PreviewPayload>();
const previews: Array<PreviewPayload & { href: string }> = [
	{
		href: "#popover",
		title: "Popover",
		description: "A popup anchored to a button, with focus management and collision handling.",
	},
	{
		href: "#dialog",
		title: "Dialog",
		description: "A focused layer for workflows that temporarily interrupt the main page.",
	},
	{
		href: "#drawer",
		title: "Drawer",
		description: "A bottom sheet that supports drag gestures, stacking, and nested workflows.",
	},
];

export const SharedPreviews: Story = {
	render: ({ _side, _align, _delay, _showArrow }) => (
		<div {...stylex.props(storyParts.stack)}>
			<p {...stylex.props(storyParts.hint)}>Hover or focus each component name to reuse one animated card.</p>
			<nav aria-label="Component previews" {...stylex.props(storyParts.links)}>
				{previews.map(({ href, ...payload }) => (
					<LinkPreview.Trigger key={href} delay={_delay} href={href} handle={sharedPreview} payload={payload}>
						{payload.title}
					</LinkPreview.Trigger>
				))}
			</nav>
			<LinkPreview.Root handle={sharedPreview}>
				{({ payload }) => (
					<LinkPreview.Popup
						arrowProps={_showArrow ? {} : undefined}
						positionerProps={{
							side: _side,
							align: _align,
							style: popupMotionStyles.movingPositioner,
						}}
						style={popupMotionStyles.movingPopup}>
						<LinkPreview.Viewport>{payload ? <PreviewContent {...payload} /> : null}</LinkPreview.Viewport>
					</LinkPreview.Popup>
				)}
			</LinkPreview.Root>
		</div>
	),
};

const storyParts = stylex.create({
	stage: {
		alignItems: "center",
		display: "grid",
		justifyItems: "center",
		height: "360px",
		width: "min(720px, calc(100vw - 48px))",
	},
	copy: {
		margin: 0,
		color: tokens["--fg"],
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	stack: {
		gap: tokens["--space-3"],
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
	},
	hint: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	links: {
		gap: tokens["--space-4"],
		display: "flex",
	},
});
