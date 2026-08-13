# Plan: Extract semantic `Table` primitives from `DataTable`

Status: Ready for implementation

Decision date: 2026-08-12

Repository: `/Users/robertweisbecker/Sites/stylex`

## 1. Goal

Create a new public, presentation-only `Table` compound component and refactor the existing `DataTable` to compose it.

The new `Table` owns:

- semantic table structure;
- the existing canonical DataTable table appearance;
- explicit, composable header/data/action/checkbox cells;
- development-only validation of invalid compound-part nesting;
- checked-row presentation;
- a reusable one-cell empty row.

The existing `DataTable` continues to own:

- TanStack Table v9 configuration and state;
- columns and data;
- filtering and filter menus;
- sorting behavior and sorting controls;
- row selection behavior;
- row expansion behavior;
- column visibility;
- row-action menus;
- the filter/action toolbar above the table;
- the selection/column-count metadata below the table.

This is an extraction and composition change. It is **not** a redesign of the `DataTable` public API.

## 2. Non-goals

Do not do any of the following as part of this work:

- Do not convert `DataTable` into `DataTable.Root`, providers, hooks, slots, or other compound parts.
- Do not change or remove any existing `DataTableProps`.
- Do not add DataTable structural override/render props.
- Do not change TanStack Table versions or configuration.
- Do not add table density, size, visual variant, striped-row, sticky-header, pagination, virtualization, or responsive-card APIs.
- Do not add a public row-header cell in v1. A future `Table.RowHeader` can render `<th scope="row">` if a real use case appears.
- Do not add public expanded-row or expanded-cell parts. Expansion remains DataTable-specific.
- Do not add `Table.Toolbar`, `Table.Metadata`, or other non-table regions. Arbitrary caller content can already be placed inside `Table.Root`.
- Do not use `Table.Footer` for DataTable's selection/column-count metadata. `Table.Footer` means semantic `<tfoot>` only.
- Do not add a polymorphic `render`, `as`, or tag-switching prop. Every semantic part has one fixed native tag.
- Do not modify unrelated dirty files or clean the worktree.
- Do not commit unless the user separately asks for a commit.

## 3. Worktree safety: read this before editing

The worktree is already dirty. Existing changes belong to the user and must be preserved.

At the time this plan was written, relevant concurrent changes included:

- `src/components/data-table/data-table.tsx`
  - sortable headers were changed from an icon-only `IconButton` to a `Button` with an `endSlot`;
  - `tableParts.headerLabel` gained `color: tokens["--fg-muted"]`.
- `src/components/data-table/data-table.stories.tsx`
  - command-palette shortcut examples now use the public `Kbd` component.
- `src/components/index.ts`
  - `Kbd` and `KbdGroup` were added to the public barrel.
- `src/components/checkbox/checkbox.tsx`
  - `labelMarker` is being applied to `Field.Label`.

Preserve all of those changes. In particular, do not restore the old sortable-header `IconButton` while refactoring DataTable.

Before editing:

```sh
git status --short --branch
git diff -- src/components/data-table/data-table.tsx
git diff -- src/components/data-table/data-table.stories.tsx
git diff -- src/components/index.ts
git diff -- src/components/checkbox/checkbox.tsx
```

After editing, run the same commands and confirm that the pre-existing hunks are still present.

## 4. Final public API

`Table.Container` is an optional styling and overflow wrapper. `Table.Content` accepts either `Table.Root` or `Table.Container` as its immediate parent. The canonical examples below use `Table.Container` when the scrollable frame is desired; direct `Table.Root` → `Table.Content` composition is also valid.

The public composition must support this exact shape:

```tsx
<Table.Root>
	{/* Optional caller-owned controls or layout */}
	<Table.Container>
		<Table.Content caption={<VisuallyHidden>Deployments</VisuallyHidden>}>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCheckbox
						label="Select all rows"
						checked={allChecked}
						indeterminate={someChecked && !allChecked}
						onCheckedChange={setAllChecked}
					/>
					<Table.HeaderCell>Name</Table.HeaderCell>
					<Table.HeaderAction>
						<VisuallyHidden>Row actions</VisuallyHidden>
					</Table.HeaderAction>
				</Table.Row>
			</Table.Header>

			<Table.Body>
				<Table.Row checked={rowChecked}>
					<Table.CellCheckbox
						label="Select app.example.com"
						checked={rowChecked}
						onCheckedChange={setRowChecked}
					/>
					<Table.Cell>app.example.com</Table.Cell>
					<Table.CellAction>
						<IconButton icon={<Icon.More />} label="Open actions" />
					</Table.CellAction>
				</Table.Row>

				<Table.Empty colSpan={3}>No deployments.</Table.Empty>
			</Table.Body>

			<Table.Footer>
				<Table.Row>
					<Table.Cell colSpan={3}>3 deployments</Table.Cell>
				</Table.Row>
			</Table.Footer>
		</Table.Content>
	</Table.Container>
	{/* Optional caller-owned metadata or layout */}
</Table.Root>
```

