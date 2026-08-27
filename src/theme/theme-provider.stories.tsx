import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { Text } from "@/components/text";
import { Stack } from "@/components/layout/layout";
import { tokens } from "@/theme/tokens.stylex";
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
			theme={theme}
		>
			<span {...stylex.props(verificationStyles.swatch)} />
			{children}
		</ThemeProvider>
	),
};

export const Contract: Story = {
	parameters: { controls: { disable: true } },
	render: () => <ContractFixture />,
};

export const StatusRamps: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<ThemeProvider
			aria-label="MP light status ramps"
			data-testid="mp-light-ramps"
			mode="light"
			render={<section />}
			style={statusRampStyles.collection}
			theme="mp"
		>
			<Text color="muted" render={<h2 />} size="1">
				Light
			</Text>
			<StatusRampSwatches />
		</ThemeProvider>
	),
};

export const MultipleRoots: Story = {
	parameters: { controls: { disable: true } },
	render: () => <MultipleRootsFixture />,
};

function StatusRampSwatches() {
	return (
		<>
			<div aria-hidden {...stylex.props(statusRampStyles.ramp)}>
				<span />
				<Text color="muted" render={<span />} size="1">
					s1
				</Text>
				<Text color="muted" render={<span />} size="1">
					c1
				</Text>
				<Text color="muted" render={<span />} size="1">
					p1
				</Text>
				<Text color="muted" render={<span />} size="1">
					p2
				</Text>
				<Text color="muted" render={<span />} size="1">
					t1
				</Text>
			</div>
			<section data-ramp="error" {...stylex.props(statusRampStyles.ramp)}>
				<Text render={<h3 />} size="1">
					Error
				</Text>
				<span
					aria-label="Error s1"
					data-step="s1"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.errorS1)}
				/>
				<span
					aria-label="Error c1"
					data-step="c1"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.errorC1)}
				/>
				<span
					aria-label="Error p1"
					data-step="p1"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.errorP1)}
				/>
				<span
					aria-label="Error p2"
					data-step="p2"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.errorP2)}
				/>
				<span
					aria-label="Error t1"
					data-step="t1"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.errorT1)}
				/>
			</section>
			<section data-ramp="success" {...stylex.props(statusRampStyles.ramp)}>
				<Text render={<h3 />} size="1">
					Success
				</Text>
				<span
					aria-label="Success s1"
					data-step="s1"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.successS1)}
				/>
				<span
					aria-label="Success c1"
					data-step="c1"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.successC1)}
				/>
				<span
					aria-label="Success p1"
					data-step="p1"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.successP1)}
				/>
				<span
					aria-label="Success p2"
					data-step="p2"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.successP2)}
				/>
				<span
					aria-label="Success t1"
					data-step="t1"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.successT1)}
				/>
			</section>
			<section data-ramp="warning" {...stylex.props(statusRampStyles.ramp)}>
				<Text render={<h3 />} size="1">
					Warning
				</Text>
				<span
					aria-label="Warning s1"
					data-step="s1"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.warningS1)}
				/>
				<span
					aria-label="Warning c1"
					data-step="c1"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.warningC1)}
				/>
				<span
					aria-label="Warning p1"
					data-step="p1"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.warningP1)}
				/>
				<span
					aria-label="Warning p2"
					data-step="p2"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.warningP2)}
				/>
				<span
					aria-label="Warning t1"
					data-step="t1"
					role="img"
					{...stylex.props(statusRampStyles.swatch, statusRampStyles.warningT1)}
				/>
			</section>
		</>
	);
}

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
			<ThemeProvider data-testid="first-independent-root" mode="light" theme="mp">
				First root
			</ThemeProvider>,
		);
		second.render(
			<ThemeProvider data-testid="second-independent-root" mode="light" theme="mp">
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
		<Stack gap={4}>
			<div ref={firstContainerRef} />
			<div ref={secondContainerRef} />
			<button
				type="button"
				onClick={() => {
					rootsRef.current?.first?.unmount();
					if (rootsRef.current) rootsRef.current.first = null;
				}}
			>
				Unmount first root
			</button>
			<button
				type="button"
				onClick={() => {
					rootsRef.current?.second?.unmount();
					if (rootsRef.current) rootsRef.current.second = null;
				}}
			>
				Unmount second root
			</button>
		</Stack>
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
		<Stack gap={4}>
			<OuterThemeSnapshot />
			<ThemeProvider
				ref={providerRef}
				data-testid="custom-theme-host"
				mode="light"
				onClick={() => setProviderClicks((count) => count + 1)}
				render={
					<main
						ref={renderRef}
						aria-label="Custom theme host"
						onClick={() => setRenderClicks((count) => count + 1)}
					/>
				}
				style={verificationStyles.callerOverride}
				theme="mp"
			>
				<Stack align="center" data-testid="custom-theme-content" gap={2} orientation="horizontal">
					<span data-testid="custom-accent" {...stylex.props(verificationStyles.swatch)} />
					<span data-testid="custom-error-s1" {...stylex.props(statusRampStyles.errorS1)} />
					<span
						data-testid="warning-reference"
						{...stylex.props(verificationStyles.warningReference)}
					/>
					<ThemeSnapshot />
					<span data-testid="merged-refs">{String(refsMerged)}</span>
					<span data-testid="merged-events">{`${renderClicks}:${providerClicks}`}</span>
					<SemanticContent />
					<PortalFixture />
					<ThemeProvider
						data-testid="nested-default-host"
						render={<section aria-label="Nested default theme" />}
						theme="default"
					>
						<span
							data-testid="nested-default-accent"
							{...stylex.props(verificationStyles.swatch)}
						/>
						<span
							data-testid="nested-default-error-s1"
							{...stylex.props(statusRampStyles.errorS1)}
						/>
						<ThemeSnapshot />
					</ThemeProvider>
				</Stack>
			</ThemeProvider>

			<ThemeProvider data-testid="fallback-theme-host">
				<Stack align="center" data-testid="fallback-theme-content" gap={2} orientation="horizontal">
					<span data-testid="fallback-accent" {...stylex.props(verificationStyles.swatch)} />
					<ThemeSnapshot />
				</Stack>
			</ThemeProvider>

			<ThemeProvider data-testid="default-light-theme-host" mode="light" theme="default">
				<span data-testid="default-light-accent" {...stylex.props(verificationStyles.swatch)} />
				<span data-testid="default-light-error-s1" {...stylex.props(statusRampStyles.errorS1)} />
			</ThemeProvider>
		</Stack>
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
						<span
							data-testid="nested-portal-accent"
							{...stylex.props(verificationStyles.swatch)}
						/>,
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
		color: tokens["--bg-warning-primary"],
	},
	preview: {
		padding: tokens["--space-4"],
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: 1,
		gap: tokens["--space-3"],
		alignItems: "center",
		backgroundColor: tokens["--surface"],
		display: "flex",
	},
	swatch: {
		borderRadius: tokens["--radius-full"],
		backgroundColor: tokens["--bg-primary"],
		display: "inline-block",
		height: tokens["--space-4"],
		width: tokens["--space-4"],
	},
	warningReference: {
		backgroundColor: tokens["--bg-warning-primary"],
		display: "inline-block",
		height: 1,
		width: 1,
	},
});

