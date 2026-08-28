import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { Stack } from "@/components/layout";
import { Text } from "@/components/text";
import { LinkButton } from "./link-button";

const iconOptions = {
	None: undefined,
	Add: <PlusIcon aria-hidden weight="bold" />,
	Continue: <ArrowRightIcon aria-hidden weight="bold" />,
};

type LinkButtonStoryArgs = ComponentProps<typeof LinkButton>;

const meta = {
	title: "Components/Link/Link button",
	component: LinkButton,
	args: {
		children: "Create project",
		endSlot: undefined,
		external: false,
		href: "#create-project",
		id: "link-button-playground",
		shape: "default",
		size: "md",
		startSlot: undefined,
		variant: "primary",
	},
	argTypes: {
		children: { control: "text" },
		endSlot: {
			control: "select",
			mapping: iconOptions,
			options: Object.keys(iconOptions),
		},
		external: { control: "boolean" },
		href: { control: "text" },
		render: { control: false },
		shape: { control: "select", options: ["default", "pill", "circle", "square"] },
		size: { control: "select", options: ["xs", "sm", "md", "lg"] },
		startSlot: {
			control: "select",
			mapping: iconOptions,
			options: Object.keys(iconOptions),
		},
		variant: {
			control: "select",
			options: ["primary", "subtle", "secondary", "neutral", "ghost", "plain", "error"],
		},
	},
	parameters: {
		controls: {
			include: ["children", "href", "external", "variant", "size", "shape", "startSlot", "endSlot"],
		},
		docs: {
			description: {
				component:
					"A semantic link with Button presentation. It renders an anchor by default and accepts a render prop for router link components.",
			},
		},
	},
} satisfies Meta<LinkButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Examples: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={6}>
			<Stack gap={2}>
				<Text color="muted" size="1">
					Actions that navigate
				</Text>
				<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
					<LinkButton href="#create-project" startSlot={<PlusIcon aria-hidden weight="bold" />}>
						Create project
					</LinkButton>
					<LinkButton href="#project-overview" variant="secondary">
						Project overview
					</LinkButton>
					<LinkButton
						external
						href="https://base-ui.com/react/components/button#rendering-links-as-buttons"
						variant="neutral"
					>
						Base UI guidance
					</LinkButton>
				</Stack>
			</Stack>
			<Stack gap={2}>
				<Text color="muted" size="1">
					Sizes and shapes
				</Text>
				<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
					<LinkButton href="#previous" size="xs" variant="ghost">
						Previous
					</LinkButton>
					<LinkButton
						href="#continue"
						endSlot={<ArrowRightIcon aria-hidden weight="bold" />}
						size="sm"
					>
						Continue
					</LinkButton>
					<LinkButton href="#invite" shape="pill" variant="subtle">
						Invite people
					</LinkButton>
				</Stack>
			</Stack>
		</Stack>
	),
};

export const Rendering: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<LinkButton
			id="link-button-rendered"
			render={<RouterLink to="#router-dashboard" />}
			variant="secondary"
		>
			Open dashboard
		</LinkButton>
	),
};

function RouterLink({ to, ...props }: ComponentProps<"a"> & { to: string }) {
	return <a data-router-link="" href={to} {...props} />;
}
