import type { ComponentProps } from "react";

export type IconProps = ComponentProps<"svg">;

function Checkmark(props: IconProps) {
	return (
		<svg
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={2.5}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={16}
			height={16}
			data-slot="icon"
			data-glyph="indicator"
			{...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
		</svg>
	);
}

function ChevronDown(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="currentColor" width={16} height={16} {...props}>
			<path
				fillRule="evenodd"
				d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

function Caret(props: IconProps) {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
			<path d="M8 11L4 7H12L8 11Z" fill="currentColor" />
		</svg>
	);
}

function More(props: IconProps) {
	return (
		<svg
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={16}
			height={16}
			data-slot="icon"
			data-glyph="more"
			{...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
			/>
		</svg>
	);
}

function Minus(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			strokeWidth={2}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={16}
			height={16}
			data-slot="icon"
			data-glyph="indicator"
			{...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
		</svg>
	);
}

function Circle(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			strokeWidth={2}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={16}
			height={16}
			data-slot="icon"
			data-glyph="circular"
			{...props}>
			<circle cx="12" cy="12" r="10" />
		</svg>
	);
}

function Dot(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			strokeWidth={2}
			aria-hidden
			focusable="false"
			width={16}
			height={16}
			data-slot="icon"
			data-glyph="circular"
			{...props}>
			<circle cx="12" cy="12" r="6" />
		</svg>
	);
}

function Square(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			strokeWidth={2}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={16}
			height={16}
			data-slot="icon"
			{...props}>
			<rect width="16" height="16" x="4" y="4" rx="2" />
		</svg>
	);
}

function Triangle(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			strokeWidth={2}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={16}
			height={16}
			data-slot="icon"
			data-glyph="triangle"
			{...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
		</svg>
	);
}

function Diamond(props: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			strokeWidth={2}
			stroke="currentColor"
			aria-hidden
			focusable="false"
			width={16}
			height={16}
			data-slot="icon"
			data-glyph="diamond"
			{...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-18v18" />
		</svg>
	);
}

function GithubLogo(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" height="16" width="16" data-slot="icon" data-glyph="circle" {...props}>
			<g>
				<path
					fill="currentColor"
					fillRule="evenodd"
					d="M8 .13c-4.42 0-8 3.6-8 8.07 0 3.57 2.3 6.58 5.47 7.65.4.08.55-.17.55-.39L6 13.96c-2.23.49-2.7-.95-2.7-.95-.35-.94-.88-1.18-.88-1.18-.73-.5.05-.5.05-.5.8.06 1.23.84 1.23.84.72 1.22 1.87.88 2.33.66.07-.52.28-.88.5-1.08-1.77-.19-3.64-.88-3.64-3.98 0-.88.32-1.6.82-2.16-.07-.2-.35-1.03.08-2.14 0 0 .68-.21 2.2.83a7.7 7.7 0 0 1 4 0c1.53-1.04 2.2-.83 2.2-.83.45 1.11.17 1.94.09 2.14.52.56.82 1.28.82 2.16 0 3.1-1.87 3.78-3.66 3.98.3.26.54.74.54 1.5v2.21c0 .22.14.47.54.4A8.1 8.1 0 0 0 16 8.2 8 8 0 0 0 8 .13"
					clipRule="evenodd"></path>
			</g>
		</svg>
	);
}

function Slash(props: IconProps) {
	return (
		<svg
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={2}
			stroke="currentColor"
			width={16}
			height={16}
			data-slot="icon"
			data-glyph="line"
			{...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="m9 20.247 6-16.5" />
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
} as const;
