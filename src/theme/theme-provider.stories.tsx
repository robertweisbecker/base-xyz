import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { colors, radius, space } from "@/styles/tokens.stylex";
import { ThemeProvider, useTheme } from "./index";

const meta = {
	title: "Design system/Theme provider",
	component: ThemeProvider,
	args: {
		children: "Theme-aware content",
		mode: "system",
		theme: "default",
	},
	argTypes: {
		mode: { control: "inline-radio", options: ["system", "light", "dark"] },
		theme: { control: "inline-radio", options: ["default", "mp"] },
	},
	parameters: {
		docs: {
			description: {
				component:
					"Provides theme state through React context and CSS variables through a real DOM host. Use render to adopt an existing semantic or layout element. Portals inherit from their DOM container: body-level portals use the root theme, while nested-theme portals need a container inside that themed host.",
			},
		},
		layout: "centered",
	},
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	render: ({ children, mode, theme }) => (
		<ThemeProvider
			mode={mode}
			render={<section aria-label="Theme preview" />}
			style={verificationStyles.preview}
			theme={theme}>
			<span {...stylex.props(verificationStyles.swatch)} />
			{children}
		</ThemeProvider>
	),
};

export const Contract: Story = {
	parameters: { controls: { disable: true } },
	render: () => <ContractFixture />,
};

export const MultipleRoots: Story = {
	parameters: { controls: { disable: true } },
	render: () => <MultipleRootsFixture />,
};

function MultipleRootsFixture() {
	const firstContainerRef = useRef<HTMLDivElement>(null);
	const secondContainerRef = useRef<HTMLDivElement>(null);
	const rootsRef = useRef<{ first: Root | null; second: Root | null } | null>(null);

	useLayoutEffect(() => {
		if (!firstContainerRef.current || !secondContainerRef.current) return;
		const first = createRoot(firstContainerRef.current);
		const second = createRoot(secondContainerRef.current);
		rootsRef.current = { first, second };
		first.render(
			<ThemeProvider data-testid="first-independent-root" mode="dark" theme="mp">
				First root
			</ThemeProvider>,
		);
		second.render(
			<ThemeProvider data-testid="second-independent-root" mode="dark" theme="mp">
				Second root
			</ThemeProvider>,
		);
		return () => {
			rootsRef.current?.first?.unmount();
			rootsRef.current?.second?.unmount();
			rootsRef.current = null;
		};
	}, []);

	return (
		<div {...stylex.props(verificationStyles.contract)}>
			<div ref={firstContainerRef} />
			<div ref={secondContainerRef} />
			<button
				type="button"
				onClick={() => {
					rootsRef.current?.first?.unmount();
					if (rootsRef.current) rootsRef.current.first = null;
				}}>
				Unmount first root
			</button>
			<button
				type="button"
				onClick={() => {
					rootsRef.current?.second?.unmount();
					if (rootsRef.current) rootsRef.current.second = null;
				}}>
				Unmount second root
			</button>
		</div>
	);
}

