import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { CubeIcon } from "@phosphor-icons/react/dist/csr/Cube";
import * as stylex from "@stylexjs/stylex";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/button/button";
import { Stack } from "@/components/layout/layout";
import { Separator } from "@/components/separator/separator";
import { Text } from "@/components/text/text";
import { media } from "@/styles/constants.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";
import { Navbar } from "./navbar";

const slotOptions = {
	None: undefined,
	Cube: <CubeIcon aria-hidden />,
	Bell: <BellIcon aria-hidden />,
};

const meta: Meta<typeof Navbar> = {
	title: "Components/Navbar",
	component: Navbar,
	args: {
		end: "Bell",
		position: "fixed",
		start: "Cube",
	},
	argTypes: {
		end: {
			control: "select",
			mapping: slotOptions,
			options: Object.keys(slotOptions),
		},
		position: {
			control: "inline-radio",
			options: ["absolute", "fixed", "sticky"],
		},
		start: {
			control: "select",
			mapping: slotOptions,
			options: Object.keys(slotOptions),
		},
	},
	parameters: {
		controls: {
			include: ["start", "end", "position"],
		},
		docs: {
			description: {
				component:
					"A stateless app-header container with start and end content slots. Callers own navigation landmarks, links, current-page state, routing, actions, and responsive overlays.",
			},
		},
		layout: "fullscreen",
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: (args) => <Navbar data-testid="navbar-playground" {...args} />,
};

export const Examples: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack gap={5}>
			<Example label="Product navigation">
				<Navbar
					position="sticky"
					start={
						<a href="#product" {...stylex.props(styles.brand, focusRing.offset)}>
							<CubeIcon aria-hidden size={18} weight="duotone" />
							Acme
						</a>
					}
					end={
						<>
							<nav aria-label="Product" {...stylex.props(styles.navigation)}>
								<StoryLink current="page" href="#dashboard">
									Dashboard
								</StoryLink>
								<StoryLink href="#deployments">Deployments</StoryLink>
								<StoryLink href="#settings">Settings</StoryLink>
							</nav>
							<Button size="sm" variant="secondary">
								View docs
							</Button>
						</>
					}
				/>
			</Example>
			<Separator />
			<Example label="Brand and actions">
				<Navbar
					position="sticky"
					start={
						<a href="#workspace" {...stylex.props(styles.brand, focusRing.offset)}>
							Acme workspace
						</a>
					}
					end={
						<>
							<Button size="sm" variant="ghost">
								Sign in
							</Button>
							<Button size="sm">Get started</Button>
						</>
					}
				/>
			</Example>
		</Stack>
	),
};

function StoryLink({
	children,
	current,
	href,
}: {
	children: React.ReactNode;
	current?: "page";
	href: string;
}) {
	return (
		<a aria-current={current} href={href} {...stylex.props(styles.link, focusRing.offset)}>
			{children}
		</a>
	);
}

function Example({ children, label }: { children: React.ReactNode; label: string }) {
	return (
		<Stack gap={2}>
			<Text color="muted" size="1">
				{label}
			</Text>
			{children}
		</Stack>
	);
}

const styles = stylex.create({
	brand: {
		gap: tokens["--space-2"],
		textDecoration: "none",
		alignItems: "center",
		color: tokens["--fg"],
		display: "inline-flex",
		flexShrink: 0,
		fontSize: tokens["--font-size-2"],
		fontWeight: tokens["--font-weight-semibold"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	navigation: {
		gap: tokens["--space-1"],
		alignItems: "center",
		display: "flex",
		minWidth: 0,
		overflowX: "auto",
	},
	link: {
		borderRadius: tokens["--radius-sm"],
		paddingInline: tokens["--space-2"],
		textDecoration: "none",
		alignItems: "center",
		backgroundColor: {
			"[aria-current]": tokens["--surface-subtle-hover"],
			default: "transparent",
			":hover": {
				default: null,
				[media.canHover]: tokens["--bg-highlight"],
			},
		},
		color: {
			"[aria-current]": tokens["--fg"],
			default: tokens["--fg-muted"],
			":hover": {
				default: null,
				[media.canHover]: tokens["--fg"],
			},
		},
		display: "inline-flex",
		flexShrink: 0,
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		whiteSpace: "nowrap",
		minHeight: tokens["--size-control-sm"],
	},
});
