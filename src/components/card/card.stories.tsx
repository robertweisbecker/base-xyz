import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Box, Grid, Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";

import { Button } from "@/components/button/button";
import {
	Card,
	type CardRadius,
	type CardRootProps,
	type CardSize,
	type CardVariant,
} from "./card";

const sizes = ["sm", "md", "lg"] as const;
const radii = ["xxs", "xs", "sm", "md", "lg", "xl", "full"] as const;

const meta = {
	title: "Components/Card",
	component: Card.Root,
	args: {
		radius: "lg",
		shadow: undefined,
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
		radius: {
			control: "select",
			options: radii,
		},
		shadow: { control: "select", options: [undefined, "none", "sm", "md", "lg"] },
	},
	parameters: {
		controls: {
			include: ["variant", "size", "radius", "shadow"],
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
	render: ({ radius, shadow, size, variant }) => (
		<CardExample radius={radius ?? "lg"} shadow={shadow} size={size ?? "md"} variant={variant ?? "elevated"} />
	),
};

export const HorizontalLayout: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Card.Root gap={0} orientation="horizontal" radius="lg">
			<Card.Header gap={2} justify="center">
				<Card.Title>Horizontal card</Card.Title>
				<Card.Description>Uses scalar composition props without a dedicated variant.</Card.Description>
			</Card.Header>
			<Card.Content flexGrow={1}>Content expands without a dedicated horizontal variant.</Card.Content>
			<Card.Footer gap={2} justify="end">
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
		<Grid
			align="start"
			gap={4}
			style={styles.cards}>
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
		<Grid
			align="start"
			gap={4}
			style={styles.cards}>
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
	radius = "lg",
	shadow,
	size = "md",
	variant,
}: {
	radius?: CardRadius;
	shadow?: CardRootProps["shadow"];
	size?: CardSize;
	variant: CardVariant;
}) {
	return (
		<Card.Root radius={radius} shadow={shadow} size={size} variant={variant}>
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
