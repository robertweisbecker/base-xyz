import { FolderOpenIcon } from "@phosphor-icons/react/dist/csr/FolderOpen";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

import { Button } from "@/components/button/button";
import { Separator } from "@/components/separator/separator";
import { EmptyState, type EmptyStateProps, type EmptyStateSize } from "./empty-state";

type EmptyStateStoryArgs = EmptyStateProps & {
	_showSecondaryAction: boolean;
};

const sizes = ["sm", "md", "lg"] as const satisfies readonly EmptyStateSize[];
const iconOptions = {
	None: undefined,
	Folder: <FolderOpenIcon aria-hidden size="1em" weight="duotone" />,
	Search: <MagnifyingGlassIcon aria-hidden size="1em" />,
};

const meta = {
	title: "Components/Empty state",
	component: EmptyState,
	args: {
		description: "Create your first project to organize files, tasks, and collaborators in one place.",
		headingLevel: "h2",
		icon: iconOptions.Folder,
		_showSecondaryAction: true,
		size: "md",
		title: "No projects yet",
	},
	argTypes: {
		children: { control: false },
		description: { control: "text" },
		headingLevel: {
			control: "select",
			options: ["h1", "h2", "h3", "h4", "h5", "h6"],
		},
		icon: {
			control: "select",
			mapping: iconOptions,
			options: Object.keys(iconOptions),
		},
		_showSecondaryAction: { control: "boolean" },
		size: { control: "inline-radio", options: sizes },
		title: { control: "text" },
	},
	decorators: [
		(Story) => (
			<div {...stylex.props(storyStyles.frame)}>
				<Story />
			</div>
		),
	],
	parameters: {
		controls: {
			include: ["title", "description", "headingLevel", "size", "icon", "_showSecondaryAction"],
		},
		docs: {
			description: {
				component:
					"A closed empty-state composition for explaining missing content and offering a small set of next actions.",
			},
		},
	},
} satisfies Meta<EmptyStateStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: ({ description, headingLevel, icon, _showSecondaryAction, size, title }) => (
		<EmptyState description={description} headingLevel={headingLevel} icon={icon} size={size} title={title}>
			<Button size={size === "sm" ? "sm" : "md"}>Create project</Button>
			{_showSecondaryAction ? (
				<Button size={size === "sm" ? "sm" : "md"} variant="secondary">
					Import project
				</Button>
			) : null}
		</EmptyState>
	),
};

export const Examples: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.stack)}>
			<section>
				<h2 {...stylex.props(storyStyles.heading)}>First-use state</h2>
				<EmptyState
					description="Create your first project to organize files, tasks, and collaborators in one place."
					headingLevel="h3"
					icon={<FolderOpenIcon aria-hidden size="1em" weight="duotone" />}
					title="No projects yet">
					<Button>Create project</Button>
					<Button variant="secondary">Import project</Button>
				</EmptyState>
			</section>
			<Separator />
			<section>
				<h2 {...stylex.props(storyStyles.heading)}>No results</h2>
				<EmptyState
					description="Try a different keyword or clear the active filters."
					headingLevel="h3"
					icon={<MagnifyingGlassIcon aria-hidden size="1em" />}
					size="sm"
					title="No matching projects">
					<Button size="sm" variant="secondary">
						Clear filters
					</Button>
				</EmptyState>
			</section>
			<Separator />
			<section>
				<h2 {...stylex.props(storyStyles.heading)}>Message only</h2>
				<EmptyState
					description="Files shared with you will appear here."
					headingLevel="h3"
					size="sm"
					title="Nothing shared yet"
				/>
			</section>
		</div>
	),
};

const storyStyles = stylex.create({
	frame: {
		maxWidth: "48rem",
	},
	stack: {
		gap: tokens["--space-8"],
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
	},
});
