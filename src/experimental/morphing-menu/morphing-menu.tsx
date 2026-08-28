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
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
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

type MorphingSubmenuProps = {
	children: ReactNode;
	hasOpenSubmenu?: boolean;
	icon: ReactNode;
	label: string;
	onOpenChange: (open: boolean) => void;
};

type MenuRowProps = {
	back?: boolean;
	icon: ReactNode;
	label: string;
	submenu?: boolean;
};

/**
 * Experimental iOS-style menu ported from Base UI PR #5335.
 *
 * The root trigger blooms into the menu surface. Submenu triggers then become
 * the header of the next popup so each level appears to morph in place.
 */
export function MorphingMenu({ label = "Document actions", defaultOpen }: MorphingMenuProps) {
	const [rootClosing, setRootClosing] = useState(false);
	const [shareOpen, setShareOpen] = useState(false);
	const [moreOpen, setMoreOpen] = useState(false);

	const handleRootOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			setRootClosing(true);
			setShareOpen(false);
			setMoreOpen(false);
		}
	};

	const handleShareOpenChange = (nextOpen: boolean) => {
		setShareOpen(nextOpen);
		if (!nextOpen) setMoreOpen(false);
	};

	return (
		<BaseMenu.Root
			defaultOpen={defaultOpen}
			onOpenChange={handleRootOpenChange}
			onOpenChangeComplete={() => setRootClosing(false)}
		>
			<span {...stylex.props(morphingMenuStyles.scope, morphingMenuStyles.root)}>
				<BaseMenu.Trigger
					data-morphing={rootClosing ? "" : undefined}
					{...stylex.props(morphingMenuStyles.trigger)}
				>
					<DotsThreeIcon
						aria-hidden
						size={20}
						weight="bold"
						{...stylex.props(morphingMenuStyles.triggerIcon)}
					/>
					<span {...stylex.props(morphingMenuStyles.visuallyHidden)}>{label}</span>
				</BaseMenu.Trigger>
			</span>

			<BaseMenu.Portal>
				<BaseMenu.Positioner
					side="top"
					align="start"
					sideOffset={-10}
					{...stylex.props(morphingMenuStyles.scope, morphingMenuStyles.positioner)}
				>
					<BaseMenu.Popup
						data-has-open-submenu={shareOpen ? "" : undefined}
						{...stylex.props(
							morphingRootPopupMarker,
							morphingMenuStyles.popup,
							morphingMenuStyles.popupWidth,
							morphingMenuStyles.rootPopup,
						)}
					>
						<div {...stylex.props(morphingMenuStyles.rootSurface)}>
							<div {...stylex.props(morphingMenuStyles.popupContent)}>
								<BaseMenu.Item
									{...stylex.props(morphingMenuStyles.row, morphingMenuStyles.interactiveRow)}
								>
									<MenuRow icon={<PencilSimpleIcon />} label="Edit" />
								</BaseMenu.Item>
								<BaseMenu.Item
									{...stylex.props(morphingMenuStyles.row, morphingMenuStyles.interactiveRow)}
								>
									<MenuRow icon={<CopyIcon />} label="Copy" />
								</BaseMenu.Item>

								<MorphingSubmenu
									hasOpenSubmenu={moreOpen}
									icon={<ShareNetworkIcon />}
									label="Share"
									onOpenChange={handleShareOpenChange}
								>
									<BaseMenu.Item
										{...stylex.props(morphingMenuStyles.row, morphingMenuStyles.interactiveRow)}
									>
										<MenuRow icon={<ChatCircleIcon />} label="Messages" />
									</BaseMenu.Item>
									<BaseMenu.Item
										{...stylex.props(morphingMenuStyles.row, morphingMenuStyles.interactiveRow)}
									>
										<MenuRow icon={<EnvelopeSimpleIcon />} label="Email" />
									</BaseMenu.Item>
									<BaseMenu.Item
										{...stylex.props(morphingMenuStyles.row, morphingMenuStyles.interactiveRow)}
									>
										<MenuRow icon={<LinkSimpleIcon />} label="Copy link" />
									</BaseMenu.Item>
									<MorphingSubmenu icon={<DotsThreeIcon />} label="More" onOpenChange={setMoreOpen}>
										<BaseMenu.Item
											{...stylex.props(morphingMenuStyles.row, morphingMenuStyles.interactiveRow)}
										>
											<MenuRow icon={<BroadcastIcon />} label="AirDrop" />
										</BaseMenu.Item>
										<BaseMenu.Item
											{...stylex.props(morphingMenuStyles.row, morphingMenuStyles.interactiveRow)}
										>
											<MenuRow icon={<FolderSimpleIcon />} label="Save to files" />
										</BaseMenu.Item>
										<BaseMenu.Item
											{...stylex.props(morphingMenuStyles.row, morphingMenuStyles.interactiveRow)}
										>
											<MenuRow icon={<BookmarkSimpleIcon />} label="Add bookmark" />
										</BaseMenu.Item>
									</MorphingSubmenu>
								</MorphingSubmenu>

								<BaseMenu.Item
									{...stylex.props(morphingMenuStyles.row, morphingMenuStyles.interactiveRow)}
								>
									<MenuRow icon={<DownloadSimpleIcon />} label="Download" />
								</BaseMenu.Item>
								<BaseMenu.Item
									{...stylex.props(morphingMenuStyles.row, morphingMenuStyles.interactiveRow)}
								>
									<MenuRow icon={<PrinterIcon />} label="Print" />
								</BaseMenu.Item>
								<BaseMenu.Item
									{...stylex.props(morphingMenuStyles.row, morphingMenuStyles.interactiveRow)}
								>
									<MenuRow icon={<ArchiveIcon />} label="Archive" />
								</BaseMenu.Item>
							</div>
						</div>
					</BaseMenu.Popup>
				</BaseMenu.Positioner>
			</BaseMenu.Portal>
		</BaseMenu.Root>
	);
}

