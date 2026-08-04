import { Field } from "@base-ui/react/field";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { PaperclipIcon } from "@phosphor-icons/react/dist/csr/Paperclip";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/csr/PaperPlaneTilt";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Button, IconButton } from "@/components/button/button";
import { breakpoints } from "@/styles/constants.stylex";
import { fieldStyles } from "@/components/field/field.stylex";
import { tokens } from "@/theme/tokens.stylex";

import * as InputGroup from "./input-group";

const meta = {
	title: "Components/Input group",
	component: InputGroup.Root,
	args: {
		orientation: "horizontal",
		size: "md",
		variant: "standard",
	},
	argTypes: {
		orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
		variant: { control: "inline-radio", options: ["standard", "elevated"] },
	},
	parameters: {
		controls: {
			include: ["orientation", "size", "variant"],
		},
	},
} satisfies Meta<typeof InputGroup.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<div {...stylex.props(styles.frame)}>
			<Field.Root {...stylex.props(fieldStyles.root)}>
				<Field.Label {...stylex.props(fieldStyles.label)}>Search projects</Field.Label>
				<InputGroup.Root {...args}>
					<InputGroup.Addon>
						<MagnifyingGlassIcon aria-hidden />
					</InputGroup.Addon>
					<InputGroup.Input placeholder="Search by name…" />
					<InputGroup.Addon>⌘ K</InputGroup.Addon>
				</InputGroup.Root>
				<Field.Description {...stylex.props(fieldStyles.description)}>
					Search across projects in the current workspace.
				</Field.Description>
			</Field.Root>
		</div>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.variants)}>
			{(["sm", "md", "lg"] as const).map((size) => (
				<State key={size} label={size}>
					<div {...stylex.props(styles.sizeRow)}>
						<InputGroup.Root size={size}>
							<InputGroup.Addon position="start">
								<MagnifyingGlassIcon aria-hidden />
							</InputGroup.Addon>
							<InputGroup.Input aria-label={`${size} input group`} defaultValue="Search projects" />
							<InputGroup.Addon position="end">
								<Button size="xs" variant="neutral">
									Action
								</Button>
							</InputGroup.Addon>
						</InputGroup.Root>
						<Button size={size}>Button compare</Button>
					</div>
				</State>
			))}
		</div>
	),
};

export const Variants: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.variants)}>
			<State label="Standard">
				<InputGroup.Root>
					<InputGroup.Input aria-label="Standard input group" placeholder="Enter a value…" />
				</InputGroup.Root>
			</State>
			<State label="Elevated">
				<InputGroup.Root variant="elevated">
					<InputGroup.Input aria-label="Elevated input group" placeholder="Ask anything…" />
				</InputGroup.Root>
			</State>
		</div>
	),
};

export const Composer: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.frame)}>
			<Field.Root {...stylex.props(fieldStyles.root)}>
				<Field.Label {...stylex.props(fieldStyles.label)}>Message</Field.Label>
				<InputGroup.Root orientation="vertical" variant="elevated">
					<InputGroup.Textarea placeholder="Ask a follow-up…" aria-label="Message" />
					<InputGroup.Footer>
						<InputGroup.Actions>
							<IconButton icon={<PaperclipIcon aria-hidden />} label="Attach a file" size="xs" variant="ghost" />
						</InputGroup.Actions>
						<InputGroup.Actions>
							<IconButton icon={<PaperPlaneTiltIcon aria-hidden weight="fill" />} label="Send message" size="xs" />
						</InputGroup.Actions>
					</InputGroup.Footer>
				</InputGroup.Root>
			</Field.Root>
		</div>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.states)}>
			<State label="Default">
				<InputGroup.Root>
					<InputGroup.Input aria-label="Default input" placeholder="Enter a value…" />
				</InputGroup.Root>
			</State>
			<State label="Filled">
				<InputGroup.Root>
					<InputGroup.Input aria-label="Filled input" defaultValue="Design system" />
				</InputGroup.Root>
			</State>
			<State label="Invalid">
				<Field.Root invalid>
					<InputGroup.Root>
						<InputGroup.Input aria-label="Invalid input" defaultValue="x" />
					</InputGroup.Root>
				</Field.Root>
			</State>
			<State label="Required">
				<InputGroup.Root>
					<InputGroup.Input aria-label="Required input" placeholder="Enter a value…" required />
				</InputGroup.Root>
			</State>
			<State label="Read only, filled">
				<InputGroup.Root>
					<InputGroup.Input aria-label="Read only input" defaultValue="Published" readOnly />
				</InputGroup.Root>
			</State>
			<State label="Read only, empty">
				<InputGroup.Root>
					<InputGroup.Input aria-label="Empty read only input" placeholder="Enter a value…" readOnly />
				</InputGroup.Root>
			</State>
			<State label="Disabled">
				<InputGroup.Root>
					<InputGroup.Input aria-label="Disabled input" defaultValue="Unavailable" disabled />
				</InputGroup.Root>
			</State>
		</div>
	),
};

function State({ children, label }: { children: ReactNode; label: string }) {
	return (
		<section {...stylex.props(styles.state)}>
			<h2 {...stylex.props(styles.stateTitle)}>{label}</h2>
			{children}
		</section>
	);
}

const styles = stylex.create({
	frame: {
		maxWidth: "32rem",
	},
	states: {
		gap: tokens["--space-8"],
		display: "grid",
		gridTemplateColumns: {
			default: "1fr",
			[breakpoints.md]: "repeat(2, minmax(0, 1fr))",
		},
		maxWidth: "56rem",
	},
	variants: {
		gap: tokens["--space-8"],
		display: "flex",
		flexDirection: "column",
		maxWidth: "32rem",
	},
	state: {
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
	},
	stateTitle: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-regular"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	sizeRow: {
		gap: tokens["--space-3"],
		alignItems: "center",
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr) auto",
	},
});
