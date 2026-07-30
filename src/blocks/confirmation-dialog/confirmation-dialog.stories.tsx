import { PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/csr/PaperPlaneTilt";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Button } from "@/components/button/button";
import { Checkbox } from "@/components/checkbox/checkbox";
import { Separator } from "@/components/separator/separator";
import { color, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import * as ConfirmationDialog from "./confirmation-dialog";

const meta = {
	title: "Blocks/Confirmation dialog",
	component: ConfirmationDialog.Root,
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<typeof ConfirmationDialog.Root>;

export default meta;
type Story = StoryObj;

const reviewItems = Array.from({ length: 28 }, (_, index) => ({
	label: `Milestone ${index + 1}`,
	status: index < 23 ? "Complete" : "Pending",
}));

export const Examples: Story = {
	render: () => (
		<div {...stylex.props(storyParts.list)}>
			<Example title="Default">
				<ConfirmationDialog.Root
					trigger={<Button>Publish project</Button>}
					successToast={{
						title: "Project published",
						description: "The project is now available to everyone with access.",
					}}>
					<ConfirmationDialog.Header>
						<ConfirmationDialog.Title>Publish this project?</ConfirmationDialog.Title>
						<ConfirmationDialog.Description>
							Anyone with project access will be able to view the latest changes.
						</ConfirmationDialog.Description>
					</ConfirmationDialog.Header>
					<ConfirmationDialog.Body>
						Publishing makes the current version available immediately. You can continue editing and publish
						another version later.
					</ConfirmationDialog.Body>
					<ConfirmationDialog.Footer>
						<ConfirmationDialog.Actions>
							<ConfirmationDialog.Cancel>Cancel</ConfirmationDialog.Cancel>
							<ConfirmationDialog.Confirm>Publish</ConfirmationDialog.Confirm>
						</ConfirmationDialog.Actions>
					</ConfirmationDialog.Footer>
				</ConfirmationDialog.Root>
			</Example>

			<Separator />

			<Example title="With visual">
				<ConfirmationDialog.Root
					size="sm"
					trigger={<Button>Submit for review</Button>}
					successToast={{
						title: "App submitted",
						description: "The review team has been notified.",
					}}>
					<ConfirmationDialog.Header>
						<ConfirmationDialog.Visual>
							<PaperPlaneTiltIcon aria-hidden size={18} weight="duotone" />
						</ConfirmationDialog.Visual>
						<ConfirmationDialog.Title>Submit app for review?</ConfirmationDialog.Title>
						<ConfirmationDialog.Description>
							The review team will be notified and can leave feedback on this version.
						</ConfirmationDialog.Description>
					</ConfirmationDialog.Header>
					<ConfirmationDialog.Body>
						You can continue working on a new draft while this version is under review.
					</ConfirmationDialog.Body>
					<ConfirmationDialog.Footer>
						<ConfirmationDialog.Actions>
							<ConfirmationDialog.Cancel>Cancel</ConfirmationDialog.Cancel>
							<ConfirmationDialog.Confirm>Submit</ConfirmationDialog.Confirm>
						</ConfirmationDialog.Actions>
					</ConfirmationDialog.Footer>
				</ConfirmationDialog.Root>
			</Example>

			<Separator />

			<Example title="With footer option">
				<ConfirmationDialog.Root
					trigger={<Button>Archive project</Button>}
					successToast={{
						title: "Project archived",
						description: "You can restore it from the archive.",
					}}>
					<ConfirmationDialog.Header>
						<ConfirmationDialog.Title>Archive this project?</ConfirmationDialog.Title>
						<ConfirmationDialog.Description>
							Archived projects are hidden from the active workspace.
						</ConfirmationDialog.Description>
					</ConfirmationDialog.Header>
					<ConfirmationDialog.Body>
						The project will remain available to workspace administrators from the archive.
					</ConfirmationDialog.Body>
					<ConfirmationDialog.Footer>
						<Checkbox label="Do not ask again" name="skip-archive-confirmation" />
						<ConfirmationDialog.Actions>
							<ConfirmationDialog.Cancel>Cancel</ConfirmationDialog.Cancel>
							<ConfirmationDialog.Confirm>Archive</ConfirmationDialog.Confirm>
						</ConfirmationDialog.Actions>
					</ConfirmationDialog.Footer>
				</ConfirmationDialog.Root>
			</Example>

			<Separator />

			<Example title="Long content">
				<ConfirmationDialog.Root
					size="lg"
					trigger={<Button>Complete project</Button>}
					successToast={{
						title: "Project completed",
						description: "The project and its milestones are now read-only.",
					}}>
					<ConfirmationDialog.Header>
						<ConfirmationDialog.Title>Complete this project?</ConfirmationDialog.Title>
						<ConfirmationDialog.Description>
							Review the milestone status before making the project read-only.
						</ConfirmationDialog.Description>
					</ConfirmationDialog.Header>
					<ConfirmationDialog.Body label="Project milestone status">
						<div {...stylex.props(storyParts.reviewList)}>
							{reviewItems.map((item) => (
								<div key={item.label} {...stylex.props(storyParts.reviewItem)}>
									<span {...stylex.props(storyParts.reviewLabel)}>{item.label}</span>
									<span {...stylex.props(storyParts.reviewStatus)}>{item.status}</span>
								</div>
							))}
						</div>
					</ConfirmationDialog.Body>
					<ConfirmationDialog.Footer>
						<ConfirmationDialog.Actions>
							<ConfirmationDialog.Cancel>Cancel</ConfirmationDialog.Cancel>
							<ConfirmationDialog.Confirm>Complete project</ConfirmationDialog.Confirm>
						</ConfirmationDialog.Actions>
					</ConfirmationDialog.Footer>
				</ConfirmationDialog.Root>
			</Example>
		</div>
	),
};

function Example({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<section {...stylex.props(storyParts.example)}>
			<h2 {...stylex.props(storyParts.heading)}>{title}</h2>
			{children}
		</section>
	);
}

const storyParts = stylex.create({
	list: {
		gap: space.x8,
		display: "flex",
		flexDirection: "column",
	},
	example: {
		gap: space.x3,
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
	},
	heading: {
		margin: 0,
		color: color.fgMuted,
		fontSize: fontSize.x1,
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	reviewList: {
		gap: space.x3,
		display: "flex",
		flexDirection: "column",
	},
	reviewItem: {
		gap: space.x4,
		alignItems: "center",
		display: "flex",
		justifyContent: "space-between",
	},
	reviewLabel: {
		color: color.fg,
		fontSize: fontSize.x2,
		fontWeight: fontWeight.medium,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
	},
	reviewStatus: {
		color: color.fgMuted,
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
});
