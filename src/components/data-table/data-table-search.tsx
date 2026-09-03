import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import * as stylex from "@stylexjs/stylex";
import { InputGroup } from "@/components/input-group/input-group";
import { dataTableParts } from "./data-table.stylex";
import type { DataTableFeatures } from "./data-table-model";
import type { RowData, Table as TableInstance } from "@tanstack/react-table";

export function DataTableSearch<TData extends RowData>({
	filterColumnId,
	filterPlaceholder,
	globalFilter,
	table,
}: {
	filterColumnId?: string;
	filterPlaceholder: string;
	globalFilter: string;
	table: TableInstance<DataTableFeatures, TData>;
}) {
	const filterColumn = filterColumnId ? table.getColumn(filterColumnId) : undefined;

	return (
		<InputGroup.Root {...stylex.props(dataTableParts.filter)}>
			<InputGroup.Addon>
				<MagnifyingGlassIcon aria-hidden size="1em" weight="bold" />
			</InputGroup.Addon>
			<InputGroup.Input
				value={filterColumn ? String(filterColumn.getFilterValue() ?? "") : globalFilter}
				aria-label={filterPlaceholder}
				placeholder={filterPlaceholder}
				onChange={(event) => {
					const nextValue = event.currentTarget.value;
					if (filterColumn) {
						filterColumn.setFilterValue(nextValue);
					} else {
						table.setGlobalFilter(nextValue);
					}
				}}
			/>
		</InputGroup.Root>
	);
}
