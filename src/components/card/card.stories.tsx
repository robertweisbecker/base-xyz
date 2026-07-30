import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { color, space } from "@/styles/tokens.stylex";
import { fontSize, letterSpacing, lineHeight } from "@/styles/tokens.stylex";
import { Button } from "../button/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	type CardRadius,
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
	},
	parameters: {
		controls: {
			include: ["variant", "size", "radius"],
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
	render: ({ radius, size, variant }) => (
		<CardExample radius={radius ?? "lg"} size={size ?? "md"} variant={variant ?? "elevated"} />
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
	size = "md",
	variant,
}: {
	radius?: CardRadius;
	size?: CardSize;
	variant: CardVariant;
}) {
	return (
		<Card radius={radius} size={size} variant={variant}>
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
		gap: space.x4,
		alignItems: "start",
		display: "grid",
		gridTemplateColumns: "repeat(auto-fit, minmax(min(16rem, 100%), 1fr))",
	},
	specimen: {
		gap: space.x2,
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
