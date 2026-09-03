import { ArrowsDownUpIcon, SortAscendingIcon, SortDescendingIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { type ReactNode } from "react";
import { Button } from "@/components/button/button";
import { Table } from "@/components/table/table";
import { dataTableParts } from "./data-table.stylex";
import {
	getAriaSort,
	getDataTableColumnRole,
	isNumericColumn,
	type DataTableColumn,
	type DataTableFeatures,
} from "./data-table-model";
import {
	flexRender,
	type Header,
	type RowData,
	type Table as TableInstance,
} from "@tanstack/react-table";

export function DataTableHeader<TData extends RowData>({
	table,
}: {
	table: TableInstance<DataTableFeatures, TData>;
}) {
	return (
		<Table.Header>
			{table.getHeaderGroups().map((headerGroup) => (
				<Table.Row key={headerGroup.id}>
					{headerGroup.headers.map((header) => {
						const columnRole = getDataTableColumnRole(header.column);

						if (columnRole === "selection") {
							return (
								<Table.HeaderCheckbox
									key={header.id}
									colSpan={header.colSpan}
									scope={header.colSpan > 1 ? "colgroup" : "col"}
									checked={table.getIsAllRowsSelected()}
									indeterminate={table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
									label="Select all rows"
									onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
								/>
							);
						}

						if (columnRole === "action") {
							return (
								<Table.HeaderAction
									key={header.id}
									colSpan={header.colSpan}
									scope={header.colSpan > 1 ? "colgroup" : "col"}
								>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
								</Table.HeaderAction>
							);
						}

						const numeric = isNumericColumn(header.column);
						const content = header.isPlaceholder ? null : (
							<HeaderContent column={header.column} header={header} numeric={numeric} />
						);

						return (
							<Table.HeaderCell
								key={header.id}
								colSpan={header.colSpan}
								scope={header.colSpan > 1 ? "colgroup" : "col"}
								aria-sort={getAriaSort(header.column)}
								numeric={numeric}
							>
								{content}
							</Table.HeaderCell>
						);
					})}
				</Table.Row>
			))}
		</Table.Header>
	);
}

function HeaderContent<TData extends RowData>({
	column,
	header,
	numeric,
}: {
	column: DataTableColumn<TData>;
	header: Header<DataTableFeatures, TData, unknown>;
	numeric: boolean;
}) {
	const content = flexRender(column.columnDef.header, header.getContext());
	const sorted = column.getIsSorted();

	if (!column.getCanSort()) {
		return <span {...stylex.props(dataTableParts.headerLabel)}>{content}</span>;
	}

	return (
		<span {...stylex.props(dataTableParts.headerContent)}>
			<Button
				endSlot={getSortIcon(sorted)}
				aria-label={getSortLabel(content, sorted)}
				variant="plain"
				ms={numeric ? undefined : -2}
				me={numeric ? -2 : undefined}
				size="xs"
				onClick={() => column.toggleSorting(sorted === "asc")}
			>
				<span {...stylex.props(dataTableParts.headerLabel)}>{content}</span>
			</Button>
		</span>
	);
}

function getSortIcon(sorted: false | "asc" | "desc") {
	if (sorted === "asc") {
		return <SortAscendingIcon aria-hidden />;
	}
	if (sorted === "desc") {
		return <SortDescendingIcon aria-hidden />;
	}
	return <ArrowsDownUpIcon aria-hidden mirrored={true} />;
}

function getSortLabel(content: ReactNode, sorted: false | "asc" | "desc") {
	const label = typeof content === "string" ? content : "column";
	if (sorted === "asc") {
		return `Sort ${label} descending`;
	}
	if (sorted === "desc") {
		return `Clear ${label} sorting`;
	}
	return `Sort ${label} ascending`;
}
