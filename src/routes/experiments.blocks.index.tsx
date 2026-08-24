import { createFileRoute } from "@tanstack/react-router";
import { BlocksIndexPage } from "@/app/experiments/blocks-index-page";

export const Route = createFileRoute("/experiments/blocks/")({
	component: BlocksIndexPage,
});
