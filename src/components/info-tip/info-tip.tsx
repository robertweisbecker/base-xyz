import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { QuestionIcon } from "@phosphor-icons/react/dist/csr/Question";
import type { ReactNode } from "react";
import { IconButton, type IconButtonProps, type ButtonSize } from "@/components/button/button";
import { Popover } from "@/components/popover/popover";

export type InfoTipProps = Omit<IconButtonProps, "icon" | "label" | "tooltip"> & {
	/** Content shown in the popover. Strings receive description semantics. */
	content: ReactNode;
	/** Uses a question-mark trigger and help-oriented accessible label. */
	help?: boolean;
	size?: ButtonSize;
};

export function InfoTip({ content, help = false, size = "sm", ...props }: InfoTipProps) {
	const label = help ? "Help" : "More information";

	return (
		<Popover.Root>
			<Popover.Trigger
				openOnHover
				render={
					<IconButton
						icon={help ? <QuestionIcon aria-hidden weight="duotone" /> : <InfoIcon aria-hidden weight="duotone" />}
						label={label}
						shape="circle"
						size={size}
						tooltip={false}
						variant="ghost"
						{...props}
					/>
				}
			/>
			<Popover.Popup aria-label={label} showClose={false}>
				{typeof content === "string" ? <Popover.Description>{content}</Popover.Description> : content}
			</Popover.Popup>
		</Popover.Root>
	);
}
