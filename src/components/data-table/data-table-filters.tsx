import * as stylex from "@stylexjs/stylex";
import { Badge } from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { Menu } from "@/components/menu/menu";
import { dataTableParts } from "./data-table.stylex";
import type { DataTableColumn, DataTableFeatures, DataTableFilter } from "./data-table-model";
import type { RowData, Table as TableInstance } from "@tanstack/react-table";

export function DataTableFilters<TData extends RowData>({
	filters,
	table,
}: {
	filters?: DataTableFilter[];
	table: TableInstance<DataTableFeatures, TData>;
}) {
	return filters?.map((filter) => {
		const column = table.getColumn(filter.columnId);
		return column ? (
			<DataTableColumnFilterMenu key={filter.columnId} column={column} filter={filter} />
		) : null;
	});
}

function DataTableColumnFilterMenu<TData extends RowData>({
	column,
	filter,
}: {
	column: DataTableColumn<TData>;
	filter: DataTableFilter;
}) {
	const selectedValues = normalizeSelectedFilterValues(column.getFilterValue());
	const selectedSet = new Set(selectedValues);

	function toggleValue(value: string, checked: boolean) {
		const nextSet = new Set(selectedValues);
		if (checked) {
			nextSet.add(value);
		} else {
			nextSet.delete(value);
		}
		const nextValues = Array.from(nextSet);
		column.setFilterValue(nextValues.length > 0 ? nextValues : undefined);
	}

	return (
		<Menu.Root>
			<Menu.Trigger
				render={
					<Button
						variant={"secondary"}
						endSlot={
							selectedValues.length > 0 ? (
								<Badge variant="solid" hue="neutral" size="sm">
									{selectedValues.length}
								</Badge>
							) : (
								<Menu.TriggerIcon />
							)
						}
						{...stylex.props(dataTableParts.filterTrigger)}
					>
						<span {...stylex.props(dataTableParts.filterTriggerLabel)}>{filter.label}</span>
					</Button>
				}
			/>
			<Menu.Popup positionerProps={{ align: "end" }}>
				<Menu.Group>
					<Menu.GroupLabel>{filter.label}</Menu.GroupLabel>
					{filter.options.map((option) => (
						<Menu.CheckboxItem
							key={option.value}
							checked={selectedSet.has(option.value)}
							onCheckedChange={(checked) => toggleValue(option.value, checked)}
						>
							<Menu.ItemLabel>{option.label}</Menu.ItemLabel>
						</Menu.CheckboxItem>
					))}
				</Menu.Group>
			</Menu.Popup>
		</Menu.Root>
	);
}

function normalizeSelectedFilterValues(value: unknown) {
	return Array.isArray(value)
		? value.filter((item): item is string => typeof item === "string")
		: [];
}
