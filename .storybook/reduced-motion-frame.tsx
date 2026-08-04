import { useLayoutEffect, type ReactNode } from "react";

export function ReducedMotionFrame({ children, reducedMotion }: { children: ReactNode; reducedMotion: boolean }) {
	useLayoutEffect(() => {
		if (reducedMotion) {
			document.documentElement.dataset.reducedMotion = "reduce";
		} else {
			delete document.documentElement.dataset.reducedMotion;
		}

		return () => delete document.documentElement.dataset.reducedMotion;
	}, [reducedMotion]);

	return <>{children}</>;
}
