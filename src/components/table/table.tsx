import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import { Checkbox, type CheckboxProps } from "@/components/checkbox/checkbox";
import { ScrollArea } from "@/components/scroll-area/scroll-area";
import { fontWeightStyles, textTabularStyles, typescaleStyles } from "@/components/text/text.stylex";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";

type StyledProps<T> = Omit<T, "className" | "style" | "xstyle"> & BaseStyleProps & {
	className?: string;
};

type RootStyledProps<T> = Omit<T, "className" | "style" | "xstyle" | keyof MarginProps> &
	MarginProps &
	StyledProps<T>;

export type TableRootProps = RootStyledProps<ComponentProps<"div">>;
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

type CellLayoutProps = {
	/** End-aligns contents and applies tabular numbers. */
	numeric?: boolean;
};

export type TableHeaderCellProps = StyledProps<ComponentProps<"th">> & CellLayoutProps;
export type TableCellProps = StyledProps<ComponentProps<"td">> & CellLayoutProps;
export type TableHeaderActionProps = Omit<TableHeaderCellProps, "numeric">;
export type TableCellActionProps = Omit<TableCellProps, "numeric">;

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

const TableLevelContext = createContext<TableLevel | null>(null);
const TableSectionContext = createContext<TableSection | null>(null);
const TableRowContext = createContext<TableSection | null>(null);

function invariantDev(condition: boolean, message: string) {
	if (import.meta.env.DEV && !condition) {
		throw new Error(message);
	}
}

export function Root({ ref, className, style, xstyle, children, ...props }: TableRootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = stylex.props(
		tableParts.root,
		typescaleStyles["2"],
		marginStyles,
		xstyle,
	);

	return (
		<TableLevelContext.Provider value="root">
			<TableSectionContext.Provider value={null}>
				<TableRowContext.Provider value={null}>
					<div
						ref={ref}
						className={attrJoin(sx.className, className)}
						style={mergeStyle(sx.style, style)}
						{...rest}>
						{children}
					</div>
				</TableRowContext.Provider>
			</TableSectionContext.Provider>
		</TableLevelContext.Provider>
	);
}

export function Container({ ref, className, style, xstyle, children, ...props }: TableContainerProps) {
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
				style={style}
				xstyle={[tableParts.container, xstyle]}
				{...props}>
				{children}
			</ScrollArea>
		</TableLevelContext.Provider>
	);
}

export function Content({ ref, caption, className, style, xstyle, children, ...props }: TableContentProps) {
	const level = useContext(TableLevelContext);
	const section = useContext(TableSectionContext);
	const row = useContext(TableRowContext);
	invariantDev(
		(level === "root" || level === "container") && section == null && row == null,
		"Table.Content must be rendered inside Table.Root or Table.Container.",
	);
	const sx = stylex.props(tableParts.content, xstyle);

	return (
		<TableLevelContext.Provider value="content">
			<table
				ref={ref}
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
				{...props}>
				{caption != null ? <caption {...stylex.props(tableParts.caption)}>{caption}</caption> : null}
				{children}
			</table>
		</TableLevelContext.Provider>
	);
}

export function Header({ ref, className, style, xstyle, children, ...props }: TableHeaderProps) {
	const level = useContext(TableLevelContext);
	const activeSection = useContext(TableSectionContext);
	const row = useContext(TableRowContext);
	invariantDev(
		level === "content" && activeSection == null && row == null,
		"Table.Header must be rendered inside Table.Content.",
	);
	const sx = stylex.props(xstyle);

	return (
		<TableSectionContext.Provider value="header">
			<thead
				ref={ref}
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
				{...props}>
				{children}
			</thead>
		</TableSectionContext.Provider>
	);
}

export function Body({ ref, className, style, xstyle, children, ...props }: TableBodyProps) {
	const level = useContext(TableLevelContext);
	const activeSection = useContext(TableSectionContext);
	const row = useContext(TableRowContext);
	invariantDev(
		level === "content" && activeSection == null && row == null,
		"Table.Body must be rendered inside Table.Content.",
	);
	const sx = stylex.props(xstyle);

	return (
		<TableSectionContext.Provider value="body">
			<tbody
				ref={ref}
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
				{...props}>
				{children}
			</tbody>
		</TableSectionContext.Provider>
	);
}

