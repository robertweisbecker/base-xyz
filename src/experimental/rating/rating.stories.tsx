import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Icon } from "@/components/icons";
import { Text } from "@/components/text/text";
import { Rating, type RatingProps } from "./rating";
import { tokens } from "@/theme/tokens.stylex";

const iconOptions = {
	None: null,
	Star: <Icon.Star width={24} height={24} />,
	"Star filled": <Icon.StarFilled width={24} height={24} />,
	Circle: <Icon.Circle width={24} height={24} />,
	Square: <Icon.Square width={24} height={24} />,
};

type RatingStoryArgs = Pick<RatingProps, "count" | "defaultValue" | "disabled" | "readOnly" | "icon" | "pressedIcon">;

const meta = {
	title: "Experimental/Rating",
	args: {
		count: 5,
		defaultValue: 3,
		disabled: false,
		readOnly: false,
		icon: iconOptions.Star,
		pressedIcon: iconOptions["Star filled"],
	},
	argTypes: {
		count: { control: { type: "number", min: 2, max: 10, step: 1 } },
		defaultValue: {
			control: { type: "number", min: 1, step: 1 },
		},
		disabled: { control: "boolean" },
		readOnly: { control: "boolean" },
		icon: {
			control: "select",
			options: Object.keys(iconOptions),
			mapping: iconOptions,
		},
		pressedIcon: {
			control: "select",
			options: Object.keys(iconOptions),
			mapping: iconOptions,
		},
	},
	parameters: {
		controls: {
			include: ["count", "defaultValue", "disabled", "readOnly", "icon", "pressedIcon"],
		},
	},
} satisfies Meta<RatingStoryArgs>;

export default meta;
type Story = StoryObj<RatingStoryArgs>;

export const Playground: Story = {
	render: ({ count, defaultValue, disabled, readOnly, icon, pressedIcon }) => (
		<Rating
			key={`${count}-${defaultValue}`}
			label="Product rating"
			count={count}
			defaultValue={defaultValue}
			disabled={disabled}
			readOnly={readOnly}
			icon={icon}
			pressedIcon={pressedIcon}
		/>
	),
};

export const Examples: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyStyles.examples)}>
			<div {...stylex.props(storyStyles.example)}>
				<Text size="1" color="subtle">
					No initial value
				</Text>
				<Rating label="Unrated product" />
			</div>
			<div {...stylex.props(storyStyles.example)}>
				<Text size="1" color="subtle">
					Selected value
				</Text>
				<Rating label="Product rating" defaultValue={4} />
			</div>
			<div {...stylex.props(storyStyles.example)}>
				<Text size="1" color="subtle">
					Custom count and icons
				</Text>
				<Rating
					label="Custom rating"
					count={7}
					defaultValue={5}
					icon={<Icon.Dot width={24} height={24} />}
					pressedIcon={<Icon.Circle width={24} height={24} />}
				/>
			</div>
			<div {...stylex.props(storyStyles.example)}>
				<Text size="1" color="subtle">
					Read-only
				</Text>
				<Rating label="Read-only product rating" defaultValue={3} readOnly />
			</div>
			<div {...stylex.props(storyStyles.example)}>
				<Text size="1" color="subtle">
					Disabled
				</Text>
				<Rating label="Disabled product rating" defaultValue={3} disabled />
			</div>
			<div {...stylex.props(storyStyles.example)}>
				<Text size="1" color="subtle">
					Bounded count
				</Text>
				<Rating label="Bounded rating" count={50} defaultValue={5} />
			</div>
		</div>
	),
};

export const Cancellation: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Rating
			label="Cancellation rating"
			defaultValue={2}
			onValueChange={(_, eventDetails) => eventDetails.cancel()}
		/>
	),
};

const storyStyles = stylex.create({
	examples: {
		display: "flex",
		flexDirection: "column",
		rowGap: tokens["--space-6"],
	},
	example: {
		alignItems: "flex-start",
		display: "flex",
		flexDirection: "column",
		rowGap: tokens["--space-2"],
	},
});