function ContractFixture() {
	const renderRef = useRef<HTMLElement>(null);
	const providerRef = useRef<HTMLElement>(null);
	const [providerClicks, setProviderClicks] = useState(0);
	const [renderClicks, setRenderClicks] = useState(0);
	const [refsMerged, setRefsMerged] = useState(false);

	useLayoutEffect(() => {
		setRefsMerged(renderRef.current !== null && renderRef.current === providerRef.current);
	}, []);

	return (
		<div {...stylex.props(verificationStyles.contract)}>
			<OuterThemeSnapshot />
			<ThemeProvider
				ref={providerRef}
				data-testid="custom-theme-host"
				mode="dark"
				onClick={() => setProviderClicks((count) => count + 1)}
				render={
					<main
						ref={renderRef}
						aria-label="Custom theme host"
						onClick={() => setRenderClicks((count) => count + 1)}
					/>
				}
				style={verificationStyles.callerOverride}
				theme="mp">
				<div data-testid="custom-theme-content" {...stylex.props(verificationStyles.content)}>
					<span data-testid="custom-accent" {...stylex.props(verificationStyles.swatch)} />
					<span data-testid="warning-reference" {...stylex.props(verificationStyles.warningReference)} />
					<ThemeSnapshot />
					<span data-testid="merged-refs">{String(refsMerged)}</span>
					<span data-testid="merged-events">{`${renderClicks}:${providerClicks}`}</span>
					<SemanticContent />
					<PortalFixture />
					<ThemeProvider
						data-testid="nested-default-host"
						render={<section aria-label="Nested default theme" />}
						theme="default">
						<span data-testid="nested-default-accent" {...stylex.props(verificationStyles.swatch)} />
						<ThemeSnapshot />
					</ThemeProvider>
				</div>
			</ThemeProvider>

			<ThemeProvider data-testid="fallback-theme-host">
				<div data-testid="fallback-theme-content" {...stylex.props(verificationStyles.content)}>
					<span data-testid="fallback-accent" {...stylex.props(verificationStyles.swatch)} />
					<ThemeSnapshot />
				</div>
			</ThemeProvider>

			<ThemeProvider data-testid="default-dark-theme-host" mode="dark" theme="default">
				<span data-testid="default-dark-accent" {...stylex.props(verificationStyles.swatch)} />
			</ThemeProvider>
		</div>
	);
}

function SemanticContent() {
	return (
		<section aria-labelledby="theme-semantics-heading">
			<h2 id="theme-semantics-heading">Theme semantics</h2>
			<ul>
				<li>Surface</li>
				<li>Accent</li>
			</ul>
			<table>
				<caption>Theme values</caption>
				<thead>
					<tr>
						<th scope="col">Token</th>
						<th scope="col">Purpose</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Accent</td>
						<td>Interactive emphasis</td>
					</tr>
				</tbody>
			</table>
			<label htmlFor="theme-label">Theme label</label>
			<input id="theme-label" defaultValue="MP" />
		</section>
	);
}

function PortalFixture() {
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	return (
		<>
			<div ref={setContainer} data-testid="nested-portal-container" />
			{typeof document === "undefined"
				? null
				: createPortal(
						<span data-testid="body-portal-accent" {...stylex.props(verificationStyles.swatch)} />,
						document.body,
					)}
			{container
				? createPortal(
						<span data-testid="nested-portal-accent" {...stylex.props(verificationStyles.swatch)} />,
						container,
					)
				: null}
		</>
	);
}

function OuterThemeSnapshot() {
	const { mode, resolvedMode, theme } = useTheme();
	return (
		<span
			data-testid="outer-theme-context"
			data-mode={mode}
			data-resolved-mode={resolvedMode}
			data-theme={theme}
		/>
	);
}

function ThemeSnapshot() {
	const { mode, resolvedMode, theme } = useTheme();
	return (
		<span
			data-testid="theme-context"
			data-mode={mode}
			data-resolved-mode={resolvedMode}
			data-theme={theme}
		/>
	);
}

const verificationStyles = stylex.create({
	callerOverride: {
		color: colors["--warning"],
	},
	content: {
		gap: space[2],
		alignItems: "center",
		display: "flex",
	},
	contract: {
		gap: space[4],
		display: "grid",
	},
	preview: {
		padding: space[4],
		borderColor: colors["--border"],
		borderRadius: radius.md,
		borderStyle: "solid",
		borderWidth: 1,
		gap: space[3],
		alignItems: "center",
		backgroundColor: colors["--surface"],
		display: "flex",
	},
	swatch: {
		borderRadius: radius.full,
		backgroundColor: colors["--accent"],
		display: "inline-block",
		height: space[4],
		width: space[4],
	},
	warningReference: {
		backgroundColor: colors["--warning"],
		display: "inline-block",
		height: 1,
		width: 1,
	},
});
