import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { color, space } from "@/styles/tokens.stylex";
import { fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import { CodeBlock } from "../code-block/code-block";
import * as Collapsible from "./collapsible";

type StoryArgs = {
	defaultOpen: boolean;
	disabled: boolean;
	_hiddenUntilFound: boolean;
	_iconSide: "start" | "end";
	_size: Collapsible.CollapsibleTriggerSize;
	_variant: Collapsible.CollapsibleTriggerVariant;
};

const meta = {
	title: "Components/Collapsible",
	args: {
		defaultOpen: false,
		disabled: false,
		_hiddenUntilFound: false,
		_iconSide: "end",
		_size: "md",
		_variant: "default",
	},
	argTypes: {
		defaultOpen: { control: "boolean" },
		disabled: { control: "boolean" },
		_hiddenUntilFound: { control: "boolean" },
		_iconSide: { control: "inline-radio", options: ["start", "end"] },
		_size: { control: "select", options: ["xs", "sm", "md", "lg"] },
		_variant: { control: "select", options: ["default", "link"] },
	},
	decorators: [
		(Story) => (
			<div {...stylex.props(storyStyles.frame)}>
				<Story />
			</div>
		),
	],
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

export const Playground: Story = {
	render: ({ defaultOpen, disabled, _hiddenUntilFound, _iconSide, _size, _variant }) => (
		<Collapsible.Root
			key={`${defaultOpen}-${disabled}-${_hiddenUntilFound}-${_iconSide}-${_size}-${_variant}`}
			defaultOpen={defaultOpen}
			disabled={disabled}>
			<Collapsible.Trigger size={_size} variant={_variant}>
				{_iconSide === "start" ? <Collapsible.Icon side="start" /> : null}
				Deployment details
				{_iconSide === "end" ? <Collapsible.Icon /> : null}
			</Collapsible.Trigger>
			<Collapsible.Panel hiddenUntilFound={_hiddenUntilFound}>
				<Collapsible.Content>
					<span>Production · US West</span>
					<span>Last deployed 12 minutes ago</span>
				</Collapsible.Content>
			</Collapsible.Panel>
		</Collapsible.Root>
	),
};

export const Examples: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.story)}>
			<section {...stylex.props(storyStyles.section)}>
				<h2 {...stylex.props(storyStyles.heading)}>Basic</h2>
				<Example label="Request details">
					The request reads project metadata and does not modify your workspace.
				</Example>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<h2 {...stylex.props(storyStyles.heading)}>Default open</h2>
				<Example defaultOpen label="Included files">
					<span>release-notes.md</span>
					<span>migration-guide.md</span>
				</Example>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<h2 {...stylex.props(storyStyles.heading)}>Leading icon</h2>
				<Collapsible.Root>
					<Collapsible.Trigger size="xs">
						<Collapsible.Icon side="start" />
						Permission details
					</Collapsible.Trigger>
					<Collapsible.Panel>
						<Collapsible.Content>
							<CodeBlock>{'{ "permission": "project:read" }'}</CodeBlock>
						</Collapsible.Content>
					</Collapsible.Panel>
				</Collapsible.Root>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<h2 {...stylex.props(storyStyles.heading)}>Link</h2>
				<Example label="Show deployment details" variant="link">
					Production · US West
				</Example>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<h2 {...stylex.props(storyStyles.heading)}>Nested</h2>
				<Collapsible.Root>
					<Collapsible.Trigger>
						Advanced options
						<Collapsible.Icon />
					</Collapsible.Trigger>
					<Collapsible.Panel>
						<Collapsible.Content>
							<Example label="Environment variables">
								Two variables will be inherited from the production environment.
							</Example>
						</Collapsible.Content>
					</Collapsible.Panel>
				</Collapsible.Root>
			</section>
			<section {...stylex.props(storyStyles.section)}>
				<h2 {...stylex.props(storyStyles.heading)}>Disabled</h2>
				<Example disabled label="Activity summary">
					Activity is unavailable while the workspace is offline.
				</Example>
			</section>
		</div>
	),
};

function Example({
	children,
	defaultOpen,
	disabled,
	label,
	variant,
}: {
	children: React.ReactNode;
	defaultOpen?: boolean;
	disabled?: boolean;
	label: string;
	variant?: Collapsible.CollapsibleTriggerVariant;
}) {
	return (
		<Collapsible.Root defaultOpen={defaultOpen} disabled={disabled}>
			<Collapsible.Trigger variant={variant}>
				{label}
				<Collapsible.Icon />
			</Collapsible.Trigger>
			<Collapsible.Panel>
				<Collapsible.Content>{children}</Collapsible.Content>
			</Collapsible.Panel>
		</Collapsible.Root>
	);
}

const storyStyles = stylex.create({
	frame: {
		maxWidth: "520px",
	},
	story: {
		gap: space[8],
		display: "flex",
		flexDirection: "column",
	},
	section: {
		gap: space[4],
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
});