Export one namespace object:

```ts
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
```

### 4.1 Semantic mapping

| Public part | Native output | Valid parent/context | Notes |
| --- | --- | --- | --- |
| `Table.Root` | `<div>` | anywhere | Outer assembly. It may contain arbitrary controls and metadata. |
| `Table.Container` | shared `ScrollArea` root | inside `Table.Root` | Optional rounded, elevated panel with a design-system horizontal scrollbar and the generic viewport name “Scrollable table.” |
| `Table.Content` | `<table>` | inside `Table.Root` or `Table.Container` | Accepts `caption?: ReactNode`; renders `<caption>` first when provided. |
| `Table.Header` | `<thead>` | inside `Table.Content` | May contain multiple `Table.Row` children for grouped headers. |
| `Table.Body` | `<tbody>` | inside `Table.Content` | Contains body rows or `Table.Empty`. |
| `Table.Footer` | `<tfoot>` | inside `Table.Content` | Semantic table footer, never the external DataTable metadata. |
| `Table.Row` | `<tr>` | inside Header, Body, or Footer | One contextual row component; tag never changes. |
| `Table.HeaderCell` | `<th>` | inside a Header row | Defaults `scope="col"`; passes through native `scope`, `colSpan`, `aria-sort`, etc. |
| `Table.Cell` | `<td>` | inside a Body or Footer row | Standard data cell. |
| `Table.HeaderAction` | `<th>` | inside a Header row | Compact header cell for disclosure/action/menu columns. Defaults `scope="col"`. |
| `Table.CellAction` | `<td>` | inside a Body or Footer row | Compact data cell for disclosure/action/menu controls. |
| `Table.HeaderCheckbox` | `<th>` containing `Checkbox` | inside a Header row | Compact selection header; defaults `scope="col"`. |
| `Table.CellCheckbox` | `<td>` containing `Checkbox` | inside a Body or Footer row | Compact row-selection cell. |
| `Table.Empty` | `<tr><td>` | directly inside Body | Requires a positive `colSpan`; children are the empty message. |

### 4.2 Naming rules

- Use **Table** for the manually composed, presentation-only primitive.
- Use **Data table** for the stateful, data-driven component.
- Use **action cell** for a compact cell containing a direct interactive control, including disclosure buttons and action-menu triggers.
- Use **checked row**, `checked`, and `data-checked` in the `Table` API. Do not introduce `selected` or `data-selected` into `Table`.
- Existing DataTable and TanStack row-selection names remain unchanged. DataTable maps `row.getIsSelected()` to `Table.Row checked`.

## 5. Files to create or change

Create:

- `src/components/table/table.tsx`
- `src/components/table/table.stories.tsx`
- `src/components/table/index.ts`
- `docs/adr/0002-semantic-table-primitives.md`

Change:

- `src/components/data-table/data-table.tsx`
- `src/components/index.ts`
- `src/App.tsx`
- `CONTEXT.md`

Do not change `src/components/checkbox/checkbox.tsx`; consume its current public API.

## 6. Implement `Table`

### 6.1 Imports and common prop helper

Start `src/components/table/table.tsx` with the following dependency shape:

```tsx
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	createContext,
	useContext,
	useMemo,
	type ComponentProps,
	type ReactNode,
} from "react";
import { Checkbox, type CheckboxProps } from "@/components/checkbox/checkbox";
import {
	fontWeightStyles,
	typescaleStyles,
} from "@/components/text/text.stylex";
import { tokens } from "@/theme/tokens.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};
```

Do not use a namespace import for any `.stylex.ts` module. Apply caller `style` last in every `stylex.props(...)` call.

Use this helper or equivalent wherever a part supports `className`:

```ts
function joinClassNames(...values: Array<string | undefined>) {
	return values.filter(Boolean).join(" ");
}
```

### 6.2 Public prop types

Use native props for each fixed semantic tag:

```ts
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
```

Derive checkbox behavior from the existing `CheckboxProps`; do not redeclare callback or state types by hand:

```ts
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

export type TableHeaderCheckboxProps = Omit<
	TableHeaderActionProps,
	"children" | keyof TableCheckboxControlProps
> &
	TableCheckboxControlProps;

export type TableCellCheckboxProps = Omit<
	TableCellActionProps,
	"children" | keyof TableCheckboxControlProps
> &
	TableCheckboxControlProps;

export type TableEmptyProps = Omit<TableRowProps, "checked"> & {
	colSpan: number;
};
```

