import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, Field, Label, Stack, TextField, type LabelVariant } from "@/components";

type LabelStoryArgs = {
	variant: LabelVariant;
	nativeLabel: boolean;
	_label: string;
	_disabled: boolean;
};

const meta = {
	title: "Components/Label",
	component: Label,
	args: { variant: "field", nativeLabel: true, _label: "Release updates", _disabled: false },
	argTypes: {
		variant: { control: "inline-radio", options: ["field", "item"] },
		nativeLabel: { control: "boolean" },
		_label: { control: "text" },
		_disabled: { control: "boolean" },
	},
	parameters: { controls: { include: ["_label", "variant", "nativeLabel", "_disabled"] } },
} satisfies Meta<LabelStoryArgs>;

export default meta;
type Story = StoryObj<LabelStoryArgs>;

export const Playground: Story = {
	render: ({ _label, _disabled, variant, nativeLabel }) => (
		<Stack maxWidth="400px">
			<Field.Root disabled={_disabled}>
				<Stack
					orientation={variant === "item" ? "horizontal" : "vertical"}
					align={variant === "item" ? "center" : "stretch"}
					gap={2}
				>
					<Label
						variant={variant}
						nativeLabel={nativeLabel}
						render={nativeLabel ? undefined : <span />}
					>
						{_label}
					</Label>
					{variant === "item" ? (
						<Checkbox defaultChecked />
					) : (
						<TextField defaultValue="Team digest" />
					)}
				</Stack>
				<Field.Description>
					{nativeLabel
						? "Click the label to activate its control."
						: "This rendered label focuses its control when clicked."}
				</Field.Description>
			</Field.Root>
		</Stack>
	),
};