export function Footer({ ref, className, style, xstyle, children, ...props }: TableFooterProps) {
	const level = useContext(TableLevelContext);
	const activeSection = useContext(TableSectionContext);
	const row = useContext(TableRowContext);
	invariantDev(
		level === "content" && activeSection == null && row == null,
		"Table.Footer must be rendered inside Table.Content.",
	);
	const sx = stylex.props(xstyle);

	return (
		<TableSectionContext.Provider value="footer">
			<tfoot
				ref={ref}
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}
				{...props}>
				{children}
			</tfoot>
		</TableSectionContext.Provider>
	);
}

export function Row({ ref, checked = false, className, style, xstyle, children, ...props }: TableRowProps) {
	const section = useContext(TableSectionContext);
	const activeRow = useContext(TableRowContext);
	invariantDev(
		section != null && activeRow == null,
		"Table.Row must be rendered inside Table.Header, Table.Body, or Table.Footer.",
	);
	invariantDev(!checked || section === "body", "Table.Row checked is only valid inside Table.Body.");

	const sx = stylex.props(
		section === "body" && tableParts.bodyRow,
		section === "body" && checked && tableParts.checkedRow,
		xstyle,
	);

	return (
		<TableRowContext.Provider value={section ?? "body"}>
			<tr
				{...props}
				ref={ref}
				data-checked={section === "body" && checked ? "" : undefined}
				className={attrJoin(sx.className, className)}
				style={mergeStyle(sx.style, style)}>
				{children}
			</tr>
		</TableRowContext.Provider>
	);
}

function useHeaderRow(message: string) {
	const row = useContext(TableRowContext);
	invariantDev(row === "header", message);
}

function useDataRow(message: string) {
	const row = useContext(TableRowContext);
	invariantDev(row === "body" || row === "footer", message);
}

export function HeaderCell({
	ref,
	className,
	numeric = false,
	scope,
	style,
	xstyle,
	children,
	...props
}: TableHeaderCellProps) {
	useHeaderRow("Table.HeaderCell must be rendered inside a header Table.Row.");
	const sx = stylex.props(
		tableParts.headerCell,
		typescaleStyles["1"],
		fontWeightStyles.medium,
		numeric && tableParts.numeric,
		numeric && textTabularStyles.tabular,
		xstyle,
	);

	return (
		<th
			{...props}
			ref={ref}
			scope={scope ?? "col"}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}>
			{children}
		</th>
	);
}

export function Cell({ ref, className, numeric = false, style, xstyle, children, ...props }: TableCellProps) {
	useDataRow("Table.Cell must be rendered inside a body or footer Table.Row.");
	const sx = stylex.props(tableParts.cell, numeric && tableParts.numeric, numeric && textTabularStyles.tabular, xstyle);

	return (
		<td
			{...props}
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}>
			{children}
		</td>
	);
}

export function HeaderAction({ ref, className, scope, style, xstyle, children, ...props }: TableHeaderActionProps) {
	useHeaderRow("Table.HeaderAction must be rendered inside a header Table.Row.");
	const sx = stylex.props(
		tableParts.headerCell,
		typescaleStyles["1"],
		fontWeightStyles.medium,
		tableParts.actionCell,
		xstyle,
	);

	return (
		<th
			{...props}
			ref={ref}
			scope={scope ?? "col"}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}>
			{children}
		</th>
	);
}

