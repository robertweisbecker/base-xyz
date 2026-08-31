import { Menu as BaseMenu } from "@base-ui/react/menu";
import { ArchiveIcon } from "@phosphor-icons/react/dist/csr/Archive";
import { BookmarkSimpleIcon } from "@phosphor-icons/react/dist/csr/BookmarkSimple";
import { BroadcastIcon } from "@phosphor-icons/react/dist/csr/Broadcast";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { ChatCircleIcon } from "@phosphor-icons/react/dist/csr/ChatCircle";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { DotsThreeIcon } from "@phosphor-icons/react/dist/csr/DotsThree";
import { DownloadSimpleIcon } from "@phosphor-icons/react/dist/csr/DownloadSimple";
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/csr/EnvelopeSimple";
import { FolderSimpleIcon } from "@phosphor-icons/react/dist/csr/FolderSimple";
import { LinkSimpleIcon } from "@phosphor-icons/react/dist/csr/LinkSimple";
import { PencilSimpleIcon } from "@phosphor-icons/react/dist/csr/PencilSimple";
import { PrinterIcon } from "@phosphor-icons/react/dist/csr/Printer";
import { ShareNetworkIcon } from "@phosphor-icons/react/dist/csr/ShareNetwork";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import {
	createContext,
	useContext,
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from "react";
import {
	morphingChildPopupMarker,
	morphingMenuStyles,
	morphingRootPopupMarker,
	morphingSubmenuTriggerMarker,
} from "./morphing-menu.stylex";

export type MorphingMenuProps = {
	/** Accessible name for the menu trigger. */
	label?: string;
	/** Opens the root menu on first render. Useful while inspecting the experiment. */
	defaultOpen?: boolean;
};

type MorphingMenuRootProps = {
	children: ReactNode;
	defaultOpen?: boolean;
	menuWidth?: string;
	rootRowCount?: number;
	trigger: ReactNode;
	triggerLabel: string;
	triggerXstyle?: StyleXStyles;
};

type MorphingMenuSubmenuProps = {
	children: ReactNode;
	label: string;
	renderRow: (back: boolean) => ReactNode;
	rowXstyle?: StyleXStyles;
};

type MorphingMenuItemProps = Omit<BaseMenu.Item.Props, "className" | "style"> & {
	xstyle?: StyleXStyles;
};

type MorphingMenuRadioItemProps = Omit<BaseMenu.RadioItem.Props, "className" | "style"> & {
	xstyle?: StyleXStyles;
};

type MenuRowProps = {
	back?: boolean;
	icon: ReactNode;
	label: string;
	submenu?: boolean;
};

type MorphingMenuContextValue = {
	menuWidth: string;
	openSubmenuId: string | null;
	setOpenSubmenuId: Dispatch<SetStateAction<string | null>>;
};

const MorphingMenuContext = createContext<MorphingMenuContextValue | null>(null);

/**
 * Experimental iOS-style menu ported from a Base UI popup demo.
 *
 * The private compound owns the morphing state machine and geometry. Examples
 * provide their trigger and row content without duplicating focus or dismissal.
 */
export function MorphingMenuExample({
	label = "Document actions",
	defaultOpen,
}: MorphingMenuProps) {
	return (
		<Root
			defaultOpen={defaultOpen}
			rootRowCount={6}
			trigger={
				<DotsThreeIcon
					aria-hidden
					size={20}
					weight="bold"
					{...stylex.props(morphingMenuStyles.triggerIcon)}
				/>
			}
			triggerLabel={label}
		>
			<Item>
				<MenuRow icon={<PencilSimpleIcon />} label="Edit" />
			</Item>
			<Item>
				<MenuRow icon={<CopyIcon />} label="Copy" />
			</Item>

			<Submenu
				label="Share"
				renderRow={(back) => (
					<MenuRow back={back} icon={<ShareNetworkIcon />} label="Share" submenu />
				)}
			>
				<Item>
					<MenuRow icon={<ChatCircleIcon />} label="Messages" />
				</Item>
				<Item>
					<MenuRow icon={<EnvelopeSimpleIcon />} label="Email" />
				</Item>
				<Item>
					<MenuRow icon={<LinkSimpleIcon />} label="Copy link" />
				</Item>
				<Submenu
					label="More"
					renderRow={(back) => (
						<MenuRow back={back} icon={<DotsThreeIcon />} label="More" submenu />
					)}
				>
					<Item>
						<MenuRow icon={<BroadcastIcon />} label="AirDrop" />
					</Item>
					<Item>
						<MenuRow icon={<FolderSimpleIcon />} label="Save to files" />
					</Item>
					<Item>
						<MenuRow icon={<BookmarkSimpleIcon />} label="Add bookmark" />
					</Item>
				</Submenu>
			</Submenu>

			<Item>
				<MenuRow icon={<DownloadSimpleIcon />} label="Download" />
			</Item>
			<Item>
				<MenuRow icon={<PrinterIcon />} label="Print" />
			</Item>
			<Item>
				<MenuRow icon={<ArchiveIcon />} label="Archive" />
			</Item>
		</Root>
	);
}

export function Root({
	children,
	defaultOpen,
	menuWidth = "10rem",
	rootRowCount = 6,
	trigger,
	triggerLabel,
	triggerXstyle,
}: MorphingMenuRootProps) {
	const [closing, setClosing] = useState(false);
	const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);

	return (
		<MorphingMenuContext value={{ menuWidth, openSubmenuId, setOpenSubmenuId }}>
			<BaseMenu.Root
				defaultOpen={defaultOpen}
				onOpenChange={(open) => {
					if (!open) {
						setClosing(true);
						setOpenSubmenuId(null);
					}
				}}
				onOpenChangeComplete={() => setClosing(false)}
			>
				<span
					{...stylex.props(
						morphingMenuStyles.scope,
						morphingMenuStyles.menuWidth(menuWidth),
						morphingMenuStyles.rootRows(rootRowCount),
						morphingMenuStyles.root,
					)}
				>
					<BaseMenu.Trigger
						aria-label={triggerLabel}
						data-morphing={closing ? "" : undefined}
						{...stylex.props(morphingMenuStyles.trigger, triggerXstyle)}
					>
						{trigger}
					</BaseMenu.Trigger>
				</span>

				<BaseMenu.Portal>
					<BaseMenu.Positioner
						side="top"
						align="start"
						sideOffset={-10}
						{...stylex.props(
							morphingMenuStyles.scope,
							morphingMenuStyles.menuWidth(menuWidth),
							morphingMenuStyles.rootRows(rootRowCount),
							morphingMenuStyles.positioner,
						)}
					>
						<BaseMenu.Popup
							data-has-open-submenu={openSubmenuId ? "" : undefined}
							{...stylex.props(
								morphingRootPopupMarker,
								morphingMenuStyles.popup,
								morphingMenuStyles.popupWidth,
								morphingMenuStyles.rootPopup,
							)}
						>
							<div
								data-morphing-closing={closing ? "" : undefined}
								{...stylex.props(morphingMenuStyles.rootSurface)}
							>
								<div
									data-morphing-closing={closing ? "" : undefined}
									{...stylex.props(morphingMenuStyles.popupContent)}
								>
									{children}
								</div>
							</div>
						</BaseMenu.Popup>
					</BaseMenu.Positioner>
				</BaseMenu.Portal>
			</BaseMenu.Root>
		</MorphingMenuContext>
	);
}

