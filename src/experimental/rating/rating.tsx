import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import { Icon } from "@/components/icons";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";
import { attrJoin } from "@/utils/attr-join";
import { ratingStarMarker } from "./rating.stylex";

const DEFAULT_COUNT = 5;
const MAX_COUNT = 10;
const DEFAULT_ICON = <Icon.Star width={24} height={24} />;
const DEFAULT_PRESSED_ICON = <Icon.StarFilled width={24} height={24} />;

export type RatingProps = Omit<
	BaseRadioGroup.Props<number>,
	"children" | "className" | "defaultValue" | "onValueChange" | "style" | "value"
> & {
	/** Number of selectable items. Values are normalized to the range 2–10. */
	count?: number;
	/** The initially selected number of items. */
	defaultValue?: number;
	/** The selected number of items when the rating is controlled. */
	value?: number;
	/** Accessible name for the radio group. */
	label?: string;
	/** Icon shown for an unselected item. */
	icon?: ReactNode;
	/** Icon shown for a selected item. When omitted, reuses a custom icon or defaults to the filled star. */
	pressedIcon?: ReactNode;
	onValueChange?: BaseRadioGroup.Props<number>["onValueChange"];
	className?: string;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Rating({
	ref,
	className,
	count,
	defaultValue,
	icon,
	pressedIcon,
	value,
	label = "Rating",
	onValueChange,
	onPointerLeave,
	style,
	disabled,
	readOnly,
	...props
}: RatingProps) {
	const [uncontrolledValue, setUncontrolledValue] = useState<number | undefined>(defaultValue);
	const [hoveredValue, setHoveredValue] = useState<number | null>(null);
	const itemCount = normalizeCount(count);
	const itemValues = Array.from({ length: itemCount }, (_, index) => index + 1);
	const selectedValue = value ?? uncontrolledValue;
	const effectiveValue =
		selectedValue === undefined
			? undefined
			: Math.min(itemCount, Math.max(1, Math.floor(selectedValue)));
	const restingIcon = icon === undefined ? DEFAULT_ICON : icon;
	const selectedIcon =
		pressedIcon === undefined
			? icon === undefined
				? DEFAULT_PRESSED_ICON
				: restingIcon
			: pressedIcon;
	const groupSx = stylex.props(ratingStyles.group, style);

	return (
		<BaseRadioGroup
			ref={ref}
			{...props}
			value={effectiveValue}
			disabled={disabled}
			readOnly={readOnly}
			aria-label={label}
			onPointerLeave={(event) => {
				onPointerLeave?.(event);
				setHoveredValue(null);
			}}
			onValueChange={(nextValue, eventDetails) => {
				onValueChange?.(nextValue, eventDetails);
				if (value === undefined && !eventDetails.isCanceled) {
					setUncontrolledValue(nextValue);
				}
			}}
			className={attrJoin(groupSx.className, className)}
			style={groupSx.style}
		>
			{itemValues.map((starValue) => (
				<BaseRadio.Root
					key={starValue}
					value={starValue}
					aria-label={`${starValue} out of ${itemCount} stars`}
					data-rating-hovered={hoveredValue === starValue ? "" : undefined}
					onPointerEnter={(event) => {
						if (event.pointerType !== "touch" && !disabled && !readOnly) {
							setHoveredValue(starValue);
						}
					}}
					{...stylex.props(
						ratingStarMarker,
						ratingStyles.star,
						starValue === 1 && ratingStyles.firstStar,
						hoveredValue !== null && starValue <= hoveredValue && ratingStyles.starHover,
						effectiveValue !== undefined &&
							effectiveValue >= starValue &&
							ratingStyles.starSelected,
						focusRing.offset,
					)}
				>
					{effectiveValue !== undefined && effectiveValue >= starValue ? selectedIcon : restingIcon}
				</BaseRadio.Root>
			))}
		</BaseRadioGroup>
	);
}

function normalizeCount(count: number | undefined) {
	if (count === undefined || !Number.isFinite(count)) return DEFAULT_COUNT;
	return Math.min(MAX_COUNT, Math.max(2, Math.floor(count)));
}

const ratingStyles = stylex.create({
	group: {
		alignItems: "center",
		color: tokens["--fill-neutral"],
		columnGap: 0,
		display: "inline-flex",
		isolation: "isolate",
		position: "relative",
	},
	star: {
		borderWidth: 0,
		alignItems: "center",
		appearance: "none",
		backgroundColor: {
			"[data-rating-hovered]": tokens["--surface-subtle-hover"],
			default: "transparent",
			[stylex.when.siblingAfter("[data-rating-hovered]", ratingStarMarker)]:
				tokens["--surface-subtle-hover"],
		},
		borderEndEndRadius: {
			"[data-rating-hovered]": tokens["--radius-full"],
			default: 0,
		},
		borderEndStartRadius: 0,
		borderStartEndRadius: {
			"[data-rating-hovered]": tokens["--radius-full"],
			default: 0,
		},
		borderStartStartRadius: 0,
		color: {
			"[data-disabled]": tokens["--fg-disabled"],
			default: tokens["--fill-neutral"],
		},
		display: "inline-flex",
		forcedColorAdjust: "auto",
		justifyContent: "center",
		position: "relative",
		zIndex: 1,
		height: tokens["--size-control-md"],
		width: tokens["--size-control-md"],
	},
	firstStar: {
		borderEndStartRadius: {
			"[data-rating-hovered]": tokens["--radius-full"],
			default: 0,
			[stylex.when.siblingAfter("[data-rating-hovered]", ratingStarMarker)]:
				tokens["--radius-full"],
		},
		borderStartStartRadius: {
			"[data-rating-hovered]": tokens["--radius-full"],
			default: 0,
			[stylex.when.siblingAfter("[data-rating-hovered]", ratingStarMarker)]:
				tokens["--radius-full"],
		},
	},
	starHover: {
		color: {
			default: tokens["--fg-subtle"],
			":active:not([data-disabled],[data-readonly])": tokens["--fg"],
		},
	},
	starSelected: {
		color: {
			"[data-disabled]": tokens["--fg-disabled"],
			"[data-readonly]": tokens["--fg-muted"],
			default: tokens["--fg-accent"],
		},
	},
});
