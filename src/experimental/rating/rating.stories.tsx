import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Separator } from "@/components/separator/separator";
import { Stack } from "@/components/layout/layout";
import { Icon } from "@/components/icons";
import { Text } from "@/components/text/text";
import { Rating, type RatingProps } from "./rating";

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
		<Stack gap={6}>
			<Example label="No initial value">
				<Rating label="Unrated product" />
			</Example>
			<Separator />
			<Example label="Selected value">
				<Rating label="Product rating" defaultValue={4} />
			</Example>
			<Separator />
			<Example label="Custom count and icons">
				<Rating
					label="Custom rating"
					count={7}
					defaultValue={5}
					icon={<Icon.Dot width={24} height={24} />}
					pressedIcon={<Icon.Circle width={24} height={24} />}
				/>
			</Example>
			<Separator />
			<Example label="Read-only">
				<Rating label="Read-only product rating" defaultValue={3} readOnly />
			</Example>
			<Separator />
			<Example label="Disabled">
				<Rating label="Disabled product rating" defaultValue={3} disabled />
			</Example>
			<Separator />
			<Example label="Bounded count">
				<Rating label="Bounded rating" count={50} defaultValue={5} />
			</Example>
		</Stack>
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

function Example({ children, label }: { children: ReactNode; label: string }) {
	return (
		<Stack align="start" gap={2}>
			<Text size="1" color="muted">
				{label}
			</Text>
			{children}
		</Stack>
	);
}
