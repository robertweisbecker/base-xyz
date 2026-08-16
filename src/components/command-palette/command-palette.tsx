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
	useRef,
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
import { Kbd } from "@/components/kbd/kbd";
import { Loader } from "@/components/loader/loader";
import { menuItemSizeStyles, menuItemStyles, menuItemVariantStyles } from "@/components/menu/menu-item.stylex";
import { ScrollArea } from "@/components/scroll-area/scroll-area";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { tokens } from "@/theme/tokens.stylex";
import { SmileyMeltingIcon } from "@phosphor-icons/react";

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

type ShortcutRegistration = {
	enabled: boolean;
	invoke: () => void;
};

const shortcutRegistrations = new Set<ShortcutRegistration>();

function handleShortcutKeyDown(event: globalThis.KeyboardEvent) {
	if (event.defaultPrevented || event.repeat) {
		return;
	}
	if (event.key.toLocaleLowerCase() !== "k" || (!event.metaKey && !event.ctrlKey)) {
		return;
	}

	let owner: ShortcutRegistration | undefined;
	for (const registration of shortcutRegistrations) {
		if (registration.enabled) {
			owner = registration;
		}
	}
	if (!owner) {
		return;
	}

	event.preventDefault();
	owner.invoke();
}

function registerShortcut(registration: ShortcutRegistration) {
	if (shortcutRegistrations.size === 0) {
		document.addEventListener("keydown", handleShortcutKeyDown);
	}
	shortcutRegistrations.add(registration);
}

function unregisterShortcut(registration: ShortcutRegistration) {
	shortcutRegistrations.delete(registration);
	if (shortcutRegistrations.size === 0) {
		document.removeEventListener("keydown", handleShortcutKeyDown);
	}
}