Checkbox-cell routing rules:

- Top-level `ref`, `className`, `style`, native cell props, `scope`, and `colSpan` apply to the outer `<th>` or `<td>`.
- The picked checkbox behavior props apply to the inner `Checkbox`.
- Always render the inner Checkbox with `size="md"` and `visuallyHideLabel`.
- Do not expose `description`, Checkbox layout theme props, Checkbox `style`, Checkbox `className`, Checkbox ref, `size`, or `visuallyHideLabel` through these table parts.
- Do not pass `aria-label` redundantly when the required `label` already creates the accessible name.

### 6.3 Private structural context

Use private context for validation. Context chooses styling and validates placement; it must **not** infer whether a cell is `<th>` or `<td>`.

Use this model:

```ts
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
```

`Table.Root` must reset all three contexts so nested tables do not accidentally inherit an outer table row:

```tsx
<TableLevelContext.Provider value="root">
	<TableSectionContext.Provider value={null}>
		<TableRowContext.Provider value={null}>
			<div ...>{children}</div>
		</TableRowContext.Provider>
	</TableSectionContext.Provider>
</TableLevelContext.Provider>
```

Development validation rules and exact intended errors:

```txt
Table.Container must be rendered inside Table.Root.
Table.Content must be rendered inside Table.Root or Table.Container.
Table.Header must be rendered inside Table.Content.
Table.Body must be rendered inside Table.Content.
Table.Footer must be rendered inside Table.Content.
Table.Row must be rendered inside Table.Header, Table.Body, or Table.Footer.
Table.Row checked is only valid inside Table.Body.
Table.HeaderCell must be rendered inside a header Table.Row.
Table.HeaderAction must be rendered inside a header Table.Row.
Table.HeaderCheckbox must be rendered inside a header Table.Row.
Table.Cell must be rendered inside a body or footer Table.Row.
Table.CellAction must be rendered inside a body or footer Table.Row.
Table.CellCheckbox must be rendered inside a body or footer Table.Row.
Table.Empty must be rendered directly inside Table.Body.
Table.Empty colSpan must be a positive integer.
```

Validation must be guarded by `import.meta.env.DEV`. Valid production output must not depend on the validation branch.

### 6.4 Part implementation behavior

Implement the parts according to the following pseudocode. This is intentionally explicit; do not replace fixed tags with polymorphic rendering.

#### Root

```tsx
export function Root({ ref, className, style, children, ...props }: TableRootProps) {
	const sx = stylex.props(tableParts.root, typescaleStyles["2"], style);

	return (
		<TableLevelContext.Provider value="root">
			<TableSectionContext.Provider value={null}>
				<TableRowContext.Provider value={null}>
					<div
						ref={ref}
						className={joinClassNames(sx.className, className)}
						style={sx.style}
						{...props}
					>
						{children}
					</div>
				</TableRowContext.Provider>
			</TableSectionContext.Provider>
		</TableLevelContext.Provider>
	);
}
```

#### Container

- Read `TableLevelContext` and assert `"root"`.
- Apply `tableParts.container`, then caller style.
- Render the shared `ScrollArea` with `orientation="horizontal"` and `size="content"`; its root remains a `<div>`.
- Pass the generic `label="Scrollable table"` to `ScrollArea` so an overflowing, keyboard-focusable viewport has an accessible name. Keep this component-owned rather than adding a label prop or placing the label on the outer root.
- Do not expose a second scrolling configuration through `Table.Container`; horizontal table overflow is the component-owned behavior.
- Do not add native `overflow: auto` to `tableParts.container`; the shared `ScrollArea` owns viewport overflow and scrollbar rendering.
- Provide `TableLevelContext` value `"container"` to children.

#### Content

- Read `TableLevelContext` and assert `"root"` or `"container"`.
- Apply `tableParts.content`, then caller style.
- Render `<table>` and provide `TableLevelContext` value `"content"`.
- If `caption != null`, render `<caption {...stylex.props(tableParts.caption)}>{caption}</caption>` before `children`.
- Keep native `aria-label` and `aria-labelledby` props available through table props for externally labelled tables.
- Do not auto-generate IDs or render a separate Title/Description API.

#### Header, Body, Footer

Each section must:

1. Read `TableLevelContext` and assert `"content"`.
2. Assert that there is no active `TableRowContext`; sections must not be nested inside rows.
3. Render its fixed tag.
4. Provide its exact `TableSectionContext` value around that tag.

`Header` applies `tableParts.header`; Body and Footer only apply caller style unless a real default style is needed by the extracted appearance.

#### Row

