import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/csr/SlidersHorizontal";
import * as stylex from "@stylexjs/stylex";
import { Badge } from "@/components/badge/badge";
import { Button, IconButton } from "@/components/button/button";
import { InputGroup } from "@/components/input-group/input-group";
import { Menu } from "@/components/menu/menu";
import { dataTableParts } from "./data-table.stylex";
import type { DataTableColumn, DataTableFeatures, DataTableFilter } from "./data-table-model";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
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
	const filterColumn = filterColumnId ? table.getColumn(filterColumnId) : undefined;

	return (
		<div {...stylex.props(dataTableParts.toolbar)}>
			<ColumnVisibilityMenu
				tableColumns={table.getAllLeafColumns()}
				getColumnLabel={getColumnLabel}
			/>
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
			<div {...stylex.props(dataTableParts.toolbarActions)}>
				{filters?.map((filter) => {
					const column = table.getColumn(filter.columnId);
					return column ? (
						<ColumnFilterMenu key={filter.columnId} column={column} filter={filter} />
					) : null;
				})}
				{toolbarEndSlot}
			</div>
		</div>
	);
}

function ColumnFilterMenu<TData extends RowData>({
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

function ColumnVisibilityMenu<TData extends RowData>({
	getColumnLabel,
	tableColumns,
}: {
	getColumnLabel: (column: DataTableColumn<TData>) => ReactNode;
	tableColumns: Array<DataTableColumn<TData>>;
}) {
	const hideableColumns = tableColumns.filter((column) => column.getCanHide());

	if (hideableColumns.length === 0) {
		return null;
	}

	return (
		<Menu.Root>
			<Menu.Trigger
				render={
					<IconButton
						variant="neutral"
						icon={<SlidersHorizontalIcon aria-hidden />}
						label="Column settings"
					/>
				}
			/>
			<Menu.Popup positionerProps={{ align: "end" }}>
				<Menu.Group>
					<Menu.GroupLabel>Visible columns</Menu.GroupLabel>
					{hideableColumns.map((column) => (
						<Menu.SwitchItem
							key={column.id}
							checked={column.getIsVisible()}
							onCheckedChange={(checked) => column.toggleVisibility(checked)}
						>
							<Menu.ItemLabel>{getColumnLabel(column)}</Menu.ItemLabel>
						</Menu.SwitchItem>
					))}
				</Menu.Group>
			</Menu.Popup>
		</Menu.Root>
	);
}