function useCommandPaletteShortcut(shortcut: boolean, inline: boolean, toggle: () => void) {
	const registrationRef = useRef<ShortcutRegistration | null>(null);
	const toggleRef = useRef(toggle);

	toggleRef.current = toggle;
	if (registrationRef.current === null) {
		registrationRef.current = {
			enabled: shortcut && !inline,
			invoke: () => toggleRef.current(),
		};
	} else {
		registrationRef.current.enabled = shortcut && !inline;
	}

	useEffect(() => {
		const registration = registrationRef.current;
		if (!registration) {
			return;
		}

		registerShortcut(registration);
		return () => unregisterShortcut(registration);
	}, []);
}

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

	useCommandPaletteShortcut(shortcut, inline, () => setOpen(!actualOpen));

	const contextValue: CommandPaletteContextValue = {
		closeOnSelect,
		inline,
		setOpen,
	};
	const panelSx = stylex.props(commandPaletteParts.panel, inline && commandPaletteParts.inlinePanel, style);
	// SAFETY: Base UI's grouped-items overload loses ItemValue through the rest spread; the root only forwards these props.
	const rootProps = props as AutocompleteRootProps<unknown>;
	const panel = (
		<Autocomplete.Root
			{...rootProps}
			inline
			open
			autoHighlight={inline ? false : autoHighlight}
			keepHighlight={!inline}>
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

export function Trigger({ children = "Search", shortcut = "⌘K", ...props }: CommandPaletteTriggerProps) {
	return (
		<Button variant="neutral" endSlot={shortcut ? <Kbd size="sm">{shortcut}</Kbd> : props.endSlot} {...props}>
			{children}
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
	startSlot = <MagnifyingGlassIcon weight="bold" aria-hidden />,
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
			{endSlot ? (
				<span {...stylex.props(commandPaletteParts.inputEndSlot)}>{endSlot}</span>
			) : context.inline ? null : (
				<BaseDialog.Close aria-label="Close dialog">
					<Kbd variant="outline">esc</Kbd>
				</BaseDialog.Close>
			)}
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
			viewportStyle={[commandPaletteParts.listViewport, viewportStyle]}
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
			<span {...stylex.props(commandPaletteParts.itemEndSlot)}>
				{endSlot ?? (shortcut ? <Kbd size="sm">{shortcut}</Kbd> : null)}
			</span>
		</Autocomplete.Item>
	);
}

export function Empty({
	ref,
	children = (
		<EmptyState
			size="sm"
			headingLevel="h3"
			icon={<SmileyMeltingIcon aria-hidden weight="duotone" />}
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
		borderRadius: tokens["--radius-xl"],
		overflow: "hidden",
		backgroundColor: tokens["--panel"],
		boxShadow: {
			default: tokens["--shadow-sm"],
			":focus-within": tokens["--shadow-md"],
		},
		outlineWidth: {
			default: 0,
			":focus-visible": 0,
			":focus-within": 0,
		},
		maxWidth: tokens["--size-container-2xl"],
	},
	panel: {
		borderColor: "transparent",
		borderRadius: `calc(${tokens["--radius-xl"]} - 1px)`,
		borderStyle: "solid",
		borderWidth: 1,
		overflow: "hidden",
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
		backgroundColor: tokens["--panel"],
	},
	inputGroup: {
		gap: tokens["--space-2"],
		paddingInline: tokens["--space-4"],
		alignItems: "center",
		display: "flex",
		paddingBlockEnd: tokens["--space-2"],
		paddingBlockStart: tokens["--space-3"],
	},
	inputSlot: {
		alignItems: "center",
		color: tokens["--fill-neutral"],
		display: "inline-flex",
		flexShrink: 0,
		fontSize: tokens["--font-size-4"],
		justifyContent: "center",
		height: tokens["--space-5"],
		width: tokens["--space-5"],
	},
	input: {
		flex: "1 1 auto",
		color: tokens["--fg"],
		minWidth: 0,
		"::placeholder": {
			color: tokens["--fg-placeholder"],
		},
	},
	inputEndSlot: {
		alignItems: "center",
		display: "inline-flex",
		flexShrink: 0,
	},
	listArea: {
		maxHeight: "min(420px, 52dvh)",
	},
	listViewport: {
		maxHeight: "inherit",
	},
	listContent: {
		padding: tokens["--space-1"],
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
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	item: {
		paddingBlock: tokens["--space-2"],
		gridTemplateColumns: `${tokens["--space-5"]} minmax(0, 1fr) auto`,
		paddingInlineEnd: tokens["--space-4"],
	},
	itemIcon: {
		gridColumn: "1",
		alignItems: "center",
		alignSelf: "start",
		color: tokens["--fill-neutral"],
		display: "inline-flex",
		flexShrink: 0,
		fontSize: tokens["--font-size-4"],
		justifyContent: "center",
		height: tokens["--space-5"],
		minHeight: "1lh",
		minWidth: tokens["--space-5"],
		width: tokens["--space-5"],
	},
	itemText: {
		gridColumn: "2",
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
	},
	itemLabel: {
		overflow: "hidden",
		color: tokens["--fg"],
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	itemDescription: {
		overflow: "hidden",
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	itemEndSlot: {
		gridColumn: "3",
		overflow: "hidden",
		alignItems: "center",
		color: tokens["--fg-subtle"],
		display: "inline-flex",
		flexShrink: 0,
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-medium"],
		justifyContent: "flex-end",
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
	empty: {
		padding: {
			default: tokens["--space-1"],
			":empty": 0,
		},
		height: {
			default: null,
			":empty": 0,
		},
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
		paddingInline: tokens["--space-4"],
		alignItems: "center",
		backgroundColor: tokens["--elevated"],
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
		paddingBlockEnd: tokens["--space-4"],
		paddingBlockStart: tokens["--space-3"],
	},
});

export const CommandPalette = {
	Root,
	Trigger,
	Input,
	List,
	Group,
	GroupLabel,
	Items,
	Item,
	Empty,
	Loading,
	Footer,
} as const;
