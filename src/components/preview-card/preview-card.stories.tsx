import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { color, space } from "@/styles/tokens.stylex";
import { fontSize, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import { createPreviewCardHandle } from "../popup-handles";
import { popupMotionStyles } from "../popover/popover.stylex";
import * as PreviewCard from "./preview-card";

type PopupSide = "top" | "right" | "bottom" | "left";
type PopupAlign = "start" | "center" | "end";
type StoryArgs = {
	_side: PopupSide;
	_align: PopupAlign;
	_delay: number;
	_showArrow: boolean;
};

const meta = {
	title: "Components/Preview card",
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
		<PreviewCard.Content>
			<PreviewCard.Title>{title}</PreviewCard.Title>
			<PreviewCard.Description>{description}</PreviewCard.Description>
		</PreviewCard.Content>
	);
}

export const Playground: Story = {
	render: ({ _side, _align, _delay, _showArrow }) => (
		<div {...stylex.props(storyParts.stage)}>
			<p {...stylex.props(storyParts.copy)}>
				Read more about{" "}
				<PreviewCard.Root>
					<PreviewCard.Trigger delay={_delay} href="https://base-ui.com/react/overview/about">
						Base UI
					</PreviewCard.Trigger>
					<PreviewCard.Popup
						arrowProps={_showArrow ? {} : undefined}
						positionerProps={{ side: _side, align: _align }}>
						<PreviewContent
							title="Base UI"
							description="An unstyled React component library for building accessible interfaces."
						/>
					</PreviewCard.Popup>
				</PreviewCard.Root>{" "}
				and its primitives.
			</p>
		</div>
	),
};

type PreviewPayload = {
	title: string;
	description: string;
};

const sharedPreview = createPreviewCardHandle<PreviewPayload>();
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
					<PreviewCard.Trigger key={href} delay={_delay} href={href} handle={sharedPreview} payload={payload}>
						{payload.title}
					</PreviewCard.Trigger>
				))}
			</nav>
			<PreviewCard.Root handle={sharedPreview}>
				{({ payload }) => (
					<PreviewCard.Popup
						arrowProps={_showArrow ? {} : undefined}
						positionerProps={{
							side: _side,
							align: _align,
							style: popupMotionStyles.movingPositioner,
						}}
						style={popupMotionStyles.movingPopup}>
						<PreviewCard.Viewport>{payload ? <PreviewContent {...payload} /> : null}</PreviewCard.Viewport>
					</PreviewCard.Popup>
				)}
			</PreviewCard.Root>
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
		color: color.fg,
		fontSize: fontSize.x2,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
	},
	stack: {
		gap: space.x3,
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
	},
	hint: {
		margin: 0,
		color: color.fgMuted,
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	links: {
		gap: space.x4,
		display: "flex",
	},
});
