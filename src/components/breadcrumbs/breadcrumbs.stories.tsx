import { BookOpenIcon } from "@phosphor-icons/react/dist/csr/BookOpen";
import { HouseIcon } from "@phosphor-icons/react/dist/csr/House";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "@/components/heading/heading";
import { Stack } from "@/components/layout/layout";
import { Separator } from "@/components/separator/separator";
import type { LinkColor } from "@/components/link/link";
import { Breadcrumbs, type BreadcrumbsRootProps } from "./breadcrumbs";

const meta: Meta<BreadcrumbsRootProps & { color: LinkColor }> = {
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => (
		<Breadcrumbs.Root {...args}>
			<Breadcrumbs.Link
				href="#"
				startSlot={<HouseIcon aria-hidden weight="duotone" />}
				color={args.color}
			>
				Home
			</Breadcrumbs.Link>
			<Breadcrumbs.Separator />
			<Breadcrumbs.Link
				href="#"
				color={args.color}
				startSlot={<BookOpenIcon aria-hidden weight="duotone" />}
			>
				Docs
			</Breadcrumbs.Link>
			<Breadcrumbs.Separator />
			<Breadcrumbs.Current>Getting started</Breadcrumbs.Current>
			<Breadcrumbs.Copy text="/docs/getting-started" />
		</Breadcrumbs.Root>
	),
};

export const Examples: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={6}>
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
		</Stack>
	),
};

function Example({ children, title }: { children: React.ReactNode; title: string }) {
	return (
		<Stack align="start" gap={2}>
			<Heading size="1" color="muted" fontWeight="regular">
				{title}
			</Heading>
			{children}
		</Stack>
	);
}
