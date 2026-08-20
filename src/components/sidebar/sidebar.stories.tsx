import type { Meta, StoryObj } from "@storybook/react-vite";
import { CubeIcon } from "@phosphor-icons/react/dist/csr/Cube";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { HouseIcon } from "@phosphor-icons/react/dist/csr/House";
import { UsersIcon } from "@phosphor-icons/react/dist/csr/Users";
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import { Avatar } from "@/components/avatar/avatar";
import { Box, Stack } from "@/components/layout/layout";
import { NavList } from "@/components/nav-list/nav-list";
import { Text } from "@/components/text/text";
import { tokens } from "@/theme/tokens.stylex";
import { Sidebar, type SidebarCollapseMode, type SidebarSide } from "./sidebar";

type StoryArgs = {
	collapseMode: SidebarCollapseMode;
	defaultCollapsed: boolean;
	side: SidebarSide;
};

const meta = {
	title: "Components/Navigation/Sidebar",
	args: {
		collapseMode: "icon",
		defaultCollapsed: false,
		side: "start",
	},
	argTypes: {
		collapseMode: { control: "select", options: ["icon", "offcanvas"] },
		defaultCollapsed: { control: "boolean" },
		side: { control: "select", options: ["start", "end"] },
	},
	parameters: {
		docs: {
			story: {
				height: "520px",
			},
		},
	},
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

function StoryShell({
	children,
	side = "start",
}: {
	children: ReactNode;
	side?: SidebarSide;
}) {
	const shell = stylex.props(storyParts.shell, side === "end" && storyParts.shellEnd);

	return (
		<Box className={shell.className} display="flex" style={shell.style}>
			{children}
		</Box>
	);
}

function StoryMain({ children }: { children?: React.ReactNode }) {
	return (
		<Stack gap={3} p={4} render={<main />} style={storyParts.main}>
			{children}
		</Stack>
	);
}

export const Playground: Story = {
	render: ({ collapseMode, defaultCollapsed, side }) => (
		<Sidebar.Root
			key={`${collapseMode}-${defaultCollapsed}-${side}`}
			collapseMode={collapseMode}
			defaultCollapsed={defaultCollapsed}
			side={side}>
			<StoryShell side={side}>
				<Sidebar.Panel>
					<WorkspaceHeader />
					<Sidebar.Content>
						<NavList.Root aria-label="Primary">
							<PrimaryNavigation />
						</NavList.Root>
					</Sidebar.Content>
					<WorkspaceFooter />
				</Sidebar.Panel>
				<StoryMain>
					<Text color="muted" size="1">
						The sidebar trigger lives in the footer here. The same trigger can still render elsewhere when the page owns
						layout or mobile composition.
					</Text>
				</StoryMain>
			</StoryShell>
		</Sidebar.Root>
	),
};

export const Modes: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Stack align="start" gap={4} orientation="horizontal">
			<ModeExample label="Expanded" collapseMode="icon" />
			<ModeExample label="Icon rail" collapseMode="icon" defaultCollapsed />
			<ModeExample label="Off-canvas" collapseMode="offcanvas" defaultCollapsed />
		</Stack>
	),
};

export const ChildPopovers: Story = {
	name: "Child popovers",
	parameters: { controls: { disable: true } },
	render: () => (
		<Sidebar.Root collapseMode="icon" defaultCollapsed>
			<StoryShell>
				<Sidebar.Panel>
					<WorkspaceHeader />
					<Sidebar.Content>
						<NavList.Root aria-label="Collapsed primary">
							<PrimaryNavigation includeChildren />
						</NavList.Root>
					</Sidebar.Content>
					<WorkspaceFooter />
				</Sidebar.Panel>
				<StoryMain>
					<Text color="muted" size="1">
						Top-level child-bearing rows in an icon rail require icons. Labels are exposed through tooltips or child
						popovers.
					</Text>
				</StoryMain>
			</StoryShell>
		</Sidebar.Root>
	),
};

export const SideEnd: Story = {
	name: "Side end",
	parameters: { controls: { disable: true } },
	render: () => (
		<Sidebar.Root side="end" collapseMode="icon">
			<StoryShell side="end">
				<Sidebar.Panel>
					<WorkspaceHeader />
					<Sidebar.Content>
						<NavList.Root aria-label="Secondary">
							<PrimaryNavigation />
						</NavList.Root>
					</Sidebar.Content>
					<WorkspaceFooter />
				</Sidebar.Panel>
				<StoryMain />
			</StoryShell>
		</Sidebar.Root>
	),
};

