import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { createContext, useContext, useMemo, type ComponentProps, type ReactNode } from "react";
import { Checkbox, type CheckboxProps } from "@/components/checkbox/checkbox";
import { ScrollArea } from "@/components/scroll-area/scroll-area";
import { fontWeightStyles, typescaleStyles } from "@/components/text/text.stylex";
import { tokens } from "@/theme/tokens.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type TableRootProps = StyledProps<ComponentProps<"div">>;
export type TableContainerProps = StyledProps<ComponentProps<"div">>;

export type TableContentProps = StyledProps<ComponentProps<"table">> & {
	caption?: ReactNode;
};

export type TableHeaderProps = StyledProps<ComponentProps<"thead">>;
export type TableBodyProps = StyledProps<ComponentProps<"tbody">>;
export type TableFooterProps = StyledProps<ComponentProps<"tfoot">>;

export type TableRowProps = StyledProps<ComponentProps<"tr">> & {
	/** Applies checked-row presentation and emits data-checked. Body rows only. */
	checked?: boolean;
};

export type TableHeaderCellProps = StyledProps<ComponentProps<"th">>;
export type TableCellProps = StyledProps<ComponentProps<"td">>;
export type TableHeaderActionProps = TableHeaderCellProps;
export type TableCellActionProps = TableCellProps;

type TableCheckboxControlProps = Pick<
	CheckboxProps,
	| "checked"
	| "defaultChecked"
	| "disabled"
	| "indeterminate"
	| "label"
	| "name"
	| "onCheckedChange"
	| "readOnly"
	| "required"
	| "value"
>;

export type TableHeaderCheckboxProps = Omit<TableHeaderActionProps, "children" | keyof TableCheckboxControlProps> &
	TableCheckboxControlProps;

export type TableCellCheckboxProps = Omit<TableCellActionProps, "children" | keyof TableCheckboxControlProps> &
	TableCheckboxControlProps;

export type TableEmptyProps = Omit<TableRowProps, "checked"> & {
	colSpan: number;
};

type TableLevel = "root" | "container" | "content";
type TableSection = "header" | "body" | "footer";

type TableRowContextValue = {
	section: TableSection;
	checked: boolean;
};

const TableLevelContext = createContext<TableLevel | null>(null);
const TableSectionContext = createContext<TableSection | null>(null);
const TableRowContext = createContext<TableRowContextValue | null>(null);

function invariantDev(condition: boolean, message: string) {
	if (import.meta.env.DEV && !condition) {
		throw new Error(message);
	}
}

function joinClassNames(...values: Array<string | undefined>) {
	return values.filter(Boolean).join(" ");
}

export function Root({ ref, className, style, children, ...props }: TableRootProps) {
	const sx = stylex.props(tableParts.root, typescaleStyles["2"], style);

	return (
		<TableLevelContext.Provider value="root">
			<TableSectionContext.Provider value={null}>
				<TableRowContext.Provider value={null}>
					<div ref={ref} className={joinClassNames(sx.className, className)} style={sx.style} {...props}>
						{children}
					</div>
				</TableRowContext.Provider>
			</TableSectionContext.Provider>
		</TableLevelContext.Provider>
	);
}

export function Container({ ref, className, style, children, ...props }: TableContainerProps) {
	const level = useContext(TableLevelContext);
	const row = useContext(TableRowContext);
	invariantDev(level === "root" && row == null, "Table.Container must be rendered inside Table.Root.");

	return (
		<TableLevelContext.Provider value="container">
			<ScrollArea
				ref={ref}
				label="Scrollable table"
				orientation="horizontal"
				size="content"
				className={className}
				style={[tableParts.container, style]}
				{...props}>
				{children}
			</ScrollArea>
		</TableLevelContext.Provider>
	);
}

