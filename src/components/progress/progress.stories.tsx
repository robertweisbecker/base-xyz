import type { Meta, StoryObj } from "@storybook/react-vite";
import x from "@stylexjs/atoms";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import { Button } from "@/components/button/button";
import { Box, Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { Progress } from "./progress";

function SimulatedProgress() {
	const [value, setValue] = useState<number | null>(null);

	useEffect(() => {
		if (value === 100) {
			return;
		}

		const timeout = window.setTimeout(() => {
			setValue((current) => {
				if (current === null) {
					return 20;
				}

				return Math.min(100, current + Math.max(1, Math.round(Math.random() * 25)));
			});
		}, 1000);

		return () => window.clearTimeout(timeout);
	}, [value]);

	const label = value === null ? "Preparing workspace" : value === 100 ? "Workspace ready" : "Processing workspace";

	return (
		<Stack gap={2}>
			<Progress.Root aria-valuetext={value === null ? label : undefined} value={value}>
				<Progress.Label>{label}</Progress.Label>
				{value === null ? <Progress.Value>{() => "In progress"}</Progress.Value> : <Progress.Value />}
				<Progress.Track>
					<Progress.Indicator />
				</Progress.Track>
			</Progress.Root>
			<Button onClick={() => setValue(null)} size="sm" variant="secondary" xstyle={x.width["fit-content"]}>
				Restart
			</Button>
		</Stack>
	);
}

const meta = {
	title: "Components/Progress",
	component: Progress.Root,
	args: {
		value: 64,
	},
	argTypes: {
		format: { control: false },
		getAriaValueText: { control: false },
		locale: { control: false },
		value: {
			control: { type: "number", min: 0, max: 100, step: 1 },
		},
	},
	parameters: {
		controls: {
			include: ["value"],
		},
	},
	decorators: [
		(Story) => (
			<Box xstyle={storyStyles.frame}>
				<Story />
			</Box>
		),
	],
	render: (args) => (
		<Progress.Root {...args}>
			<Progress.Label>Indexing project</Progress.Label>
			<Progress.Value />
			<Progress.Track>
				<Progress.Indicator />
			</Progress.Track>
		</Progress.Root>
	),
} satisfies Meta<typeof Progress.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={8}>
			<Stack gap={2}>
				<Text color="muted" size="1">
					Determinate
				</Text>
				<Progress.Root value={42}>
					<Progress.Label>Uploading design assets</Progress.Label>
					<Progress.Value />
					<Progress.Track>
						<Progress.Indicator />
					</Progress.Track>
				</Progress.Root>
			</Stack>
			<Stack gap={2}>
				<Text color="muted" size="1">
					Indeterminate
				</Text>
				<Progress.Root aria-valuetext="Preparing workspace" value={null}>
					<Progress.Label>Preparing workspace</Progress.Label>
					<Progress.Value>{() => "Initializing…"}</Progress.Value>
					<Progress.Track>
						<Progress.Indicator />
					</Progress.Track>
				</Progress.Root>
			</Stack>
			<Stack gap={2}>
				<Text color="muted" size="1">
					Complete
				</Text>
				<Progress.Root value={100}>
					<Progress.Label>Workspace ready</Progress.Label>
					<Progress.Value />
					<Progress.Track>
						<Progress.Indicator />
					</Progress.Track>
				</Progress.Root>
			</Stack>
			<Stack gap={2}>
				<Text color="muted" size="1">
					Simulated states
				</Text>
				<SimulatedProgress />
			</Stack>
		</Stack>
	),
};

const storyStyles = stylex.create({
	frame: {
		maxWidth: "28rem",
		width: "100%",
	},
});
