import { Button as BaseButton } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { mergeStyle, type BaseStyleProps } from "@/styles/props/base";
import { extractMarginProps, type MarginProps } from "@/styles/props/spacing.stylex";
import { tokens } from "@/theme/tokens.stylex";

import { Loader } from "@/components/loader/loader";
import { Tooltip } from "@/components/tooltip/tooltip";
import { attrJoin } from "@/utils/attr-join";
import { renderButtonSlot } from "./button-slot";
import {
	getButtonRootStyleProps,
	type ButtonShape,
	type ButtonSize,
	type ButtonVariant,
} from "./button.stylex";

export type { ButtonShape, ButtonSize, ButtonVariant } from "./button.stylex";

const loadingStyles = stylex.create({
	resting: {
		gap: "inherit",
		// Real box required so loading `opacity: 0` hides slotted icons that set
		// their own color (e.g. muted start slots). `display: contents` drops opacity.
		alignItems: "center",
		display: "inline-flex",
		justifyContent: "center",
		minWidth: 0,
	},
	hidden: {
		color: "transparent",
		opacity: 0,
		textShadow: "none",
	},
	loading: {
		inset: tokens["--space-1"],
		gap: "inherit",
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		pointerEvents: "none",
		position: "absolute",
		minWidth: 0,
	},
	loadingText: {
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		minWidth: 0,
	},
});

export type ButtonProps = Omit<
	BaseButton.Props,
	"className" | "color" | "style" | keyof MarginProps
> &
	MarginProps &
	BaseStyleProps & {
		variant?: ButtonVariant;
		size?: ButtonSize;
		shape?: ButtonShape;
		className?: string;
		/** Visual content positioned before the label. */
		startSlot?: ReactNode;
		/** Visual content positioned after the label. */
		endSlot?: ReactNode;
		/** Whether the button shows its loading state and ignores interaction. */
		loading?: boolean;
		/** Visible loading label. Defaults to `"Loading…"`; use an empty string for a loader only. */
		loadingText?: string;
	};

export type IconButtonProps = Omit<
	ButtonProps,
	"children" | "endSlot" | "loadingText" | "shape" | "startSlot"
> & {
	icon: ReactNode;
	/** Visible tooltip text and the fallback accessible name. */
	label: string;
	shape?: Extract<ButtonShape, "circle" | "square">;
	/** Visible tooltip text. Defaults to `label`; use `false` to disable it. */
	tooltip?: ReactNode | false;
	/** Whether the tooltip should be closed when the button is clicked. */
	closeTooltipOnClick?: boolean;
};

type ButtonRootProps = ButtonProps & {
	iconOnly?: boolean;
};

export function Button(props: ButtonProps) {
	return <ButtonRoot {...props} />;
}

export function IconButton({
	icon,
	label,
	"aria-label": ariaLabel,
	closeTooltipOnClick = true,
	shape = "square",
	tooltip = label,
	...props
}: IconButtonProps) {
	const button = (
		<ButtonRoot
			{...props}
			aria-label={ariaLabel ?? label}
			iconOnly
			shape={shape}
			startSlot={icon}
		/>
	);

	if (tooltip === false) {
		return button;
	}

	return (
		<Tooltip.Root>
			<Tooltip.Trigger render={button} closeOnClick={closeTooltipOnClick} />
			<Tooltip.Popup>{tooltip}</Tooltip.Popup>
		</Tooltip.Root>
	);
}

function ButtonRoot({
	ref,
	variant = "primary",
	size = "md",
	shape = "default",
	className,
	style,
	xstyle,
	type = "button",
	render,
	nativeButton,
	children,
	startSlot,
	endSlot,
	loading = false,
	loadingText = "Loading…",
	disabled,
	focusableWhenDisabled,
	"aria-busy": ariaBusy,
	iconOnly = false,
	...props
}: ButtonRootProps) {
	const { marginStyles, rest } = extractMarginProps(props);
	const sx = getButtonRootStyleProps({ variant, size, shape, iconOnly }, [marginStyles, xstyle]);
	const resolvedLoadingText = iconOnly ? "" : loadingText;

	return (
		<BaseButton
			ref={ref}
			type={type}
			render={render}
			nativeButton={nativeButton}
			aria-busy={loading ? true : ariaBusy}
			disabled={loading || disabled}
			focusableWhenDisabled={loading || focusableWhenDisabled}
			data-icon-only={iconOnly ? "" : undefined}
			data-loading={loading ? "" : undefined}
			data-shape={shape}
			data-size={size}
			data-variant={variant}
			className={attrJoin(sx.className, className)}
			style={mergeStyle(sx.style, style)}
			{...rest}
		>
			<span {...stylex.props(loadingStyles.resting, loading && loadingStyles.hidden)}>
				{renderButtonSlot(startSlot, "start", size, variant, iconOnly)}
				{children}
				{renderButtonSlot(endSlot, "end", size, variant, iconOnly)}
			</span>
			{loading && (
				<span aria-hidden {...stylex.props(loadingStyles.loading)}>
					{renderButtonSlot(
						<Loader aria-hidden />,
						"loading",
						size,
						variant,
						iconOnly || resolvedLoadingText.length === 0,
					)}
					{resolvedLoadingText.length > 0 && (
						<span {...stylex.props(loadingStyles.loadingText)}>{resolvedLoadingText}</span>
					)}
				</span>
			)}
		</BaseButton>
	);
}
