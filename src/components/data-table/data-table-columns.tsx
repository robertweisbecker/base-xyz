import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { ArrowsInLineVerticalIcon, ArrowsOutLineVerticalIcon } from "@phosphor-icons/react";
import { useMemo } from "react";
import { Icon } from "@/components/icons";
import { IconButton } from "@/components/button/button";
import { Menu } from "@/components/menu/menu";
import { Toggle } from "@/components/toggle/toggle";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import {
	actionColumnMeta,
	dataTableFilter,
	getColumnDefId,
	selectionColumnMeta,
	withNumericMeta,
	type DataTableColumnDef,
	type DataTableFilter,
	type DataTableProps,
	type DataTableRow,
} from "./data-table-model";
import type { RowData } from "@tanstack/react-table";

export function useDataTableColumns<TData extends RowData, TValue>({
	columns,
	filterColumnId,
	filters,
	getRowActions,
	rowSelection,
	showExpandColumn,
	supportsActions,
	supportsExpansion,
}: {
	columns: Array<DataTableColumnDef<TData, TValue>>;
	filterColumnId?: string;
	filters?: DataTableFilter[];
	getRowActions: DataTableProps<TData>["getRowActions"];
	rowSelection: boolean;
	showExpandColumn: boolean;
	supportsActions: boolean;
	supportsExpansion: boolean;
}) {
	return useMemo<Array<DataTableColumnDef<TData, unknown>>>(() => {
		const internalColumns: Array<DataTableColumnDef<TData, unknown>> = [];
		const defaultFilterColumnIds = new Set([
			...(filterColumnId ? [filterColumnId] : []),
			...(filters?.map((filter) => filter.columnId) ?? []),
		]);

		if (rowSelection) {
			internalColumns.push({
				id: "__select",
				enableHiding: false,
				enableSorting: false,
				meta: selectionColumnMeta(),
			});
		}

		if (supportsExpansion && showExpandColumn) {
			internalColumns.push({
				id: "__expand",
				enableHiding: false,
				enableSorting: false,
				meta: actionColumnMeta(),
				header: ({ table }) => {
					const allExpanded = table.getIsAllRowsExpanded();
					return (
						<Toggle
							variant="plain"
							size="xs"
							pressed={allExpanded}
							disabled={!table.getCanSomeRowsExpand()}
							label={allExpanded ? "Collapse all" : "Expand all"}
							onPressedChange={table.getToggleAllRowsExpandedHandler()}
							icon={<ArrowsOutLineVerticalIcon aria-hidden />}
							pressedIcon={<ArrowsInLineVerticalIcon aria-hidden />}
						/>
					);
				},
				cell: ({ row }) =>
					row.getCanExpand() ? (
						<Toggle
							variant="plain"
							size="xs"
							pressed={row.getIsExpanded()}
							aria-label={`${row.getIsExpanded() ? "Collapse" : "Expand"} row ${row.index + 1}`}
							label={`${row.getIsExpanded() ? "Collapse" : "Expand"}`}
							onPressedChange={row.getToggleExpandedHandler()}
							icon={<CaretRightIcon aria-hidden />}
							pressedIcon={<CaretDownIcon aria-hidden />}
						/>
					) : null,
			});
		}

		// SAFETY: TanStack's column definition is invariant in TValue, while this table preserves each definition unchanged.
		const typedColumns = (columns as Array<DataTableColumnDef<TData, unknown>>).map((column) => {
			const normalized = withNumericMeta(column);
			const columnId = getColumnDefId(normalized);
			if (columnId && defaultFilterColumnIds.has(columnId) && normalized.filterFn == null) {
				return { ...normalized, filterFn: dataTableFilter };
			}
			return normalized;
		});

		if (supportsActions) {
			return [
				...internalColumns,
				...typedColumns,
				{
					id: "__actions",
					enableHiding: false,
					enableSorting: false,
					meta: actionColumnMeta(),
					header: () => <VisuallyHidden>Row actions</VisuallyHidden>,
					cell: ({ row }) => <RowActions row={row} getRowActions={getRowActions} />,
				},
			];
		}

		return [...internalColumns, ...typedColumns];
	}, [
		columns,
		filterColumnId,
		filters,
		getRowActions,
		rowSelection,
		showExpandColumn,
		supportsActions,
		supportsExpansion,
	]);
}

function RowActions<TData extends RowData>({
	getRowActions,
	row,
}: {
	getRowActions: DataTableProps<TData>["getRowActions"];
	row: DataTableRow<TData>;
}) {
	const actions = getRowActions?.(row) ?? [];

	if (actions.length === 0) {
		return null;
	}

	return (
		<Menu.Root>
			<Menu.Trigger
				render={
					<IconButton
						icon={<Icon.More />}
						label={`Open actions for row ${row.index + 1}`}
						size="xs"
						variant="ghost"
						tooltip={false}
					/>
				}
			/>
			<Menu.Popup positionerProps={{ align: "end" }}>
				<Menu.Group>
					{actions.map((action) => (
						<Menu.Item
							key={action.id}
							disabled={action.disabled}
							variant={action.variant === "danger" ? "error" : "default"}
							onClick={() => action.onSelect?.(row)}
						>
							{action.icon && <Menu.ItemIcon>{action.icon}</Menu.ItemIcon>}
							<Menu.ItemLabel>{action.label}</Menu.ItemLabel>
						</Menu.Item>
					))}
				</Menu.Group>
			</Menu.Popup>
		</Menu.Root>
	);
}
