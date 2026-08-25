import { createFileRoute } from "@tanstack/react-router";
import { ComponentsIndexPage } from "@/app/experiments/components-index-page";

export const Route = createFileRoute("/experiments/components/")({
	component: ComponentsIndexPage,
});
