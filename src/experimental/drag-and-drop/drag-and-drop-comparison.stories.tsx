import type { Meta, StoryObj } from "@storybook/react-vite";
import { DndKitBoardDemo } from "./dnd-kit/dnd-kit-board-demo";
import { DndKitFeedbackDemo } from "./dnd-kit/dnd-kit-feedback-demo";
import { DndKitMenuDemo } from "./dnd-kit/dnd-kit-menu-demo";
import { DndKitTransferDemo } from "./dnd-kit/dnd-kit-transfer-demo";
import { DemoComparison } from "./demo-parts";
import { ReactAriaAccessibilityDemo } from "./react-aria/react-aria-accessibility-demo";
import { ReactAriaBoardDemo } from "./react-aria/react-aria-board-demo";
import { ReactAriaTransferDemo } from "./react-aria/react-aria-transfer-demo";
import { Text } from "@/components/text/text";

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
		<div>
			<Text size="1" mb={"3"} color="subtle">
				Notice insertion targeting on the left and live geometric reflow on the right.
			</Text>
			<DemoComparison>
				<ReactAriaBoardDemo />
				<DndKitBoardDemo />
			</DemoComparison>
		</div>
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
