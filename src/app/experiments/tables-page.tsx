import {
	Avatar,
	Badge,
	Button,
	DataTable,
	Stack,
	Table,
	Text,
	VisuallyHidden,
	type DataTableColumnDef,
	type DataTableFilter,
} from "@/components";
import { ExperimentPage, ExperimentSection } from "./experiment-page";

type Deployment = {
	environment: "Preview" | "Production" | "Staging";
	id: string;
	owner: string;
	status: "Building" | "Deployed" | "Failed";
	updated: string;
	url: string;
};

const deployments: Deployment[] = [
	{
		environment: "Production",
		id: "dep_3gt9m",
		owner: "Maya Chen",
		status: "Deployed",
		updated: "2 min ago",
		url: "app.example.com",
	},
	{
		environment: "Preview",
		id: "dep_8b21x",
		owner: "Ari Patel",
		status: "Building",
		updated: "12 min ago",
		url: "feature-auth.example.com",
	},
	{
		environment: "Staging",
		id: "dep_4yf72",
		owner: "Sam Rivera",
		status: "Failed",
		updated: "24 min ago",
		url: "staging.example.com",
	},
	{
		environment: "Preview",
		id: "dep_9km30",
		owner: "Noah Kim",
		status: "Deployed",
		updated: "41 min ago",
		url: "checkout-copy.example.com",
	},
];

const columns: Array<DataTableColumnDef<Deployment>> = [
	{
		accessorKey: "url",
		header: "URL",
		cell: ({ row }) => (
			<Text render={<span />} fontWeight="medium" size="2">
				{row.original.url}
			</Text>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => <DeploymentStatus status={row.original.status} />,
	},
	{
		accessorKey: "environment",
		header: "Environment",
	},
	{
		accessorKey: "owner",
		header: "Owner",
		cell: ({ row }) => (
			<Stack align="center" gap={2} orientation="horizontal" wrap="nowrap">
				<Avatar name={row.original.owner} size={5} />
				<Text color="muted" render={<span />} size="2">
					{row.original.owner}
				</Text>
			</Stack>
		),
	},
	{
		accessorKey: "updated",
		header: "Updated",
		numeric: true,
		cell: ({ row }) => (
			<Text color="muted" render={<span />} size="1">
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

export function TablesPage() {
	return (
		<ExperimentPage
			description="Semantic and stateful tables exercised with realistic deployment data, filters, selection, and overflow."
			title="Tables"
		>
			<ExperimentSection
				description="The stateful table combines filtering, sorting, selection, column controls, and row actions."
				title="Recent deployments"
			>
				<DataTable
					columns={columns}
					data={deployments}
					filterColumnId="url"
					filterPlaceholder="Search deployment URLs…"
					filters={filters}
					getRowActions={(row) => [
						{ label: "View deployment" },
						{ label: "Redeploy", disabled: row.original.status === "Building" },
						{ label: "Delete deployment", variant: "danger" },
					]}
					getRowId={(deployment) => deployment.id}
					rowSelection
					showExpandColumn={false}
					toolbarEndSlot={<Button>Create deployment</Button>}
				/>
			</ExperimentSection>

			<ExperimentSection
				description="The presentation-only table keeps native table structure when the application already owns the data state."
				title="Build queue"
			>
				<Table.Root>
					<Table.Container>
						<Table.Content caption={<VisuallyHidden>Queued and active builds</VisuallyHidden>}>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Commit</Table.HeaderCell>
									<Table.HeaderCell>Branch</Table.HeaderCell>
									<Table.HeaderCell>Status</Table.HeaderCell>
									<Table.HeaderCell numeric>Duration</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Table.Row>
									<Table.Cell>8bc21ea</Table.Cell>
									<Table.Cell>codex/experiment-routes</Table.Cell>
									<Table.Cell>
										<Badge hue="accent" variant="subtle">
											Running
										</Badge>
									</Table.Cell>
									<Table.Cell numeric>1m 42s</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>3gt9m11</Table.Cell>
									<Table.Cell>main</Table.Cell>
									<Table.Cell>
										<Badge hue="neutral" variant="subtle">
											Queued
										</Badge>
									</Table.Cell>
									<Table.Cell numeric>—</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Content>
					</Table.Container>
				</Table.Root>
			</ExperimentSection>
		</ExperimentPage>
	);
}

function DeploymentStatus({ status }: { status: Deployment["status"] }) {
	const hue = status === "Deployed" ? "success" : status === "Failed" ? "error" : "warning";
	return (
		<Badge hue={hue} size="sm" variant="subtle">
			{status}
		</Badge>
	);
}