export function Content({ ref, caption, className, style, children, ...props }: TableContentProps) {
	const level = useContext(TableLevelContext);
	const section = useContext(TableSectionContext);
	const row = useContext(TableRowContext);
	invariantDev(
		(level === "root" || level === "container") && section == null && row == null,
		"Table.Content must be rendered inside Table.Root or Table.Container.",
	);
	const sx = stylex.props(tableParts.content, style);

	return (
		<TableLevelContext.Provider value="content">
			<table ref={ref} className={joinClassNames(sx.className, className)} style={sx.style} {...props}>
				{caption != null ? <caption {...stylex.props(tableParts.caption)}>{caption}</caption> : null}
				{children}
			</table>
		</TableLevelContext.Provider>
	);
}

export function Header({ ref, className, style, children, ...props }: TableHeaderProps) {
	const level = useContext(TableLevelContext);
	const activeSection = useContext(TableSectionContext);
	const row = useContext(TableRowContext);
	invariantDev(
		level === "content" && activeSection == null && row == null,
		"Table.Header must be rendered inside Table.Content.",
	);
	const sx = stylex.props(tableParts.header, style);

	return (
		<TableSectionContext.Provider value="header">
			<thead ref={ref} className={joinClassNames(sx.className, className)} style={sx.style} {...props}>
				{children}
			</thead>
		</TableSectionContext.Provider>
	);
}

export function Body({ ref, className, style, children, ...props }: TableBodyProps) {
	const level = useContext(TableLevelContext);
	const activeSection = useContext(TableSectionContext);
	const row = useContext(TableRowContext);
	invariantDev(
		level === "content" && activeSection == null && row == null,
		"Table.Body must be rendered inside Table.Content.",
	);
	const sx = stylex.props(style);

	return (
		<TableSectionContext.Provider value="body">
			<tbody ref={ref} className={joinClassNames(sx.className, className)} style={sx.style} {...props}>
				{children}
			</tbody>
		</TableSectionContext.Provider>
	);
}

export function Footer({ ref, className, style, children, ...props }: TableFooterProps) {
	const level = useContext(TableLevelContext);
	const activeSection = useContext(TableSectionContext);
	const row = useContext(TableRowContext);
	invariantDev(
		level === "content" && activeSection == null && row == null,
		"Table.Footer must be rendered inside Table.Content.",
	);
	const sx = stylex.props(style);

	return (
		<TableSectionContext.Provider value="footer">
			<tfoot ref={ref} className={joinClassNames(sx.className, className)} style={sx.style} {...props}>
				{children}
			</tfoot>
		</TableSectionContext.Provider>
	);
}

export function Row({ ref, checked = false, className, style, children, ...props }: TableRowProps) {
	const section = useContext(TableSectionContext);
	const activeRow = useContext(TableRowContext);
	invariantDev(
		section != null && activeRow == null,
		"Table.Row must be rendered inside Table.Header, Table.Body, or Table.Footer.",
	);
	invariantDev(!checked || section === "body", "Table.Row checked is only valid inside Table.Body.");

	const rowContext = useMemo(
		() => ({ section: section ?? "body", checked: section === "body" && checked }),
		[checked, section],
	);
	const sx = stylex.props(
		section === "body" && tableParts.bodyRow,
		section === "body" && checked && tableParts.checkedRow,
		style,
	);

	return (
		<TableRowContext.Provider value={rowContext}>
			<tr
				{...props}
				ref={ref}
				data-checked={section === "body" && checked ? "" : undefined}
				className={joinClassNames(sx.className, className)}
				style={sx.style}>
				{children}
			</tr>
		</TableRowContext.Provider>
	);
}

function useHeaderRow(message: string) {
	const row = useContext(TableRowContext);
	invariantDev(row?.section === "header", message);
	return row;
}

function useDataRow(message: string) {
	const row = useContext(TableRowContext);
	invariantDev(row?.section === "body" || row?.section === "footer", message);
	return row;
}

export function HeaderCell({ ref, className, scope, style, children, ...props }: TableHeaderCellProps) {
	useHeaderRow("Table.HeaderCell must be rendered inside a header Table.Row.");
	const sx = stylex.props(tableParts.headerCell, typescaleStyles["1"], fontWeightStyles.medium, style);

	return (
		<th
			{...props}
			ref={ref}
			scope={scope ?? "col"}
			className={joinClassNames(sx.className, className)}
			style={sx.style}>
			{children}
		</th>
	);
}

