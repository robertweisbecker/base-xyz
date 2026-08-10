import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "@/components/icons";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { PageHeader } from "@/blocks/page-header/page-header";
import { Badge } from "@/components/badge/badge";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { Stack } from "@/components/layout/layout";
import { Text } from "@/components/text/text";
import { tokens } from "@/theme/tokens.stylex";
import { DataTable, type DataTableColumnDef, type DataTableFilter, type DataTableProps } from "./data-table";
import { Loader } from "@/components/loader";
import { Button, IconButton } from "@/components/button";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { XCircleIcon } from "@phosphor-icons/react/dist/csr/XCircle";
import { GearFineIcon, ScrollIcon } from "@phosphor-icons/react";

type Deployment = {
	id: string;
	environment: "Production" | "Preview" | "Staging";
	owner: string;
	status: "Ready" | "Building" | "Failed";
	updated: string;
	url: string;
};

type DeploymentCommand = {
	description: string;
	group: string;
	icon: ReactNode;
	id: string;
	keywords: string;
	shortcut?: string;
	title: string;
};

type DeploymentCommandGroup = {
	id: string;
	items: DeploymentCommand[];
	label: string;
};

const deployments: Deployment[] = [
	{
		id: "dep_3gt9m",
		environment: "Production",
		owner: "Maya Chen",
		status: "Ready",
		updated: "2 minutes ago",
		url: "app.example.com",
	},
	{
		id: "dep_8b21x",
		environment: "Preview",
		owner: "Ari Patel",
		status: "Building",
		updated: "12 minutes ago",
		url: "feature-auth.example.com",
	},
	{
		id: "dep_4yf72",
		environment: "Staging",
		owner: "Sam Rivera",
		status: "Failed",
		updated: "24 minutes ago",
		url: "staging.example.com",
	},
	{
		id: "dep_9km30",
		environment: "Preview",
		owner: "Noah Kim",
		status: "Ready",
		updated: "41 minutes ago",
		url: "checkout-copy.example.com",
	},
	{
		id: "dep_1rx64",
		environment: "Production",
		owner: "Iris Wu",
		status: "Ready",
		updated: "1 minute ago",
		url: "docs.example.com",
	},
];

const commandGroups: DeploymentCommandGroup[] = [
	{
		id: "deployments",
		label: "Deployments",
		items: [
			{
				id: "search-deployments",
				title: "Search deployments",
				description: "Filter the deployment table by URL or owner.",
				group: "Deployments",
				keywords: "find filter url owner",
				shortcut: "/",
				icon: <CaretRightIcon aria-hidden />,
			},
			{
				id: "new-deployment",
				title: "Create deployment",
				description: "Start a production or preview deployment.",
				group: "Deployments",
				keywords: "new create publish deploy",
				shortcut: "N",
				icon: <CheckCircleIcon aria-hidden />,
			},
			{
				id: "retry-failed",
				title: "Retry failed deployments",
				description: "Queue a redeploy for every failed target.",
				group: "Maintenance",
				keywords: "failed retry rebuild",
				icon: <XCircleIcon aria-hidden />,
			},
		],
	},
	{
		id: "admin",
		label: "Admin",
		items: [
			{
				id: "view-logs",
				title: "View logs",
				description: "View the logs for the selected deployment.",
				group: "Admin",
				keywords: "logs view",
				icon: <ScrollIcon aria-hidden />,
			},
			{
				id: "open-settings",
				title: "Deployment settings",
				description: "Manage environments and visibility defaults.",
				group: "Maintenance",
				keywords: "settings environments visibility",
				icon: <GearFineIcon aria-hidden />,
			},
		],
	},
];

const columns: Array<DataTableColumnDef<Deployment>> = [
	{
		accessorKey: "url",
		header: "URL",
		cell: ({ row }) => (
			<span {...stylex.props(storyParts.urlCell)}>
				{row.getCanExpand() ? (
					<IconButton
						type="button"
						variant="ghost"
						size="xs"
						aria-expanded={row.getIsExpanded()}
						label={`${row.getIsExpanded() ? "Collapse" : "Expand"} ${row.original.url}`}
						tooltip={false}
						onClick={row.getToggleExpandedHandler()}
						icon={row.getIsExpanded() ? <CaretDownIcon aria-hidden /> : <CaretRightIcon aria-hidden />}
					/>
				) : null}
				<span {...stylex.props(storyParts.url)}>{row.original.url}</span>
			</span>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => <StatusBadge status={row.original.status} />,
	},
	{
		accessorKey: "environment",
		header: "Environment",
	},
	{
		accessorKey: "owner",
		header: "Owner",
	},
	{
		accessorKey: "updated",
		header: "Updated",
		enableHiding: true,
	},
];

const filters: DataTableFilter[] = [
	{
		columnId: "status",
		label: "Status",
		options: [
			{ label: "Ready", value: "Ready" },
			{ label: "Building", value: "Building" },
			{ label: "Failed", value: "Failed" },
		],
	},
	{
		columnId: "environment",
		label: "Environment",
		options: [
			{ label: "Production", value: "Production" },
			{ label: "Preview", value: "Preview" },
			{ label: "Staging", value: "Staging" },
		],
	},
];

const meta = {
	title: "Components/Data table",
	component: DataTable,
	args: {
		filterColumnId: "url",
		filterPlaceholder: "Search by URL…",
		rowSelection: true,
	},
	argTypes: {
		columns: { table: { disable: true } },
		data: { table: { disable: true } },
		emptyLabel: { control: "text" },
		filterColumnId: {
			control: "select",
			options: ["url", "owner", "environment", "status"],
		},
		filters: { table: { disable: true } },
		filterPlaceholder: { control: "text" },
		getColumnLabel: { table: { disable: true } },
		getRowActions: { table: { disable: true } },
		getRowCanExpand: { table: { disable: true } },
		getRowId: { table: { disable: true } },
		initialColumnVisibility: { control: "object" },
		renderExpandedRow: { table: { disable: true } },
		showExpandColumn: { table: { disable: true } },
		style: { table: { disable: true } },
		toolbarEndSlot: { table: { disable: true } },
	},
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj;

export const Playground: Story = {
	render: (args: Partial<DataTableProps<Deployment>>) => <DeploymentTable {...args} />,
};

export const Composition: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<Stack gap={5} style={storyParts.composition}>
			<PageHeader
				breadcrumbs={
					<Breadcrumbs.Root size="sm">
						<Breadcrumbs.Link href="#">Repositories</Breadcrumbs.Link>
						<Breadcrumbs.Separator />
						<Breadcrumbs.Current>base-stylex-lab</Breadcrumbs.Current>
					</Breadcrumbs.Root>
				}
				title="Deployments"
				description="Monitor production and preview releases across environments."
				actions={
					<>
						<DeploymentCommandPalette />
						<Button size="sm">Create deployment</Button>
					</>
				}
			/>
			<DeploymentTable
				filterColumnId="url"
				filterPlaceholder="Search by URL…"
				initialColumnVisibility={{ updated: true }}
				rowSelection
			/>
		</Stack>
	),
};

