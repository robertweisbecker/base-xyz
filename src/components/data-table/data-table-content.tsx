import * as stylex from "@stylexjs/stylex";
import { type ReactNode } from "react";
import { Table } from "@/components/table/table";
import { typescaleStyles } from "@/components/text/text.stylex";
import { DataTableBody } from "./data-table-body";
import { DataTableHeader } from "./data-table-header";
import { dataTableParts } from "./data-table.stylex";
import type { DataTableFeatures, DataTableRow } from "./data-table-model";
import type { RowData, Table as TableInstance } from "@tanstack/react-table";

export function DataTableContent<TData extends RowData>({
	emptyLabel,
	renderExpandedRow,
	table,
}: {
	emptyLabel: ReactNode;
	renderExpandedRow?: (row: DataTableRow<TData>) => ReactNode;
	table: TableInstance<DataTableFeatures, TData>;
}) {
	const selectedCount = table.getFilteredSelectedRowModel().rows.length;
	const filteredCount = table.getFilteredRowModel().rows.length;

	return (
		<>
			<Table.Container>
				<Table.Content>
					<DataTableHeader table={table} />
					<DataTableBody
						emptyLabel={emptyLabel}
						renderExpandedRow={renderExpandedRow}
						table={table}
					/>
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
