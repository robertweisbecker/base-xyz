import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { Separator } from "@/components";
import type { ButtonSize, ButtonVariant } from "@/components";
import { PromptComposer } from "@/blocks/prompt-composer/prompt-composer";
import { tokens } from "@/theme/tokens.stylex";
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
		<div {...stylex.props(storyParts.list)}>
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
				<div {...stylex.props(storyParts.row)}>
					{sizes.map((size) => (
						<ContextPopover key={size} size={size} total={258_000} usage={129_000} variant="secondary" />
					))}
				</div>
			</Example>

			<Separator />

			<Example title="Token formatting">
				<div {...stylex.props(storyParts.row)}>
					{tokenFormattingExamples.map(({ label, value }) => (
						<div key={label} {...stylex.props(storyParts.formattingExample)}>
							<span {...stylex.props(storyParts.label)}>{label} tokens</span>
							<ContextPopover total={value} usage={value} />
						</div>
					))}
				</div>
			</Example>

			<Separator />

			<Example title="Variants">
				<div {...stylex.props(storyParts.row)}>
					{variants.map((variant) => (
						<ContextPopover key={variant} total={256_000} usage={104_000} variant={variant} />
					))}
				</div>
			</Example>
		</div>
	),
};

function Example({ children, title }: { children: ReactNode; title: string }) {
	return (
		<section {...stylex.props(storyParts.example)}>
			<h2 {...stylex.props(storyParts.heading)}>{title}</h2>
			{children}
		</section>
	);
}

const storyParts = stylex.create({
	example: {
		gap: tokens["--space-3"],
		display: "flex",
		flexDirection: "column",
	},
	formattingExample: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
	},
	heading: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-regular"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	label: {
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-regular"],
		lineHeight: tokens["--line-height-1"],
	},
	list: {
		gap: tokens["--space-8"],
		display: "flex",
		flexDirection: "column",
		maxWidth: "42rem",
	},
	row: {
		gap: tokens["--space-3"],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
	},
});
