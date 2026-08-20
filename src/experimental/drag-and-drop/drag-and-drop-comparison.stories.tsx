import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { DndKitBoardDemo } from "./dnd-kit/dnd-kit-board-demo";
import { DndKitFeedbackDemo } from "./dnd-kit/dnd-kit-feedback-demo";
import { DndKitMenuDemo } from "./dnd-kit/dnd-kit-menu-demo";
import { DndKitTransferDemo } from "./dnd-kit/dnd-kit-transfer-demo";
import { DemoComparison } from "./demo-parts";
import { ReactAriaAccessibilityDemo } from "./react-aria/react-aria-accessibility-demo";
import { ReactAriaBoardDemo } from "./react-aria/react-aria-board-demo";
import { ReactAriaTransferDemo } from "./react-aria/react-aria-transfer-demo";

const meta = {
	title: "Experimental/Drag and drop",
	parameters: {
		controls: { disable: true },
		layout: "padded",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicTransfer: Story = {
	render: () => (
		<DemoComparison>
			<ReactAriaTransferDemo />
			<DndKitTransferDemo />
		</DemoComparison>
	),
};

export const SortableBoard: Story = {
	render: () => (
		<Stack gap={3}>
			<Text size="1" color="muted">
				Notice insertion targeting on the left and live geometric reflow on the right.
			</Text>
			<DemoComparison>
				<ReactAriaBoardDemo />
				<DndKitBoardDemo />
			</DemoComparison>
		</Stack>
	),
};

export const ReactAriaDifferentiators: Story = {
	render: () => <ReactAriaAccessibilityDemo />,
};

export const DndKitDifferentiators: Story = {
	render: () => <DndKitFeedbackDemo />,
};

export const DndKitBaseUiMenuItems: Story = {
	render: () => <DndKitMenuDemo />,
};
