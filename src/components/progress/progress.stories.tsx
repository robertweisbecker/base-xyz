import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import { Text } from "@/components/text/text";
import { tokens } from "@/theme/tokens.stylex";
import { Button } from "@/components/button/button";
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
		<>
			<Progress.Root aria-valuetext={value === null ? label : undefined} value={value}>
				<Progress.Label>{label}</Progress.Label>
				{value === null ? <Progress.Value>{() => "In progress"}</Progress.Value> : <Progress.Value />}
				<Progress.Track>
					<Progress.Indicator />
				</Progress.Track>
			</Progress.Root>
			<Button onClick={() => setValue(null)} size="sm" variant="secondary" width="fit-content">
				Restart
			</Button>
		</>
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
			<div {...stylex.props(storyStyles.frame)}>
				<Story />
			</div>
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
		<div {...stylex.props(storyStyles.stack)}>
			<section {...stylex.props(storyStyles.specimen)}>
				<Text>Determinate</Text>
				<Progress.Root value={42}>
					<Progress.Label>Uploading design assets</Progress.Label>
					<Progress.Value />
					<Progress.Track>
						<Progress.Indicator />
					</Progress.Track>
				</Progress.Root>
			</section>
			<section {...stylex.props(storyStyles.specimen)}>
				<Text>Indeterminate</Text>
				<Progress.Root aria-valuetext="Preparing workspace" value={null}>
					<Progress.Label>Preparing workspace</Progress.Label>
					<Progress.Value>{() => "Initializing…"}</Progress.Value>
					<Progress.Track>
						<Progress.Indicator />
					</Progress.Track>
				</Progress.Root>
			</section>
			<section {...stylex.props(storyStyles.specimen)}>
				<Text>Complete</Text>
				<Progress.Root value={100}>
					<Progress.Label>Workspace ready</Progress.Label>
					<Progress.Value />
					<Progress.Track>
						<Progress.Indicator />
					</Progress.Track>
				</Progress.Root>
			</section>
			<section {...stylex.props(storyStyles.specimen)}>
				<Text>Simulated states</Text>
				<SimulatedProgress />
			</section>
		</div>
	),
};

const storyStyles = stylex.create({
	frame: {
		maxWidth: "28rem",
		width: "100%",
	},
	stack: {
		gap: tokens["--space-8"],
		display: "flex",
		flexDirection: "column",
	},
	specimen: {
		gap: tokens["--space-2"],
		display: "flex",
		flexDirection: "column",
	},
});