```tsx
export function Row({ ref, checked = false, className, style, ...props }: TableRowProps) {
	const section = useContext(TableSectionContext);
	invariantDev(section != null, "Table.Row must be rendered inside Table.Header, Table.Body, or Table.Footer.");
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
				ref={ref}
				data-checked={section === "body" && checked ? "" : undefined}
				className={joinClassNames(sx.className, className)}
				style={sx.style}
				{...props}
			/>
		</TableRowContext.Provider>
	);
}
```

Important: put `{...props}` before an owned attribute if spreading it afterward could overwrite the owned value. `checked` must own the emitted `data-checked` marker.

#### HeaderCell and Cell

- `HeaderCell` requires a row whose context section is `"header"`.
- It renders `<th scope={scope ?? "col"}>`.
- Compose `tableParts.headerCell`, `typescaleStyles["1"]`, `fontWeightStyles.medium`, then caller style.
- `Cell` requires a row whose section is `"body"` or `"footer"`.
- It renders `<td>`.
- Compose `tableParts.cell`, `row.checked && tableParts.checkedCell`, then caller style.

#### HeaderAction and CellAction

- Validate the same contexts as HeaderCell and Cell respectively.
- HeaderAction renders `<th scope={scope ?? "col"}>`.
- CellAction renders `<td>`.
- HeaderAction composes header-cell styles plus `tableParts.actionCell`.
- CellAction composes data-cell styles, checked-cell styles when applicable, plus `tableParts.actionCell`.
- These parts render arbitrary children. They do not size, clone, or replace nested icons; Button/IconButton/Checkbox own their own icon/control sizing.

#### HeaderCheckbox and CellCheckbox

Explicitly destructure all picked Checkbox behavior props so they do not leak onto `<th>` or `<td>`:

```tsx
const checkboxProps = {
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
};
```

Render this content inside the appropriately validated and styled action cell:

```tsx
<span {...stylex.props(tableParts.checkboxFrame)}>
	<Checkbox
		{...checkboxProps}
		size="md"
		visuallyHideLabel
		style={tableParts.checkbox}
	/>
</span>
```

Do not wrap one public part inside another public part if that would trigger an extra validation path or nested `<th>/<td>`. Share a private style/helper or duplicate the small outer element implementation.

#### Empty

- Require direct Body section context and no active row context.
- In development, require `Number.isInteger(colSpan) && colSpan > 0`.
- Render one `<tr>` and one `<td colSpan={colSpan}>`.
- Top-level native row props, ref, className, and style apply to the `<tr>`.
- Children render inside the `<td>`.
- Apply `tableParts.cell` and `tableParts.emptyCell` to the `<td>`.
- Do not apply the normal body-row hover or checked styles.

### 6.5 Styles to move from DataTable

Move the current values rather than visually redesigning them.

Use this ownership map:

| Current `data-table.tsx` style | New owner/name |
| --- | --- |
| `tableParts.root` | `Table` / `tableParts.root` |
| `tableParts.surface` | `Table` / `tableParts.container` |
| `tableParts.table` | `Table` / `tableParts.content` |
| `tableParts.header` | `Table` / `tableParts.header` |
| structural portion of `headerCell` | `Table` / `tableParts.headerCell` |
| `tableParts.row` | `Table` / `tableParts.bodyRow` and `checkedRow` |
| `tableParts.cell` | `Table` / `tableParts.cell` and `checkedCell` |
| `tableParts.emptyCell` | `Table` / `tableParts.emptyCell` |
| `tableParts.utilityColumn` | `Table` / `tableParts.actionCell` |
| `selectionCheckbox` | `Table` / `tableParts.checkbox` |
| `selectionCheckboxFrame` | `Table` / `tableParts.checkboxFrame` |

Keep these styles in DataTable:

- `toolbar`
- `filter`
- `toolbarActions`
- `filterTrigger`
- `filterTriggerContent`
- `filterTriggerLabel`
- `headerContent`
- `headerLabel`, including the user's concurrent muted-color change
- `expandedRow`
- `expandedCell`
- external metadata currently named `footer` (rename it to `metadata` to avoid confusion with `<tfoot>`)

Use shared typography styles instead of copying font-size/letter-spacing/line-height triples:

- Table Root: `typescaleStyles["2"]`
- Header cells: `typescaleStyles["1"]` plus `fontWeightStyles.medium`
- DataTable external metadata: `typescaleStyles["1"]`

The extracted style shape should be equivalent to:

```tsx
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
		backgroundColor: tokens["--panel"],
		boxShadow: tokens["--shadow-sm"],
	},
	content: {
		borderCollapse: "collapse",
		width: "100%",
	},
	caption: {
		captionSide: "top",
		textAlign: "start",
	},
	header: {
		backgroundColor: "transparent",
	},
	headerCell: {
		paddingBlock: tokens["--space-1"],
		paddingInlineStart: tokens["--space-2"],
		color: tokens["--fg-muted"],
		textAlign: "start",
		verticalAlign: "middle",
		whiteSpace: "nowrap",
	},
	bodyRow: {
		backgroundColor: {
			default: "transparent",
			":hover": tokens["--bg-highlight"],
		},
	},
	checkedRow: {
		backgroundColor: {
			default: tokens["--bg-accent"],
			":hover": tokens["--bg-highlight"],
		},
	},
	cell: {
		paddingBlock: tokens["--space-2"],
		borderBlockStartColor: tokens["--border"],
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
	checkedCell: {
		borderBlockStartColor: "transparent",
	},
	emptyCell: {
		paddingBlock: tokens["--space-10"],
		paddingInline: tokens["--space-2"],
		color: tokens["--fg-muted"],
		textAlign: "center",
	},
	actionCell: {
		paddingInline: tokens["--space-2"],
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
	},
});
```

Style details that must be verified live:

- checked rows use the accent background at rest and the existing highlight on hover;
- checked body cells receive a transparent block-start border through row context;
- action columns remain `width: 1%`, centered, and non-wrapping;
- checkbox controls retain the current `md` optical size;
- caller StyleX styles win over every default;
- Container overflow and rounded/elevated appearance match the current DataTable surface.

## 7. Refactor `DataTable` to use `Table`

### 7.1 Imports

In `src/components/data-table/data-table.tsx`:

- add `import { Table } from "@/components/table/table";`
- remove the direct `Checkbox` import after deleting `RowSelectionCheckbox`;
- import `typescaleStyles` if needed for the external metadata style;
- preserve the user's current `Button`-based sortable header implementation.

### 7.2 Selection column definitions

The structural checkbox cells must own the actual Checkbox. Therefore the internal `__select` TanStack column must stop returning `RowSelectionCheckbox` React elements.

Replace the selection definition with a structural marker column:

```tsx
if (rowSelection) {
	internalColumns.push({
		id: "__select",
		enableHiding: false,
		enableSorting: false,
	});
}
```

Delete the private `RowSelectionCheckbox` function after the render branches below use `Table.HeaderCheckbox` and `Table.CellCheckbox`.

Leave the `__expand` and `__actions` render callbacks intact; their content is rendered inside action cells.

### 7.3 Column classification helpers

Replace `getColumnTone` with explicit semantic classification:

```ts
function isSelectionColumn(columnId: string) {
	return columnId === "__select";
}

function isActionColumn(columnId: string) {
	return columnId === "__expand" || columnId === "__actions";
}
```

Do not classify ordinary caller columns from width, content, metadata, or position. Only DataTable's three private IDs receive special structural parts.

### 7.4 Replace the returned structure

Replace only the semantic table region and outer root. Keep toolbar and external metadata content intact.

DataTable deliberately continues using `Table.Container` so it retains the canonical scrollable surface. The resulting shape should be:

```tsx
return (
	<Table.Root className={className} style={style} {...props}>
		<div {...stylex.props(dataTableParts.toolbar)}>
			{/* Existing filter and toolbar actions, unchanged */}
		</div>

		<Table.Container>
			<Table.Content>
				<Table.Header>
					{table.getHeaderGroups().map((headerGroup) => (
						<Table.Row key={headerGroup.id}>
							{/* Header mapping described below */}
						</Table.Row>
					))}
				</Table.Header>

				<Table.Body>
					{/* Row/empty mapping described below */}
				</Table.Body>
			</Table.Content>
		</Table.Container>

		<div {...stylex.props(dataTableParts.metadata, typescaleStyles["1"])}>
			{/* Existing selected and visible counts, unchanged */}
		</div>
	</Table.Root>
);
```

Do not pass `caption` from DataTable because DataTable has no caption prop today. Do not invent one during this extraction. DataTable remains valid in page contexts where an adjacent heading describes it; the standalone Table story must demonstrate the caption API.

### 7.5 Header mapping

For every TanStack header:

1. Preserve `key={header.id}` and `colSpan={header.colSpan}`.
2. If the column is `__select`, render `Table.HeaderCheckbox` and do not call `HeaderContent`.
3. If the column is `__expand` or `__actions`, render `Table.HeaderAction`.
4. Otherwise render `Table.HeaderCell` with `aria-sort={getAriaSort(header.column)}`.
5. Preserve `header.isPlaceholder` behavior.

Copy-ready branch shape:

```tsx
{headerGroup.headers.map((header) => {
	const columnId = header.column.id;

	if (isSelectionColumn(columnId)) {
		return (
			<Table.HeaderCheckbox
				key={header.id}
				colSpan={header.colSpan}
				checked={table.getIsAllRowsSelected()}
				indeterminate={
					table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
				}
				label="Select all rows"
				onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
			/>
		);
	}

	const content = header.isPlaceholder ? null : (
		<HeaderContent column={header.column} header={header} />
	);

	if (isActionColumn(columnId)) {
		return (
			<Table.HeaderAction key={header.id} colSpan={header.colSpan}>
				{content}
			</Table.HeaderAction>
		);
	}

	return (
		<Table.HeaderCell
			key={header.id}
			colSpan={header.colSpan}
			aria-sort={getAriaSort(header.column)}
		>
			{content}
		</Table.HeaderCell>
	);
})}
```

### 7.6 Body-row and cell mapping

For each visible TanStack row:

- render `Table.Row`;
- set `checked={row.getIsSelected()}`;
- preserve `data-expanded={row.getIsExpanded() ? "" : undefined}`;
- preserve the Fragment and stable row IDs;
- map each cell according to the private column ID.

Copy-ready cell mapping:

```tsx
{row.getVisibleCells().map((cell) => {
	const columnId = cell.column.id;

	if (isSelectionColumn(columnId)) {
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

	const content = flexRender(
		cell.column.columnDef.cell,
		cell.getContext(),
	);

	if (isActionColumn(columnId)) {
		return <Table.CellAction key={cell.id}>{content}</Table.CellAction>;
	}

	return <Table.Cell key={cell.id}>{content}</Table.Cell>;
})}
```

### 7.7 Expanded rows

Expansion is not a public Table concept. Compose normal primitives and apply DataTable-local styles:

```tsx
{renderExpandedRow && row.getIsExpanded() ? (
	<Table.Row key={`${row.id}-expanded`} style={dataTableParts.expandedRow}>
		<Table.Cell
			colSpan={Math.max(1, row.getVisibleCells().length)}
			style={dataTableParts.expandedCell}
		>
			{renderExpandedRow(row)}
		</Table.Cell>
	</Table.Row>
) : null}
```

Because normal body rows have hover styling, make `dataTableParts.expandedRow` explicitly preserve its intended background on hover as well as at rest. Do not add a public Table expanded variant.

### 7.8 Empty rows

Replace the current raw empty `<tr>/<td>` with:

```tsx
<Table.Empty colSpan={Math.max(1, table.getVisibleLeafColumns().length)}>
	{emptyLabel}
</Table.Empty>
```

The `Math.max(1, ...)` guard ensures valid HTML even if every hideable column is hidden and no internal utility column is present.

### 7.9 DataTable styles after extraction

Rename the remaining private map from `tableParts` to `dataTableParts` so it is not confused with the new public Table owner.

Remove all styles now owned by Table. Keep only DataTable-specific styles listed in section 6.5.

Delete these now-obsolete helpers/imports:

- `RowSelectionCheckbox`
- `getColumnTone`
- direct `Checkbox` import
- `rootSx`

Do not remove:

- `HeaderContent`
- current Button-based sorting code
- `getSortIcon`
- `getSortLabel`
- `getAriaSort`
- filtering/menu/action helpers
- `VisuallyHidden`, still used by `__expand` and `__actions` headers

## 8. Public exports

Create `src/components/table/index.ts`:

```ts
export * from "./table";
```

In `src/components/index.ts`, add the public compound export alphabetically near other `T` components:

```ts
export { Table } from "./table/table";
```

Do not remove or rearrange the user's concurrent Kbd export. Avoid broad barrel reformatting.

The individual prop types remain exported from `table.tsx` and the local `table/index.ts`. Following existing compound-component barrel precedent, the aggregate `src/components/index.ts` only needs to export the `Table` namespace unless a real aggregate type consumer is added during implementation.

## 9. Storybook

Create `src/components/table/table.stories.tsx` with title `Components/Table` and `Playground` as the first exported story.

### 9.1 Playground controls

Use story-only arguments prefixed with `_`:

- `_caption`: string, default `"Deployments"`
- `_checked`: boolean, default `false`
- `_empty`: boolean, default `false`
- `_showFooter`: boolean, default `true`

Disable `style`, structural children, and layout escape hatches from controls.

The Playground must:

- wrap `_caption` in `VisuallyHidden` and pass it through `Table.Content.caption`;
- show HeaderCell, Cell, HeaderAction, CellAction, HeaderCheckbox, and CellCheckbox;
- use controlled React state for row checkboxes;
- synchronize controlled state when `_checked` changes from Storybook controls;
- demonstrate an indeterminate select-all checkbox when only some rows are checked;
- show `Table.Empty` instead of body rows when `_empty` is true;
- show semantic Footer/Row/Cell composition when `_showFooter` is true;
- use real Button/IconButton controls rather than decorative placeholders.

