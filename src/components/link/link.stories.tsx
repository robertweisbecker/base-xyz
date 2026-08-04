import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

import { Link } from "./link";

const meta = {
	title: "Components/Link",
	component: Link,
	args: {
		children: "Read the documentation",
		href: "#documentation",
		external: false,
		variant: "accent",
	},
	argTypes: {
		children: { control: "text" },
		href: { control: "text" },
		external: { control: "boolean" },
		variant: {
			control: "inline-radio",
			options: ["accent", "neutral"],
		},
	},
	parameters: {
		controls: {
			include: ["children", "href", "external", "variant"],
		},
	},
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.examples)}>
			<section {...stylex.props(storyStyles.example)}>
				<span {...stylex.props(storyStyles.label)}>Internal link</span>
				<Link href="#account-settings">Account settings</Link>
			</section>
			<section {...stylex.props(storyStyles.example)}>
				<span {...stylex.props(storyStyles.label)}>Neutral link</span>
				<Link href="#project-overview" variant="neutral">
					Project overview
				</Link>
			</section>
			<section {...stylex.props(storyStyles.example)}>
				<span {...stylex.props(storyStyles.label)}>External link</span>
				<Link href="https://base-ui.com/" external>
					Base UI documentation
				</Link>
			</section>
			<section {...stylex.props(storyStyles.example)}>
				<span {...stylex.props(storyStyles.label)}>In a sentence</span>
				<p {...stylex.props(storyStyles.copy)}>
					Review the <Link href="#release-notes">release notes</Link> before upgrading.
				</p>
			</section>
		</div>
	),
};

const storyStyles = stylex.create({
	examples: {
		gap: tokens["--space-6"],
		display: "flex",
		flexDirection: "column",
	},
	example: {
		gap: tokens["--space-2"],
		display: "flex",
		flexDirection: "column",
	},
	label: {
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	copy: {
		margin: 0,
	},
});
