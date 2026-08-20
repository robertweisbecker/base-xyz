import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@/components/layout";
import { Text } from "@/components/text/text";
import { Link } from "./link";

const meta = {
	title: "Components/Link",
	component: Link,
	args: {
		children: "Read the documentation",
		href: "#documentation",
		external: false,
		color: "accent",
	},
	argTypes: {
		children: { control: "text" },
		href: { control: "text" },
		external: { control: "boolean" },
		color: {
			control: "inline-radio",
			options: ["accent", "neutral", "inherit"],
		},
	},
	parameters: {
		controls: {
			include: ["children", "href", "external", "color"],
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
		<Stack gap={6}>
			<Stack gap={2}>
				<Text color="muted" size="1">
					Internal link
				</Text>
				<Link href="#account-settings">Account settings</Link>
			</Stack>
			<Stack gap={2}>
				<Text color="muted" size="1">
					Neutral link
				</Text>
				<Link href="#project-overview" color="neutral">
					Project overview
				</Link>
			</Stack>
			<Stack gap={2}>
				<Text color="muted" size="1">
					External link
				</Text>
				<Link href="https://base-ui.com/" external>
					Base UI documentation
				</Link>
			</Stack>
			<Stack gap={2}>
				<Text color="muted" size="1">
					In a sentence
				</Text>
				<Text>
					Review the <Link href="#release-notes">release notes</Link> before upgrading.
				</Text>
			</Stack>
		</Stack>
	),
};
