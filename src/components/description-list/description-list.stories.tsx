import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { DescriptionList } from "@/components";
import { Badge } from "@/components/badge/badge";
import { Code } from "@/components/code/code";
import { Link } from "@/components/link/link";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";

type PlaygroundArgs = {
	orientation: "horizontal" | "vertical" | "grid";
	size: "sm" | "md" | "lg";
	variant: "plain" | "divided";
	labelWidth: string;
	_showActions: boolean;
};

const meta = {
	title: "Components/Description list",
	component: DescriptionList.Root,
	args: {
		orientation: "horizontal",
		size: "md",
		variant: "plain",
		labelWidth: "6.5rem",
		_showActions: true,
	},
	parameters: {
		docs: {
			description: {
				component:
					"Description lists associate native terms and values. Root margins are the external layout boundary; parts accept native attributes and style overrides. Horizontal layout stacks below the 34rem container width, while grid uses auto-fit columns above that width. labelWidth affects only wide horizontal layout. Row actions are caller-owned and should include contextual visible or visually hidden text. Items default to baseline alignment and accept start, center, or baseline; labelWidth defaults to 6.5rem. Each item supports multiple Label and Value parts with at most one optional Actions group.",
			},
		},
	},
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical", "grid"],
			description:
				"Horizontal stacks below the 34rem container width; vertical stays stacked; grid uses auto-fit columns above 34rem.",
		},
		size: { control: "select", options: ["sm", "md", "lg"] },
		variant: { control: "select", options: ["plain", "divided"] },
		labelWidth: {
			control: "text",
			description: "Shared label column width for wide horizontal layout only.",
		},
		_showActions: { control: "boolean" },
	},
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
	render: ({ _showActions, ...props }) => (
		<DescriptionList.Root {...props}>
			<DescriptionList.Item>
				<DescriptionList.Label>Workspace name</DescriptionList.Label>
				<DescriptionList.Value>Acme Design</DescriptionList.Value>
				{_showActions ? (
					<DescriptionList.Actions>
						<Link href="#workspace-name">
							Change<VisuallyHidden> workspace name</VisuallyHidden>
						</Link>
					</DescriptionList.Actions>
				) : null}
			</DescriptionList.Item>
			<DescriptionList.Item align="center">
				<DescriptionList.Label>Status</DescriptionList.Label>
				<DescriptionList.Value>
					<Badge hue="success">Active</Badge>
				</DescriptionList.Value>
			</DescriptionList.Item>
		</DescriptionList.Root>
	),
};

export const Orientations: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={6}>
			<OrientationFixture
				label="Horizontal"
				orientation="horizontal"
				testId="description-horizontal"
			/>
			<OrientationFixture label="Grid" orientation="grid" testId="description-grid" />
			<OrientationFixture label="Vertical" orientation="vertical" testId="description-vertical" />
		</Stack>
	),
};

export const Sizes: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={5}>
			{(["sm", "md", "lg"] as const).map((size) => (
				<DescriptionList.Root key={size} size={size} variant="divided">
					<DescriptionList.Item>
						<DescriptionList.Label>{size} size</DescriptionList.Label>
						<DescriptionList.Value>Example value</DescriptionList.Value>
					</DescriptionList.Item>
				</DescriptionList.Root>
			))}
		</Stack>
	),
};

