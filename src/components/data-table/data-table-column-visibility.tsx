import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/csr/SlidersHorizontal";
import { IconButton } from "@/components/button/button";
import { Menu } from "@/components/menu/menu";
import type { DataTableColumn, DataTableFeatures } from "./data-table-model";
import type { ReactNode } from "react";
import type { RowData, Table as TableInstance } from "@tanstack/react-table";

export function DataTableColumnVisibility<TData extends RowData>({
	getColumnLabel,
	table,
}: {
	getColumnLabel: (column: DataTableColumn<TData>) => ReactNode;
	table: TableInstance<DataTableFeatures, TData>;
}) {
	const hideableColumns = table.getAllLeafColumns().filter((column) => column.getCanHide());

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
