import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Box, Grid, Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { Textarea } from "./textarea";

const meta = {
	title: "Components/Textarea",
	component: Textarea,
	args: {
		label: "Project update",
		placeholder: "What changed?",
		description: "Share a concise summary with your teammates.",
		defaultValue: "",
		disabled: false,
		error: "",
		readOnly: false,
		required: false,
		rows: 5,
		minRows: undefined,
		maxRows: undefined,
		size: "md",
	},
	argTypes: {
		label: { control: "text" },
		placeholder: { control: "text" },
		description: { control: "text" },
		defaultValue: { control: "text" },
		disabled: { control: "boolean" },
		error: { control: "text" },
		readOnly: { control: "boolean" },
		required: { control: "boolean" },
		rows: { control: { type: "number", min: 2, max: 12, step: 1 } },
		minRows: { control: { type: "number", min: 1, max: 12, step: 1 } },
		maxRows: { control: { type: "number", min: 1, max: 20, step: 1 } },
		size: { control: "inline-radio", options: ["sm", "md", "lg"] },
	},
	parameters: {
		controls: {
			include: [
				"label",
				"placeholder",
				"description",
				"defaultValue",
				"disabled",
				"error",
				"readOnly",
				"required",
				"rows",
				"minRows",
				"maxRows",
				"size",
			],
		},
	},
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<Box maxWidth="420px">
			<Textarea
				key={`${args.defaultValue}-${args.disabled}-${args.error}-${args.readOnly}-${args.rows}-${args.minRows}-${args.maxRows}-${args.size}`}
				{...args}
			/>
		</Box>
	),
};

export const Resizing: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid gap={8} maxWidth="900px" xstyle={styles.responsiveGrid}>
			<StateSpecimen label="Rows only">
				<Textarea
					label="Project update"
					rows={2}
					defaultValue={"The native rows height remains fixed while extra content scrolls."}
				/>
			</StateSpecimen>
			<StateSpecimen label="Minimum rows only">
				<Textarea
					label="Project update"
					rows={2}
					minRows={3}
					defaultValue={
						"The textarea grows with content and never becomes shorter than three rows."
					}
				/>
			</StateSpecimen>
			<StateSpecimen label="Maximum rows only">
				<Textarea
					label="Project update"
					rows={2}
					maxRows={4}
					defaultValue={
						"The textarea grows from its rows value up to four rows, then scrolls as more content is added."
					}
				/>
			</StateSpecimen>
			<StateSpecimen label="Minimum and maximum rows">
				<Textarea
					label="Project update"
					minRows={2}
					maxRows={4}
					defaultValue={"The textarea grows between its two configured row limits."}
				/>
			</StateSpecimen>
		</Grid>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid gap={8} maxWidth="900px" xstyle={styles.responsiveGrid}>
			<StateSpecimen label="Default">
				<Textarea label="Project update" placeholder="What changed?" />
			</StateSpecimen>
			<StateSpecimen label="Filled">
				<Textarea label="Project update" defaultValue="The new navigation is ready for review." />
			</StateSpecimen>
			<StateSpecimen label="Invalid">
				<Textarea label="Project update" defaultValue="Draft" error="Add at least 20 characters." />
			</StateSpecimen>
			<StateSpecimen label="Required">
				<Textarea label="Project update" placeholder="What changed?" required />
			</StateSpecimen>
			<StateSpecimen label="Readonly, filled">
				<Textarea
					label="Project update"
					defaultValue="This update has already been published."
					readOnly
					description="Published updates cannot be edited."
				/>
			</StateSpecimen>
			<StateSpecimen label="Readonly, empty">
				<Textarea label="Project update" placeholder="What changed?" readOnly />
			</StateSpecimen>
			<StateSpecimen label="Disabled">
				<Textarea
					label="Project update"
					defaultValue="Updates are disabled for archived projects."
					disabled
				/>
			</StateSpecimen>
		</Grid>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={6} maxWidth="420px">
			<Textarea label="Small" defaultValue="Small textarea" rows={2} size="sm" />
			<Textarea label="Medium" defaultValue="Medium textarea" rows={2} size="md" />
			<Textarea label="Large" defaultValue="Large textarea" rows={2} size="lg" />
		</Stack>
	),
};

function StateSpecimen({ children, label }: { children: ReactNode; label: string }) {
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
	responsiveGrid: {
		gridTemplateColumns: {
			default: "repeat(2, minmax(0, 1fr))",
			"@media (max-width: 760px)": "1fr",
		},
	},
});