### 9.2 States story

Add one fixed `States` story with controls disabled. Display clearly labelled examples for:

- normal rows;
- one checked row;
- an empty table;
- a table with a visible rich caption, using `Text render={<span />}` inside the caption;
- a semantic footer.

Use sentence-case, muted, regular-weight supporting labels. Do not add decorative cards, tinted wells, or specimen panels.

### 9.3 Development validation

Do not commit a permanently broken Storybook story. During implementation, temporarily exercise representative invalid structures locally and then remove them:

```tsx
<Table.HeaderCell>Invalid outside a row</Table.HeaderCell>
<Table.Header><Table.Row checked /></Table.Header>
<Table.Body><Table.Row><Table.HeaderCell>Invalid</Table.HeaderCell></Table.Row></Table.Body>
<Table.Empty colSpan={0}>Invalid</Table.Empty>
```

Confirm each produces the documented development error. Restore valid stories before building Storybook.

## 10. Demo gallery

Update `src/App.tsx` because new public components belong in the gallery.

- Import `Table` from `./components`, never from the implementation file.
- Keep the public component imports alphabetical.
- Add a compact, non-interactive specimen titled `Table` in the alphabetically correct position near `Switch`/`Tabs`.
- The specimen should include a visually hidden caption, one header row, two body rows, and at least one standard cell.
- Keep the existing `DataTable` specimen unchanged except for any formatting mechanically required by the new import.
- Do not duplicate the DataTable filtering/selection behavior in the Table specimen; the specimen exists to demonstrate manual semantic composition.

## 11. Domain documentation

### 11.1 Glossary

Append these concepts to `CONTEXT.md`, adapting punctuation to the file's existing list format without rewriting existing entries:

```md
- **Table** — A manually composed, presentation-only compound component for semantic tabular structure and its canonical visual treatment. It owns no dataset-derived behavior such as filtering, sorting, visibility, or expansion.
- **Data table** — A stateful, data-driven component that derives rows and columns from data and composes `Table` for presentation. It owns filtering, sorting, visibility, selection, expansion, and row actions.
- **Action cell** — A compact table header or data cell reserved for a direct interactive control, such as a disclosure button or row-action menu trigger. Checkbox cells are specialized action cells that own the design-system Checkbox composition.
- **Checked row** — A body row whose selection checkbox is checked and which receives the corresponding visual treatment. Use `checked`, not `selected`, in the presentation-only `Table` API.
```

Do not add implementation-specific context/provider/style details to the glossary.

### 11.2 ADR

Create `docs/adr/0002-semantic-table-primitives.md` with this decision content:

```md
# ADR 0002: Explicit semantic table primitives

- Status: Accepted
- Date: 2026-08-12

## Context

DataTable owned reusable semantic table markup and appearance alongside TanStack state, filtering, sorting, selection, expansion, and actions. Consumers also need the same table structure and visual treatment without adopting the stateful DataTable API. A single cell component with a type prop or parent-inferred tag would make invalid header/data-cell combinations easier to write and would weaken native prop typing.

## Decision

Introduce a public, presentation-only `Table` compound component and make DataTable compose it. `Table.Root` is an outer assembly div so controls and metadata may be composed around the table; the optional `Table.Container` composes the shared `ScrollArea` in horizontal mode to add the scrollable frame and gives its focusable viewport the generic accessible name “Scrollable table,” while `Table.Content` is the semantic `<table>` and may be rendered directly inside Root or inside Container. Header, Body, and Footer map directly to `<thead>`, `<tbody>`, and `<tfoot>`. One contextual Row always renders `<tr>`. Header/data/action/checkbox cells remain explicit parts with fixed `<th>` or `<td>` output, while private context validates their section and row placement in development. Checkbox cells compose the existing design-system Checkbox, and `Table.Content` owns optional rich caption rendering so the caption is always the table's first child.

## Consequences

Manual tables and DataTable share one visual and semantic source of truth without coupling Table to TanStack. The namespace is larger than a type-prop API, but call sites expose native semantics and prop types directly. Row-header cells, expanded-row presentation, toolbar/metadata parts, and a compound DataTable API remain outside v1 and can be added only when real consumers require them.
```

## 12. Verification

Run validation independently; one passing command does not substitute for another.

### 12.1 Static and production checks

```sh
npx tsc -b
npm run lint
npm run build
npm run build-storybook
```

If `npm run build` stops at known TypeScript errors before Vite runs, also run:

```sh
npx vite build
```

At planning time, `npx tsc -b` already failed on unrelated concurrent work:

