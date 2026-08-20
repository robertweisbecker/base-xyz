import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import { Badge } from "@/components/badge/badge";
import { Icon, IconButton } from "@/components";
import { Text } from "@/components/text/text";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { tokens } from "@/theme/tokens.stylex";
import { Table } from "./table";

type PlaygroundArgs = {
	_caption: string;
	_checked: boolean;
	_empty: boolean;
	_numeric: boolean;
	_showFooter: boolean;
};

const meta = {
	title: "Components/Table",
	args: {
		_caption: "Deployments",
		_checked: false,
		_empty: false,
		_numeric: false,
		_showFooter: true,
	},
	argTypes: {
		_caption: { control: "text" },
		_checked: { control: "boolean" },
		_empty: { control: "boolean" },
		_numeric: { control: "boolean" },
		_showFooter: { control: "boolean" },
	},
	parameters: {
		controls: {
			include: ["_caption", "_checked", "_empty", "_numeric", "_showFooter"],
		},
	},
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
	render: ({ _caption, _checked, _empty, _numeric, _showFooter }) => (
		<ControlledTable
			key={_checked ? "checked" : "unchecked"}
			caption={<VisuallyHidden>{_caption}</VisuallyHidden>}
			checked={_checked}
			empty={_empty}
			numeric={_numeric}
			showFooter={_showFooter}
		/>
	),
};

export const States: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyParts.stack)}>
			<Example label="Normal rows" checkedRows={[]} />
			<Example label="One checked row" checkedRows={["app"]} />
			<Example label="Empty table" empty />
			<Example
				label="Visible rich caption"
				caption={
					<Text render={<span />} size="1" color="muted">
						Deployment destinations
					</Text>
				}
			/>
			<Example groupedHeaders label="Grouped headers" />
			<Example label="Semantic footer" showFooter />
		</div>
	),
};

export const Overflow: Story = {
	parameters: {
		controls: { disable: true },
	},
	render: () => (
		<div {...stylex.props(storyParts.overflowExamples)}>
			<section>
				<Text size="1" color="muted" style={storyParts.label}>
					Without scrolling
				</Text>
				<Table.Root>
					<Table.Content caption={<VisuallyHidden>Recent deployments without scrolling</VisuallyHidden>}>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>URL</Table.HeaderCell>
								<Table.HeaderCell>Status</Table.HeaderCell>
								<Table.HeaderCell>Environment</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<Table.Row>
								<Table.Cell>app.example.com</Table.Cell>
								<Table.Cell>Ready</Table.Cell>
								<Table.Cell>Production</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>preview.example.com</Table.Cell>
								<Table.Cell>Building</Table.Cell>
								<Table.Cell>Preview</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table.Content>
				</Table.Root>
			</section>

			<section>
				<Text size="1" color="muted" style={storyParts.label}>
					With horizontal scrolling
				</Text>
				<Table.Root>
					<Table.Container>
						<Table.Content
							caption={<VisuallyHidden>Recent deployments with horizontal scrolling</VisuallyHidden>}
							style={storyParts.wideTable}>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>URL</Table.HeaderCell>
									<Table.HeaderCell>Status</Table.HeaderCell>
									<Table.HeaderCell>Environment</Table.HeaderCell>
									<Table.HeaderCell>Branch</Table.HeaderCell>
									<Table.HeaderCell>Owner</Table.HeaderCell>
									<Table.HeaderCell>Region</Table.HeaderCell>
									<Table.HeaderCell numeric>Updated</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Table.Row>
									<Table.Cell>app.example.com</Table.Cell>
									<Table.Cell>Ready</Table.Cell>
									<Table.Cell>Production</Table.Cell>
									<Table.Cell>main</Table.Cell>
									<Table.Cell>Maya Chen</Table.Cell>
									<Table.Cell>Washington, D.C., USA</Table.Cell>
									<Table.Cell numeric>2 minutes ago</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>feature-auth.example.com</Table.Cell>
									<Table.Cell>Building</Table.Cell>
									<Table.Cell>Preview</Table.Cell>
									<Table.Cell>feature/authentication</Table.Cell>
									<Table.Cell>Ari Patel</Table.Cell>
									<Table.Cell>Frankfurt, Germany</Table.Cell>
									<Table.Cell numeric>12 minutes ago</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Content>
					</Table.Container>
				</Table.Root>
			</section>
		</div>
	),
};

function ControlledTable({
	caption,
	checked: initialChecked,
	empty = false,
	numeric = false,
	showFooter = false,
}: {
	caption: ReactNode;
	checked: boolean;
	empty?: boolean;
	numeric?: boolean;
	showFooter?: boolean;
}) {
	const [checkedRows, setCheckedRows] = useState<string[]>(initialChecked ? ["app"] : []);

	return (
		<ManualTable
			caption={caption}
			checkedRows={checkedRows}
			empty={empty}
			numeric={numeric}
			onCheckedRowsChange={setCheckedRows}
			showFooter={showFooter}
		/>
	);
}