export function Submenu({ children, label, renderRow, rowXstyle }: MorphingMenuSubmenuProps) {
	const { menuWidth, setOpenSubmenuId: setParentOpenSubmenuId } = useMorphingMenuContext();
	const submenuId = useId();
	const actionsRef = useRef<BaseMenu.Root.Actions | null>(null);
	const popupRef = useRef<HTMLDivElement | null>(null);
	const focusPopupOnOpenRef = useRef(false);
	const [open, setOpen] = useState(false);
	const [closing, setClosing] = useState(false);
	const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);

	useLayoutEffect(() => {
		if (open && focusPopupOnOpenRef.current) {
			const frame = requestAnimationFrame(() => {
				popupRef.current?.focus({ preventScroll: true });
				focusPopupOnOpenRef.current = false;
			});

			return () => cancelAnimationFrame(frame);
		}
	}, [open]);

	return (
		<MorphingMenuContext value={{ menuWidth, openSubmenuId, setOpenSubmenuId }}>
			<BaseMenu.SubmenuRoot
				actionsRef={actionsRef}
				onOpenChange={(nextOpen, eventDetails) => {
					setOpen(nextOpen);
					setParentOpenSubmenuId((currentId) =>
						nextOpen ? submenuId : currentId === submenuId ? null : currentId,
					);
					focusPopupOnOpenRef.current =
						nextOpen &&
						eventDetails.reason === "trigger-press" &&
						isPhysicalPointerPress(eventDetails.event);
					if (!nextOpen) {
						setClosing(true);
						setOpenSubmenuId(null);
					}
				}}
				onOpenChangeComplete={() => setClosing(false)}
			>
				<BaseMenu.SubmenuTrigger
					data-morphing={closing ? "" : undefined}
					label={label}
					openOnHover={false}
					{...stylex.props(
						morphingSubmenuTriggerMarker,
						morphingMenuStyles.row,
						morphingMenuStyles.interactiveRow,
						morphingMenuStyles.submenuTrigger,
						rowXstyle,
					)}
				>
					{renderRow(false)}
				</BaseMenu.SubmenuTrigger>

				<BaseMenu.Portal>
					<BaseMenu.Positioner
						side="bottom"
						align="center"
						sideOffset={({ side, anchor }) =>
							side === "top" || side === "bottom" ? -anchor.height : -anchor.width
						}
						collisionAvoidance={{ side: "flip", align: "shift", fallbackAxisSide: "none" }}
						{...stylex.props(
							morphingMenuStyles.scope,
							morphingMenuStyles.menuWidth(menuWidth),
							morphingMenuStyles.positioner,
							morphingMenuStyles.childPositioner,
						)}
					>
						<BaseMenu.Popup
							ref={popupRef}
							data-has-open-submenu={openSubmenuId ? "" : undefined}
							{...stylex.props(
								morphingChildPopupMarker,
								morphingMenuStyles.popup,
								morphingMenuStyles.popupWidth,
								morphingMenuStyles.childPopup,
							)}
						>
							<div
								aria-hidden
								data-morphing-closing={closing ? "" : undefined}
								{...stylex.props(morphingMenuStyles.childSurface)}
							/>
							<BaseMenu.Item
								aria-label={`Back from ${label}`}
								closeOnClick={false}
								onClick={() => actionsRef.current?.close()}
								{...stylex.props(
									morphingMenuStyles.row,
									morphingMenuStyles.interactiveRow,
									morphingMenuStyles.submenuHeader,
									rowXstyle,
								)}
							>
								{renderRow(true)}
							</BaseMenu.Item>
							<div aria-hidden {...stylex.props(morphingMenuStyles.submenuHeaderSpacer)} />
							<div
								aria-hidden
								data-morphing-closing={closing ? "" : undefined}
								{...stylex.props(morphingMenuStyles.submenuSeparator)}
							/>
							<div
								data-morphing-closing={closing ? "" : undefined}
								{...stylex.props(morphingMenuStyles.childItems)}
							>
								{children}
							</div>
						</BaseMenu.Popup>
					</BaseMenu.Positioner>
				</BaseMenu.Portal>
			</BaseMenu.SubmenuRoot>
		</MorphingMenuContext>
	);
}

