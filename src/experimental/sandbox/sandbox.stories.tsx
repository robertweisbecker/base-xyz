import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeader } from "@/blocks";
import { Button, Card, Icon, IconButton, Separator, Stack, Text } from "@/components";

const meta = {
	title: "Experimental/Sandbox",
	tags: ["!autodocs"],
	parameters: {
		docs: { disable: true },
		controls: { disable: true },
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Canvas: Story = {
	render: () => (
		<Stack gap={5}>
			<PageHeader title="Sandbox" description="The world is your oyster." />
			<Card.Root>
				<Card.Header>
					<Stack orientation="horizontal" align="start" justify="space-between" gap={2}>
						<Card.Title>Sandbox</Card.Title>
						<IconButton icon={<Icon.Diamond />} label="Card actions" variant="ghost" size="sm" onClick={() => {}} />
					</Stack>
				</Card.Header>
				<Separator />
				<Card.Content>
					<Text size="2">The world is your oyster.</Text>
				</Card.Content>
				<Separator />
				<Card.Footer>
					<Button>Action</Button>
				</Card.Footer>
			</Card.Root>
		</Stack>
	),
};
