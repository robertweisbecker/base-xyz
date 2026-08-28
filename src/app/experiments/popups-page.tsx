import { Stack } from "@/components";
import { ExperimentPage } from "./experiment-page";
import {
	AlertDialogExample,
	CommandPaletteExample,
	ConfirmationDialogExample,
	LinkPreviewExample,
	MenuExample,
	NestedPopupsExample,
	PopoverExample,
	SelectExample,
	TooltipExample,
} from "./popups-basic-examples";
import { DialogExample } from "./popups-dialog-examples";
import { DrawerExample } from "./popups-drawer-example";
import {
	SharedTransitionsExample,
	TooltipToAnchoredToastExample,
} from "./popups-transition-examples";

export function PopupsPage() {
	return (
		<ExperimentPage
			description="Open each popup directly, then exercise focus, dismissal, scrolling, nesting, and stacking behavior."
			title="Popups"
		>
			<Stack data-popup-trigger-grid align="start" gap={3} orientation="horizontal" wrap="wrap">
				<MenuExample />
				<SelectExample />
				<PopoverExample />
				<LinkPreviewExample />
				<TooltipExample />
				<CommandPaletteExample />
				<DialogExample />
				<AlertDialogExample />
				<ConfirmationDialogExample />
				<DrawerExample />
				<NestedPopupsExample />
				<SharedTransitionsExample />
				<TooltipToAnchoredToastExample />
			</Stack>
		</ExperimentPage>
	);
}