export function Item({ xstyle, ...props }: MorphingMenuItemProps) {
	return (
		<BaseMenu.Item
			{...stylex.props(morphingMenuStyles.row, morphingMenuStyles.interactiveRow, xstyle)}
			{...props}
		/>
	);
}

export function RadioItem({ xstyle, ...props }: MorphingMenuRadioItemProps) {
	return (
		<BaseMenu.RadioItem
			{...stylex.props(morphingMenuStyles.row, morphingMenuStyles.interactiveRow, xstyle)}
			{...props}
		/>
	);
}

export function RadioGroup(props: BaseMenu.RadioGroup.Props) {
	return <BaseMenu.RadioGroup {...props} />;
}

export function RadioItemIndicator(props: BaseMenu.RadioItemIndicator.Props) {
	return <BaseMenu.RadioItemIndicator {...props} />;
}

function useMorphingMenuContext() {
	const context = useContext(MorphingMenuContext);
	if (!context) throw new Error("MorphingMenu parts must be rendered inside MorphingMenu.Root.");
	return context;
}

function isPhysicalPointerPress(event: Event) {
	if ("pointerType" in event && typeof event.pointerType === "string") {
		return event.pointerType.length > 0;
	}

	if ("touches" in event) return true;
	return event instanceof MouseEvent && event.detail > 0;
}

function MenuRow({ back, icon, label, submenu }: MenuRowProps) {
	return (
		<>
			<span {...stylex.props(morphingMenuStyles.itemLabel)}>
				<span aria-hidden {...stylex.props(morphingMenuStyles.itemIcon)}>
					{icon}
				</span>
				{label}
			</span>
			{submenu ? (
				<CaretRightIcon
					aria-hidden
					size={16}
					weight="bold"
					{...stylex.props(morphingMenuStyles.chevron, back && morphingMenuStyles.chevronBack)}
				/>
			) : null}
		</>
	);
}