export function CellAction({ ref, className, style, xstyle, children, ...props }: TableCellActionProps) {
	useDataRow("Table.CellAction must be rendered inside a body or footer Table.Row.");
	const sx = stylex.props(tableParts.cell, tableParts.actionCell, xstyle);

	return (
		<td
			{...props}
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}>
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
				data-component="checkbox"
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
				{...stylex.props(tableParts.checkbox)}
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
	xstyle,
	value,
	...props
}: TableHeaderCheckboxProps) {
	useHeaderRow("Table.HeaderCheckbox must be rendered inside a header Table.Row.");
	const sx = stylex.props(tableParts.headerCell, tableParts.checkboxCell, xstyle);

	return (
		<th
			{...props}
			ref={ref}
			scope={scope ?? "col"}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}>
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
	xstyle,
	value,
	...props
}: TableCellCheckboxProps) {
	useDataRow("Table.CellCheckbox must be rendered inside a body or footer Table.Row.");
	const sx = stylex.props(tableParts.cell, tableParts.checkboxCell, xstyle);

	return (
		<td
			{...props}
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}>
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

export function Empty({ ref, className, colSpan, style, xstyle, children, ...props }: TableEmptyProps) {
	const section = useContext(TableSectionContext);
	const row = useContext(TableRowContext);
	invariantDev(section === "body" && row == null, "Table.Empty must be rendered directly inside Table.Body.");
	invariantDev(Number.isInteger(colSpan) && colSpan > 0, "Table.Empty colSpan must be a positive integer.");
	const sx = stylex.props(xstyle);

	return (
		<tr
			ref={ref}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...props}>
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
		borderRadius: tokens["--radius-md"],
		backgroundColor: tokens["--surface"],
		outlineColor: tokens["--border-opaque"],
		outlineStyle: "solid",
		outlineWidth: "1px",
	},
	content: {
		borderCollapse: "collapse",
		width: "100%",
	},
	caption: {
		backgroundColor: tokens["--canvas"],
		captionSide: "top",
		color: tokens["--fg"],
		fontSize: typescaleStyles["1"].fontSize,
		fontWeight: fontWeightStyles.medium,
		lineHeight: typescaleStyles["1"].lineHeight,
		textAlign: "start",
		textIndent: tokens["--space-3"],
	},
	headerCell: {
		paddingBlock: tokens["--space-2"],
		backgroundColor: tokens["--canvas"],
		borderBlockEndColor: tokens["--border-opaque"],
		borderBlockEndStyle: "solid",
		borderBlockEndWidth: "1px",
		color: tokens["--fg-subtle"],
		paddingInlineStart: {
			default: tokens["--space-2"],
			":first-child": tokens["--space-3"],
		},
		textAlign: "start",
		verticalAlign: "middle",
		whiteSpace: "nowrap",
	},
	bodyRow: {
		backgroundColor: {
			"[data-interactive]:hover": tokens["--bg-highlight"],
			default: "transparent",
		},
	},
	checkedRow: {
		backgroundColor: {
			"[data-interactive]:hover": tokens["--bg-highlight"],
			default: tokens["--bg-accent"],
		},
	},
	cell: {
		paddingBlock: tokens["--space-2"],
		borderBlockStartColor: tokens["--border"],
		borderBlockStartStyle: "solid",
		borderBlockStartWidth: "1px",
		paddingInlineEnd: {
			default: tokens["--space-2"],
			":last-child": tokens["--space-3"],
		},
		paddingInlineStart: {
			default: tokens["--space-2"],
			":first-child": tokens["--space-3"],
		},
		textAlign: "start",
		verticalAlign: "middle",
		minHeight: tokens["--size-control-md"],
	},
	emptyCell: {
		paddingBlock: tokens["--space-10"],
		paddingInline: tokens["--space-2"],
		color: tokens["--fg-muted"],
		textAlign: "center",
	},
	actionCell: {
		paddingBlock: tokens["--space-0-5"],
		paddingInlineEnd: tokens["--space-1-5"],
		paddingInlineStart: tokens["--space-1-5"],
		textAlign: "center",
		whiteSpace: "nowrap",
		width: "1%",
	},
	numeric: {
		paddingInlineEnd: tokens["--space-3"],
		textAlign: "end",
	},
	checkboxCell: {
		paddingBlock: tokens["--space-0-5"],
		paddingInlineStart: tokens["--space-3"],
		paddingInlineEnd: tokens["--space-1"],
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
		verticalAlign: "bottom",
		minHeight: tokens["--size-indicator-sm"],
		width: "fit-content",
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
