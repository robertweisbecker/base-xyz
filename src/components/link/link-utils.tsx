import { IconArrowUpRight } from "fyicons";
import type { ComponentProps } from "react";

type ExternalLinkOptions = Pick<ComponentProps<"a">, "rel" | "target"> & {
	external: boolean;
};

export const externalLinkIndicator = <IconArrowUpRight aria-hidden size="1em" />;

export function resolveExternalLinkProps({ external, rel, target }: ExternalLinkOptions) {
	return {
		rel: external ? mergeLinkRel(rel, "noopener noreferrer") : rel,
		target: external ? "_blank" : target,
	};
}

function mergeLinkRel(rel: string | undefined, requiredRel: string) {
	return Array.from(new Set(`${rel ?? ""} ${requiredRel}`.trim().split(/\s+/))).join(" ");
}
