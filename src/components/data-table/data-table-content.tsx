import { ArrowsDownUpIcon, SortAscendingIcon, SortDescendingIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { Fragment, type ReactNode } from "react";
import { Button } from "@/components/button/button";
import { Table } from "@/components/table/table";
import { typescaleStyles } from "@/components/text/text.stylex";
import { dataTableParts } from "./data-table.stylex";
import {
	getAriaSort,
	getDataTableColumnRole,
	isNumericColumn,
	type DataTableColumn,
	type DataTableFeatures,
	type DataTableRow,
} from "./data-table-model";
import {
	flexRender,
	type Header,
	type RowData,
	type Table as TableInstance,
} from "@tanstack/react-table";

export function DataTableContent<TData extends RowData>({
	emptyLabel,
	renderExpandedRow,
	table,
}: {
	emptyLabel: ReactNode;
	renderExpandedRow?: (row: DataTableRow<TData>) => ReactNode;
	table: TableInstance<DataTableFeatures, TData>;
}) {
	const visibleRows = table.getRowModel().rows;
	const selectedCount = table.getFilteredSelectedRowModel().rows.length;
	const filteredCount = table.getFilteredRowModel().rows.length;

	return (
		<>
			<Table.Container>
				<Table.Content>
					<Table.Header>
						{table.getHeaderGroups().map((headerGroup) => (
							<Table.Row key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const columnRole = getDataTableColumnRole(header.column);

									if (columnRole === "selection") {
										return (
											<Table.HeaderCheckbox
												key={header.id}
												colSpan={header.colSpan}
												scope={header.colSpan > 1 ? "colgroup" : "col"}
												checked={table.getIsAllRowsSelected()}
												indeterminate={
													table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
												}
												label="Select all rows"
												onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
											/>
										);
									}

									if (columnRole === "action") {
										return (
											<Table.HeaderAction
												key={header.id}
												colSpan={header.colSpan}
												scope={header.colSpan > 1 ? "colgroup" : "col"}
											>
												{header.isPlaceholder
													? null
													: flexRender(header.column.columnDef.header, header.getContext())}
											</Table.HeaderAction>
										);
									}

									const numeric = isNumericColumn(header.column);
									const content = header.isPlaceholder ? null : (
										<HeaderContent column={header.column} header={header} numeric={numeric} />
									);

									return (
										<Table.HeaderCell
											key={header.id}
											colSpan={header.colSpan}
											scope={header.colSpan > 1 ? "colgroup" : "col"}
											aria-sort={getAriaSort(header.column)}
											numeric={numeric}
										>
											{content}
										</Table.HeaderCell>
									);
								})}
							</Table.Row>
						))}
					</Table.Header>
					<Table.Body>
						{visibleRows.length > 0 ? (
							visibleRows.map((row) => (
								<Fragment key={row.id}>
									<Table.Row
										data-expanded={row.getIsExpanded() ? "" : undefined}
										checked={row.getIsSelected()}
									>
										{row.getVisibleCells().map((cell) => {
											const columnRole = getDataTableColumnRole(cell.column);

											if (columnRole === "selection") {
												return (
													<Table.CellCheckbox
														key={cell.id}
														checked={row.getIsSelected()}
														disabled={!row.getCanSelect()}
														label={`Select row ${row.index + 1}`}
														onCheckedChange={(checked) => row.toggleSelected(checked)}
													/>
												);
											}

											const content = flexRender(cell.column.columnDef.cell, cell.getContext());

											if (columnRole === "action") {
												return <Table.CellAction key={cell.id}>{content}</Table.CellAction>;
											}

											return (
												<Table.Cell key={cell.id} numeric={isNumericColumn(cell.column)}>
													{content}
												</Table.Cell>
											);
										})}
									</Table.Row>
									{renderExpandedRow && row.getIsExpanded() ? (
										<Table.Row
											key={`${row.id}-expanded`}
											{...stylex.props(dataTableParts.expandedRow)}
										>
											<Table.Cell
												colSpan={Math.max(1, row.getVisibleCells().length)}
												{...stylex.props(dataTableParts.expandedCell)}
											>
												{renderExpandedRow(row)}
											</Table.Cell>
										</Table.Row>
									) : null}
								</Fragment>
							))
						) : (
							<Table.Empty colSpan={Math.max(1, table.getVisibleLeafColumns().length)}>
								{emptyLabel}
							</Table.Empty>
						)}
					</Table.Body>
				</Table.Content>
			</Table.Container>

			<div {...stylex.props(dataTableParts.metadata, typescaleStyles["1"])}>
				<span>
					{selectedCount} of {filteredCount} row(s) selected.
				</span>
				<span>{table.getVisibleLeafColumns().length} column(s) visible.</span>
			</div>
		</>
	);
}

function HeaderContent<TData extends RowData>({
	column,
	header,
	numeric,
}: {
	column: DataTableColumn<TData>;
	header: Header<DataTableFeatures, TData, unknown>;
	numeric: boolean;
}) {
	const content = flexRender(column.columnDef.header, header.getContext());
	const sorted = column.getIsSorted();

	if (!column.getCanSort()) {
		return <span {...stylex.props(dataTableParts.headerLabel)}>{content}</span>;
	}

	return (
		<span {...stylex.props(dataTableParts.headerContent)}>
			<Button
				endSlot={getSortIcon(sorted)}
				aria-label={getSortLabel(content, sorted)}
				variant="plain"
				ms={numeric ? undefined : -2}
				me={numeric ? -2 : undefined}
				size="xs"
				onClick={() => column.toggleSorting(sorted === "asc")}
			>
				<span {...stylex.props(dataTableParts.headerLabel)}>{content}</span>
			</Button>
		</span>
	);
}

function getSortIcon(sorted: false | "asc" | "desc") {
	if (sorted === "asc") {
		return <SortAscendingIcon aria-hidden />;
	}
	if (sorted === "desc") {
		return <SortDescendingIcon aria-hidden />;
	}
	return <ArrowsDownUpIcon aria-hidden mirrored={true} />;
}

function getSortLabel(content: ReactNode, sorted: false | "asc" | "desc") {
	const label = typeof content === "string" ? content : "column";
	if (sorted === "asc") {
		return `Sort ${label} descending`;
	}
	if (sorted === "desc") {
		return `Clear ${label} sorting`;
	}
	return `Sort ${label} ascending`;
}
