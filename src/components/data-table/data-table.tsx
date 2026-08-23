import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/csr/SlidersHorizontal";
import { Icon } from "@/components/icons";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { Toggle } from "@/components/toggle/toggle";
import * as stylex from "@stylexjs/stylex";
import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createExpandedRowModel,
	createFilteredRowModel,
	createSortedRowModel,
	flexRender,
	filterFn_includesString,
	globalFilteringFeature,
	metaHelper,
	rowExpandingFeature,
	rowSelectionFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	sortFn_text,
	tableFeatures,
	useTable,
	type Column,
	type ColumnVisibilityState,
	type ColumnDef,
	type ExpandedState,
	type Header,
	type Row,
	type RowData,
	type RowSelectionState,
	type SortingState,
} from "@tanstack/react-table";
import { Fragment, useMemo, useState, type ComponentProps, type ReactNode } from "react";
import { Badge } from "@/components/badge/badge";
import { Button, IconButton } from "@/components/button/button";
import { InputGroup } from "@/components/input-group/input-group";
import { Menu } from "@/components/menu/menu";
import { Table } from "@/components/table/table";
import { typescaleStyles } from "@/components/text/text.stylex";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import type { BaseStyleProps } from "@/styles/props/base";
import type { MarginProps } from "@/styles/props/spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";
import {
	ArrowsDownUpIcon,
	ArrowsInLineVerticalIcon,
	ArrowsOutLineVerticalIcon,
	SortAscendingIcon,
	SortDescendingIcon,
} from "@phosphor-icons/react";

const dataTableColumnRole = Symbol("data-table-column-role");
type DataTableColumnRole = "selection" | "action";
type DataTableColumnMeta = Record<string, unknown> & {
	[dataTableColumnRole]?: DataTableColumnRole;
	numeric?: boolean;
};

type DataTableColumnNumeric = {
	/** End-aligns header and body cells and applies tabular numbers. */
	numeric?: boolean;
};

const dataTableFeatures = tableFeatures({
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

type DataTableFeatures = typeof dataTableFeatures;

export type DataTableColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<DataTableFeatures, TData, TValue> &
	DataTableColumnNumeric;
export type DataTableRow<TData extends RowData> = Row<DataTableFeatures, TData>;
export type DataTableColumn<TData extends RowData> = Column<DataTableFeatures, TData, unknown>;

export type DataTableRowAction<TData extends RowData> = {
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
	const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(initialColumnVisibility ?? {});
	const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>({});
	const [expanded, setExpanded] = useState<ExpandedState>({});
	const supportsExpansion = Boolean(renderExpandedRow);
	const supportsActions = Boolean(getRowActions);

	const tableColumns = useMemo<Array<DataTableColumnDef<TData, unknown>>>(() => {
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
				meta: { [dataTableColumnRole]: "selection" },
			});
		}

		if (supportsExpansion && showExpandColumn) {
			internalColumns.push({
				id: "__expand",
				enableHiding: false,
				enableSorting: false,
				meta: { [dataTableColumnRole]: "action" },
				header: ({ table }) => {
					const allExpanded = table.getIsAllRowsExpanded();
					return (
						<Toggle
							variant="ghost"
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
							variant="ghost"
							size="xs"
							pressed={row.getIsExpanded()}
							label={`${row.getIsExpanded() ? "Collapse" : "Expand"} row ${row.index + 1}`}
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
					meta: { [dataTableColumnRole]: "action" },
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

	const filterColumn = filterColumnId ? table.getColumn(filterColumnId) : undefined;
	const visibleRows = table.getRowModel().rows;
	const selectedCount = table.getFilteredSelectedRowModel().rows.length;
	const filteredCount = table.getFilteredRowModel().rows.length;

	return (
		<Table.Root
			className={className}
			style={style}
			xstyle={xstyle}
			// Delegated: Table.Root owns margin resolution; do not resolve locally.
			{...props}>
			<div {...stylex.props(dataTableParts.toolbar)}>
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
								setGlobalFilter(nextValue);
							}
						}}
					/>
				</InputGroup.Root>
				<div {...stylex.props(dataTableParts.toolbarActions)}>
					{filters?.map((filter) => {
						const column = table.getColumn(filter.columnId);
						return column ? <ColumnFilterMenu key={filter.columnId} column={column} filter={filter} /> : null;
					})}
					{toolbarEndSlot}
					<ColumnVisibilityMenu tableColumns={table.getAllLeafColumns()} getColumnLabel={getColumnLabel} />
				</div>
			</div>

			<Table.Container>
				<Table.Content>
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
												scope={header.colSpan > 1 ? "colgroup" : "col"}>
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
											numeric={numeric}>
											{content}
										</Table.HeaderCell>
									);
								})}
							</Table.Row>
						))}
					</Table.Header>
					<Table.Body>
						{visibleRows.length > 0 ? (
							visibleRows.map((row) => (
								<Fragment key={row.id}>
									<Table.Row data-expanded={row.getIsExpanded() ? "" : undefined} checked={row.getIsSelected()}>
										{row.getVisibleCells().map((cell) => {
											const columnRole = getDataTableColumnRole(cell.column);

											if (columnRole === "selection") {
												return (
													<Table.CellCheckbox
														key={cell.id}
														checked={row.getIsSelected()}
														disabled={!row.getCanSelect()}
														label={`Select row ${row.index + 1}`}
														onCheckedChange={(checked) => row.toggleSelected(checked)}
													/>
												);
											}

											const content = flexRender(cell.column.columnDef.cell, cell.getContext());

											if (columnRole === "action") {
												return <Table.CellAction key={cell.id}>{content}</Table.CellAction>;
											}

											return (
												<Table.Cell key={cell.id} numeric={isNumericColumn(cell.column)}>
													{content}
												</Table.Cell>
											);
										})}
									</Table.Row>
									{renderExpandedRow && row.getIsExpanded() ? (
										<Table.Row key={`${row.id}-expanded`} {...stylex.props(dataTableParts.expandedRow)}>
											<Table.Cell
												colSpan={Math.max(1, row.getVisibleCells().length)}
												{...stylex.props(dataTableParts.expandedCell)}>
												{renderExpandedRow(row)}
											</Table.Cell>
										</Table.Row>
									) : null}
								</Fragment>
							))
						) : (
							<Table.Empty colSpan={Math.max(1, table.getVisibleLeafColumns().length)}>{emptyLabel}</Table.Empty>
						)}
					</Table.Body>
				</Table.Content>
			</Table.Container>

			<div {...stylex.props(dataTableParts.metadata, typescaleStyles["1"])}>
				<span>
					{selectedCount} of {filteredCount} row(s) selected.
				</span>
				<span>{table.getVisibleLeafColumns().length} column(s) visible.</span>
			</div>
		</Table.Root>
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
				onClick={() => column.toggleSorting(sorted === "asc")}>
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
	return <ArrowsDownUpIcon aria-hidden />;
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
						{...stylex.props(dataTableParts.filterTrigger)}>
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
							onCheckedChange={(checked) => toggleValue(option.value, checked)}>
							<Menu.ItemLabel>{option.label}</Menu.ItemLabel>
						</Menu.CheckboxItem>
					))}
				</Menu.Group>
			</Menu.Popup>
		</Menu.Root>
	);
}

