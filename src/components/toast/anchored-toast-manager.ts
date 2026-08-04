import { Toast as BaseToast } from "@base-ui/react/toast";
import type { ReactNode } from "react";

export const anchoredToastVariants = ["default", "tooltip", "popover", "pill"] as const;
export type AnchoredToastVariant = (typeof anchoredToastVariants)[number];

export const anchoredToastTones = ["neutral", "accent", "success", "error"] as const;
export type AnchoredToastTone = (typeof anchoredToastTones)[number];

export const anchoredToastStatuses = ["idle", "loading", "ongoing", "success", "error"] as const;
export type AnchoredToastStatus = (typeof anchoredToastStatuses)[number];

export type AnchoredToastData = {
	variant?: AnchoredToastVariant;
	tone?: AnchoredToastTone;
	status?: AnchoredToastStatus;
	/**
	 * Optional icon content. Pass `false` or `null` to suppress the generated
	 * status icon. Pass `true` to request the generated status icon explicitly.
	 */
	icon?: ReactNode;
	dismissible?: boolean;
};

export function createAnchoredToastManager<Data extends AnchoredToastData = AnchoredToastData>() {
	return BaseToast.createToastManager<Data>();
}

export const anchoredToastManager = createAnchoredToastManager();

export function useAnchoredToastManager<Data extends AnchoredToastData = AnchoredToastData>() {
	return BaseToast.useToastManager<Data>();
}