export function Cell({ ref, className, style, children, ...props }: TableCellProps) {
	const row = useDataRow("Table.Cell must be rendered inside a body or footer Table.Row.");
	const sx = stylex.props(tableParts.cell, row?.checked && tableParts.checkedCell, style);

	return (
		<td {...props} ref={ref} className={joinClassNames(sx.className, className)} style={sx.style}>
			{children}
		</td>
	);
}

export function HeaderAction({ ref, className, scope, style, children, ...props }: TableHeaderActionProps) {
	useHeaderRow("Table.HeaderAction must be rendered inside a header Table.Row.");
	const sx = stylex.props(
		tableParts.headerCell,
		typescaleStyles["1"],
		fontWeightStyles.medium,
		tableParts.actionCell,
		style,
	);

	return (
		<th
			{...props}
			ref={ref}
			scope={scope ?? "col"}
			className={joinClassNames(sx.className, className)}
			style={sx.style}>
			{children}
		</th>
	);
}

export function CellAction({ ref, className, style, children, ...props }: TableCellActionProps) {
	const row = useDataRow("Table.CellAction must be rendered inside a body or footer Table.Row.");
	const sx = stylex.props(tableParts.cell, row?.checked && tableParts.checkedCell, tableParts.actionCell, style);

	return (
		<td {...props} ref={ref} className={joinClassNames(sx.className, className)} style={sx.style}>
			{children}
		</td>
	);
}

function CheckboxContent({
	checked,
	defaultChecked,
	disabled,
	indeterminate,
	label,
	name,
	onCheckedChange,
	readOnly,
	required,
	value,
}: TableCheckboxControlProps) {
	return (
		<span {...stylex.props(tableParts.checkboxFrame)}>
			<Checkbox
				checked={checked}
				defaultChecked={defaultChecked}
				disabled={disabled}
				indeterminate={indeterminate}
				label={label}
				name={name}
				onCheckedChange={onCheckedChange}
				readOnly={readOnly}
				required={required}
				value={value}
				size="md"
				visuallyHideLabel
				style={tableParts.checkbox}
			/>
		</span>
	);
}

export function HeaderCheckbox({
	ref,
	className,
	checked,
	defaultChecked,
	disabled,
	indeterminate,
	label,
	name,
	onCheckedChange,
	readOnly,
	required,
	scope,
	style,
	value,
	...props
}: TableHeaderCheckboxProps) {
	useHeaderRow("Table.HeaderCheckbox must be rendered inside a header Table.Row.");
	const sx = stylex.props(
		tableParts.headerCell,
		typescaleStyles["1"],
		fontWeightStyles.medium,
		tableParts.actionCell,
		style,
	);

	return (
		<th
			{...props}
			ref={ref}
			scope={scope ?? "col"}
			className={joinClassNames(sx.className, className)}
			style={sx.style}>
			<CheckboxContent
				checked={checked}
				defaultChecked={defaultChecked}
				disabled={disabled}
				indeterminate={indeterminate}
				label={label}
				name={name}
				onCheckedChange={onCheckedChange}
				readOnly={readOnly}
				required={required}
				value={value}
			/>
		</th>
	);
}

export function CellCheckbox({
	ref,
	className,
	checked,
	defaultChecked,
	disabled,
	indeterminate,
	label,
	name,
	onCheckedChange,
	readOnly,
	required,
	style,
	value,
	...props
}: TableCellCheckboxProps) {
	const row = useDataRow("Table.CellCheckbox must be rendered inside a body or footer Table.Row.");
	const sx = stylex.props(tableParts.cell, row?.checked && tableParts.checkedCell, tableParts.actionCell, style);

	return (
		<td {...props} ref={ref} className={joinClassNames(sx.className, className)} style={sx.style}>
			<CheckboxContent
				checked={checked}
				defaultChecked={defaultChecked}
				disabled={disabled}
				indeterminate={indeterminate}
				label={label}
				name={name}
				onCheckedChange={onCheckedChange}
				readOnly={readOnly}
				required={required}
				value={value}
			/>
		</td>
	);
}

