import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { LegoSmileyIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { breakpointRanges } from "@/styles/constants.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { tokens } from "@/theme/tokens.stylex";
import { Tooltip } from "@/components/tooltip/tooltip";
import { attrJoin } from "@/utils/attr-join";

const avatarSizeTokens = {
	4: tokens["--space-4"],
	5: tokens["--space-5"],
	6: tokens["--space-6"],
	7: tokens["--space-7"],
	8: tokens["--space-8"],
	9: tokens["--space-9"],
	10: tokens["--space-10"],
	12: tokens["--space-12"],
	16: tokens["--space-16"],
} as const;
const responsiveKeys = ["default", "xs", "sm", "md", "lg", "xl", "xxl"] as const;

export type AvatarSize = keyof typeof avatarSizeTokens;
type AvatarBreakpoint = Exclude<(typeof responsiveKeys)[number], "default">;
export type AvatarResponsiveSize = Partial<Record<AvatarBreakpoint, AvatarSize>> & {
	default?: AvatarSize;
};
export type AvatarShape = keyof typeof shapeVariants;

export type AvatarProps = Omit<BaseAvatar.Root.Props, "children" | "className" | "style"> & {
	className?: string;
	/** URL for the avatar image. */
	image?: string;
	/** Alternative text for the image when the avatar has no name. */
	imageAlt?: string;
	/** Custom fallback icon. Takes precedence over initials. */
	icon?: ReactNode;
	/** Explicit fallback initials. Name prop is used to derive them when omitted, if provided. Overrides icon, and string overrides auto-initials. */
	initials?: string;
	/** Full name used for derived initials, the accessible name, and a tooltip. */
	name?: string;
	/** Avatar dimension using the spacing scale. */
	size?: AvatarSize | AvatarResponsiveSize;
	shape?: AvatarShape;
	/** StyleX overrides, applied after the component's own styles. */
	style?: StyleXStyles;
};

export function Avatar({
	ref,
	"aria-label": ariaLabel,
	className,
	icon,
	image,
	imageAlt,
	initials,
	name,
	render,
	role,
	shape = "circle",
	size = 8,
	style,
	tabIndex,
	...props
}: AvatarProps) {
	const normalizedName = name?.trim().replace(/\s+/gu, " ") ?? "";
	const resolvedInitials = initials?.trim() || deriveInitials(normalizedName);
	const fallback =
		icon ??
		(resolvedInitials || (
			<LegoSmileyIcon aria-hidden weight="duotone" size="100%" style={{ transform: "translateY(24%)" }} />
		));
	const hasName = normalizedName.length > 0;
	const sx = stylex.props(
		avatarParts.root,
		focusRing.offsetInteractive,
		responsiveSizeStyle(size),
		shapeVariants[shape],
		style,
	);

	const element = (
		<BaseAvatar.Root
			ref={ref}
			aria-label={ariaLabel ?? (hasName ? normalizedName : undefined)}
			className={attrJoin(sx.className, className)}
			render={render}
			role={role ?? (render == null && (ariaLabel || hasName) ? "img" : undefined)}
			style={sx.style}
			tabIndex={tabIndex ?? (render == null && hasName ? 0 : undefined)}
			{...props}>
			{image ? (
				<BaseAvatar.Image alt={hasName ? "" : (imageAlt ?? "")} src={image} {...stylex.props(avatarParts.image)} />
			) : null}
			<BaseAvatar.Fallback {...stylex.props(avatarParts.fallback)}>
				{typeof fallback === "string" ? (
					fallback
				) : (
					<span aria-hidden {...stylex.props(avatarParts.icon)}>
						{fallback}
					</span>
				)}
			</BaseAvatar.Fallback>
		</BaseAvatar.Root>
	);

	return (
		<Tooltip.Root disabled={!hasName}>
			<Tooltip.Trigger render={element} />
			<Tooltip.Popup>{normalizedName}</Tooltip.Popup>
		</Tooltip.Root>
	);
}

function deriveInitials(name: string): string {
	if (!name) return "";

	const parts = name.split(" ");
	if (parts.length === 1) return Array.from(parts[0]).slice(0, 2).join("").toLocaleUpperCase();

	return `${Array.from(parts[0])[0]}${Array.from(parts.at(-1) ?? "")[0] ?? ""}`.toLocaleUpperCase();
}

const avatarParts = stylex.create({
	fallback: {
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		height: "100%",
		width: "100%",
	},
	icon: {
		alignItems: "center",
		display: "inline-flex",
		fontSize: "1em",
		justifyContent: "center",
		lineHeight: 0,
	},
	image: {
		inset: 0,
		objectFit: "cover",
		position: "absolute",
		height: "100%",
		width: "100%",
	},
	root: {
		overflow: "hidden",
		alignItems: "center",
		backgroundImage: `linear-gradient(to bottom, ${tokens["--color-gray-p1"]}, ${tokens["--color-gray-p3"]})`,
		boxSizing: "border-box",
		color: tokens["--fg-neutral-contrast"],
		display: "inline-flex",
		flexShrink: 0,
		fontWeight: tokens["--font-weight-semibold"],
		isolation: "isolate",
		justifyContent: "center",
		outlineColor: tokens["--color-gray-p4"],
		outlineOffset: -1,
		outlineStyle: "solid",
		outlineWidth: 1,
		position: "relative",
		userSelect: "none",
		verticalAlign: "middle",
	},
});

const shapeVariants = stylex.create({
	circle: {
		borderRadius: tokens["--radius-full"],
	},
	rounded: {
		borderRadius: tokens["--radius-xs"],
	},
	square: {
		borderRadius: 0,
	},
});

const responsiveSizeStyles = stylex.create({
	size: (base, xs, sm, md, lg, xl, xxl) => ({
		fontSize: {
			default: `calc(${base} * 0.5)`,
			[breakpointRanges.xs]: `calc(${xs} * 0.5)`,
			[breakpointRanges.sm]: `calc(${sm} * 0.5)`,
			[breakpointRanges.md]: `calc(${md} * 0.5)`,
			[breakpointRanges.lg]: `calc(${lg} * 0.5)`,
			[breakpointRanges.xl]: `calc(${xl} * 0.5)`,
			[breakpointRanges.xxl]: `calc(${xxl} * 0.5)`,
		},
		height: {
			default: base,
			[breakpointRanges.xs]: xs,
			[breakpointRanges.sm]: sm,
			[breakpointRanges.md]: md,
			[breakpointRanges.lg]: lg,
			[breakpointRanges.xl]: xl,
			[breakpointRanges.xxl]: xxl,
		},
		width: {
			default: base,
			[breakpointRanges.xs]: xs,
			[breakpointRanges.sm]: sm,
			[breakpointRanges.md]: md,
			[breakpointRanges.lg]: lg,
			[breakpointRanges.xl]: xl,
			[breakpointRanges.xxl]: xxl,
		},
	}),
});

function responsiveSizeStyle(size: AvatarSize | AvatarResponsiveSize): StyleXStyles {
	if (typeof size === "number") {
		const value = avatarSizeTokens[size];
		return responsiveSizeStyles.size(value, value, value, value, value, value, value);
	}

	let current: AvatarSize = size.default ?? 8;
	const values = responsiveKeys.map((key) => {
		current = size[key] ?? current;
		return avatarSizeTokens[current];
	});

	return responsiveSizeStyles.size(values[0], values[1], values[2], values[3], values[4], values[5], values[6]);
}
