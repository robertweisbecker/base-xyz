import { createContext, useMemo, type MouseEvent, type ReactNode, type RefObject } from "react";
import type { NavListSize } from "./nav-list.types";

export type NavListContextValue = {
	size: NavListSize;
	onNavigate?: (event: MouseEvent<HTMLElement>) => void;
};

export type Presentation = "expanded" | "icon";
type ScrollMode = "internal" | "external";

type PresentationContextValue = {
	presentation: Presentation;
	popoverSide: "left" | "right";
	scrollMode: ScrollMode;
	scrollRef?: RefObject<HTMLElement | null>;
};

export const NavListContext = createContext<NavListContextValue | null>(null);
export const NavListPresentationContext = createContext<PresentationContextValue>({
	presentation: "expanded",
	popoverSide: "right",
	scrollMode: "internal",
});
export const ScrollContext = createContext<{ scrollRef: RefObject<HTMLElement | null> } | null>(
	null,
);

export function NavListPresentationProvider({
	children,
	presentation,
	popoverSide = "right",
	scrollMode = "internal",
	scrollRef,
}: {
	children: ReactNode;
	presentation: Presentation;
	popoverSide?: "left" | "right";
	scrollMode?: ScrollMode;
	scrollRef?: RefObject<HTMLElement | null>;
}) {
	const value = useMemo(
		() => ({ presentation, popoverSide, scrollMode, scrollRef }),
		[presentation, popoverSide, scrollMode, scrollRef],
	);

	return (
		<NavListPresentationContext.Provider value={value}>
			{children}
		</NavListPresentationContext.Provider>
	);
}
