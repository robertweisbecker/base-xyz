import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { color, space } from "@/styles/tokens.stylex";
import { fontSize, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import { Link } from "./link";

const meta = {
	title: "Components/Link",
	component: Link,
	args: {
		children: "Read the documentation",
		href: "#documentation",
		external: false,
	},
	argTypes: {
		children: { control: "text" },
		href: { control: "text" },
		external: { control: "boolean" },
	},
	parameters: {
		controls: {
			include: ["children", "href", "external"],
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
		gap: space[6],
		display: "flex",
		flexDirection: "column",
	},
	example: {
		gap: space[2],
		display: "flex",
		flexDirection: "column",
	},
	label: {
		color: color.fgMuted,
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	copy: {
		margin: 0,
	},
});
