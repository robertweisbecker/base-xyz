import { createFileRoute } from "@tanstack/react-router";
import { PopupsPage } from "@/app/experiments/popups-page";

export const Route = createFileRoute("/experiments/components/popups")({
	component: PopupsPage,
});
