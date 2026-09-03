import * as stylex from "@stylexjs/stylex";
import { Fragment, type ReactNode } from "react";
import { Table } from "@/components/table/table";
import { dataTableParts } from "./data-table.stylex";
import {
	getDataTableColumnRole,
	isNumericColumn,
	type DataTableFeatures,
	type DataTableRow,
} from "./data-table-model";
import { flexRender, type RowData, type Table as TableInstance } from "@tanstack/react-table";

export function DataTableBody<TData extends RowData>({
	emptyLabel,
	renderExpandedRow,
	table,
}: {
	emptyLabel: ReactNode;
	renderExpandedRow?: (row: DataTableRow<TData>) => ReactNode;
	table: TableInstance<DataTableFeatures, TData>;
}) {
	const visibleRows = table.getRowModel().rows;

	return (
		<Table.Body>
			{visibleRows.length > 0 ? (
				visibleRows.map((row) => (
					<DataTableBodyRow key={row.id} renderExpandedRow={renderExpandedRow} row={row} />
				))
			) : (
				<Table.Empty colSpan={Math.max(1, table.getVisibleLeafColumns().length)}>
					{emptyLabel}
				</Table.Empty>
			)}
		</Table.Body>
	);
}

function DataTableBodyRow<TData extends RowData>({
	renderExpandedRow,
	row,
}: {
	renderExpandedRow?: (row: DataTableRow<TData>) => ReactNode;
	row: DataTableRow<TData>;
}) {
	return (
		<Fragment>
			<Table.Row data-expanded={row.getIsExpanded() ? "" : undefined} checked={row.getIsSelected()}>
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
				<Table.Row key={`${row.id}-expanded`} {...stylex.props(dataTableParts.expandedRow)}>
					<Table.Cell
						colSpan={Math.max(1, row.getVisibleCells().length)}
						{...stylex.props(dataTableParts.expandedCell)}
					>
						{renderExpandedRow(row)}
					</Table.Cell>
				</Table.Row>
			) : null}
		</Fragment>
	);
}
