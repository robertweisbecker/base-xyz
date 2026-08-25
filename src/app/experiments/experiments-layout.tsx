import { Link as RouterLink, Outlet, useRouterState } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import { NavList, Sidebar, type NavListIndentLevel } from "@/components";
import { breakpoints } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { experimentNavigationGroups, type ExperimentNavigationPath } from "./experiment-navigation";

export function ExperimentsLayout() {
	const [collapsed, setCollapsed] = useState(false);
	const pathname = useRouterState({ select: (state) => state.location.pathname });

	return (
		<Sidebar.Root collapsed={collapsed} onCollapsedChange={setCollapsed}>
			<div {...stylex.props(styles.shell, collapsed && styles.shellCollapsed)}>
				<Sidebar.Panel xstyle={[styles.sidebar, !collapsed && styles.sidebarExpanded]}>
					<Sidebar.Header endSlot={<Sidebar.Trigger />}>
						<Sidebar.Title>Experiments</Sidebar.Title>
					</Sidebar.Header>
					<Sidebar.Content>
						<NavList.Root aria-label="Experiments">
							{experimentNavigationGroups.map((group) => (
								<NavList.Section key={group.label} label={group.label} visuallyHideLabel={collapsed}>
									<ExperimentNavItem
										current={pathname === group.to}
										icon={group.icon}
										label={group.label}
										to={group.to}
									/>
									{group.items.map((item) => (
										<ExperimentNavItem
											key={item.to}
											current={pathname === item.to}
											icon={item.icon}
											indentLevel={1}
											label={item.label}
											to={item.to}
										/>
									))}
								</NavList.Section>
							))}
						</NavList.Root>
					</Sidebar.Content>
				</Sidebar.Panel>
				<main id="experiment-content" {...stylex.props(styles.content)}>
					<Outlet />
				</main>
			</div>
		</Sidebar.Root>
	);
}

function ExperimentNavItem({
	current,
	icon,
	indentLevel,
	label,
	to,
}: {
	current: boolean;
	icon: ReactNode;
	indentLevel?: NavListIndentLevel;
	label: string;
	to: ExperimentNavigationPath;
}) {
	return (
		<NavList.Item
			current={current ? "page" : false}
			icon={icon}
			indentLevel={indentLevel}
			label={label}
			render={<RouterLink to={to} search={true} />}
		/>
	);
}

const styles = stylex.create({
	shell: {
		display: "grid",
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[breakpoints.md]: `${tokens["--size-sidebar"]} minmax(0, 1fr)`,
		},
		minHeight: `calc(100svh - ${tokens["--size-navbar-height"]})`,
	},
	shellCollapsed: {
		gridTemplateColumns: {
			default: "minmax(0, 1fr)",
			[breakpoints.md]: `${tokens["--size-sidebar-rail"]} minmax(0, 1fr)`,
		},
	},
	sidebar: {
		blockSize: {
			default: "auto",
			[breakpoints.md]: `calc(100svh - ${tokens["--size-navbar-height"]})`,
		},
		position: {
			default: "static",
			[breakpoints.md]: "sticky",
		},
		top: {
			default: "auto",
			[breakpoints.md]: tokens["--size-navbar-height"],
		},
	},
	sidebarExpanded: {
		inlineSize: {
			default: "100%",
			[breakpoints.md]: tokens["--size-sidebar"],
		},
	},
	content: {
		marginInline: "auto",
		paddingInline: tokens["--space-4"],
		maxWidth: "80rem",
		minWidth: 0,
		width: "100%",
	},
});
