import { Autocomplete } from "@base-ui/react/autocomplete";
import type {
	AutocompleteCollectionProps,
	AutocompleteEmptyProps,
	AutocompleteGroupLabelProps,
	AutocompleteGroupProps,
	AutocompleteInputProps,
	AutocompleteItemProps,
	AutocompleteListProps,
	AutocompleteRootProps,
	AutocompleteStatusProps,
} from "@base-ui/react/autocomplete";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ComponentProps,
	type KeyboardEvent,
	type ReactElement,
	type ReactNode,
} from "react";
import { Button, type ButtonProps } from "@/components/button/button";
import { modalBackdropStyles, modalPopupStyles, modalViewportStyles } from "@/components/dialog/dialog.stylex";
import { EmptyState } from "@/components/empty-state/empty-state";
import { fieldStyles, fieldTextStyles } from "@/components/field/field.stylex";
import { Loader } from "@/components/loader/loader";
import { menuItemSizeStyles, menuItemStyles, menuItemVariantStyles } from "@/components/menu/menu-item.stylex";
import { ScrollArea } from "@/components/scroll-area/scroll-area";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { tokens } from "@/theme/tokens.stylex";

type StyledProps<T> = Omit<T, "className" | "style"> & {
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

type CommandPaletteContextValue = {
	closeOnSelect: boolean;
	inline: boolean;
	setOpen: (open: boolean) => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export type CommandPaletteRootProps<ItemValue> = Omit<
	AutocompleteRootProps<ItemValue>,
	"children" | "inline" | "keepHighlight" | "onOpenChange" | "open"
> & {
	children: ReactNode;
	className?: string;
	closeOnSelect?: boolean;
	defaultOpen?: boolean;
	inline?: boolean;
	label?: string;
	onOpenChange?: (open: boolean) => void;
	open?: boolean;
	shortcut?: boolean;
	trigger?: ReactElement;
	/** StyleX overrides for the palette panel, applied after the component's own styles. */
	style?: StyleXStyles;
};

export type CommandPaletteTriggerProps = Omit<ButtonProps, "children"> & {
	children?: ReactNode;
	shortcut?: ReactNode;
};

export type CommandPaletteInputProps = Omit<StyledProps<AutocompleteInputProps>, "onKeyDown"> & {
	endSlot?: ReactNode;
	label?: string;
	onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
	startSlot?: ReactNode;
};

export type CommandPaletteListProps = StyledProps<AutocompleteListProps> & {
	areaStyle?: StyleXStyles;
	contentStyle?: StyleXStyles;
	viewportStyle?: StyleXStyles;
};

export type CommandPaletteGroupProps = StyledProps<AutocompleteGroupProps>;
export type CommandPaletteGroupLabelProps = StyledProps<AutocompleteGroupLabelProps>;
export type CommandPaletteItemsProps = AutocompleteCollectionProps;
export type CommandPaletteEmptyProps = StyledProps<AutocompleteEmptyProps>;
export type CommandPaletteLoadingProps = StyledProps<AutocompleteStatusProps>;
export type CommandPaletteFooterProps = StyledProps<ComponentProps<"div">>;
export type CommandPaletteShortcutProps = StyledProps<ComponentProps<"kbd">>;
export type CommandPaletteItemProps = Omit<StyledProps<AutocompleteItemProps>, "children"> & {
	children?: ReactNode;
	closeOnSelect?: boolean;
	description?: ReactNode;
	endSlot?: ReactNode;
	shortcut?: ReactNode;
	startSlot?: ReactNode;
};

export function Root<ItemValue = unknown>({
	autoHighlight = "always",
	children,
	className,
	closeOnSelect = true,
	defaultOpen = false,
	inline = false,
	label = "Command palette",
	onOpenChange,
	open,
	shortcut = false,
	style,
	trigger,
	...props
}: CommandPaletteRootProps<ItemValue>) {
	const controlled = open !== undefined;
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const actualOpen = inline ? true : controlled ? open : uncontrolledOpen;

	const setOpen = useCallback(
		(nextOpen: boolean) => {
			if (!controlled) {
				setUncontrolledOpen(nextOpen);
			}
			onOpenChange?.(nextOpen);
		},
		[controlled, onOpenChange],
	);

	useEffect(() => {
		if (!shortcut || inline) {
			return;
		}

		function handleKeyDown(event: globalThis.KeyboardEvent) {
			if (event.key.toLocaleLowerCase() !== "k" || (!event.metaKey && !event.ctrlKey)) {
				return;
			}

			event.preventDefault();
			setOpen(!actualOpen);
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [actualOpen, inline, setOpen, shortcut]);

	const contextValue: CommandPaletteContextValue = {
		closeOnSelect,
		inline,
		setOpen,
	};
	const panelSx = stylex.props(commandPaletteParts.panel, inline && commandPaletteParts.inlinePanel, style);
	const panel = (
		<Autocomplete.Root
			{...(props as AutocompleteRootProps<unknown>)}
			inline
			open
			autoHighlight={autoHighlight}
			keepHighlight>
			<CommandPaletteContext.Provider value={contextValue}>
				<div
					aria-label={label}
					role={inline ? "group" : undefined}
					className={[panelSx.className, className].filter(Boolean).join(" ")}
					style={panelSx.style}>
					{children}
				</div>
			</CommandPaletteContext.Provider>
		</Autocomplete.Root>
	);

	if (inline) {
		return panel;
	}

	return (
		<BaseDialog.Root open={actualOpen} onOpenChange={setOpen}>
			{trigger ? <BaseDialog.Trigger render={trigger} /> : null}
			<BaseDialog.Portal>
				<BaseDialog.Backdrop {...stylex.props(modalBackdropStyles, commandPaletteParts.backdrop)} />
				<BaseDialog.Viewport {...stylex.props(modalViewportStyles, commandPaletteParts.viewport)}>
					<BaseDialog.Popup aria-label={label} {...stylex.props(modalPopupStyles, commandPaletteParts.popup)}>
						{panel}
						<BaseDialog.Close>
							<VisuallyHidden>Close command palette</VisuallyHidden>
						</BaseDialog.Close>
					</BaseDialog.Popup>
				</BaseDialog.Viewport>
			</BaseDialog.Portal>
		</BaseDialog.Root>
	);
}

export function Trigger({ children = "Open command palette", shortcut = "⌘K", ...props }: CommandPaletteTriggerProps) {
	return (
		<Button variant="secondary" {...props}>
			{children}
			{shortcut ? <Shortcut>{shortcut}</Shortcut> : undefined}
		</Button>
	);
}

export function Input({
	ref,
	className,
	endSlot,
	label = "Search commands",
	onKeyDown,
	placeholder = "Search commands…",
	startSlot = <MagnifyingGlassIcon aria-hidden weight="bold" />,
	style,
	...props
}: CommandPaletteInputProps) {
	const context = useCommandPaletteContext();
	const inputGroupSx = stylex.props(commandPaletteParts.inputGroup, style);

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		onKeyDown?.(event);
		if (event.defaultPrevented) {
			return;
		}
		if (event.key === "Escape") {
			context.setOpen(false);
		}
	}

	return (
		<Autocomplete.InputGroup
			className={[inputGroupSx.className, className].filter(Boolean).join(" ")}
			style={inputGroupSx.style}>
			{startSlot ? (
				<span aria-hidden {...stylex.props(commandPaletteParts.inputSlot)}>
					{startSlot}
				</span>
			) : null}
			<Autocomplete.Input
				ref={ref}
				aria-label={label}
				autoFocus
				placeholder={placeholder}
				onKeyDown={handleKeyDown}
				{...stylex.props(fieldStyles.inputUnstyled, fieldTextStyles.md, commandPaletteParts.input)}
				{...props}
			/>
			{endSlot ? <span {...stylex.props(commandPaletteParts.inputEndSlot)}>{endSlot}</span> : null}
		</Autocomplete.InputGroup>
	);
}

export function List({
	children,
	className,
	style,
	areaStyle,
	contentStyle,
	viewportStyle,
	...props
}: CommandPaletteListProps) {
	const sx = stylex.props(commandPaletteParts.list, style);

	return (
		<ScrollArea
			label="Command results"
			disableFade
			showScrollbar="scroll"
			style={[commandPaletteParts.listArea, areaStyle]}
			viewportStyle={viewportStyle}
			contentStyle={[commandPaletteParts.listContent, contentStyle]}>
			<Autocomplete.List className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props}>
				{children}
			</Autocomplete.List>
		</ScrollArea>
	);
}

export function Group({ ref, className, style, ...props }: CommandPaletteGroupProps) {
	const sx = stylex.props(commandPaletteParts.group, style);

	return (
		<Autocomplete.Group
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function GroupLabel({ ref, className, style, ...props }: CommandPaletteGroupLabelProps) {
	const sx = stylex.props(commandPaletteParts.groupLabel, style);

	return (
		<Autocomplete.GroupLabel
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}
		/>
	);
}

export function Items(props: CommandPaletteItemsProps) {
	return <Autocomplete.Collection {...props} />;
}

export function Item({
	ref,
	children,
	className,
	closeOnSelect,
	description,
	endSlot,
	onClick,
	shortcut,
	startSlot,
	style,
	...props
}: CommandPaletteItemProps) {
	const context = useCommandPaletteContext();
	const shouldCloseOnSelect = closeOnSelect ?? context.closeOnSelect;
	const sx = stylex.props(
		menuItemStyles.item,
		menuItemSizeStyles.md,
		menuItemVariantStyles.default,
		commandPaletteParts.item,
		style,
	);

	return (
		<Autocomplete.Item
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented && shouldCloseOnSelect) {
					context.setOpen(false);
				}
			}}
			{...props}>
			<span aria-hidden {...stylex.props(commandPaletteParts.itemIcon)}>
				{startSlot}
			</span>
			<span {...stylex.props(commandPaletteParts.itemText)}>
				<span {...stylex.props(commandPaletteParts.itemLabel)}>{children}</span>
				{description ? <span {...stylex.props(commandPaletteParts.itemDescription)}>{description}</span> : null}
			</span>
			{endSlot ?? (shortcut ? <Shortcut>{shortcut}</Shortcut> : null)}
		</Autocomplete.Item>
	);
}

