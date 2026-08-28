import type { ComponentProps } from "react";

export type IconProps = Omit<ComponentProps<"svg">, "size"> & {
	size?: number | string;
};

function Checkmark({ size, ...props }: IconProps) {
	return (
		<svg
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={2.5}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={size ?? 16}
			height={size ?? 16}
			data-slot="icon"
			data-glyph="indicator"
			{...props}
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
		</svg>
	);
}

function ChevronDown({ size, ...props }: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="currentColor" width={size ?? 16} height={size ?? 16} {...props}>
			<path
				d="M4 6L8 10L12 6"
				fill="none"
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function Caret({ size, ...props }: IconProps) {
	return (
		<svg width={size ?? 16} height={size ?? 16} viewBox="0 0 16 16" fill="none" {...props}>
			<path d="M8 11L4 7H12L8 11Z" fill="currentColor" />
		</svg>
	);
}

function More({ size, ...props }: IconProps) {
	return (
		<svg
			fill="none"
			viewBox="0 0 16 16"
			// strokeWidth={1.25}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={size ?? 16}
			height={size ?? 16}
			data-slot="icon"
			data-glyph="more"
			{...props}
		>
			<circle cx="2.375" cy="8" r="0.5" stroke="currentColor" strokeWidth={1.5} />
			<circle cx="8" cy="8" r="0.5" stroke="currentColor" strokeWidth={1.5} />
			<circle cx="13.625" cy="8" r="0.5" stroke="currentColor" strokeWidth={1.5} />
		</svg>
	);
}

function Minus({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			strokeWidth={2}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={size ?? 16}
			height={size ?? 16}
			data-slot="icon"
			data-glyph="indicator"
			{...props}
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
		</svg>
	);
}

function Circle({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			strokeWidth={2}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={size ?? 16}
			height={size ?? 16}
			data-slot="icon"
			data-glyph="circular"
			{...props}
		>
			<circle cx="12" cy="12" r="8" />
		</svg>
	);
}

function Dot({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			strokeWidth={2}
			aria-hidden
			focusable="false"
			width={size ?? 16}
			height={size ?? 16}
			data-slot="icon"
			data-glyph="circular"
			{...props}
		>
			<circle cx="12" cy="12" r="6" />
		</svg>
	);
}

function Square({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			strokeWidth={2}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={size ?? 16}
			height={size ?? 16}
			data-slot="icon"
			{...props}
		>
			<rect width="16" height="16" x="4" y="4" rx="2" />
		</svg>
	);
}

function Triangle({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			strokeWidth={2}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={size ?? 16}
			height={size ?? 16}
			data-slot="icon"
			data-glyph="triangle"
			{...props}
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
		</svg>
	);
}

function Diamond({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			strokeWidth={2}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={size ?? 16}
			height={size ?? 16}
			data-slot="icon"
			data-glyph="diamond"
			{...props}
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 4 20 12 12 20 4 12Z" />
		</svg>
	);
}

function GithubLogo({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 16 16"
			height={size ?? 16}
			width={size ?? 16}
			data-slot="icon"
			data-glyph="circle"
			{...props}
		>
			<g>
				<path
					fill="currentColor"
					fillRule="evenodd"
					d="M8 .13c-4.42 0-8 3.6-8 8.07 0 3.57 2.3 6.58 5.47 7.65.4.08.55-.17.55-.39L6 13.96c-2.23.49-2.7-.95-2.7-.95-.35-.94-.88-1.18-.88-1.18-.73-.5.05-.5.05-.5.8.06 1.23.84 1.23.84.72 1.22 1.87.88 2.33.66.07-.52.28-.88.5-1.08-1.77-.19-3.64-.88-3.64-3.98 0-.88.32-1.6.82-2.16-.07-.2-.35-1.03.08-2.14 0 0 .68-.21 2.2.83a7.7 7.7 0 0 1 4 0c1.53-1.04 2.2-.83 2.2-.83.45 1.11.17 1.94.09 2.14.52.56.82 1.28.82 2.16 0 3.1-1.87 3.78-3.66 3.98.3.26.54.74.54 1.5v2.21c0 .22.14.47.54.4A8.1 8.1 0 0 0 16 8.2 8 8 0 0 0 8 .13"
					clipRule="evenodd"
				></path>
			</g>
		</svg>
	);
}

function Slash({ size, ...props }: IconProps) {
	return (
		<svg
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={2}
			stroke="currentColor"
			width={size ?? 16}
			height={size ?? 16}
			data-slot="icon"
			data-glyph="line"
			{...props}
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="m9 20.247 6-16.5" />
		</svg>
	);
}

function Star({ size, ...props }: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			width={size ?? 16}
			height={size ?? 16}
			aria-hidden
			focusable="false"
			data-slot="icon"
			data-glyph="star"
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.563.563 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
			/>
		</svg>
	);
}

function StarFilled({ size, ...props }: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			width={size ?? 16}
			height={size ?? 16}
			aria-hidden
			focusable="false"
			data-slot="icon"
			data-glyph="star"
			{...props}
		>
			<path
				fillRule="evenodd"
				d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

export const Icon = {
	Caret,
	Checkmark,
	ChevronDown,
	Dot,
	Minus,
	More,
	Circle,
	Square,
	Triangle,
	Diamond,
	GithubLogo,
	Slash,
	Star,
	StarFilled,
} as const;