const statusRampStyles = stylex.create({
	collection: {
		padding: tokens["--space-4"],
		borderRadius: tokens["--radius-md"],
		gap: tokens["--space-3"],
		backgroundColor: tokens["--surface"],
		display: "grid",
	},
	successC1: { backgroundColor: tokens["--color-success-c1"] },
	successP1: { backgroundColor: tokens["--color-success-p1"] },
	successP2: { backgroundColor: tokens["--color-success-p2"] },
	successS1: { backgroundColor: tokens["--color-success-s1"] },
	successT1: { backgroundColor: tokens["--color-success-t1"] },
	warningC1: { backgroundColor: tokens["--color-warning-c1"] },
	warningP1: { backgroundColor: tokens["--color-warning-p1"] },
	warningP2: { backgroundColor: tokens["--color-warning-p2"] },
	warningS1: { backgroundColor: tokens["--color-warning-s1"] },
	warningT1: { backgroundColor: tokens["--color-warning-t1"] },
	ramp: {
		gap: tokens["--space-1"],
		alignItems: "center",
		display: "grid",
		gridTemplateColumns: `5rem repeat(5, ${tokens["--space-8"]})`,
	},
	errorC1: { backgroundColor: tokens["--color-error-c1"] },
	errorP1: { backgroundColor: tokens["--color-error-p1"] },
	errorP2: { backgroundColor: tokens["--color-error-p2"] },
	errorS1: { backgroundColor: tokens["--color-error-s1"] },
	errorT1: { backgroundColor: tokens["--color-error-t1"] },
	swatch: {
		borderRadius: tokens["--radius-xs"],
		display: "block",
		height: tokens["--space-8"],
		width: tokens["--space-8"],
	},
});
