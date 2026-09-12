import type { Meta, StoryObj } from "@storybook/react-vite";
import { CubeIcon } from "@phosphor-icons/react/dist/csr/Cube";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { HouseIcon } from "@phosphor-icons/react/dist/csr/House";
import { ShieldChevronIcon } from "@phosphor-icons/react/dist/csr/ShieldChevron";
import { UsersIcon } from "@phosphor-icons/react/dist/csr/Users";
import * as stylex from "@stylexjs/stylex";
import { useRef, useState, type MouseEvent } from "react";
import { Badge } from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { Drawer } from "@/components/drawer/drawer";
import { Box, Stack } from "@/components/layout";
import { Separator } from "@/components/separator/separator";
import { tokens } from "@/theme/tokens.stylex";
import { NavList, type NavListIndentLevel, type NavListSize } from "./nav-list";

type StoryArgs = {
	size: NavListSize;
	current: "overview" | "deployments" | "members";
	disabled: boolean;
	indentLevel: NavListIndentLevel;
	_icon: "House" | "Cube" | "None";
};

const meta = {
	title: "Components/Navigation/Nav list",
	args: {
		size: "md",
		current: "overview",
		disabled: false,
		indentLevel: 0,
		_icon: "House",
	},
	argTypes: {
		size: { control: "select", options: ["sm", "md"] },
		current: { control: "select", options: ["overview", "deployments", "members"] },
		disabled: { control: "boolean" },
		indentLevel: { control: "inline-radio", options: [0, 1] },
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
	render: ({ size, current, disabled, indentLevel, _icon }) => (
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
						indentLevel={indentLevel}
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
					<NavList.Item
						label="Overview"
						href="#overview"
						icon={<HouseIcon weight="duotone" />}
						current="page"
					/>
					<NavList.Item label="Deploy" href="#deploy" icon={<CubeIcon weight="duotone" />} />
					<NavList.Item
						label="Deployments"
						href="#deployments"
						indentLevel={1}
						badge={<Badge size="sm">4</Badge>}
					/>
					<NavList.Item label="Workers" href="#workers" indentLevel={1} />
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
						<NavList.Item
							key={index}
							label={`Project ${index + 1}`}
							href={`#project-${index + 1}`}
						/>
					))}
					<NavList.CollapsibleGroup>
						<NavList.CollapsibleGroupTrigger
							label="Bottom group"
							icon={<GearIcon weight="duotone" />}
						/>
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
						<NavList.Item
							label="Overview"
							href="#overview"
							icon={<HouseIcon weight="duotone" />}
							current="page"
						/>
						<NavList.CollapsibleGroup>
							<NavList.CollapsibleGroupTrigger
								label="Deploy"
								icon={<CubeIcon weight="duotone" />}
							/>
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

export const States: Story = {
	parameters: { controls: { disable: true } },
	render: () => <NavigationStates />,
};

function NavigationStates() {
	const [icon, setIcon] = useState(false);
	const [cancel, setCancel] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [panel, setPanel] = useState("deployments");
	const [clicks, setClicks] = useState(0);
	const [navigations, setNavigations] = useState(0);
	const onClick = (event: MouseEvent<HTMLElement>) => {
		setClicks((count) => count + 1);
		if (cancel) event.preventDefault();
	};
	return (
		<Stack gap={3}>
			<label>
				<input type="checkbox" checked={icon} onChange={(event) => setIcon(event.target.checked)} />
				Icon presentation
			</label>
			<label>
				<input
					type="checkbox"
					checked={cancel}
					onChange={(event) => setCancel(event.target.checked)}
				/>
				Cancel activation
			</label>
			<label>
				<input
					type="checkbox"
					checked={disabled}
					onChange={(event) => setDisabled(event.target.checked)}
				/>
				Disable triggers
			</label>
			<label>
				Available navigation{" "}
				<select value={panel} onChange={(event) => setPanel(event.target.value)}>
					<option value="deployments">Deployments</option>
					<option value="workers">Workers</option>
					<option value="none">None</option>
				</select>
			</label>
			<output aria-label="Click callbacks">{clicks}</output>
			<output aria-label="Navigation callbacks">{navigations}</output>
			<Box width={icon ? "4rem" : "18rem"} height="20rem">
				<NavList.NavListPresentationProvider presentation={icon ? "icon" : "expanded"}>
					<NavList.Root
						aria-label="Configurable navigation"
						onNavigate={() => setNavigations((count) => count + 1)}
					>
						<NavList.Section label="Project" visuallyHideLabel={icon}>
							<NavList.Item label="Overview" href="#overview" current="page" onClick={onClick} />
							<NavList.Item label="Unavailable" href="#unavailable" disabled />
							<NavList.CollapsibleGroup>
								<NavList.CollapsibleGroupTrigger
									label="Deploy"
									aria-label="Open deployment navigation"
									icon={<CubeIcon />}
									disabled={disabled}
									onClick={onClick}
								/>
								{panel !== "none" && (
									<NavList.CollapsibleGroupPanel key={panel}>
										<NavList.Item
											label={panel === "deployments" ? "Deployments" : "Workers"}
											href={"#" + panel}
										/>
									</NavList.CollapsibleGroupPanel>
								)}
							</NavList.CollapsibleGroup>
							<NavList.Drilldown defaultValue="account">
								<NavList.DrilldownPanel value="account" label="Account">
									<NavList.DrilldownTrigger
										to="settings"
										label="Settings"
										aria-label="Open account settings"
										icon={<GearIcon />}
										disabled={disabled}
										onClick={onClick}
									/>
								</NavList.DrilldownPanel>
								<NavList.DrilldownPanel value="settings" label="Settings">
									<NavList.DrilldownBack to="account" />
									<NavList.Item label="Members" href="#members" />
								</NavList.DrilldownPanel>
							</NavList.Drilldown>
						</NavList.Section>
					</NavList.Root>
				</NavList.NavListPresentationProvider>
			</Box>
		</Stack>
	);
}

