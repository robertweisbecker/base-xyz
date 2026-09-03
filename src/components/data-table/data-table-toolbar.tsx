import * as stylex from "@stylexjs/stylex";
import { DataTableFilters } from "./data-table-filters";
import { DataTableColumnVisibility } from "./data-table-column-visibility";
import { DataTableSearch } from "./data-table-search";
import { dataTableParts } from "./data-table.stylex";
import type { DataTableColumn, DataTableFeatures, DataTableFilter } from "./data-table-model";
import type { ReactNode } from "react";
import type { RowData, Table as TableInstance } from "@tanstack/react-table";

export function DataTableToolbar<TData extends RowData>({
	filterColumnId,
	filterPlaceholder,
	filters,
	getColumnLabel,
	globalFilter,
	table,
	toolbarEndSlot,
}: {
	filterColumnId?: string;
	filterPlaceholder: string;
	filters?: DataTableFilter[];
	getColumnLabel: (column: DataTableColumn<TData>) => ReactNode;
	globalFilter: string;
	table: TableInstance<DataTableFeatures, TData>;
	toolbarEndSlot?: ReactNode;
}) {
	return (
		<div {...stylex.props(dataTableParts.toolbar)}>
			<DataTableColumnVisibility getColumnLabel={getColumnLabel} table={table} />
			<DataTableSearch
				filterColumnId={filterColumnId}
				filterPlaceholder={filterPlaceholder}
				globalFilter={globalFilter}
				table={table}
			/>
			<div {...stylex.props(dataTableParts.toolbarActions)}>
				<DataTableFilters filters={filters} table={table} />
				{toolbarEndSlot}
			</div>
		</div>
	);
}