export const Examples: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={4}>
			<DescriptionList.Root data-testid="description-examples" variant="divided" m={2}>
				<DescriptionList.Item>
					<DescriptionList.Label>Workspace</DescriptionList.Label>
					<DescriptionList.Value>Acme Design</DescriptionList.Value>
					<DescriptionList.Actions>
						<Link href="#workspace-name">
							Change<VisuallyHidden> workspace name</VisuallyHidden>
						</Link>
					</DescriptionList.Actions>
				</DescriptionList.Item>
				<DescriptionList.Item>
					<DescriptionList.Label>Plan</DescriptionList.Label>
					<DescriptionList.Value>
						<Badge hue="accent">Pro</Badge> <Code>team_01</Code>
					</DescriptionList.Value>
				</DescriptionList.Item>
				<DescriptionList.Item>
					<DescriptionList.Label>Workspace name</DescriptionList.Label>
					<DescriptionList.Value>Acme Design</DescriptionList.Value>
					<DescriptionList.Actions>
						<Link href="#name">
							Change<VisuallyHidden> workspace name</VisuallyHidden>
						</Link>
					</DescriptionList.Actions>
				</DescriptionList.Item>
				<DescriptionList.Item>
					<DescriptionList.Label>Billing email</DescriptionList.Label>
					<DescriptionList.Value>
						<Link href="#billing">Add billing email</Link>
					</DescriptionList.Value>
				</DescriptionList.Item>
				<DescriptionList.Item>
					<DescriptionList.Label>Workspace ID</DescriptionList.Label>
					<DescriptionList.Value>
						workspace_identifier_01J8F5Z3NQ7P3C2L9V8K6M4A1B
					</DescriptionList.Value>
				</DescriptionList.Item>
				<DescriptionList.Item>
					<DescriptionList.Label>Region</DescriptionList.Label>
					<DescriptionList.Value>US West</DescriptionList.Value>
				</DescriptionList.Item>
				<DescriptionList.Item data-testid="description-multiple-group">
					<DescriptionList.Label>Primary region</DescriptionList.Label>
					<DescriptionList.Label>Fallback region</DescriptionList.Label>
					<DescriptionList.Value>US West</DescriptionList.Value>
					<DescriptionList.Value>US East</DescriptionList.Value>
					<DescriptionList.Actions>
						<Link href="#regions">
							Change<VisuallyHidden> regions</VisuallyHidden>
						</Link>
					</DescriptionList.Actions>
				</DescriptionList.Item>
			</DescriptionList.Root>
			<DescriptionList.Root data-testid="description-xstyle-override" xstyle={storyStyles.override}>
				<DescriptionList.Item>
					<DescriptionList.Label>Override one</DescriptionList.Label>
					<DescriptionList.Value>First value</DescriptionList.Value>
				</DescriptionList.Item>
				<DescriptionList.Item>
					<DescriptionList.Label>Override two</DescriptionList.Label>
					<DescriptionList.Value>Second value</DescriptionList.Value>
				</DescriptionList.Item>
			</DescriptionList.Root>
			<DescriptionList.Root
				data-testid="description-native-override"
				xstyle={storyStyles.override}
				style={{ rowGap: "2px" }}
			>
				<DescriptionList.Item>
					<DescriptionList.Label>Native one</DescriptionList.Label>
					<DescriptionList.Value>First value</DescriptionList.Value>
				</DescriptionList.Item>
				<DescriptionList.Item>
					<DescriptionList.Label>Native two</DescriptionList.Label>
					<DescriptionList.Value>Second value</DescriptionList.Value>
				</DescriptionList.Item>
			</DescriptionList.Root>
		</Stack>
	),
};

function OrientationFixture({
	label,
	orientation,
	testId,
}: {
	label: string;
	orientation: PlaygroundArgs["orientation"];
	testId: string;
}) {
	return (
		<Stack gap={2}>
			<Text size="1" color="muted">
				{label}
			</Text>
			<div
				data-testid={testId}
				style={{
					maxWidth: "42rem",
					minWidth: "12rem",
					width: "100%",
					resize: "horizontal",
					overflow: "auto",
				}}
			>
				<DescriptionList.Root orientation={orientation} variant="divided">
					{["Workspace", "Owner", "Region"].map((name) => (
						<DescriptionList.Item key={name}>
							<DescriptionList.Label>{name}</DescriptionList.Label>
							<DescriptionList.Value>
								{name === "Owner" ? <Code>maya@example.com</Code> : "Acme Design"}
							</DescriptionList.Value>
							{name === "Workspace" ? (
								<DescriptionList.Actions>
									<Link href="#workspace">
										Change<VisuallyHidden> workspace</VisuallyHidden>
									</Link>
								</DescriptionList.Actions>
							) : null}
						</DescriptionList.Item>
					))}
				</DescriptionList.Root>
			</div>
		</Stack>
	);
}

const storyStyles = stylex.create({ override: { rowGap: "20px" } });
