import { Menu as BaseMenu } from "@base-ui/react/menu";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import * as stylex from "@stylexjs/stylex";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
	morphingChildPopupMarker,
	morphingMenuStyles,
	morphingRootPopupMarker,
	morphingSubmenuTriggerMarker,
} from "./morphing-menu.stylex";
import { morphingModelSelectorStyles } from "./morphing-model-selector.stylex";

type RootProps = {
	children: ReactNode;
	defaultOpen?: boolean;
	hasOpenSubmenu: boolean;
	icon: ReactNode;
	label: string;
	meta: string;
	onOpenChange?: (open: boolean) => void;
	rowCount: number;
};

type SubmenuProps = {
	children: ReactNode;
	hasOpenSubmenu?: boolean;
	icon: ReactNode;
	label: string;
	onOpenChange: (open: boolean) => void;
	value?: string;
};

type RowProps = {
	back?: boolean;
	icon: ReactNode;
	label: string;
	selected?: boolean;
	submenu?: boolean;
	value?: string;
};

export function MorphingSelectorRoot({
	children,
	defaultOpen = true,
	hasOpenSubmenu,
	icon,
	label,
	meta,
	onOpenChange,
	rowCount,
}: RootProps) {
	const [closing, setClosing] = useState(false);

	return (
		<BaseMenu.Root
			defaultOpen={defaultOpen}
			onOpenChange={(open) => {
				if (!open) setClosing(true);
				onOpenChange?.(open);
			}}
			onOpenChangeComplete={() => setClosing(false)}
		>
			<span
				{...stylex.props(
					morphingMenuStyles.scope,
					morphingModelSelectorStyles.menuScope,
					morphingMenuStyles.root,
				)}
			>
				<BaseMenu.Trigger
					data-morphing={closing ? "" : undefined}
					{...stylex.props(morphingMenuStyles.trigger, morphingModelSelectorStyles.trigger)}
				>
					<span aria-hidden {...stylex.props(morphingModelSelectorStyles.triggerIcon)}>
						{icon}
					</span>
					<span {...stylex.props(morphingModelSelectorStyles.triggerCopy)}>
						<span {...stylex.props(morphingModelSelectorStyles.triggerLabel)}>{label}</span>
						<span {...stylex.props(morphingModelSelectorStyles.triggerMeta)}>{meta}</span>
					</span>
				</BaseMenu.Trigger>
			</span>

			<BaseMenu.Portal>
				<BaseMenu.Positioner
					side="top"
					align="start"
					sideOffset={-10}
					{...stylex.props(
						morphingMenuStyles.scope,
						morphingModelSelectorStyles.menuScope,
						morphingMenuStyles.positioner,
					)}
				>
					<BaseMenu.Popup
						data-has-open-submenu={hasOpenSubmenu ? "" : undefined}
						{...stylex.props(
							morphingRootPopupMarker,
							morphingMenuStyles.popup,
							morphingMenuStyles.popupWidth,
							morphingMenuStyles.rootPopup,
							morphingModelSelectorStyles.rootRows(rowCount),
						)}
					>
						<div {...stylex.props(morphingMenuStyles.rootSurface)}>
							<div {...stylex.props(morphingMenuStyles.popupContent)}>{children}</div>
						</div>
					</BaseMenu.Popup>
				</BaseMenu.Positioner>
			</BaseMenu.Portal>
		</BaseMenu.Root>
	);
}

export function MorphingSelectorSubmenu({
	children,
	hasOpenSubmenu,
	icon,
	label,
	onOpenChange,
	value,
}: SubmenuProps) {
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
					morphingModelSelectorStyles.row,
				)}
			>
				<MorphingSelectorRow icon={icon} label={label} submenu value={value} />
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
						morphingModelSelectorStyles.menuScope,
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
							{...stylex.props(
								morphingMenuStyles.row,
								morphingMenuStyles.submenuHeader,
								morphingModelSelectorStyles.row,
							)}
						>
							<MorphingSelectorRow back icon={icon} label={label} submenu value={value} />
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

export function MorphingSelectorRadioGroup({
	children,
	onValueChange,
	value,
}: {
	children: ReactNode;
	onValueChange: (value: string) => void;
	value: string;
}) {
	return (
		<BaseMenu.RadioGroup value={value} onValueChange={onValueChange}>
			{children}
		</BaseMenu.RadioGroup>
	);
}

export function MorphingSelectorOption({
	icon,
	label,
	selected,
	value,
}: {
	icon: ReactNode;
	label: string;
	selected: boolean;
	value: string;
}) {
	return (
		<BaseMenu.RadioItem
			value={value}
			{...stylex.props(
				morphingMenuStyles.row,
				morphingMenuStyles.interactiveRow,
				morphingModelSelectorStyles.row,
			)}
		>
			<MorphingSelectorRow icon={icon} label={label} selected={selected} />
		</BaseMenu.RadioItem>
	);
}

function MorphingSelectorRow({ back, icon, label, selected, submenu, value }: RowProps) {
	return (
		<>
			<span {...stylex.props(morphingModelSelectorStyles.rowCopy)}>
				<span aria-hidden {...stylex.props(morphingMenuStyles.itemIcon)}>
					{icon}
				</span>
				<span {...stylex.props(morphingModelSelectorStyles.rowLabel)}>{label}</span>
			</span>
			<span {...stylex.props(morphingModelSelectorStyles.rowEnd)}>
				{value ? (
					<span {...stylex.props(morphingModelSelectorStyles.rowValue)}>{value}</span>
				) : null}
				{selected ? (
					<CheckIcon
						aria-hidden
						weight="bold"
						{...stylex.props(morphingModelSelectorStyles.check)}
					/>
				) : null}
				{submenu ? (
					<CaretRightIcon
						aria-hidden
						size={16}
						weight="bold"
						{...stylex.props(morphingMenuStyles.chevron, back && morphingMenuStyles.chevronBack)}
					/>
				) : null}
			</span>
		</>
	);
}

function isPhysicalPointerPress(event: Event) {
	if ("pointerType" in event && typeof event.pointerType === "string") {
		return event.pointerType.length > 0;
	}

	if ("touches" in event) return true;
	return event instanceof MouseEvent && event.detail > 0;
}
