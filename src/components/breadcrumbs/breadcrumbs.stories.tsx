import { BookOpenIcon } from "@phosphor-icons/react/dist/csr/BookOpen";
import { HouseIcon } from "@phosphor-icons/react/dist/csr/House";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { Separator } from "@/components/separator/separator";
import { tokens } from "@/theme/tokens.stylex";
import { Breadcrumbs } from "./breadcrumbs";
import type { LinkColor } from "@/components/link/link";

const meta = {
	title: "Components/Breadcrumbs",
	component: Breadcrumbs.Root,
	args: {
		size: "md",
		color: "accent",
	},
	argTypes: {
		label: { control: "text" },
		color: {
			control: "inline-radio",
			options: ["inherit", "accent", "neutral"],
		},
		size: {
			control: "inline-radio",
			options: ["sm", "md"],
		},
		style: { table: { disable: true } },
	},
} satisfies Meta<typeof Breadcrumbs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<Breadcrumbs.Root {...args}>
			<Breadcrumbs.Link href="#" startSlot={<HouseIcon aria-hidden weight="duotone" />} color={args.color as LinkColor}>
				Home
			</Breadcrumbs.Link>
			<Breadcrumbs.Separator />
			<Breadcrumbs.Link href="#" color={args.color as LinkColor}>
				Docs
			</Breadcrumbs.Link>
			<Breadcrumbs.Separator />
			<Breadcrumbs.Current startSlot={<BookOpenIcon aria-hidden weight="duotone" />}>
				Getting started
			</Breadcrumbs.Current>
			<Breadcrumbs.Copy text="/docs/getting-started" />
		</Breadcrumbs.Root>
	),
};

export const Examples: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyParts.list)}>
			<Example title="Basic">
				<Breadcrumbs.Root>
					<Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
					<Breadcrumbs.Separator />
					<Breadcrumbs.Link href="#">Docs</Breadcrumbs.Link>
					<Breadcrumbs.Separator />
					<Breadcrumbs.Current>Breadcrumbs</Breadcrumbs.Current>
				</Breadcrumbs.Root>
			</Example>
			<Separator />
			<Example title="Compact">
				<Breadcrumbs.Root size="sm">
					<Breadcrumbs.Link href="#" startSlot={<HouseIcon aria-hidden weight="duotone" />}>
						Home
					</Breadcrumbs.Link>
					<Breadcrumbs.Separator />
					<Breadcrumbs.Current>Getting started</Breadcrumbs.Current>
				</Breadcrumbs.Root>
			</Example>
			<Separator />
			<Example title="Loading current page">
				<Breadcrumbs.Root>
					<Breadcrumbs.Link href="#">Home</Breadcrumbs.Link>
					<Breadcrumbs.Separator />
					<Breadcrumbs.Link href="#">Docs</Breadcrumbs.Link>
					<Breadcrumbs.Separator />
					<Breadcrumbs.Current loading />
				</Breadcrumbs.Root>
			</Example>
		</div>
	),
};

function Example({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<section {...stylex.props(storyParts.example)}>
			<h2 {...stylex.props(storyParts.heading)}>{title}</h2>
			{children}
		</section>
	);
}

const storyParts = stylex.create({
	list: {
		gap: tokens["--space-6"],
		display: "flex",
		flexDirection: "column",
	},
	example: {
		gap: tokens["--space-2"],
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
});
