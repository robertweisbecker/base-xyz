import { useState } from "react";
import {
	useTable,
	type ColumnVisibilityState,
	type ExpandedState,
	type RowData,
	type RowSelectionState,
	type SortingState,
} from "@tanstack/react-table";
import { Table } from "@/components/table/table";
import { useDataTableColumns } from "./data-table-columns";
import { DataTableContent } from "./data-table-content";
import { DataTableToolbar } from "./data-table-toolbar";
import {
	dataTableFeatures,
	getDefaultColumnLabel,
	type DataTableFeatures,
	type DataTableProps,
} from "./data-table-model";

export type {
	DataTableColumn,
	DataTableColumnDef,
	DataTableFilter,
	DataTableFilterOption,
	DataTableProps,
	DataTableRow,
	DataTableRowAction,
} from "./data-table-model";

export function DataTable<TData extends RowData, TValue = unknown>({
	className,
	columns,
	data,
	emptyLabel = "No results.",
	filterColumnId,
	filters,
	filterPlaceholder = "Filter rows",
	getColumnLabel = getDefaultColumnLabel,
	getRowActions,
	getRowCanExpand,
	getRowId,
	initialColumnVisibility,
	renderExpandedRow,
	rowSelection = true,
	showExpandColumn = true,
	style,
	xstyle,
	toolbarEndSlot,
	...props
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState("");
	const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(
		initialColumnVisibility ?? {},
	);
	const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>({});
	const [expanded, setExpanded] = useState<ExpandedState>({});
	const supportsExpansion = Boolean(renderExpandedRow);
	const supportsActions = Boolean(getRowActions);

	const tableColumns = useDataTableColumns({
		columns,
		filterColumnId,
		filters,
		getRowActions,
		rowSelection,
		showExpandColumn,
		supportsActions,
		supportsExpansion,
	});

	const table = useTable<DataTableFeatures, TData>({
		features: dataTableFeatures,
		data,
		columns: tableColumns,
		getRowId,
		enableRowSelection: rowSelection,
		getRowCanExpand: getRowCanExpand ?? (() => supportsExpansion),
		globalFilterFn: "includesString",
		onColumnVisibilityChange: setColumnVisibility,
		onExpandedChange: setExpanded,
		onGlobalFilterChange: setGlobalFilter,
		onRowSelectionChange: setRowSelectionState,
		onSortingChange: setSorting,
		state: {
			columnVisibility,
			expanded,
			globalFilter,
			rowSelection: rowSelectionState,
			sorting,
		},
	});

	return (
		<Table.Root
			className={className}
			style={style}
			xstyle={xstyle}
			// Delegated: Table.Root owns margin resolution; do not resolve locally.
			{...props}
		>
			<DataTableToolbar
				filterColumnId={filterColumnId}
				filterPlaceholder={filterPlaceholder}
				filters={filters}
				getColumnLabel={getColumnLabel}
				globalFilter={globalFilter}
				table={table}
				toolbarEndSlot={toolbarEndSlot}
			/>
			<DataTableContent
				emptyLabel={emptyLabel}
				renderExpandedRow={renderExpandedRow}
				table={table}
			/>
		</Table.Root>
	);
}
