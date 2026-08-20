import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Separator } from "@/components";
import type { ButtonSize, ButtonVariant } from "@/components";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { PromptComposer } from "@/blocks/prompt-composer/prompt-composer";
import { ContextPopover } from "./context-popover";

const sizes = ["xs", "sm", "md", "lg"] as const satisfies readonly ButtonSize[];
const variants = [
	"primary",
	"subtle",
	"secondary",
	"neutral",
	"ghost",
	"plain",
	"error",
] as const satisfies readonly ButtonVariant[];
const tokenFormattingExamples = [
	{ label: "842", value: 842 },
	{ label: "32K", value: 32_000 },
	{ label: "1.5M", value: 1_500_000 },
	{ label: "2.1B", value: 2_100_000_000 },
] as const;

const meta = {
	title: "Blocks/Context popover",
	component: ContextPopover,
	args: {
		total: 258_000,
		usage: 207_000,
	},
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<typeof ContextPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Examples: Story = {
	render: () => (
		<Stack gap={8} maxWidth="42rem">
			<Example title="Prompt composer placement">
				<PromptComposer.Root defaultValue="Summarize the open review comments." onSubmit={() => undefined}>
					<PromptComposer.Surface>
						<PromptComposer.Input />
						<PromptComposer.Footer>
							<PromptComposer.Options>
								<ContextPopover total={128_000} usage={40_000} />
							</PromptComposer.Options>
							<PromptComposer.Actions>
								<PromptComposer.Submit />
							</PromptComposer.Actions>
						</PromptComposer.Footer>
					</PromptComposer.Surface>
				</PromptComposer.Root>
			</Example>

			<Separator />

			<Example title="Sizes">
				<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
					{sizes.map((size) => (
						<ContextPopover key={size} size={size} total={258_000} usage={129_000} variant="secondary" />
					))}
				</Stack>
			</Example>

			<Separator />

			<Example title="Token formatting">
				<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
					{tokenFormattingExamples.map(({ label, value }) => (
						<Stack key={label} align="center" gap={2}>
							<Text size="1" color="muted">
								{label} tokens
							</Text>
							<ContextPopover total={value} usage={value} />
						</Stack>
					))}
				</Stack>
			</Example>

			<Separator />

			<Example title="Variants">
				<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
					{variants.map((variant) => (
						<ContextPopover key={variant} total={256_000} usage={104_000} variant={variant} />
					))}
				</Stack>
			</Example>
		</Stack>
	),
};

function Example({ children, title }: { children: ReactNode; title: string }) {
	return (
		<Stack gap={3}>
			<Text size="1" color="muted">
				{title}
			</Text>
			{children}
		</Stack>
	);
}
