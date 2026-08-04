import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { QuestionIcon } from "@phosphor-icons/react/dist/csr/Question";
import type { ReactNode } from "react";
import { IconButton, type ButtonSize } from "../button/button";
import * as Popover from "../popover/popover";

export type InfoTipProps = {
	/** Content shown in the popover. Strings receive description semantics. */
	content: ReactNode;
	/** Uses a question-mark trigger and help-oriented accessible label. */
	help?: boolean;
	size?: ButtonSize;
};

export function InfoTip({ content, help = false, size = "sm" }: InfoTipProps) {
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
					/>
				}
			/>
			<Popover.Popup aria-label={label} showClose={false}>
				{typeof content === "string" ? <Popover.Description>{content}</Popover.Description> : content}
			</Popover.Popup>
		</Popover.Root>
	);
}