```txt
src/components/breadcrumbs/breadcrumbs.tsx: unused LinkPrimitive
src/components/code-block/code-block.tsx: sx prop reaches a native pre element
src/components/item/item.tsx: unused fontWeightStyles
src/components/select/select.stories.tsx: unused Text import
src/components/tabs/tabs.stories.tsx: unused CaretRightIcon import
```

Do not fix those files as part of this task. Compare failures before and after the Table work and report the baseline separately. New errors in Table or DataTable are in scope and must be fixed.

### 12.2 Live Storybook checks

Because this change moves StyleX selectors and interactive table structure, start Storybook and wait for optimization to finish:

```sh
npm run storybook
```

Verify the new `Components/Table` Playground and the existing `Components/Data table` Playground.

Inspect all of the following:

1. DOM structure
   - Root is a `<div>`.
   - Container's shared `ScrollArea` root is a `<div>`, its focusable viewport is named “Scrollable table,” and it renders its horizontal scrollbar only when content overflows.
   - Content is `<table>`.
   - Caption is the first table child when supplied.
   - Header/Body/Footer are `<thead>/<tbody>/<tfoot>`.
   - Every Row is `<tr>`.
   - Header parts are `<th>` and data parts are `<td>`.
   - Empty renders one `<tr>` containing one spanning `<td>`.

2. Accessibility
   - The caption supplies the accessible table name.
   - HeaderCell, HeaderAction, and HeaderCheckbox default to `scope="col"`.
   - Select-all and row checkboxes have distinct accessible names.
   - Sortable DataTable headers preserve their Button accessible labels and `aria-sort` values.
   - Expansion controls preserve `aria-expanded` and their row-specific labels.
   - Row-action triggers retain row-specific labels.

3. Interaction
   - Header checkbox selects/deselects all DataTable rows.
   - Header checkbox becomes indeterminate for partial selection.
   - Row checkbox toggles its own row.
   - Checked row emits `data-checked` and receives the intended background/border treatment.
   - Sorting cycles exactly as before.
   - Text and option filters still work.
   - Column visibility still works.
   - Expansion still works with and without a dedicated expand column.
   - Row-action menus still open and execute callbacks.
   - Keyboard focus order and visible focus treatment remain correct.

4. Layout and styling
   - Container scrolls horizontally when content is wide.
   - Rounded corners, background, and shadow match the old DataTable surface.
   - Action columns remain compact.
   - Header text and the user's new sortable Button treatment remain unchanged.
   - Empty and expanded rows retain their existing appearance.
   - External selected/column-count metadata remains outside the semantic table.
   - No valid story logs a Table composition error or other new console error.

5. Edge cases
   - Content rendered directly inside Root without Container;
   - Content rendered inside the optional Container wrapper;
	- no visible data rows;
   - all hideable columns hidden;
   - row selection disabled;
   - expansion disabled;
   - row actions omitted;
   - grouped/multiple TanStack header rows;
   - one checked row and all checked rows;
   - caller StyleX override on Root, Container, Content, Row, and Cell.

### 12.3 Final diff review

Before handing off:

```sh
git diff --check
git status --short --branch
git diff -- .agents/table-primitives-plan.md
git diff -- src/components/table
git diff -- src/components/data-table/data-table.tsx
git diff -- src/components/data-table/data-table.stories.tsx
git diff -- src/components/index.ts
git diff -- src/App.tsx
git diff -- CONTEXT.md docs/adr/0002-semantic-table-primitives.md
```

Confirm:

- no unrelated user edits disappeared;
- DataTable's current public types did not change;
- no dependency or lockfile changed;
- no old raw semantic table tag with extracted canonical styling remains in DataTable;
- DataTable still uses TanStack v9 `useTable` and its existing feature registry;
- the new Table gallery specimen imports only the public export;
- all new and changed files are formatted consistently;
- no commit was created unless explicitly requested.

## 13. Definition of done

This task is complete only when all of the following are true:

- `Table` is publicly exported and manually usable without DataTable or TanStack.
- Its namespace and tag mapping exactly match section 4.
- Invalid compound composition throws the documented errors in development.
- Valid production rendering does not depend on validation code.
- DataTable uses Table parts for every `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` previously carrying the extracted canonical styles.
- DataTable's existing public API and feature behavior remain intact.
- Selection uses HeaderCheckbox/CellCheckbox and checked rows emit `data-checked`.
- DataTable expansion remains local and uses ordinary Table Row/Cell parts.
- Storybook documents all public Table parts and meaningful states.
- The gallery includes an alphabetical public-export Table specimen.
- `CONTEXT.md` and ADR 0002 record the agreed terminology and architectural decision.
- Validation results and unrelated pre-existing failures are reported accurately.
- Existing dirty worktree changes are preserved.
