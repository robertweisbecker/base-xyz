import type { Meta, StoryObj } from "@storybook/react-vite";
import x from "@stylexjs/atoms";
import { Icon } from "@/components/icons";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { PageHeader } from "@/blocks/page-header/page-header";
import { Badge } from "@/components/badge/badge";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { Breadcrumbs } from "@/components/breadcrumbs/breadcrumbs";
import { Kbd } from "@/components/kbd/kbd";
import { Text } from "@/components/text/text";
import { Code } from "@/components/code/code";
import { tokens } from "@/theme/tokens.stylex";
import {
	DataTable,
	type DataTableColumnDef,
	type DataTableFilter,
	type DataTableProps,
} from "./data-table";
import { Loader } from "@/components/loader";
import { Button } from "@/components/button";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { XCircleIcon } from "@phosphor-icons/react/dist/csr/XCircle";
import {
	ArrowClockwiseIcon,
	CopyIcon,
	CubeFocusIcon,
	GearFineIcon,
	ScrollIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { Avatar } from "@/components/avatar/avatar";
import { Stack } from "@/components/layout/layout";

type Deployment = {
	id: string;
	environment: "Production" | "Preview" | "Staging";
	owner: string;
	status: "Deployed" | "Building" | "Failed";
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
		status: "Deployed",
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
		status: "Deployed",
		updated: "41 minutes ago",
		url: "checkout-copy.example.com",
	},
	{
		id: "dep_1rx64",
		environment: "Production",
		owner: "Iris Wu",
		status: "Deployed",
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
				title: "Find a deployment",
				description: "Search the deployment table by URL or owner.",
				group: "Deployments",
				keywords: "find filter search url owner",
				shortcut: "/",
				icon: <CubeFocusIcon aria-hidden />,
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
				{/* {row.getCanExpand() ? (
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
				) : null} */}
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
		cell: ({ row }) => (
			<Text size="2" render={<span />} wrap="truncate">
				{row.original.environment}
			</Text>
		),
	},
	{
		accessorKey: "owner",
		header: "Owner",
		cell: ({ row }) => (
			<>
				<Stack gap={2} align="center" orientation="horizontal" wrap="nowrap">
					<Avatar name={row.original.owner} size={5} />
					<Text size="2" color="muted" render={<span />} wrap="truncate">
						{row.original.owner}
					</Text>
				</Stack>
			</>
		),
	},
	{
		accessorKey: "updated",
		header: "Updated",
		enableHiding: true,
		numeric: true,
		cell: ({ row }) => (
			<Text size="1" color="muted" render={<span />} wrap="truncate">
				{row.original.updated}
			</Text>
		),
	},
];

const filters: DataTableFilter[] = [
	{
		columnId: "status",
		label: "Status",
		options: ["Deployed", "Building", "Failed"].map((value) => ({ label: value, value })),
	},
	{
		columnId: "environment",
		label: "Environment",
		options: ["Production", "Preview", "Staging"].map((value) => ({ label: value, value })),
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
		xstyle: { table: { disable: true } },
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
		<Stack gap={5} xstyle={storyParts.composition}>
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
			showExpandColumn={true}
			renderExpandedRow={(row) => (
				<Stack gap={1}>
					<Text size="2" color="muted">
						Deployment <Code>{row.original.id}</Code> was last updated by{" "}
						<Text size="2" fontWeight="medium" render={<span />}>
							{row.original.owner}
						</Text>
						.
					</Text>
					<Text size="1" color="muted">
						Target:{" "}
						<Text size="1" fontWeight="medium" render={<span />}>
							{row.original.environment}
						</Text>{" "}
						∙ Hostname:{" "}
						<Text size="1" fontWeight="medium" render={<span />}>
							{row.original.url}
						</Text>{" "}
					</Text>
				</Stack>
			)}
			getRowActions={(row) => [
				{ label: "View deployment", icon: <CubeFocusIcon weight="duotone" /> },
				{
					label: "Copy deployment ID",
					icon: <CopyIcon weight="duotone" />,
					onSelect: () => navigator.clipboard?.writeText(row.original.id),
				},
				{
					label: "Redeploy",
					icon: <ArrowClockwiseIcon />,
					disabled: row.original.status === "Building",
				},
				{ label: "Delete deployment", icon: <TrashIcon weight="duotone" />, variant: "danger" },
			]}
		/>
	);
}

function DeploymentCommandPalette() {
	return (
		<CommandPalette.Root
			shortcut
			trigger={
				<CommandPalette.Trigger size="sm" xstyle={x.paddingInlineEnd(tokens["--space-2"])}>
					Actions
				</CommandPalette.Trigger>
			}
			items={commandGroups}
			itemToStringValue={commandToStringValue}
		>
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
									endSlot={!command.shortcut ? <CaretRightIcon aria-hidden /> : undefined}
								>
									{command.title}
								</CommandPalette.Item>
							)}
						</CommandPalette.Items>
					</CommandPalette.Group>
				)}
			</CommandPalette.List>
			<CommandPalette.Empty />
			<CommandPalette.Footer>
				<Stack align="center" gap={2} orientation="horizontal">
					<Kbd size="sm">↑↓</Kbd>
					Navigate
				</Stack>
				<Stack align="center" gap={2} orientation="horizontal">
					<Kbd size="sm">↵</Kbd>
					Select
				</Stack>
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
		<Badge hue="success" startSlot={<Icon.Dot aria-hidden />}>
			Deployed
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
});
