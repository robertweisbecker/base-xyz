import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/csr/SlidersHorizontal";
import { Icon } from "@/components/icons";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createExpandedRowModel,
	createFilteredRowModel,
	createSortedRowModel,
	flexRender,
	filterFn_includesString,
	globalFilteringFeature,
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
import { Checkbox } from "@/components/checkbox/checkbox";
import { InputGroup } from "@/components/input-group/input-group";
import { Menu } from "@/components/menu/menu";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { tokens } from "@/theme/tokens.stylex";
import { ArrowsDownUpIcon, SortAscendingIcon, SortDescendingIcon } from "@phosphor-icons/react";

const dataTableFeatures = tableFeatures({
	columnFilteringFeature,
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

export type DataTableColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<DataTableFeatures, TData, TValue>;
export type DataTableRow<TData extends RowData> = Row<DataTableFeatures, TData>;
export type DataTableColumn<TData extends RowData> = Column<DataTableFeatures, TData, unknown>;

export type DataTableRowAction<TData extends RowData> = {
	label: ReactNode;
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
	"children" | "style"
> & {
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
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
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
				header: ({ table }) => (
					<RowSelectionCheckbox
						checked={table.getIsAllRowsSelected()}
						indeterminate={table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
						label="Select all rows"
						onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
					/>
				),
				cell: ({ row }) => (
					<RowSelectionCheckbox
						checked={row.getIsSelected()}
						disabled={!row.getCanSelect()}
						label={`Select row ${row.index + 1}`}
						onCheckedChange={(checked) => row.toggleSelected(checked)}
					/>
				),
			});
		}

		if (supportsExpansion && showExpandColumn) {
			internalColumns.push({
				id: "__expand",
				enableHiding: false,
				enableSorting: false,
				header: () => <VisuallyHidden>Expand row</VisuallyHidden>,
				cell: ({ row }) =>
					row.getCanExpand() ? (
						<IconButton
							type="button"
							variant="ghost"
							size="xs"
							aria-expanded={row.getIsExpanded()}
							label={`${row.getIsExpanded() ? "Collapse" : "Expand"} row ${row.index + 1}`}
							onClick={row.getToggleExpandedHandler()}
							icon={row.getIsExpanded() ? <CaretDownIcon aria-hidden /> : <CaretRightIcon aria-hidden />}
						/>
					) : null,
			});
		}

		const typedColumns = (columns as Array<DataTableColumnDef<TData, unknown>>).map((column) => {
			const columnId = getColumnDefId(column);
			if (columnId && defaultFilterColumnIds.has(columnId) && column.filterFn == null) {
				return { ...column, filterFn: dataTableFilter };
			}
			return column;
		});

		if (supportsActions) {
			return [
				...internalColumns,
				...typedColumns,
				{
					id: "__actions",
					enableHiding: false,
					enableSorting: false,
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
	const rootSx = stylex.props(tableParts.root, style);
	const selectedCount = table.getFilteredSelectedRowModel().rows.length;
	const filteredCount = table.getFilteredRowModel().rows.length;

	return (
		<div className={[rootSx.className, className].filter(Boolean).join(" ")} style={rootSx.style} {...props}>
			<div {...stylex.props(tableParts.toolbar)}>
				<InputGroup.Root style={tableParts.filter}>
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
				<div {...stylex.props(tableParts.toolbarActions)}>
					{filters?.map((filter) => {
						const column = table.getColumn(filter.columnId);
						return column ? <ColumnFilterMenu key={filter.columnId} column={column} filter={filter} /> : null;
					})}
					{toolbarEndSlot}
					<ColumnVisibilityMenu tableColumns={table.getAllLeafColumns()} getColumnLabel={getColumnLabel} />
				</div>
			</div>

			<div {...stylex.props(tableParts.surface)}>
				<table {...stylex.props(tableParts.table)}>
					<thead {...stylex.props(tableParts.header)}>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										colSpan={header.colSpan}
										aria-sort={getAriaSort(header.column)}
										{...stylex.props(tableParts.headerCell, getColumnTone(header.column.id))}>
										{header.isPlaceholder ? null : <HeaderContent column={header.column} header={header} />}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{visibleRows.length > 0 ? (
							visibleRows.map((row) => (
								<Fragment key={row.id}>
									<tr
										data-expanded={row.getIsExpanded() ? "" : undefined}
										data-selected={row.getIsSelected() ? "" : undefined}
										{...stylex.props(tableParts.row)}>
										{row.getVisibleCells().map((cell) => (
											<td key={cell.id} {...stylex.props(tableParts.cell, getColumnTone(cell.column.id))}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</td>
										))}
									</tr>
									{renderExpandedRow && row.getIsExpanded() ? (
										<tr key={`${row.id}-expanded`} {...stylex.props(tableParts.expandedRow)}>
											<td colSpan={row.getVisibleCells().length} {...stylex.props(tableParts.expandedCell)}>
												{renderExpandedRow(row)}
											</td>
										</tr>
									) : null}
								</Fragment>
							))
						) : (
							<tr>
								<td colSpan={table.getVisibleLeafColumns().length} {...stylex.props(tableParts.emptyCell)}>
									{emptyLabel}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div {...stylex.props(tableParts.footer)}>
				<span>
					{selectedCount} of {filteredCount} row(s) selected.
				</span>
				<span>{table.getVisibleLeafColumns().length} column(s) visible.</span>
			</div>
		</div>
	);
}

function HeaderContent<TData extends RowData>({
	column,
	header,
}: {
	column: DataTableColumn<TData>;
	header: Header<DataTableFeatures, TData, unknown>;
}) {
	const content = flexRender(column.columnDef.header, header.getContext());
	const sorted = column.getIsSorted();

	if (!column.getCanSort()) {
		return <span {...stylex.props(tableParts.headerLabel)}>{content}</span>;
	}

	return (
		<span {...stylex.props(tableParts.headerContent)}>
			<Button
				endSlot={getSortIcon(sorted)}
				aria-label={getSortLabel(content, sorted)}
				variant="plain"
				size="xs"
				onClick={() => column.toggleSorting(sorted === "asc")}>
				<span {...stylex.props(tableParts.headerLabel)}>{content}</span>
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
						variant={selectedValues.length > 0 ? "neutral" : "ghost"}
						endSlot={<CaretDownIcon aria-hidden weight="bold" />}
						style={tableParts.filterTrigger}>
						<FilterTriggerContent filter={filter} selectedValues={selectedValues} />
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

function FilterTriggerContent({ filter, selectedValues }: { filter: DataTableFilter; selectedValues: string[] }) {
	if (selectedValues.length === 0) {
		return <span {...stylex.props(tableParts.filterTriggerLabel)}>{filter.label}</span>;
	}

	return (
		<span {...stylex.props(tableParts.filterTriggerContent)}>
			<span {...stylex.props(tableParts.filterTriggerLabel)}>{filter.label}</span>
			<Badge variant="elevated" size="sm">
				{selectedValues.length}
			</Badge>
		</span>
	);
}

function normalizeSelectedFilterValues(value: unknown) {
	return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function RowSelectionCheckbox({
	checked,
	disabled,
	indeterminate,
	label,
	onCheckedChange,
}: {
	checked: boolean;
	disabled?: boolean;
	indeterminate?: boolean;
	label: string;
	onCheckedChange: (checked: boolean) => void;
}) {
	return (
		<span {...stylex.props(tableParts.selectionCheckboxFrame)}>
			<Checkbox
				checked={checked}
				disabled={disabled}
				indeterminate={indeterminate}
				label={<VisuallyHidden>{label}</VisuallyHidden>}
				onCheckedChange={onCheckedChange}
				aria-label={label}
				style={tableParts.selectionCheckbox}
			/>
		</span>
	);
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
		<Menu.Root size="sm">
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
		<Menu.Root size="sm">
			<Menu.Trigger
				render={
					<IconButton
						variant="neutral"
						icon={<SlidersHorizontalIcon aria-hidden />}
						label="Open columns menu"
						tooltip={"Edit columns"}
					/>
				}
			/>
			<Menu.Popup positionerProps={{ align: "end" }}>
				<Menu.Group>
					<Menu.GroupLabel>Visible columns</Menu.GroupLabel>
					{hideableColumns.map((column) => (
						<Menu.CheckboxItem
							key={column.id}
							checked={column.getIsVisible()}
							onCheckedChange={(checked) => column.toggleVisibility(checked)}>
							<Menu.ItemLabel>{getColumnLabel(column)}</Menu.ItemLabel>
						</Menu.CheckboxItem>
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

function getColumnTone(columnId: string) {
	if (columnId === "__select" || columnId === "__expand" || columnId === "__actions") {
		return tableParts.utilityColumn;
	}
	return null;
}

function getColumnDefId<TData extends RowData>(column: DataTableColumnDef<TData, unknown>) {
	const columnWithIds = column as { accessorKey?: unknown; id?: unknown };
	if (typeof columnWithIds.id === "string") {
		return columnWithIds.id;
	}
	if (typeof columnWithIds.accessorKey === "string") {
		return columnWithIds.accessorKey;
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

const tableParts = stylex.create({
	root: {
		gap: tokens["--space-3"],
		color: tokens["--fg"],
		display: "flex",
		flexDirection: "column",
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		minWidth: 0,
		width: "100%",
	},
	toolbar: {
		gap: tokens["--space-2"],
		alignItems: "center",
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "flex-end",
	},
	filter: {
		flex: "0 1 10rem",
		// maxWidth: "22rem",
		// width: "100%",
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
	filterTriggerContent: {
		gap: tokens["--space-1"],
		alignItems: "center",
		display: "inline-flex",
		minWidth: 0,
	},
	filterTriggerLabel: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	surface: {
		// borderColor: tokens["--border"],
		// borderStyle: "solid",
		// borderWidth: "1px",
		borderRadius: tokens["--radius-md"],
		overflow: "auto",
		backgroundColor: tokens["--panel"],
		boxShadow: tokens["--shadow-sm"],
	},
	table: {
		borderCollapse: "collapse",
		// minWidth: "40rem",
		width: "100%",
	},
	header: {
		backgroundColor: "transparent",
	},
	headerCell: {
		paddingBlock: tokens["--space-1"],
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		paddingInlineStart: tokens["--space-2"],
		textAlign: "start",
		verticalAlign: "middle",
		whiteSpace: "nowrap",
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
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
		color: tokens["--fg-muted"],
	},
	row: {
		backgroundColor: {
			"[data-selected]": tokens["--bg-accent"],
			default: "transparent",
			":hover": tokens["--bg-highlight"],
		},
	},
	expandedRow: {
		borderRadius: "inherit",
		backgroundColor: tokens["--inset"],
	},
	cell: {
		paddingBlock: tokens["--space-2"],
		borderBlockStartColor: {
			"[data-selected]": "transparent",
			default: tokens["--border"],
		},
		borderBlockStartStyle: "solid",
		borderBlockStartWidth: "1px",
		paddingInlineEnd: {
			default: tokens["--space-2"],
			":last-child": tokens["--space-1"],
		},
		paddingInlineStart: tokens["--space-2"],
		textAlign: "start",
		verticalAlign: "middle",
		minHeight: tokens["--size-control-sm"],
	},
	expandedCell: {
		paddingBlock: tokens["--space-3"],
		backgroundColor: tokens["--surface"],
		borderBlockStartColor: tokens["--border"],
		borderBlockStartStyle: "solid",
		borderBlockStartWidth: "1px",
		paddingInlineStart: tokens["--space-10"],
	},
	emptyCell: {
		paddingBlock: tokens["--space-10"],
		paddingInline: tokens["--space-2"],
		color: tokens["--fg-muted"],
		textAlign: "center",
	},
	utilityColumn: {
		paddingInline: tokens["--space-2"],
		textAlign: "center",
		whiteSpace: "nowrap",
		width: "1%",
	},
	selectionCheckbox: {
		gap: 0,
		alignItems: "center",
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		lineHeight: 0,
		width: "auto",
	},
	selectionCheckboxFrame: {
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		lineHeight: 0,
		minHeight: tokens["--size-indicator-sm"],
		width: "fit-content",
	},
	footer: {
		gap: tokens["--space-2"],
		color: tokens["--fg-muted"],
		display: "flex",
		flexWrap: "wrap",
		fontSize: tokens["--font-size-1"],
		justifyContent: "space-between",
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
});
