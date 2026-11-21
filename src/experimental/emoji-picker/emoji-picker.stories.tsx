import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack, Text } from "@/components";
import { EmojiPicker } from "./emoji-picker";
import "../ui-sdk/agent";

const meta = {
	title: "Experimental/Emoji picker",
	component: EmojiPicker,
	parameters: { controls: { disable: true } },
	decorators: [
		(Story) => (
			<Stack gap="2" align="start">
				<Text size="1" color="muted">
					Choose an emoji
				</Text>
				<Story />
				<Text size="1" color="muted">
					↓ to browse · Enter to select · Esc to search
				</Text>
			</Stack>
		),
	],
} satisfies Meta<typeof EmojiPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const RightToLeft: Story = {
	name: "Right to left",
	render: () => (
		<div dir="rtl">
			<EmojiPicker />
		</div>
	),
};
export const Cancellation: Story = {
	args: { onValueChange: (_, details) => details.cancel() },
};