function DeploymentTable(args: Partial<DataTableProps<Deployment>>) {
	return (
		<DataTable
			{...args}
			columns={columns}
			data={deployments}
			filters={filters}
			getRowId={(deployment) => deployment.id}
			initialColumnVisibility={args.initialColumnVisibility ?? { updated: true }}
			showExpandColumn={false}
			renderExpandedRow={(row) => (
				<div {...stylex.props(storyParts.details)}>
					<Text size="2" color="muted">
						Deployment {row.original.id} was last updated by {row.original.owner}.
					</Text>
					<Text size="2" color="muted">
						Target: {row.original.environment} · Hostname: {row.original.url}
					</Text>
				</div>
			)}
			getRowActions={(row) => [
				{ label: "View deployment" },
				{ label: "Copy deployment ID", onSelect: () => navigator.clipboard?.writeText(row.original.id) },
				{ label: "Redeploy", disabled: row.original.status === "Building" },
				{ label: "Delete deployment", variant: "danger" },
			]}
		/>
	);
}

function DeploymentCommandPalette() {
	return (
		<CommandPalette.Root
			shortcut
			trigger={
				<CommandPalette.Trigger size="sm" pe={2}>
					Actions
				</CommandPalette.Trigger>
			}
			items={commandGroups}
			itemToStringValue={commandToStringValue}>
			<CommandPalette.Input placeholder="Search deployments and actions…" />
			<CommandPalette.List>
				{(group: DeploymentCommandGroup) => (
					<CommandPalette.Group key={group.id} items={group.items}>
						<CommandPalette.GroupLabel>{group.label}</CommandPalette.GroupLabel>
						<CommandPalette.Items>
							{(command: DeploymentCommand) => (
								<CommandPalette.Item
									key={command.id}
									value={command}
									startSlot={command.icon}
									description={command.description}
									shortcut={command.shortcut}
									endSlot={!command.shortcut ? <CaretRightIcon aria-hidden /> : undefined}>
									{command.title}
								</CommandPalette.Item>
							)}
						</CommandPalette.Items>
					</CommandPalette.Group>
				)}
			</CommandPalette.List>
			<CommandPalette.Empty />
			<CommandPalette.Footer>
				<span {...stylex.props(storyParts.footerHint)}>
					<CommandPalette.Shortcut>↑↓</CommandPalette.Shortcut>
					Navigate
				</span>
				<span {...stylex.props(storyParts.footerHint)}>
					<CommandPalette.Shortcut>↵</CommandPalette.Shortcut>
					Select
				</span>
			</CommandPalette.Footer>
		</CommandPalette.Root>
	);
}

function commandToStringValue(item: DeploymentCommand | DeploymentCommandGroup) {
	if ("title" in item) {
		return item.title;
	}
	return item.label;
}

function StatusBadge({ status }: { status: Deployment["status"] }) {
	if (status === "Failed") {
		return (
			<Badge hue="error" startSlot={<XCircleIcon aria-hidden weight="fill" />}>
				Failed
			</Badge>
		);
	}

	if (status === "Building") {
		return (
			<Badge hue="accent" variant="elevated" startSlot={<Loader />}>
				Building
			</Badge>
		);
	}

	return (
		<Badge hue="success" startSlot={<Icon.Checkmark aria-hidden />}>
			Ready
		</Badge>
	);
}

const storyParts = stylex.create({
	composition: {
		maxWidth: "72rem",
		width: "100%",
	},
	urlCell: {
		gap: tokens["--space-1"],
		alignItems: "center",
		display: "inline-flex",
		minWidth: 0,
	},
	url: {
		fontWeight: tokens["--font-weight-medium"],
	},
	details: {
		gap: tokens["--space-1"],
		display: "flex",
		flexDirection: "column",
	},
	footerHint: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "inline-flex",
	},
});