function Example({
	caption,
	checkedRows = [],
	empty = false,
	groupedHeaders = false,
	label,
	showFooter = false,
}: {
	caption?: ReactNode;
	checkedRows?: string[];
	empty?: boolean;
	groupedHeaders?: boolean;
	label: string;
	showFooter?: boolean;
}) {
	return (
		<section>
			<Text size="1" color="muted" style={storyParts.label}>
				{label}
			</Text>
			<ManualTable
				caption={caption ?? <VisuallyHidden>{label}</VisuallyHidden>}
				checkedRows={checkedRows}
				empty={empty}
				groupedHeaders={groupedHeaders}
				showFooter={showFooter}
			/>
		</section>
	);
}

function ManualTable({
	caption,
	checkedRows,
	empty = false,
	groupedHeaders = false,
	numeric = false,
	onCheckedRowsChange,
	showFooter = false,
}: {
	caption: ReactNode;
	checkedRows: string[];
	empty?: boolean;
	groupedHeaders?: boolean;
	numeric?: boolean;
	onCheckedRowsChange?: (rows: string[]) => void;
	showFooter?: boolean;
}) {
	const rows = [
		{ id: "app", url: "app.example.com", status: "Ready" },
		{ id: "preview", url: "preview.example.com", status: "Building" },
	];
	const displayedRows = empty ? [] : rows;
	const allChecked = displayedRows.length > 0 && displayedRows.every((row) => checkedRows.includes(row.id));
	const someChecked = displayedRows.some((row) => checkedRows.includes(row.id)) && !allChecked;
	const updateRow = (id: string, checked: boolean) => {
		const nextRows = checked ? [...new Set([...checkedRows, id])] : checkedRows.filter((rowId) => rowId !== id);
		onCheckedRowsChange?.(nextRows);
	};

	return (
		<Table.Root>
			<Table.Container>
				<Table.Content caption={caption}>
					<Table.Header>
						{groupedHeaders ? (
							<>
								<Table.Row>
									<Table.HeaderCheckbox
										rowSpan={2}
										checked={allChecked}
										disabled={displayedRows.length === 0}
										indeterminate={someChecked}
										label="Select all deployments"
										onCheckedChange={(checked) =>
											onCheckedRowsChange?.(checked ? displayedRows.map((row) => row.id) : [])
										}
									/>
									<Table.HeaderCell colSpan={2} scope="colgroup">
										Deployment details
									</Table.HeaderCell>
									<Table.HeaderAction rowSpan={2}>Row actions</Table.HeaderAction>
								</Table.Row>
								<Table.Row>
									<Table.HeaderCell>URL</Table.HeaderCell>
									<Table.HeaderCell numeric={numeric}>Status</Table.HeaderCell>
								</Table.Row>
							</>
						) : (
							<Table.Row>
								<Table.HeaderCheckbox
									checked={allChecked}
									disabled={displayedRows.length === 0}
									indeterminate={someChecked}
									label="Select all deployments"
									onCheckedChange={(checked) =>
										onCheckedRowsChange?.(checked ? displayedRows.map((row) => row.id) : [])
									}
								/>
								<Table.HeaderCell>Name</Table.HeaderCell>
								<Table.HeaderCell numeric={numeric}>Status</Table.HeaderCell>
								<Table.HeaderAction>
									<VisuallyHidden>Row actions</VisuallyHidden>
								</Table.HeaderAction>
							</Table.Row>
						)}
					</Table.Header>
					<Table.Body>
						{displayedRows.length === 0 ? (
							<Table.Empty colSpan={4}>No deployments.</Table.Empty>
						) : (
							displayedRows.map((row) => (
								<Table.Row key={row.id} checked={checkedRows.includes(row.id)}>
									<Table.CellCheckbox
										checked={checkedRows.includes(row.id)}
										label={`Select ${row.url}`}
										onCheckedChange={(checked) => updateRow(row.id, checked)}
									/>
									<Table.Cell>{row.url}</Table.Cell>
									<Table.Cell numeric={numeric}>
										<Badge variant="subtle" hue={row.status === "Ready" ? "accent" : "neutral"}>
											{row.status}
										</Badge>
									</Table.Cell>
									<Table.CellAction>
										<IconButton
											icon={<Icon.More aria-hidden />}
											label={`Open actions for ${row.url}`}
											tooltip={false}
											variant="ghost"
										/>
									</Table.CellAction>
								</Table.Row>
							))
						)}
					</Table.Body>
					{showFooter ? (
						<Table.Footer>
							<Table.Row>
								<Table.Cell colSpan={4}>{`${displayedRows.length} deployments`}</Table.Cell>
							</Table.Row>
						</Table.Footer>
					) : null}
				</Table.Content>
			</Table.Container>
		</Table.Root>
	);
}

const storyParts = stylex.create({
	stack: {
		gap: tokens["--space-6"],
		display: "flex",
		flexDirection: "column",
	},
	label: {
		marginBlockEnd: tokens["--space-2"],
	},
	overflowExamples: {
		gap: tokens["--space-6"],
		display: "flex",
		flexDirection: "column",
		maxWidth: "42rem",
		width: "100%",
	},
	wideTable: {
		minWidth: "64rem",
	},
});
