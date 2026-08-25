import { createFileRoute } from "@tanstack/react-router";
import { ExperimentsLayout } from "@/app/experiments/experiments-layout";

export const Route = createFileRoute("/experiments")({
	component: ExperimentsLayout,
});
