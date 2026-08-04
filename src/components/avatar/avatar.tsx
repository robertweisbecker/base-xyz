import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { UserCircleIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { breakpointRanges } from "@/styles/constants.stylex";
import { focusRing } from "@/styles/recipes/focus";
import { color, fontWeight, radius, space } from "@/styles/tokens.stylex";
import * as Tooltip from "../tooltip/tooltip";

const avatarSizeTokens = {
	4: space[4],
	5: space[5],
	6: space[6],
	7: space[7],
	8: space[8],
	9: space[9],
	10: space[10],
	12: space[12],
	16: space[16],
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
	const normalizedName = normalizeName(name);
	const resolvedInitials = normalizeInitials(initials) || deriveInitials(normalizedName);
	const fallback = icon ?? (resolvedInitials || <UserCircleIcon aria-hidden weight="fill" size="100%" />);
	const hasName = normalizedName.length > 0;
	const sx = stylex.props(
		avatarParts.root,
		focusRing.outsetInteractive,
		responsiveSizeStyle(size),
		shapeVariants[shape],
		style,
	);

	const element = (
		<BaseAvatar.Root
			ref={ref}
			aria-label={ariaLabel ?? (hasName ? normalizedName : undefined)}
			className={[sx.className, className].filter(Boolean).join(" ")}
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
			<Tooltip.Trigger render={element} style={hasName && render == null ? avatarParts.tooltipTrigger : undefined} />
			<Tooltip.Popup>{normalizedName}</Tooltip.Popup>
		</Tooltip.Root>
	);
}

function normalizeName(name: string | undefined): string {
	return name?.trim().replace(/\s+/gu, " ") ?? "";
}

function normalizeInitials(initials: string | undefined): string {
	return initials?.trim() ?? "";
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
		justifyContent: "center",
		lineHeight: 0,
		height: "1em",
		width: "1em",
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
		backgroundColor: "var(--gray-a1)",
		boxSizing: "border-box",
		color: color.fgMuted,
		display: "inline-flex",
		flexShrink: 0,
		fontWeight: fontWeight.semibold,
		isolation: "isolate",
		justifyContent: "center",
		outlineColor: {
			default: null,
			// eslint-disable-next-line @stylexjs/valid-styles -- the compiler supports nested pseudo-class conditions; the lint rule is stricter than the compiler.
			":is(button)": {
				":hover": color.borderStrong,
			},
		},
		outlineStyle: {
			default: "solid",
		},
		outlineWidth: {
			default: "1px",
		},
		position: "relative",
		userSelect: "none",
		verticalAlign: "middle",
	},
	tooltipTrigger: {
		// outlineColor: {
		// 	":hover": color.borderStrong,
		// 	default: null,
		// },
		// outlineWidth: {
		// 	":hover": "1px",
		// 	default: null,
		// },
		// outlineStyle: {
		// 	":hover": "solid",
		// 	default: null,
		// },
	},
});

const shapeVariants = stylex.create({
	circle: {
		borderRadius: radius.full,
	},
	rounded: {
		borderRadius: radius.md,
	},
	square: {
		borderRadius: 0,
	},
});

const responsiveSizeStyles = stylex.create({
	size: (base, xs, sm, md, lg, xl, xxl) => ({
		fontSize: {
			default: `calc(${base} * 0.4)`,
			[breakpointRanges.xs]: `calc(${xs} * 0.4)`,
			[breakpointRanges.sm]: `calc(${sm} * 0.4)`,
			[breakpointRanges.md]: `calc(${md} * 0.4)`,
			[breakpointRanges.lg]: `calc(${lg} * 0.4)`,
			[breakpointRanges.xl]: `calc(${xl} * 0.4)`,
			[breakpointRanges.xxl]: `calc(${xxl} * 0.4)`,
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
