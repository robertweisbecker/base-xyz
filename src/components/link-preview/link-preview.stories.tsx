import type { Meta, StoryObj } from "@storybook/react-vite";
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
		<Box
			p={10}
			maxWidth="min(600px, 100vw - 32px)"
			mx="auto"
			minHeight="min(600px, 100vh - 32px)"
			display="flex"
			orientation="vertical"
			align="center"
			justify="center"
		>
			<LinkPreview.Root>
				<Text>
					Edgar Degas's{" "}
					<LinkPreview.Trigger
						delay={_delay}
						render={<Link href="https://www.nga.gov/artworks/164915-riders" external />}
					>
						The Riders
					</LinkPreview.Trigger>
					<LinkPreview.Popup
						arrowProps={_showArrow ? {} : undefined}
						positionerProps={{ side: _side, align: _align }}
						style={{ width: "300px" }}
					>
						<img
							src="https://images.unsplash.com/photo-1766170449400-be0022117c24?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
							alt="The Riders oil on canvas painting"
							style={{ aspectRatio: "2/1", objectFit: "cover" }}
						/>
						<LinkPreview.Content>
							<LinkPreview.Title>
								The Riders{" "}
								<Text render={<span />} color="muted">
									∙ c. 1885
								</Text>
							</LinkPreview.Title>
							<LinkPreview.Description>Oil on canvas (28 3/4 × 35 3/4 in.)</LinkPreview.Description>
						</LinkPreview.Content>
					</LinkPreview.Popup>{" "}
					is an Impressionist oil on canvas painting created between 1875 and 1885 that portrays six
					men on horseback in jockey uniforms lining up on a grassy field.
				</Text>
			</LinkPreview.Root>
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