function MorphingSubmenu({
	children,
	hasOpenSubmenu,
	icon,
	label,
	onOpenChange,
}: MorphingSubmenuProps) {
	const actionsRef = useRef<BaseMenu.Root.Actions | null>(null);
	const popupRef = useRef<HTMLDivElement | null>(null);
	const focusPopupOnOpenRef = useRef(false);
	const [open, setOpen] = useState(false);
	const [closing, setClosing] = useState(false);

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
		<BaseMenu.SubmenuRoot
			actionsRef={actionsRef}
			onOpenChange={(nextOpen, eventDetails) => {
				setOpen(nextOpen);
				onOpenChange(nextOpen);
				focusPopupOnOpenRef.current =
					nextOpen &&
					eventDetails.reason === "trigger-press" &&
					isPhysicalPointerPress(eventDetails.event);
				if (!nextOpen) setClosing(true);
			}}
			onOpenChangeComplete={() => setClosing(false)}
		>
			<BaseMenu.SubmenuTrigger
				data-morphing={closing ? "" : undefined}
				openOnHover={false}
				{...stylex.props(
					morphingSubmenuTriggerMarker,
					morphingMenuStyles.row,
					morphingMenuStyles.interactiveRow,
					morphingMenuStyles.submenuTrigger,
				)}
			>
				<MenuRow icon={icon} label={label} submenu />
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
						morphingMenuStyles.positioner,
						morphingMenuStyles.childPositioner,
					)}
				>
					<BaseMenu.Popup
						ref={popupRef}
						data-has-open-submenu={hasOpenSubmenu ? "" : undefined}
						{...stylex.props(
							morphingChildPopupMarker,
							morphingMenuStyles.popup,
							morphingMenuStyles.popupWidth,
							morphingMenuStyles.childPopup,
						)}
					>
						<div aria-hidden {...stylex.props(morphingMenuStyles.childSurface)} />
						<button
							type="button"
							tabIndex={-1}
							aria-hidden="true"
							onClick={() => actionsRef.current?.close()}
							{...stylex.props(morphingMenuStyles.row, morphingMenuStyles.submenuHeader)}
						>
							<MenuRow back icon={icon} label={label} submenu />
						</button>
						<div aria-hidden {...stylex.props(morphingMenuStyles.submenuHeaderSpacer)} />
						<div aria-hidden {...stylex.props(morphingMenuStyles.submenuSeparator)} />
						<div {...stylex.props(morphingMenuStyles.childItems)}>{children}</div>
					</BaseMenu.Popup>
				</BaseMenu.Positioner>
			</BaseMenu.Portal>
		</BaseMenu.SubmenuRoot>
	);
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