export const ExternalTrigger: Story = {
	name: "External trigger",
	parameters: { controls: { disable: true } },
	render: () => <ExternalTriggerExample />,
};

function ModeExample({
	label,
	collapseMode,
	defaultCollapsed = false,
}: {
	label: string;
	collapseMode: SidebarCollapseMode;
	defaultCollapsed?: boolean;
}) {
	return (
		<Stack style={storyParts.mode}>
			<Box p={2}>
				<Text color="muted" size="1">
					{label}
				</Text>
			</Box>
			<Sidebar.Root collapseMode={collapseMode} defaultCollapsed={defaultCollapsed}>
				<Sidebar.Panel>
					<WorkspaceHeader />
					<Sidebar.Content>
						<NavList.Root aria-label={`${label} navigation`}>
							<PrimaryNavigation includeChildren />
						</NavList.Root>
					</Sidebar.Content>
					<WorkspaceFooter />
				</Sidebar.Panel>
			</Sidebar.Root>
		</Stack>
	);
}

function WorkspaceHeader() {
	return (
		<Sidebar.Header startSlot={<Avatar aria-label="Acme workspace" initials="AC" shape="rounded" size={10} />}>
			<Sidebar.Title>Acme</Sidebar.Title>
			<Sidebar.Description>Production</Sidebar.Description>
		</Sidebar.Header>
	);
}

function WorkspaceFooter() {
	return (
		<Sidebar.Footer>
			<Sidebar.Trigger />
		</Sidebar.Footer>
	);
}

function ExternalTriggerExample() {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<Sidebar.Root collapsed={collapsed} onCollapsedChange={setCollapsed}>
			<StoryShell>
				<Sidebar.Panel>
					<Sidebar.Content>
						<NavList.Root aria-label="External trigger navigation">
							<PrimaryNavigation />
						</NavList.Root>
					</Sidebar.Content>
				</Sidebar.Panel>
				<StoryMain>
					<Sidebar.Trigger />
					<Text color="muted" size="1">
						This trigger lives outside the panel while sharing the same Sidebar state.
					</Text>
				</StoryMain>
			</StoryShell>
		</Sidebar.Root>
	);
}

function PrimaryNavigation({ includeChildren = false }: { includeChildren?: boolean }) {
	return (
		<NavList.Drilldown defaultValue="account">
			<NavList.DrilldownPanel value="account" label="Account navigation">
				<NavList.Section label="Project" visuallyHideLabel>
					<NavList.Item label="Overview" href="#overview" icon={<HouseIcon weight="duotone" />} />
					<NavList.Item label="Members" href="#members" icon={<UsersIcon weight="duotone" />} />
					{includeChildren ? (
						<NavList.CollapsibleGroup>
							<NavList.CollapsibleGroupTrigger label="Deploy" icon={<CubeIcon weight="duotone" />} />
							<NavList.CollapsibleGroupPanel>
								<NavList.Item label="Deployments" href="#deployments" />
								<NavList.Item label="Workers" href="#workers" />
							</NavList.CollapsibleGroupPanel>
						</NavList.CollapsibleGroup>
					) : null}
					<NavList.DrilldownTrigger to="settings" label="Settings" icon={<GearIcon weight="duotone" />} />
				</NavList.Section>
			</NavList.DrilldownPanel>
			<NavList.DrilldownPanel value="settings" label="Settings">
				<NavList.DrilldownBack to="account" />
				<NavList.Section label="Settings" visuallyHideLabel>
					<NavList.Item label="Profile" href="#profile" />
					<NavList.Item label="Billing" href="#billing" />
				</NavList.Section>
			</NavList.DrilldownPanel>
		</NavList.Drilldown>
	);
}

const storyParts = stylex.create({
	shell: {
		borderRadius: tokens["--radius-lg"],
		overflow: "hidden",
		blockSize: "28rem",
		outlineColor: tokens["--border-input"],
		outlineOffset: "-1px",
		outlineStyle: "solid",
		outlineWidth: tokens["--border-width"],
	},
	shellEnd: {
		flexDirection: "row-reverse",
	},
	main: {
		flex: "1",
		minInlineSize: 0,
	},
	mode: {
		overflow: "hidden",
		minBlockSize: "24rem",
	},
});
