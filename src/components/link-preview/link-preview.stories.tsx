import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Link } from "@/components/link/link";
import { Box, Stack } from "@/components/layout";
import { createLinkPreviewHandle } from "@/components/popup-handles";
import { popupMotionStyles } from "@/components/popover/popover.stylex";
import { Text } from "@/components/text/text";
import { LinkPreview } from "./link-preview";

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
		<Box height="360px" xstyle={storyParts.stage} width="min(720px, calc(100vw - 48px))">
			<Text>
				Read more about{" "}
				<LinkPreview.Root>
					<LinkPreview.Trigger
						delay={_delay}
						render={<Link href="https://base-ui.com/react/overview/about" external />}
					>
						Base UI
					</LinkPreview.Trigger>
					<LinkPreview.Popup
						arrowProps={_showArrow ? {} : undefined}
						positionerProps={{ side: _side, align: _align }}
					>
						<PreviewContent
							title="Base UI"
							description="An unstyled React component library for building accessible interfaces."
						/>
					</LinkPreview.Popup>
				</LinkPreview.Root>{" "}
				and its primitives.
			</Text>
		</Box>
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
		<Stack align="center" gap={3}>
			<Text color="muted" size="1">
				Hover or focus each component name to reuse one animated card.
			</Text>
			<Stack aria-label="Component previews" gap={4} orientation="horizontal" render={<nav />}>
				{previews.map(({ href, ...payload }) => (
					<LinkPreview.Trigger
						key={href}
						delay={_delay}
						href={href}
						handle={sharedPreview}
						payload={payload}
					>
						{payload.title}
					</LinkPreview.Trigger>
				))}
			</Stack>
			<LinkPreview.Root handle={sharedPreview}>
				{({ payload }) => (
					<LinkPreview.Popup
						arrowProps={_showArrow ? {} : undefined}
						positionerProps={{
							side: _side,
							align: _align,
							xstyle: popupMotionStyles.movingPositioner,
						}}
						xstyle={popupMotionStyles.movingPopup}
					>
						<LinkPreview.Viewport>
							{payload ? <PreviewContent {...payload} /> : null}
						</LinkPreview.Viewport>
					</LinkPreview.Popup>
				)}
			</LinkPreview.Root>
		</Stack>
	),
};

const storyParts = stylex.create({
	stage: {
		alignItems: "center",
		display: "grid",
		justifyItems: "center",
	},
});
