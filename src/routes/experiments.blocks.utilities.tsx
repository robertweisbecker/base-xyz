import { createFileRoute } from "@tanstack/react-router";
import { UtilitiesPage } from "@/app/experiments/utilities-page";

export const Route = createFileRoute("/experiments/blocks/utilities")({
	component: UtilitiesPage,
});
