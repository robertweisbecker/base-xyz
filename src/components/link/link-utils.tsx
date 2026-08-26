import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import type { ComponentProps } from "react";

type ExternalLinkOptions = Pick<ComponentProps<"a">, "rel" | "target"> & {
	external: boolean;
};

export const externalLinkIndicator = <ArrowUpRightIcon aria-hidden size="1em" weight="regular" />;

export function resolveExternalLinkProps({ external, rel, target }: ExternalLinkOptions) {
	return {
		rel: external ? mergeLinkRel(rel, "noopener noreferrer") : rel,
		target: external ? "_blank" : target,
	};
}

function mergeLinkRel(rel: string | undefined, requiredRel: string) {
	return Array.from(new Set(`${rel ?? ""} ${requiredRel}`.trim().split(/\s+/))).join(" ");
}
