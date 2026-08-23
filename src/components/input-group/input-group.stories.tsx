import { Field } from "@base-ui/react/field";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { PaperclipIcon } from "@phosphor-icons/react/dist/csr/Paperclip";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/csr/PaperPlaneTilt";
import { ArrowUpIcon } from "@phosphor-icons/react/dist/csr/ArrowUp";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Button, IconButton } from "@/components/button/button";
import { breakpoints } from "@/styles/constants.stylex";
import { fieldStyles } from "@/components/field/field.stylex";
import { Box, Grid, Stack } from "@/components/layout/layout";
import { Separator } from "@/components/separator/separator";
import { Text } from "@/components/text/text";

import { InputGroup } from "./input-group";
const meta = {
	title: "Components/Input group",
	component: InputGroup.Root,
	args: {
		size: "md",
		variant: "standard",
	},
	argTypes: {
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
		variant: { control: "inline-radio", options: ["standard", "elevated", "subtle"] },
	},
	parameters: {
		controls: {
			include: ["size", "variant"],
		},
	},
} satisfies Meta<typeof InputGroup.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<Box xstyle={styles.frame}>
			<Field.Root {...stylex.props(fieldStyles.root)}>
				<Field.Label {...stylex.props(fieldStyles.label)}>Search projects</Field.Label>
				<InputGroup.Root {...args}>
					<InputGroup.Input placeholder="Search by name…" />
					<InputGroup.Addon>
						<MagnifyingGlassIcon aria-hidden />
					</InputGroup.Addon>
					<InputGroup.Addon position="end">⌘ K</InputGroup.Addon>
				</InputGroup.Root>
				<Field.Description {...stylex.props(fieldStyles.description)}>
					Search across projects in the current workspace.
				</Field.Description>
			</Field.Root>
		</Box>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8} xstyle={styles.variants}>
			{(["sm", "md", "lg"] as const).map((size) => (
				<State key={size} label={size}>
					<Grid align="center" columns={2} gap={3} xstyle={styles.sizeRow}>
						<InputGroup.Root size={size}>
							<InputGroup.Input aria-label={`${size} input group`} defaultValue="Search projects" />
							<InputGroup.Addon position="start">
								<MagnifyingGlassIcon aria-hidden />
							</InputGroup.Addon>
							<InputGroup.Addon position="end">
								<Button size="xs" variant="neutral">
									Action
								</Button>
							</InputGroup.Addon>
						</InputGroup.Root>
						<Button size={size}>Button compare</Button>
					</Grid>
				</State>
			))}
		</Stack>
	),
};

export const Variants: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8} xstyle={styles.variants}>
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
			<State label="Subtle">
				<InputGroup.Root variant="subtle">
					<InputGroup.Input aria-label="Subtle input group" placeholder="Enter a value…" />
				</InputGroup.Root>
			</State>
		</Stack>
	),
};

export const Alignments: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8} xstyle={styles.variants}>
			<State label="Solo input">
				<InputGroup.Root>
					<InputGroup.Input aria-label="Solo input" placeholder="Enter a value…" />
				</InputGroup.Root>
			</State>
			<Separator />
			<State label="Inline start and end">
				<InputGroup.Root>
					<InputGroup.Input aria-label="Inline start and end" placeholder="Search…" />
					<InputGroup.Addon position="start">
						<MagnifyingGlassIcon aria-hidden />
					</InputGroup.Addon>
					<InputGroup.Addon position="end">⌘ K</InputGroup.Addon>
				</InputGroup.Root>
			</State>
			<Separator />
			<State label="Start only">
				<InputGroup.Root>
					<InputGroup.Input aria-label="Start only input" placeholder="Search…" />
					<InputGroup.Addon position="start">
						<MagnifyingGlassIcon aria-hidden />
					</InputGroup.Addon>
				</InputGroup.Root>
			</State>
			<Separator />
			<State label="End only">
				<InputGroup.Root>
					<InputGroup.Input aria-label="End only input" placeholder="Search…" />
					<InputGroup.Addon position="end">⌘ K</InputGroup.Addon>
				</InputGroup.Root>
			</State>
			<Separator />
			<State label="Header">
				<InputGroup.Root variant="elevated">
					<InputGroup.Header>script.js</InputGroup.Header>
					<InputGroup.Textarea aria-label="Header textarea" placeholder="console.log('Hello');" />
				</InputGroup.Root>
			</State>
			<Separator />
			<State label="Footer">
				<InputGroup.Root variant="elevated">
					<InputGroup.Textarea placeholder="Ask a follow-up…" aria-label="Footer message" />
					<InputGroup.Footer>
						<InputGroup.Actions>
							<IconButton icon={<PaperclipIcon aria-hidden />} label="Attach a file" variant="ghost" size="sm" />
						</InputGroup.Actions>
						<InputGroup.Actions>
							<IconButton icon={<ArrowUpIcon aria-hidden />} label="Send message" size="sm" />
						</InputGroup.Actions>
					</InputGroup.Footer>
				</InputGroup.Root>
			</State>
			<Separator />
			<State label="Header label + footer actions">
				<InputGroup.Root variant="elevated">
					<InputGroup.Header>
						<label htmlFor="header-and-footer-message">Draft a reply</label>
					</InputGroup.Header>
					<InputGroup.Textarea
						id="header-and-footer-message"
						aria-label="Header and footer message"
						placeholder="Write a reply…"
					/>
					<InputGroup.Footer>
						<InputGroup.Actions>
							<Button startSlot={<PaperclipIcon aria-hidden />} size="sm" variant="neutral">
								Attach
							</Button>
						</InputGroup.Actions>
						<InputGroup.Actions>
							<Button startSlot={<PaperPlaneTiltIcon aria-hidden weight="fill" />} size="sm">
								Send
							</Button>
						</InputGroup.Actions>
					</InputGroup.Footer>
				</InputGroup.Root>
			</State>
		</Stack>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid gap={8} xstyle={styles.states}>
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
			<State label="Disabled elevated">
				<InputGroup.Root variant="elevated">
					<InputGroup.Input aria-label="Disabled elevated input" defaultValue="Unavailable" disabled />
				</InputGroup.Root>
			</State>
			<State label="Disabled textarea">
				<InputGroup.Root variant="elevated">
					<InputGroup.Textarea aria-label="Disabled textarea" defaultValue="Unavailable" disabled rows={3} />
				</InputGroup.Root>
			</State>
		</Grid>
	),
};

function State({ children, label }: { children: ReactNode; label: string }) {
	return (
		<Stack gap={3}>
			<Text color="muted" size="1">
				{label}
			</Text>
			{children}
		</Stack>
	);
}

const styles = stylex.create({
	frame: {
		maxWidth: "32rem",
	},
	states: {
		gridTemplateColumns: {
			default: "1fr",
			[breakpoints.md]: "repeat(2, minmax(0, 1fr))",
		},
		maxWidth: "56rem",
	},
	variants: {
		maxWidth: "32rem",
	},
	sizeRow: {
		gridTemplateColumns: "minmax(0, 1fr) auto",
	},
});
