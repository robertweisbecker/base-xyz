import { createFileRoute } from "@tanstack/react-router";
import { InputsPage } from "@/app/experiments/inputs-page";

export const Route = createFileRoute("/experiments/components/inputs")({
	component: InputsPage,
});
