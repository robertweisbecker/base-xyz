import type { Meta, StoryObj } from "@storybook/react-vite";
import { CubeIcon } from "@phosphor-icons/react/dist/csr/Cube";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { HouseIcon } from "@phosphor-icons/react/dist/csr/House";
import { ShieldChevronIcon } from "@phosphor-icons/react/dist/csr/ShieldChevron";
import { UsersIcon } from "@phosphor-icons/react/dist/csr/Users";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";
import { Badge } from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { Drawer } from "@/components/drawer/drawer";
import { Box } from "@/components/layout";
import { Separator } from "@/components/separator/separator";
import { tokens } from "@/theme/tokens.stylex";
import { NavList, type NavListSize } from "./nav-list";

type StoryArgs = {
	size: NavListSize;
	current: "overview" | "deployments" | "members";
	disabled: boolean;
	_icon: "House" | "Cube" | "None";
};

const meta = {
	title: "Components/Navigation/Nav list",
	args: {
		size: "md",
		current: "overview",
		disabled: false,
		_icon: "House",
	},
	argTypes: {
		size: { control: "select", options: ["sm", "md"] },
		current: { control: "select", options: ["overview", "deployments", "members"] },
		disabled: { control: "boolean" },
		_icon: { control: "select", options: ["House", "Cube", "None"] },
	},
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

const icons = {
	House: <HouseIcon />,
	Cube: <CubeIcon />,
	None: undefined,
} as const;

export const Playground: Story = {
	render: ({ size, current, disabled, _icon }) => (
		<Box height="28rem" p={3} radius="lg" xstyle={storyParts.frame} width="18rem">
			<NavList.Root aria-label="Project navigation" size={size}>
				<NavList.Section label="Project">
					<NavList.Item
						label="Overview"
						href="#overview"
						icon={icons[_icon]}
						current={current === "overview" ? "page" : false}
					/>
					<NavList.Item
						label="Deployments"
						href="#deployments"
						icon={<CubeIcon weight="duotone" />}
						current={current === "deployments" ? "page" : false}
						badge={<Badge size="sm">12</Badge>}
					/>
					<NavList.Item
						label="Members"
						icon={<UsersIcon weight="duotone" />}
						disabled={disabled}
						current={current === "members" ? "page" : false}
					/>
				</NavList.Section>
			</NavList.Root>
		</Box>
	),
};

export const Examples: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Box p={3} radius="lg" xstyle={storyParts.frame} width="18rem">
			<NavList.Root aria-label="Workspace navigation">
				<NavList.Section label="Main">
					<NavList.Item label="Overview" href="#overview" icon={<HouseIcon weight="duotone" />} current="page" />
					<NavList.Item
						label="Deployments"
						href="#deployments"
						icon={<CubeIcon weight="duotone" />}
						badge={<Badge size="sm">4</Badge>}
					/>
					<NavList.Item label="Current location" href="#location" current="location" />
					<NavList.Item label="Disabled link" href="#disabled" disabled />
				</NavList.Section>
				<Separator />
				<NavList.Section label="Hidden section label" visuallyHideLabel>
					<NavList.Item
						label="A very long navigation row label that truncates cleanly inside the available column"
						href="#long"
					/>
				</NavList.Section>
			</NavList.Root>
		</Box>
	),
};

export const Collapsible: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<Box p={3} radius="lg" xstyle={storyParts.frame} width="18rem">
			<NavList.Root aria-label="Build navigation">
				<NavList.Section label="Build">
					<NavList.CollapsibleGroup defaultOpen>
						<NavList.CollapsibleGroupTrigger label="Deploy" icon={<CubeIcon weight="duotone" />} />
						<NavList.CollapsibleGroupPanel>
							<NavList.Item label="Deployments" href="#deployments" current="page" />
							<NavList.Item label="Workers" href="#workers" />
							<NavList.CollapsibleGroup defaultOpen>
								<NavList.CollapsibleGroupTrigger label="Nested group" />
								<NavList.CollapsibleGroupPanel>
									<NavList.Item label="Variables" href="#variables" />
									<NavList.Item label="Secrets" href="#secrets" />
								</NavList.CollapsibleGroupPanel>
							</NavList.CollapsibleGroup>
						</NavList.CollapsibleGroupPanel>
					</NavList.CollapsibleGroup>
					{Array.from({ length: 8 }, (_, index) => (
						<NavList.Item key={index} label={`Project ${index + 1}`} href={`#project-${index + 1}`} />
					))}
					<NavList.CollapsibleGroup>
						<NavList.CollapsibleGroupTrigger label="Bottom group" icon={<GearIcon weight="duotone" />} />
						<NavList.CollapsibleGroupPanel>
							<NavList.Item label="Audit logs" href="#audit" />
							<NavList.Item label="Access" href="#access" />
						</NavList.CollapsibleGroupPanel>
					</NavList.CollapsibleGroup>
				</NavList.Section>
			</NavList.Root>
		</Box>
	),
};

