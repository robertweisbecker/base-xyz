import { createFileRoute } from "@tanstack/react-router";
import { ExperimentsOverviewPage } from "@/app/experiments/experiments-overview-page";

export const Route = createFileRoute("/experiments/")({
	component: ExperimentsOverviewPage,
});
