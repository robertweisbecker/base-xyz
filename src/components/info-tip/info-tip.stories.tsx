import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";
import { Text } from "@/components/text/text";
import { InfoTip } from "./info-tip";

const sizes = ["xs", "sm", "md", "lg"] as const;

const meta = {
	title: "Components/Info tip",
	component: InfoTip,
	args: {
		content: "This setting applies to everyone in the workspace.",
		help: false,
		size: "sm",
	},
	argTypes: {
		content: { control: "text" },
		help: { control: "boolean" },
		size: { control: "inline-radio", options: sizes },
	},
	parameters: {
		controls: {
			include: ["content", "help", "size"],
		},
	},
	decorators: [
		(Story) => (
			<div {...stylex.props(styles.stage)}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof InfoTip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<div {...stylex.props(styles.examples)}>
			{[
				{ help: false, label: "Information" },
				{ help: true, label: "Help" },
			].map((option) => (
				<div key={option.label} {...stylex.props(styles.option)}>
					<Text color="muted" size="1" style={styles.label}>
						{option.label}
					</Text>
					<div {...stylex.props(styles.sizes)}>
						{sizes.map((size) => (
							<InfoTip
								key={size}
								content={`${option.label} (${size})`}
								help={option.help}
								size={size}
							/>
						))}
					</div>
				</div>
			))}
			<div {...stylex.props(styles.option)}>
				<Text color="muted" size="1" style={styles.label}>
					Rich content
				</Text>
				<InfoTip
					help
					content={
						<div {...stylex.props(styles.content)}>
							<Text fontWeight="medium">Workspace visibility</Text>
							<Text color="muted">Only members of this workspace can view the project.</Text>
						</div>
					}
				/>
			</div>
		</div>
	),
};

const styles = stylex.create({
	stage: {
		padding: tokens["--space-8"],
		display: "flex",
		justifyContent: "center",
	},
	examples: {
		gap: tokens["--space-5"],
		alignItems: "start",
		display: "flex",
		flexDirection: "column",
	},
	option: {
		gap: tokens["--space-4"],
		alignItems: "center",
		display: "flex",
	},
	label: {
		minWidth: "5rem",
	},
	sizes: {
		gap: tokens["--space-3"],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
	},
	content: {
		gap: tokens["--space-1"],
		display: "flex",
		flexDirection: "column",
	},
});