export function Empty({ ref, className, colSpan, style, children, ...props }: TableEmptyProps) {
	const section = useContext(TableSectionContext);
	const row = useContext(TableRowContext);
	invariantDev(section === "body" && row == null, "Table.Empty must be rendered directly inside Table.Body.");
	invariantDev(Number.isInteger(colSpan) && colSpan > 0, "Table.Empty colSpan must be a positive integer.");
	const sx = stylex.props(style);

	return (
		<tr ref={ref} className={joinClassNames(sx.className, className)} style={sx.style} {...props}>
			<td colSpan={colSpan} {...stylex.props(tableParts.cell, tableParts.emptyCell)}>
				{children}
			</td>
		</tr>
	);
}

const tableParts = stylex.create({
	root: {
		gap: tokens["--space-3"],
		color: tokens["--fg"],
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
		width: "100%",
	},
	container: {
		backgroundColor: tokens["--surface"],
		borderRadius: tokens["--radius-md"],
		outlineWidth: "1px",
		outlineStyle: "solid",
		outlineColor: tokens["--border-opaque"],
		// boxShadow: tokens["--shadow-sm"],
		// backgroundClip: "padding-box",
	},
	content: {
		borderCollapse: "collapse",
		width: "100%",
	},
	caption: {
		captionSide: "top",
		textAlign: "start",
		textIndent: tokens["--space-3"],
		fontWeight: fontWeightStyles.medium,
		fontSize: typescaleStyles["1"].fontSize,
		lineHeight: typescaleStyles["1"].lineHeight,
		color: tokens["--fg"],
		backgroundColor: tokens["--canvas"],
	},
	header: {},
	headerCell: {
		backgroundColor: tokens["--canvas"],
		// backgroundClip: "padding-box",
		color: tokens["--fg-subtle"],
		paddingBlock: tokens["--space-2"],
		paddingInlineStart: tokens["--space-3"],
		textAlign: "start",
		verticalAlign: "middle",
		whiteSpace: "nowrap",
		borderBlockEndColor: tokens["--border-opaque"],
		borderBlockEndStyle: "solid",
		borderBlockEndWidth: "1px",
	},
	bodyRow: {
		backgroundColor: {
			default: "transparent",
			"[data-interactive]:hover": tokens["--bg-highlight"],
		},
	},
	checkedRow: {
		backgroundColor: {
			default: tokens["--bg-accent"],
			"[data-interactive]:hover": tokens["--bg-highlight"],
		},
	},
	cell: {
		paddingBlock: tokens["--space-2"],
		borderBlockStartColor: tokens["--border"],
		borderBlockStartStyle: "solid",
		borderBlockStartWidth: "1px",
		paddingInlineEnd: tokens["--space-3"],
		paddingInlineStart: tokens["--space-3"],
		textAlign: "start",
		verticalAlign: "middle",
		minHeight: tokens["--size-control-md"],
	},
	checkedCell: {
		// borderBlockStartColor: "transparent",
	},
	emptyCell: {
		paddingBlock: tokens["--space-10"],
		paddingInline: tokens["--space-2"],
		color: tokens["--fg-muted"],
		textAlign: "center",
	},
	actionCell: {
		paddingInline: tokens["--space-1"],
		paddingBlock: tokens["--space-0-5"],
		textAlign: "center",
		whiteSpace: "nowrap",
		width: "1%",
	},
	checkbox: {
		gap: 0,
		alignItems: "center",
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		lineHeight: 0,
		width: "auto",
	},
	checkboxFrame: {
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		lineHeight: 0,
		minHeight: tokens["--size-indicator-sm"],
		width: "fit-content",
		verticalAlign: "bottom",
	},
});

export const Table = {
	Root,
	Container,
	Content,
	Header,
	Body,
	Footer,
	Row,
	HeaderCell,
	Cell,
	HeaderAction,
	CellAction,
	HeaderCheckbox,
	CellCheckbox,
	Empty,
} as const;
