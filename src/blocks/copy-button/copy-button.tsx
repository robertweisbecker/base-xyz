import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import * as stylex from "@stylexjs/stylex";
import { type ReactNode, useId, useRef, useState } from "react";
import { Button, IconButton, Icon, Toast } from "@/components";
import type { ButtonProps } from "@/components";
import { iconSwapTransition } from "@/styles/recipes/transitions";

export type CopyButtonProps = Omit<ButtonProps, "children"> & {
	value: string;
	children?: ReactNode;
	tooltip?: string;
};

export function CopyButton({ ref, ...props }: CopyButtonProps) {
	const [toastManager] = useState(() => Toast.createAnchoredToastManager());

	return (
		<Toast.AnchoredProvider toastManager={toastManager} timeout={1600}>
			<CopyButtonControl ref={ref} {...props} />
		</Toast.AnchoredProvider>
	);
}

function CopyButtonControl({
	ref: forwardedRef,
	value,
	children,
	"aria-label": ariaLabel,
	onClick,
	shape,
	tooltip = "Copy to clipboard",
	...props
}: CopyButtonProps) {
	const manager = Toast.useAnchoredToastManager();
	const toastId = useId();
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const [copied, setCopied] = useState(false);
	const iconOnly = children == null;
	const mergedRef = useMergedRefs(forwardedRef, anchorRef);

	async function handleClick(event: Parameters<NonNullable<ButtonProps["onClick"]>>[0]) {
		onClick?.(event);
		if (event.defaultPrevented) {
			return;
		}

		setCopied(true);

		try {
			await navigator.clipboard.writeText(value);
			manager.add({
				id: toastId,
				description: "Copied!",
				timeout: 1600,
				onClose: () => setCopied(false),
				positionerProps: {
					anchor: anchorRef.current,
					side: "top",
					align: "center",
				},
				data: {
					variant: "tooltip",
					tone: "neutral",
					status: "success",
					dismissible: false,
				},
			});
		} catch {
			setCopied(false);
			manager.add({
				id: toastId,
				description: "Couldn’t copy",
				timeout: 2400,
				positionerProps: {
					anchor: anchorRef.current,
					side: "top",
					align: "center",
				},
				data: {
					variant: "tooltip",
					tone: "error",
					status: "error",
					dismissible: false,
				},
			});
		}
	}

	const icon = (
		<span aria-hidden {...stylex.props(iconSwapTransition.slot)}>
			<span
				{...stylex.props(
					iconSwapTransition.icon,
					copied ? iconSwapTransition.hidden : iconSwapTransition.visible,
				)}
			>
				<CopyIcon aria-hidden weight="regular" />
			</span>
			<span
				{...stylex.props(
					iconSwapTransition.icon,
					iconSwapTransition.to,
					copied ? iconSwapTransition.visible : iconSwapTransition.hidden,
				)}
			>
				<Icon.Checkmark strokeWidth={props.size === "md" || props.size === "lg" ? 3 : 2} />
			</span>
		</span>
	);

	if (!iconOnly) {
		return (
			<Button
				ref={mergedRef}
				aria-label={ariaLabel}
				endSlot={icon}
				shape={shape ?? "default"}
				onClick={handleClick}
				{...props}
			>
				{children}
			</Button>
		);
	}

	return (
		<IconButton
			ref={mergedRef}
			icon={icon}
			label={ariaLabel ?? tooltip}
			onClick={handleClick}
			shape={shape === "circle" ? "circle" : "square"}
			{...props}
		/>
	);
}
