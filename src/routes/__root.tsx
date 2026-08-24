import { createRootRoute } from "@tanstack/react-router";
import { AppShell } from "@/app/app-shell";

export const Route = createRootRoute({
	component: AppShell,
});