export const Drilldown: Story = {
	parameters: { controls: { disable: true } },
	render: () => <DrilldownExample />,
};

export const InDrawer: Story = {
	name: "In drawer",
	parameters: { controls: { disable: true } },
	render: () => <DrawerExample />,
};

export const CollapsedChildPopovers: Story = {
	name: "Collapsed child popovers",
	parameters: { controls: { disable: true } },
	render: () => (
		<Box height="24rem" p={3} radius="lg" xstyle={[storyParts.frame, storyParts.sidebarRail]}>
			<NavList.NavListPresentationProvider presentation="icon">
				<NavList.Root aria-label="Collapsed project navigation">
					<NavList.Section label="Project" visuallyHideLabel>
						<NavList.Item label="Overview" href="#overview" icon={<HouseIcon weight="duotone" />} current="page" />
						<NavList.CollapsibleGroup>
							<NavList.CollapsibleGroupTrigger label="Deploy" icon={<CubeIcon weight="duotone" />} />
							<NavList.CollapsibleGroupPanel>
								<NavList.Item label="Deployments" href="#deployments" />
								<NavList.Item label="Workers" href="#workers" />
							</NavList.CollapsibleGroupPanel>
						</NavList.CollapsibleGroup>
						<DrilldownNavigation />
					</NavList.Section>
				</NavList.Root>
			</NavList.NavListPresentationProvider>
		</Box>
	),
};

function DrilldownExample() {
	const [value, setValue] = useState("account");

	return (
		<Box height="28rem" p={3} radius="lg" xstyle={storyParts.frame} width="18rem">
			<NavList.Root aria-label="Account navigation">
				<NavList.Drilldown value={value} defaultValue="account" onValueChange={setValue}>
					<NavList.DrilldownPanel value="account" label="Account navigation">
						<NavList.Section label="Account">
							<NavList.Item label="Overview" icon={<HouseIcon weight="duotone" />} href="#account" />
							<NavList.DrilldownTrigger to="project" label="Project settings" icon={<GearIcon weight="duotone" />} />
							<NavList.DrilldownTrigger to="security" label="Security" icon={<ShieldChevronIcon weight="duotone" />} />
						</NavList.Section>
					</NavList.DrilldownPanel>
					<NavList.DrilldownPanel value="project" label="Project">
						<NavList.DrilldownBack to="account" />
						<NavList.Section label="Project" visuallyHideLabel>
							<NavList.Item label="Members" href="#members" />
							<NavList.Item label="Billing" href="#billing" />
							<NavList.Item label="Environments" href="#environments" />
						</NavList.Section>
					</NavList.DrilldownPanel>
					<NavList.DrilldownPanel value="security" label="Security">
						<NavList.DrilldownBack to="account" />
						<NavList.Section label="Security">
							<NavList.Item label="Single sign-on" href="#sso" />
							<NavList.Item label="Audit log" href="#audit-log" />
						</NavList.Section>
					</NavList.DrilldownPanel>
				</NavList.Drilldown>
			</NavList.Root>
		</Box>
	);
}

function DrilldownNavigation() {
	return (
		<NavList.Drilldown defaultValue="account">
			<NavList.DrilldownPanel value="account" label="Account navigation">
				<NavList.DrilldownTrigger to="project" label="Project settings" icon={<GearIcon />} />
			</NavList.DrilldownPanel>
			<NavList.DrilldownPanel value="project" label="Project">
				<NavList.DrilldownBack to="account" />
				<NavList.Section label="Project" visuallyHideLabel>
					<NavList.Item label="Members" href="#members" />
					<NavList.Item label="Billing" href="#billing" />
				</NavList.Section>
			</NavList.DrilldownPanel>
		</NavList.Drilldown>
	);
}

function DrawerExample() {
	const [open, setOpen] = useState(false);

	return (
		<Drawer.Root open={open} onOpenChange={setOpen}>
			<Drawer.Trigger render={<Button />}>Open navigation</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup>
						<Drawer.Content>
							<Drawer.Body>
								<NavList.Root aria-label="Drawer navigation" onNavigate={() => setOpen(false)}>
									<NavList.Section label="Project">
										<NavList.Item label="Overview" href="#overview" icon={<HouseIcon />} />
										<NavList.CollapsibleGroup>
											<NavList.CollapsibleGroupTrigger label="Deploy" icon={<CubeIcon />} />
											<NavList.CollapsibleGroupPanel>
												<NavList.Item label="Deployments" href="#deployments" />
												<NavList.Item label="Workers" href="#workers" />
											</NavList.CollapsibleGroupPanel>
										</NavList.CollapsibleGroup>
									</NavList.Section>
								</NavList.Root>
							</Drawer.Body>
						</Drawer.Content>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	);
}

const storyParts = stylex.create({
	frame: {
		borderColor: tokens["--border"],
		borderStyle: "solid",
		borderWidth: tokens["--border-width"],
	},
	sidebarRail: {
		width: tokens["--size-sidebar-rail"],
	},
});
