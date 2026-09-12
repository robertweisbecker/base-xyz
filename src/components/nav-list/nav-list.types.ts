import type { useRender } from "@base-ui/react/use-render";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import type { BaseStyleProps } from "@/styles/props/base";
import type { MarginProps } from "@/styles/props/spacing.stylex";

export type NavListRootProps = Omit<
	ComponentProps<"nav">,
	"className" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		className?: string;
		children: ReactNode;
		size?: NavListSize;
		onNavigate?: (event: MouseEvent<HTMLElement>) => void;
	};

export type NavListSize = "sm" | "md";
export type NavListCurrent = "page" | "location";
export type NavListIndentLevel = 0 | 1;

export type NavListSectionProps = BaseStyleProps & {
	label: string;
	description?: string;
	endSlot?: ReactNode;
	visuallyHideLabel?: boolean;
	children: ReactNode;
	className?: string;
};

export type NavListItemProps = BaseStyleProps & {
	label: string;
	icon?: ReactNode;
	startSlot?: ReactNode;
	endSlot?: ReactNode;
	children?: ReactNode;
	badge?: ReactNode;
	href?: string;
	render?: useRender.RenderProp;
	current?: NavListCurrent | false;
	active?: boolean;
	indentLevel?: NavListIndentLevel;
	disabled?: boolean;
	tooltip?: string | false;
	"aria-label"?: string;
	onClick?: MouseEventHandler<HTMLElement>;
	className?: string;
};

export type MouseEventHandler<T extends HTMLElement> = (event: MouseEvent<T>) => void;