function normalizeSelectedFilterValues(value: unknown) {
	return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
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
					{actions.map((action, index) => (
						<Menu.Item
							key={index}
							disabled={action.disabled}
							variant={action.variant === "danger" ? "error" : "default"}
							onClick={() => action.onSelect?.(row)}>
							{action.icon && <Menu.ItemIcon>{action.icon}</Menu.ItemIcon>}
							<Menu.ItemLabel>{action.label}</Menu.ItemLabel>
						</Menu.Item>
					))}
				</Menu.Group>
			</Menu.Popup>
		</Menu.Root>
	);
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
				render={<IconButton variant="neutral" icon={<SlidersHorizontalIcon aria-hidden />} label="Column settings" />}
			/>
			<Menu.Popup positionerProps={{ align: "end" }}>
				<Menu.Group>
					<Menu.GroupLabel>Visible columns</Menu.GroupLabel>
					{hideableColumns.map((column) => (
						<Menu.SwitchItem
							key={column.id}
							checked={column.getIsVisible()}
							onCheckedChange={(checked) => column.toggleVisibility(checked)}>
							<Menu.ItemLabel>{getColumnLabel(column)}</Menu.ItemLabel>
						</Menu.SwitchItem>
					))}
				</Menu.Group>
			</Menu.Popup>
		</Menu.Root>
	);
}

function getDefaultColumnLabel<TData extends RowData>(column: DataTableColumn<TData>) {
	const header = column.columnDef.header;
	if (typeof header === "string") {
		return header;
	}
	return column.id;
}

function getAriaSort<TData extends RowData>(column: DataTableColumn<TData>) {
	const sorted = column.getIsSorted();
	if (sorted === "asc") return "ascending";
	if (sorted === "desc") return "descending";
	return undefined;
}

function getDataTableColumnRole<TData extends RowData>(column: DataTableColumn<TData>) {
	return column.columnDef.meta?.[dataTableColumnRole];
}

function isNumericColumn<TData extends RowData>(column: DataTableColumn<TData>) {
	return column.columnDef.meta?.numeric === true;
}

function withNumericMeta<TData extends RowData, TValue>(
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

function getColumnDefId<TData extends RowData, TValue>(column: DataTableColumnDef<TData, TValue>) {
	if (column.id) {
		return column.id;
	}
	if ("accessorKey" in column && typeof column.accessorKey === "string") {
		return column.accessorKey;
	}
	return undefined;
}

function dataTableFilter<TData extends RowData>(row: DataTableRow<TData>, columnId: string, filterValue: unknown) {
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

const dataTableParts = stylex.create({
	toolbar: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "flex-end",
	},
	filter: {
		flexBasis: "10rem",
		flexGrow: "1",
		flexShrink: "1",
		flexWrap: "nowrap",
	},
	toolbarActions: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "flex-end",
	},
	filterTrigger: {
		maxWidth: "100%",
	},
	filterTriggerLabel: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	headerContent: {
		gap: tokens["--space-1"],
		alignItems: "center",
		display: "inline-flex",
		maxWidth: "100%",
		minWidth: 0,
	},
	headerLabel: {
		overflow: "hidden",
		color: tokens["--fg-muted"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	expandedRow: {
		borderRadius: "inherit",
		backgroundColor: {
			default: tokens["--inset"],
			":hover": tokens["--inset"],
		},
	},
	expandedCell: {
		paddingBlock: tokens["--space-3"],
		backgroundColor: tokens["--surface"],
		borderBlockStartColor: tokens["--border"],
		borderBlockStartStyle: "solid",
		borderBlockStartWidth: "1px",
		paddingInlineStart: tokens["--space-10"],
	},
	metadata: {
		gap: tokens["--space-2"],
		color: tokens["--fg-muted"],
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
});
