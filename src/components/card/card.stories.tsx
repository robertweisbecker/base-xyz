import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

import { Button } from "../button/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	type CardRadius,
	type CardProps,
	type CardSize,
	type CardVariant,
} from "./card";

const sizes = ["sm", "md", "lg"] as const;
const radii = ["xxs", "xs", "sm", "md", "lg", "xl", "full"] as const;

const meta = {
	title: "Components/Card",
	component: Card,
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
			<div {...stylex.props(styles.frame)}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: ({ radius, shadow, size, variant }) => (
		<CardExample
			radius={typeof radius === "string" ? radius : "lg"}
			shadow={shadow}
			size={size ?? "md"}
			variant={variant ?? "elevated"}
		/>
	),
};

export const HorizontalLayout: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Card gap={0} orientation="horizontal" radius="lg">
			<CardHeader gap={2} justify="center">
				<CardTitle>Horizontal card</CardTitle>
				<CardDescription>Uses scalar composition props without a dedicated variant.</CardDescription>
			</CardHeader>
			<CardContent flexGrow={1}>Content expands without a dedicated horizontal variant.</CardContent>
			<CardFooter gap={2} justify="end">
				<Button size="sm" variant="secondary">
					Cancel
				</Button>
				<Button size="sm">Save</Button>
			</CardFooter>
		</Card>
	),
};

export const Variants: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.cards)}>
			{(["elevated", "outline"] as const).map((variant) => (
				<div key={variant} {...stylex.props(styles.specimen)}>
					<span {...stylex.props(styles.label)}>{variant}</span>
					<CardExample variant={variant} />
				</div>
			))}
		</div>
	),
};

export const Sizes: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(styles.cards)}>
			{sizes.map((size) => (
				<div key={size} {...stylex.props(styles.specimen)}>
					<span {...stylex.props(styles.label)}>{size}</span>
					<CardExample size={size} variant="elevated" />
				</div>
			))}
		</div>
	),
};

function CardExample({
	radius = "lg",
	shadow,
	size = "md",
	variant,
}: {
	radius?: CardRadius;
	shadow?: CardProps["shadow"];
	size?: CardSize;
	variant: CardVariant;
}) {
	return (
		<Card radius={radius} shadow={shadow} size={size} variant={variant}>
			<CardHeader>
				<CardTitle>Team workspace</CardTitle>
				<CardDescription>Invite collaborators and organize shared project files.</CardDescription>
			</CardHeader>
			<CardContent>
				<p {...stylex.props(styles.copy)}>Your workspace currently has three active members and twelve projects.</p>
			</CardContent>
			<CardFooter>
				<Button variant="ghost">View members</Button>
				<Button>Invite member</Button>
			</CardFooter>
		</Card>
	);
}

const styles = stylex.create({
	frame: { maxWidth: "64rem" },
	cards: {
		gap: tokens["--space-4"],
		alignItems: "start",
		display: "grid",
		gridTemplateColumns: "repeat(auto-fit, minmax(min(16rem, 100%), 1fr))",
	},
	specimen: {
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
