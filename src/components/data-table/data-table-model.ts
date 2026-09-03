import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createExpandedRowModel,
	createFilteredRowModel,
	createSortedRowModel,
	filterFn_includesString,
	globalFilteringFeature,
	metaHelper,
	rowExpandingFeature,
	rowSelectionFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_text,
	tableFeatures,
	type Column,
	type ColumnDef,
	type ColumnVisibilityState,
	type Row,
	type RowData,
} from "@tanstack/react-table";
import type { ReactNode, ComponentProps } from "react";
import type { BaseStyleProps } from "@/styles/props/base";
import type { MarginProps } from "@/styles/props/spacing.stylex";

const dataTableColumnRole = Symbol("data-table-column-role");
export type DataTableColumnRole = "selection" | "action";
export type DataTableColumnMeta = Record<string, unknown> & {
	[dataTableColumnRole]?: DataTableColumnRole;
	numeric?: boolean;
};

export type DataTableColumnNumeric = {
	/** End-aligns header and body cells and applies tabular numbers. */
	numeric?: boolean;
};

export const dataTableFeatures = tableFeatures({
	columnFilteringFeature,
	columnMeta: metaHelper<DataTableColumnMeta>(),
	columnVisibilityFeature,
	globalFilteringFeature,
	rowExpandingFeature,
	rowSelectionFeature,
	rowSortingFeature,
	expandedRowModel: createExpandedRowModel(),
	filterFns: { includesString: filterFn_includesString },
	filteredRowModel: createFilteredRowModel(),
	sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
	sortedRowModel: createSortedRowModel(),
});

export type DataTableFeatures = typeof dataTableFeatures;

export type DataTableColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<
	DataTableFeatures,
	TData,
	TValue
> &
	DataTableColumnNumeric;
export type DataTableRow<TData extends RowData> = Row<DataTableFeatures, TData>;
export type DataTableColumn<TData extends RowData> = Column<DataTableFeatures, TData, unknown>;

export type DataTableRowAction<TData extends RowData> = {
	/** Stable semantic identity, unique among the actions returned for one row. */
	id: string;
	label: ReactNode;
	icon?: ReactNode;
	disabled?: boolean;
	variant?: "default" | "danger";
	onSelect?: (row: DataTableRow<TData>) => void;
};

export type DataTableFilterOption = {
	label: ReactNode;
	value: string;
};

export type DataTableFilter = {
	columnId: string;
	label: ReactNode;
	options: DataTableFilterOption[];
};

export type DataTableProps<TData extends RowData, TValue = unknown> = Omit<
	ComponentProps<"div">,
	"children" | "style" | "xstyle" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		columns: Array<DataTableColumnDef<TData, TValue>>;
		data: TData[];
		emptyLabel?: ReactNode;
		filterColumnId?: string;
		filters?: DataTableFilter[];
		filterPlaceholder?: string;
		getColumnLabel?: (column: DataTableColumn<TData>) => ReactNode;
		getRowActions?: (row: DataTableRow<TData>) => Array<DataTableRowAction<TData>>;
		getRowCanExpand?: (row: DataTableRow<TData>) => boolean;
		getRowId?: (originalRow: TData, index: number, parent?: DataTableRow<TData>) => string;
		initialColumnVisibility?: ColumnVisibilityState;
		renderExpandedRow?: (row: DataTableRow<TData>) => ReactNode;
		rowSelection?: boolean;
		showExpandColumn?: boolean;
		toolbarEndSlot?: ReactNode;
	};

export function selectionColumnMeta(): DataTableColumnMeta {
	return { [dataTableColumnRole]: "selection" };
}

export function actionColumnMeta(): DataTableColumnMeta {
	return { [dataTableColumnRole]: "action" };
}

export function getDefaultColumnLabel<TData extends RowData>(column: DataTableColumn<TData>) {
	const header = column.columnDef.header;
	if (typeof header === "string") {
		return header;
	}
	return column.id;
}

export function getAriaSort<TData extends RowData>(column: DataTableColumn<TData>) {
	const sorted = column.getIsSorted();
	if (sorted === "asc") return "ascending";
	if (sorted === "desc") return "descending";
	return undefined;
}

export function getDataTableColumnRole<TData extends RowData>(column: DataTableColumn<TData>) {
	return column.columnDef.meta?.[dataTableColumnRole];
}

export function isNumericColumn<TData extends RowData>(column: DataTableColumn<TData>) {
	return column.columnDef.meta?.numeric === true;
}

export function withNumericMeta<TData extends RowData, TValue>(
	column: DataTableColumnDef<TData, TValue>,
): DataTableColumnDef<TData, TValue> {
	if (column.numeric == null) {
		return column;
	}

	return {
		...column,
		meta: {
			...column.meta,
			numeric: column.numeric,
		},
	};
}

export function getColumnDefId<TData extends RowData, TValue>(
	column: DataTableColumnDef<TData, TValue>,
) {
	if (column.id) {
		return column.id;
	}
	if ("accessorKey" in column && typeof column.accessorKey === "string") {
		return column.accessorKey;
	}
	return undefined;
}

export function dataTableFilter<TData extends RowData>(
	row: DataTableRow<TData>,
	columnId: string,
	filterValue: unknown,
) {
	const rowValue = row.getValue(columnId);

	if (Array.isArray(filterValue)) {
		const selectedValues = filterValue.filter((item): item is string => typeof item === "string");
		if (selectedValues.length === 0) {
			return true;
		}
		if (Array.isArray(rowValue)) {
			return rowValue.some((item) => selectedValues.includes(String(item)));
		}
		return selectedValues.includes(String(rowValue));
	}

	if (typeof filterValue === "string") {
		return String(rowValue).toLocaleLowerCase().includes(filterValue.toLocaleLowerCase());
	}

	return true;
}