function DrilldownExample() {
	const [value, setValue] = useState("account");
	const [controlled, setControlled] = useState(true);
	const [defer, setDefer] = useState(false);
	const [icon, setIcon] = useState(false);
	const [request, setRequest] = useState({ value: "account", direction: "forward", count: 0 });
	const scrollRef = useRef<HTMLDivElement>(null);

	return (
		<Stack gap={3}>
			<label>
				<input
					type="checkbox"
					checked={controlled}
					onChange={(event) => setControlled(event.target.checked)}
				/>
				Controlled navigation
			</label>
			<label>
				<input
					type="checkbox"
					checked={defer}
					onChange={(event) => setDefer(event.target.checked)}
				/>
				Defer navigation update
			</label>
			<label>
				<input type="checkbox" checked={icon} onChange={(event) => setIcon(event.target.checked)} />
				Icon presentation
			</label>
			<Button onClick={() => setValue(request.value)}>Apply requested navigation</Button>
			<output aria-label="Requested navigation">
				{request.value} {request.direction} {request.count}
			</output>
			<output aria-label="Supplied navigation">{value}</output>
			<Box
				ref={scrollRef}
				data-testid="account-scroll"
				height="18rem"
				width={icon ? "4rem" : "18rem"}
				xstyle={storyParts.scroller}
			>
				<NavList.NavListPresentationProvider
					presentation={icon ? "icon" : "expanded"}
					scrollMode="external"
					scrollRef={scrollRef}
				>
					<NavList.Root aria-label="Account navigation">
						<NavList.Drilldown
							key={String(controlled)}
							value={controlled ? value : undefined}
							defaultValue="account"
							onValueChange={(nextValue, details) => {
								setRequest((previous) => ({
									value: nextValue,
									direction: details.direction,
									count: previous.count + 1,
								}));
								if (!defer) setValue(nextValue);
							}}
						>
							<NavList.DrilldownPanel value="account" label="Account navigation">
								<NavList.Section label="Account">
									<NavList.Item
										label="Overview"
										icon={<HouseIcon weight="duotone" />}
										href="#account"
									/>
									{Array.from({ length: 10 }, (_, index) => (
										<NavList.Item
											key={index}
											label={`Account ${index + 1}`}
											href={`#account-${index + 1}`}
										/>
									))}
									<NavList.DrilldownTrigger
										to="project"
										label="Project settings"
										icon={<GearIcon weight="duotone" />}
									/>
									<NavList.DrilldownTrigger
										to="security"
										label="Security"
										icon={<ShieldChevronIcon weight="duotone" />}
									/>
								</NavList.Section>
							</NavList.DrilldownPanel>
							<NavList.DrilldownPanel value="project" label="Project">
								<NavList.DrilldownBack to="account" />
								<NavList.Section label="Project" visuallyHideLabel>
									<NavList.Item label="Members" href="#members" />
									<NavList.Item label="Billing" href="#billing" />
									<NavList.Item label="Environments" href="#environments" />
									<NavList.DrilldownTrigger to="security" label="Security settings" />
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
				</NavList.NavListPresentationProvider>
			</Box>
		</Stack>
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
	const [icon, setIcon] = useState(false);

	return (
		<Box>
			<label>
				<input type="checkbox" checked={icon} onChange={(event) => setIcon(event.target.checked)} />
				Icon presentation
			</label>
			<Drawer.Root open={open} onOpenChange={setOpen}>
				<Drawer.Trigger render={<Button />}>Open navigation</Drawer.Trigger>
				<Drawer.Portal>
					<Drawer.Backdrop />
					<Drawer.Viewport>
						<Drawer.Popup>
							<Drawer.Content>
								<Drawer.Body>
									<NavList.NavListPresentationProvider presentation={icon ? "icon" : "expanded"}>
										<NavList.Root aria-label="Drawer navigation" onNavigate={() => setOpen(false)}>
											<NavList.Section label="Project">
												<NavList.Item label="Overview" href="#overview" icon={<HouseIcon />} />
												<NavList.Item
													label="Cancelled link"
													href="#cancelled"
													onClick={(event) => event.preventDefault()}
												/>
												<NavList.CollapsibleGroup>
													<NavList.CollapsibleGroupTrigger label="Deploy" icon={<CubeIcon />} />
													<NavList.CollapsibleGroupPanel>
														<NavList.Item label="Deployments" href="#deployments" />
														<NavList.Item label="Workers" href="#workers" />
													</NavList.CollapsibleGroupPanel>
												</NavList.CollapsibleGroup>
												<DrilldownNavigation />
											</NavList.Section>
										</NavList.Root>
									</NavList.NavListPresentationProvider>
								</Drawer.Body>
							</Drawer.Content>
						</Drawer.Popup>
					</Drawer.Viewport>
				</Drawer.Portal>
			</Drawer.Root>
		</Box>
	);
}

const storyParts = stylex.create({
	scroller: {
		overflowY: "auto",
	},
	frame: {
		borderColor: tokens["--border"],
		borderStyle: "solid",
		borderWidth: tokens["--border-width"],
	},
	sidebarRail: {
		width: tokens["--size-sidebar-rail"],
	},
});
