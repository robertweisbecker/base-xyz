import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { PreviewCard as BaseLinkPreview } from "@base-ui/react/preview-card";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

export const createDrawerHandle = BaseDrawer.createHandle;
export const createLinkPreviewHandle = BaseLinkPreview.createHandle;
export const createPopoverHandle = BasePopover.createHandle;
export const createTooltipHandle = BaseTooltip.createHandle;
