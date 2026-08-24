import { createFileRoute } from "@tanstack/react-router";
import { TablesPage } from "@/app/experiments/tables-page";

export const Route = createFileRoute("/experiments/components/tables")({
	component: TablesPage,
});