export function Empty({
	ref,
	children = (
		<EmptyState
			size="sm"
			headingLevel="h3"
			icon={<MagnifyingGlassIcon aria-hidden weight="duotone" />}
			title="No commands found"
			description="Try a different search term."
		/>
	),
	className,
	style,
	...props
}: CommandPaletteEmptyProps) {
	const sx = stylex.props(commandPaletteParts.empty, style);

	return (
		<Autocomplete.Empty
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}>
			{children}
		</Autocomplete.Empty>
	);
}

export function Loading({ ref, children = "Loading…", className, style, ...props }: CommandPaletteLoadingProps) {
	const sx = stylex.props(commandPaletteParts.loading, style);

	return (
		<Autocomplete.Status
			ref={ref}
			className={[sx.className, className].filter(Boolean).join(" ")}
			style={sx.style}
			{...props}>
			<Loader aria-hidden />
			{children}
		</Autocomplete.Status>
	);
}

export function Footer({ className, style, ...props }: CommandPaletteFooterProps) {
	const sx = stylex.props(commandPaletteParts.footer, style);

	return <div className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

export function Shortcut({ className, style, ...props }: CommandPaletteShortcutProps) {
	const sx = stylex.props(commandPaletteParts.shortcut, style);

	return <kbd className={[sx.className, className].filter(Boolean).join(" ")} style={sx.style} {...props} />;
}

function useCommandPaletteContext() {
	const context = useContext(CommandPaletteContext);
	if (!context) {
		throw new Error("CommandPalette parts must be rendered inside CommandPalette.Root.");
	}
	return context;
}

const commandPaletteParts = stylex.create({
	backdrop: {
		backgroundColor: "light-dark(rgb(0 0 0 / 8%), rgb(0 0 0 / 8%))",
	},
	viewport: {
		alignItems: "flex-start",
		paddingBlockStart: "14dvh",
	},
	popup: {
		padding: 0,
		overflow: "hidden",
		boxShadow: {
			default: tokens["--shadow-md"],
			":focus-within": `inset 0 0 0 2px ${tokens["--focus"]}, ${tokens["--shadow-md"]}`,
		},
		maxWidth: "680px",
		borderRadius: tokens["--radius-lg"],
	},
	panel: {
		overflow: "hidden",
		backgroundColor: tokens["--panel"],
		color: tokens["--fg"],
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
	inlinePanel: {
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-lg"],
		borderStyle: "solid",
		borderWidth: "1px",
	},
	inputGroup: {
		gap: tokens["--space-3"],
		paddingBlock: tokens["--space-3"],
		paddingInline: tokens["--space-4"],
		alignItems: "center",
		borderBlockEndColor: tokens["--border"],
		borderBlockEndStyle: "solid",
		borderBlockEndWidth: "1px",
		display: "flex",
	},
	inputSlot: {
		alignItems: "center",
		color: tokens["--fg-subtle"],
		display: "inline-flex",
		flexShrink: 0,
		justifyContent: "center",
		height: tokens["--space-5"],
		width: tokens["--space-5"],
	},
	input: {
		flex: "1 1 auto",
		color: tokens["--fg"],
		minWidth: 0,
	},
	inputEndSlot: {
		alignItems: "center",
		display: "inline-flex",
		flexShrink: 0,
	},
	listArea: {
		maxHeight: "min(420px, 52dvh)",
	},
	listContent: {
		paddingInline: tokens["--space-1"],
		paddingBlockEnd: tokens["--space-4"],
		paddingBlockStart: tokens["--space-1"],
	},
	list: {
		display: "flex",
		flexDirection: "column",
	},
	group: {
		display: "flex",
		flexDirection: "column",
	},
	groupLabel: {
		paddingBlock: tokens["--space-2"],
		paddingInline: tokens["--space-3"],
		color: tokens["--fg-subtle"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	item: {
		gridTemplateColumns: `${tokens["--space-6"]} minmax(0, 1fr) auto`,
		paddingBlock: tokens["--space-2"],
	},
	itemIcon: {
		gridColumn: "1",
		alignItems: "center",
		alignSelf: "start",
		color: tokens["--fg-subtle"],
		display: "inline-flex",
		justifyContent: "center",
		// height: tokens["--space-6"],
		// width: tokens["--space-6"],
		fontSize: tokens["--font-size-3"],
		minHeight: "1lh",
	},
	itemText: {
		gridColumn: "2",
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
	},
	itemLabel: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	itemDescription: {
		overflow: "hidden",
		color: tokens["--fg-subtle"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	empty: {
		paddingBlock: tokens["--space-6"],
		paddingInline: tokens["--space-4"],
	},
	loading: {
		gap: tokens["--space-2"],
		paddingBlock: tokens["--space-4"],
		paddingInline: tokens["--space-5"],
		alignItems: "center",
		color: tokens["--fg-muted"],
		display: "flex",
	},
	footer: {
		gap: tokens["--space-3"],
		paddingBlock: tokens["--space-3"],
		paddingInline: tokens["--space-5"],
		alignItems: "center",
		borderBlockStartColor: tokens["--border"],
		borderBlockStartStyle: "solid",
		borderBlockStartWidth: "1px",
		color: tokens["--fg-muted"],
		display: "flex",
		flexWrap: "wrap",
		fontSize: tokens["--font-size-1"],
		justifyContent: "space-between",
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	shortcut: {
		borderRadius: tokens["--radius-xs"],
		paddingBlock: "1px",
		paddingInline: tokens["--space-1"],
		backgroundColor: tokens["--surface-subtle"],
		color: tokens["--fg-muted"],
		fontFamily: "inherit",
		fontSize: "10px",
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		whiteSpace: "nowrap",
	},
});
