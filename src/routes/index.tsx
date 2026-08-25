import { createFileRoute } from "@tanstack/react-router";
import { GalleryGrid } from "@/app/gallery-page";

export const Route = createFileRoute("/")({
	component: GalleryGrid,
});
