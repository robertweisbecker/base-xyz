import { createFileRoute } from "@tanstack/react-router";
import { AgentBlocksPage } from "@/app/experiments/agent-blocks-page";

export const Route = createFileRoute("/experiments/blocks/agent-blocks")({
	component: AgentBlocksPage,
});
