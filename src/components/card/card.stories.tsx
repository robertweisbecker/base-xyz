import type { Meta, StoryObj } from "@storybook/react-vite";
import x from "@stylexjs/atoms";
import * as stylex from "@stylexjs/stylex";
import { Box, Grid, Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { tokens } from "@/theme/tokens.stylex";

import { Button } from "@/components/button/button";
import { Card, type CardSize, type CardVariant } from "./card";

const sizes = ["sm", "md", "lg"] as const;

const meta = {
	title: "Components/Card",
	component: Card.Root,
	args: {
		size: "md",
		variant: "elevated",
	},
	argTypes: {
		variant: {
			control: "inline-radio",
			options: ["elevated", "outline"],
		},
		size: {
			control: "inline-radio",
			options: sizes,
		},
	},
	parameters: {
		controls: {
			include: ["variant", "size"],
		},
	},
	decorators: [
		(Story) => (
			<Box maxWidth="64rem">
				<Story />
			</Box>
		),
	],
} satisfies Meta<typeof Card.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: ({ size, variant }) => (
		<CardExample size={size ?? "md"} variant={variant ?? "elevated"} />
	),
};

export const HorizontalLayout: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Card.Root xstyle={[x.flexDirection.row, x.gap._0]}>
			<Card.Header xstyle={[x.gap(tokens["--space-2"]), x.justifyContent.center]}>
				<Card.Title>Horizontal card</Card.Title>
				<Card.Description>Uses direct overrides without a dedicated variant.</Card.Description>
			</Card.Header>
			<Card.Content xstyle={x.flexGrow._1}>Content expands without a dedicated horizontal variant.</Card.Content>
			<Card.Footer xstyle={[x.gap(tokens["--space-2"]), x.justifyContent["flex-end"]]}>
				<Button size="sm" variant="secondary">
					Cancel
				</Button>
				<Button size="sm">Save</Button>
			</Card.Footer>
		</Card.Root>
	),
};

export const Variants: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid align="start" gap={4} xstyle={styles.cards}>
			{(["elevated", "outline"] as const).map((variant) => (
				<Stack align="start" gap={2} key={variant}>
					<Text size="1" color="muted">
						{variant}
					</Text>
					<CardExample variant={variant} />
				</Stack>
			))}
		</Grid>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Grid align="start" gap={4} xstyle={styles.cards}>
			{sizes.map((size) => (
				<Stack align="start" gap={2} key={size}>
					<Text size="1" color="muted">
						{size}
					</Text>
					<CardExample size={size} variant="elevated" />
				</Stack>
			))}
		</Grid>
	),
};

function CardExample({
	size = "md",
	variant,
}: {
	size?: CardSize;
	variant: CardVariant;
}) {
	return (
		<Card.Root size={size} variant={variant}>
			<Card.Header>
				<Card.Title>Team workspace</Card.Title>
				<Card.Description>Invite collaborators and organize shared project files.</Card.Description>
			</Card.Header>
			<Card.Content>
				<Text>Your workspace currently has three active members and twelve projects.</Text>
			</Card.Content>
			<Card.Footer>
				<Button variant="ghost">View members</Button>
				<Button>Invite member</Button>
			</Card.Footer>
		</Card.Root>
	);
}

const styles = stylex.create({
	cards: {
		gridTemplateColumns: "repeat(auto-fit, minmax(min(16rem, 100%), 1fr))",
	},
});
