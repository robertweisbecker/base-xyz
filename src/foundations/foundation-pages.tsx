import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import { ColorItem, ColorPalette, IconGallery, IconItem, Source, Typeset } from "@storybook/addon-docs/blocks";
import * as stylex from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import { breakpoints, zIndex } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

import { fontFamilyStyles, typescaleStyles } from "@/components/text/text.stylex";

import { ThemeProvider } from "@/theme";

export function DesignSystemPage() {
	return (
		<FoundationPage
			title="Design system"
			description="Tokens and foundations for color, typography, spacing, shape, depth, motion, and iconography.">
			<ColorsSection />
			<TypographySection />
			<SpacingAndShapeSection />
			<DepthAndMotionSection />
			<IconographySection />
		</FoundationPage>
	);
}

function ColorsSection() {
	return (
		<FoundationCategory
			title="Color"
			description="Semantic tokens describe a role instead of a fixed value, so the same component code adapts across light and dark themes.">
			<FoundationSection
				title="Semantic palette"
				description="Use these tokens in component styles. Each row groups colors that work together in a specific UI role.">
				<div {...stylex.props(styles.themePalettes)}>
					<ThemePalette mode="light" name="Light" />
					<ThemePalette mode="dark" name="Dark" />
				</div>
			</FoundationSection>

			<FoundationSection
				title="Primitive ramps"
				description="Primitive values support the semantic layer. Prefer semantic tokens in product UI so themes can evolve independently.">
				<div {...stylex.props(styles.paletteScroller)}>
					<div {...stylex.props(styles.paletteContent)}>
						<ColorPalette>
							<ColorItem
								title="Gray / Surface"
								subtitle="Canvas, surfaces, borders, and disabled states"
								colors={{
									s1: tokens["--color-gray-s1"],
									s2: tokens["--color-gray-s2"],
									s3: tokens["--color-gray-s3"],
								}}
							/>
							<ColorItem
								title="Gray / Component"
								subtitle="Neutral component states"
								colors={{
									c1: tokens["--color-gray-c1"],
									c2: tokens["--color-gray-c2"],
									c3: tokens["--color-gray-c3"],
								}}
							/>
							<ColorItem
								title="Borders"
								subtitle="Borders, outlines, and separators"
								colors={{
									b1: tokens["--color-gray-b1"],
									b2: tokens["--color-gray-b2"],
									b3: tokens["--color-gray-b3"],
								}}
							/>
							<ColorItem
								title="Primary"
								subtitle="Primary buttons states"
								colors={{
									p1: tokens["--color-gray-p1"],
									p2: tokens["--color-gray-p2"],
									p3: tokens["--color-gray-p3"],
									p4: tokens["--color-gray-p4"],
								}}
							/>
							<ColorItem
								title="Text"
								subtitle="Text colors"
								colors={{
									t1: tokens["--color-gray-t1"],
									t2: tokens["--color-gray-t2"],
									t3: tokens["--color-gray-t3"],
								}}
							/>
						</ColorPalette>
					</div>
				</div>
			</FoundationSection>

			<TokenSource
				code={`import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

const styles = stylex.create({
  card: {
    backgroundColor: tokens["--surface"],
    borderColor: tokens["--border"],
    color: tokens["--fg"],
  },
  action: {
    backgroundColor: tokens["--bg-primary"],
    color: tokens["--fg-accent-contrast"],
  },
});`}
			/>
		</FoundationCategory>
	);
}

function TypographySection() {
	return (
		<FoundationCategory
			title="Typography"
			description="A compact semantic type scale pairs each font size with Radix-derived line-height and letter-spacing tokens.">
			<FoundationSection
				title="Size scale"
				description="Storybook’s Typeset block renders every supported size against the same sentence for a direct comparison.">
				<Typeset
					fontFamily={tokens["--font-family-sans"]}
					fontSizes={[
						"0.75rem",
						"0.875rem",
						"1rem",
						"1.125rem",
						"1.25rem",
						"1.5rem",
						"1.75rem",
						"2.1875rem",
						"3.75rem",
					]}
					fontWeight={400}
					sampleText="Build clear interfaces from a small set of deliberate choices."
				/>
			</FoundationSection>

			<FoundationSection
				title="Family composites"
				description="Compose a family style with a scale step to establish family, size, line-height, and letter-spacing together.">
				<div {...stylex.props(styles.typeRoles)}>
					<TypeRole
						name="Sans 3"
						token="fontFamilyStyles.sans · typescaleStyles.3"
						description="Default interface and reading typography."
						sampleFontFamily={tokens["--font-family-sans"]}
						style={[fontFamilyStyles.sans, typescaleStyles["3"]]}>
						Clear tools make complex work feel lighter.
					</TypeRole>
					<TypeRole
						name="Serif 3"
						token="fontFamilyStyles.serif · typescaleStyles.3"
						description="Editorial or expressive supporting content."
						sampleFontFamily={tokens["--font-family-serif"]}
						style={[fontFamilyStyles.serif, typescaleStyles["3"]]}>
						Clear tools make complex work feel lighter.
					</TypeRole>
					<TypeRole
						name="Mono 3"
						token="fontFamilyStyles.mono · typescaleStyles.3"
						description="Code, identifiers, and tabular technical values."
						sampleFontFamily={tokens["--font-family-mono"]}
						style={[fontFamilyStyles.mono, typescaleStyles["3"]]}>
						const clarity = system.compose();
					</TypeRole>
				</div>
			</FoundationSection>

			<FoundationSection
				title="Semantic roles"
				description="Choose a role by intent. Keep each semantic size paired with its matching line-height and letter-spacing step.">
				<div {...stylex.props(styles.typeRoles)}>
					<TypeRole
						name="Display"
						token='tokens["--font-size-5"] · tokens["--line-height-5"] · tokens["--letter-spacing-5"] · tokens["--font-weight-semibold"]'
						description="Short, high-emphasis page or empty-state titles."
						style={styles.typeDisplay}>
						Design systems, clearly expressed.
					</TypeRole>
					<TypeRole
						name="Title"
						token='tokens["--font-size-4"] · tokens["--line-height-4"] · tokens["--letter-spacing-4"] · tokens["--font-weight-semibold"]'
						description="Section headings, dialog titles, and card titles."
						style={styles.typeTitle}>
						Workspace activity
					</TypeRole>
					<TypeRole
						name="Control"
						token='tokens["--font-size-3"] · tokens["--line-height-3"] · tokens["--letter-spacing-3"] · tokens["--font-weight-medium"]'
						description="Prominent labels in buttons, inputs, and menu items."
						style={styles.typeControl}>
						Create workspace
					</TypeRole>
					<TypeRole
						name="Body"
						token='tokens["--font-size-2"] · tokens["--line-height-2"] · tokens["--letter-spacing-2"] · tokens["--font-weight-regular"]'
						description="Default reading size for descriptions and content."
						style={styles.typeBody}>
						Invite collaborators and keep project decisions in one place.
					</TypeRole>
					<TypeRole
						name="Small"
						token='tokens["--font-size-1"] · tokens["--line-height-1"] · tokens["--letter-spacing-1"] · tokens["--font-weight-medium"]'
						description="Metadata, helper text, compact labels, and status."
						style={styles.typeSmall}>
						Updated two minutes ago
					</TypeRole>
				</div>
			</FoundationSection>

			<FoundationSection
				title="Weight scale"
				description="Use regular for reading, medium for controls, and semibold for hierarchy.">
				<div {...stylex.props(styles.weightGrid)}>
					<Typeset
						fontFamily={tokens["--font-family-sans"]}
						fontSizes={["1.125rem"]}
						fontWeight={400}
						sampleText="Regular 400 · Long-form copy"
					/>
					<Typeset
						fontFamily={tokens["--font-family-sans"]}
						fontSizes={["1.125rem"]}
						fontWeight={500}
						sampleText="Medium 500 · Controls and labels"
					/>
					<Typeset
						fontFamily={tokens["--font-family-sans"]}
						fontSizes={["1.125rem"]}
						fontWeight={600}
						sampleText="Semibold 600 · Titles and emphasis"
					/>
				</div>
			</FoundationSection>

			<TokenSource
				code={`import * as stylex from "@stylexjs/stylex";
import { fontFamilyStyles, typescaleStyles, fontWeightStyles } from "@/components/text/text.stylex";

<h2 {...stylex.props(typescaleStyles["4"], fontWeightStyles.semibold)}>Workspace activity</h2>
<code {...stylex.props(fontFamilyStyles.mono, typescaleStyles["2"])}>npm run build</code>`}
			/>
		</FoundationCategory>
	);
}

function SpacingAndShapeSection() {
	return (
		<FoundationCategory
			title="Spacing & shape"
			description="A 0.25rem-based spacing scale and a restrained radius family for rhythm and concentricity">
			<FoundationSection
				title="Spacing scale"
				description="The bars are rendered at their actual token width. Combine adjacent steps instead of introducing one-off values.">
				<div {...stylex.props(styles.tokenRows)}>
					{spacingTokens.map((token) => (
						<div key={token.name} {...stylex.props(styles.tokenRow)}>
							<TokenName name={token.name} value={token.value} />
							<div {...stylex.props(styles.measureTrack)}>
								<span {...stylex.props(styles.measureBar)} style={{ width: token.value }} />
							</div>
							<span {...stylex.props(styles.usage)}>{token.usage}</span>
						</div>
					))}
				</div>
				<div {...stylex.props(styles.spacingExample)}>
					<div {...stylex.props(styles.spacingCard)}>
						<span {...stylex.props(styles.exampleEyebrow)}>tokens["--space-3"] gap</span>
						<strong {...stylex.props(styles.exampleTitle)}>A composed card</strong>
						<p {...stylex.props(styles.exampleCopy)}>
							The --space-6 inset gives content room to breathe while --space-3 keeps related text together.
						</p>
					</div>
					<p {...stylex.props(styles.exampleAnnotation)}>
						This specimen uses <code>tokens["--space-6"]</code> for card padding, <code>tokens["--space-3"]</code>{" "}
						between related items, and <code>tokens["--space-8"]</code> around the example.
					</p>
				</div>
			</FoundationSection>

			<FoundationSection
				title="Container sizes"
				description="Named maximum widths keep common page and panel measures on the shared size scale.">
				<div {...stylex.props(styles.tokenRows)}>
					{containerSizeTokens.map((token) => (
						<div key={token.name} {...stylex.props(styles.tokenRow)}>
							<TokenName name={token.name} value={token.value} />
							<span {...stylex.props(styles.usage)}>{token.usage}</span>
						</div>
					))}
				</div>
			</FoundationSection>

			<FoundationSection
				title="Radius scale"
				description="Small radii belong to controls and nested elements; larger radii give containers a distinct silhouette.">
				<div {...stylex.props(styles.radiusGrid)}>
					{radiusTokens.map((token) => (
						<div key={token.name} {...stylex.props(styles.radiusToken)}>
							<div {...stylex.props(styles.radiusSpecimen)} style={{ borderRadius: token.value }} />
							<TokenName name={token.name} value={token.value} />
							<span {...stylex.props(styles.usage)}>{token.usage}</span>
						</div>
					))}
				</div>
			</FoundationSection>

			<TokenSource
				code={`import * as stylex from "@stylexjs/stylex";
import { tokens } from "@/theme/tokens.stylex";

const styles = stylex.create({
  card: {
    borderRadius: tokens["--radius-md"],
    padding: tokens["--space-6"],
  },
  controlRow: {
    display: "flex",
    gap: tokens["--space-3"],
  },
});`}
			/>
		</FoundationCategory>
	);
}

function DepthAndMotionSection() {
	return (
		<FoundationCategory
			title="Depth & motion"
			description="Elevation and movement clarify hierarchy, continuity, and feedback without becoming the focus of the interface.">
			<FoundationSection
				title="Elevation"
				description="Apply the lowest shadow that communicates the required separation. Theme-aware rings keep edges legible.">
				<div {...stylex.props(styles.shadowGrid)}>
					<ShadowSpecimen
						name='tokens["--shadow-sm"]'
						usage="Raised controls and compact cards"
						style={styles.shadowSmall}
					/>
					<ShadowSpecimen
						name='tokens["--shadow-md"]'
						usage="Menus, popovers, and floating panels"
						style={styles.shadowMedium}
					/>
					<ShadowSpecimen
						name='tokens["--shadow-lg"]'
						usage="Prominent previews and large overlays"
						style={styles.shadowLarge}
					/>
				</div>
			</FoundationSection>

			<FoundationSection
				title="Duration and easing"
				description="Play the specimens to compare durations. Reduced-motion preferences remove the travel automatically.">
				<MotionSpecimens />
			</FoundationSection>

			<FoundationSection
				title="Layering"
				description="Named z-index tokens make the intended relationship between escaped surfaces explicit.">
				<div {...stylex.props(styles.layerLayout)}>
					<div {...stylex.props(styles.layerStage)}>
						<div {...stylex.props(styles.layerCard, styles.layerModal)}>Modal · 300</div>
						<div {...stylex.props(styles.layerCard, styles.layerPopup)}>Popup · 600</div>
						<div {...stylex.props(styles.layerCard, styles.layerTooltip)}>Tooltip · 700</div>
						<div {...stylex.props(styles.layerCard, styles.layerToast)}>Toast · 800</div>
					</div>
					<div {...stylex.props(styles.layerList)}>
						{layerTokens.map((token) => (
							<div key={token.name} {...stylex.props(styles.layerRow)}>
								<TokenName name={token.name} value={token.value} />
								<span {...stylex.props(styles.usage)}>{token.usage}</span>
							</div>
						))}
					</div>
				</div>
			</FoundationSection>

			<TokenSource
				code={`import * as stylex from "@stylexjs/stylex";
import { zIndex } from "@/styles/constants.stylex";
import { tokens } from "@/theme/tokens.stylex";

const styles = stylex.create({
  popup: {
    boxShadow: tokens["--shadow-md"],
    transitionDuration: tokens["--motion-duration-short"],
    transitionTimingFunction: tokens["--motion-ease-out"],
    zIndex: zIndex.popup,
  },
});`}
			/>
		</FoundationCategory>
	);
}

function IconographySection() {
	return (
		<FoundationCategory
			title="Iconography"
			description="Phosphor icons use a consistent optical language. Keep icons aligned to a clear action or state, and pair unfamiliar symbols with text.">
			<FoundationSection
				title="Core interface symbols"
				description="Storybook’s IconGallery keeps names and specimens together so the approved set stays easy to scan.">
				<IconGallery>
					<IconItem name="Search">
						<MagnifyingGlassIcon aria-label="Search" size={28} weight="regular" />
					</IconItem>
					<IconItem name="Add">
						<PlusIcon aria-label="Add" size={28} weight="bold" />
					</IconItem>
					<IconItem name="Continue">
						<ArrowRightIcon aria-label="Continue" size={28} weight="bold" />
					</IconItem>
					<IconItem name="Success">
						<CheckCircleIcon aria-label="Success" size={28} weight="fill" />
					</IconItem>
					<IconItem name="Information">
						<InfoIcon aria-label="Information" size={28} weight="fill" />
					</IconItem>
					<IconItem name="Warning">
						<WarningIcon aria-label="Warning" size={28} weight="fill" />
					</IconItem>
				</IconGallery>
			</FoundationSection>

			<FoundationSection
				title="Sizing and weight"
				description="Use 16–20px icons inside controls, regular weight for utility, bold for directional actions, and fill for status.">
				<div {...stylex.props(styles.iconExamples)}>
					<div {...stylex.props(styles.iconExample)}>
						<MagnifyingGlassIcon aria-hidden size={16} />
						<TokenName name="16px · regular" value="Dense controls" />
					</div>
					<div {...stylex.props(styles.iconExample)}>
						<ArrowRightIcon aria-hidden size={20} weight="bold" />
						<TokenName name="20px · bold" value="Primary actions" />
					</div>
					<div {...stylex.props(styles.iconExample)}>
						<CheckCircleIcon aria-hidden size={24} weight="fill" />
						<TokenName name="24px · fill" value="Status emphasis" />
					</div>
				</div>
			</FoundationSection>

			<TokenSource
				code={`import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { Button } from "./components/button/button";

<Button endSlot={<ArrowRightIcon aria-hidden weight="bold" />}>
  Continue
</Button>`}
			/>
		</FoundationCategory>
	);
}

function FoundationPage({ children, description, title }: { children: ReactNode; description: string; title: string }) {
	return (
		<article {...stylex.props(styles.page)}>
			<header {...stylex.props(styles.pageHeader)}>
				<h1 {...stylex.props(styles.pageTitle)}>{title}</h1>
				<p {...stylex.props(styles.pageDescription)}>{description}</p>
			</header>
			{children}
		</article>
	);
}

function FoundationCategory({
	children,
	description,
	title,
}: {
	children: ReactNode;
	description: string;
	title: string;
}) {
	return (
		<section {...stylex.props(styles.category)}>
			<div {...stylex.props(styles.categoryHeader)}>
				<h2 {...stylex.props(styles.categoryTitle)}>{title}</h2>
				<p {...stylex.props(styles.categoryDescription)}>{description}</p>
			</div>
			{children}
		</section>
	);
}

function FoundationSection({
	children,
	description,
	title,
}: {
	children: ReactNode;
	description: string;
	title: string;
}) {
	return (
		<section {...stylex.props(styles.section)}>
			<div {...stylex.props(styles.sectionHeader)}>
				<h3 {...stylex.props(styles.sectionTitle)}>{title}</h3>
				<p {...stylex.props(styles.sectionDescription)}>{description}</p>
			</div>
			{children}
		</section>
	);
}

function ThemePalette({ mode, name }: { mode: "light" | "dark"; name: string }) {
	return (
		<div {...stylex.props(styles.themePalette)}>
			<h4 {...stylex.props(styles.paletteTitle)}>{name} theme</h4>
			<ThemeProvider
				aria-label={`${name} theme palette`}
				mode={mode}
				render={<section />}
				style={styles.paletteScroller}>
				<div {...stylex.props(styles.paletteContent)}>
					<ColorPalette>
						<ColorItem
							title="Surfaces"
							subtitle="Page and container elevation"
							colors={{
								canvas: tokens["--canvas"],
								surface: tokens["--surface"],
								raised: tokens["--elevated"],
								subtle: tokens["--surface-subtle"],
							}}
						/>
						<ColorItem
							title="Content"
							subtitle="Default, quiet, and emphasized text"
							colors={{
								text: tokens["--fg"],
								muted: tokens["--fg-muted"],
								accent: tokens["--fg-accent"],
								inverse: tokens["--fg-inverse"],
							}}
						/>
						<ColorItem
							title="Boundaries"
							subtitle="Dividers, control borders, and focus"
							colors={{
								border: tokens["--border"],
								strong: tokens["--border-input"],
								focus: tokens["--focus"],
							}}
						/>
						<ColorItem
							title="Interaction"
							subtitle="Primary actions and hover feedback"
							colors={{
								accent: tokens["--bg-primary"],
								hover: tokens["--bg-primary-highlight"],
								soft: tokens["--bg-accent"],
								contrast: tokens["--fg-accent-contrast"],
							}}
						/>
						<ColorItem
							title="Feedback"
							subtitle="Destructive and successful outcomes"
							colors={{
								"error-primary": tokens["--bg-error-primary"],
								error: tokens["--bg-error"],
								"success-primary": tokens["--bg-success-primary"],
								success: tokens["--bg-success"],
							}}
						/>
					</ColorPalette>
				</div>
			</ThemeProvider>
		</div>
	);
}

function TypeRole({
	children,
	description,
	name,
	sampleFontFamily,
	style,
	token,
}: {
	children: ReactNode;
	description: string;
	name: string;
	sampleFontFamily?: string;
	style: stylex.StyleXStyles | ReadonlyArray<stylex.StyleXStyles>;
	token: string;
}) {
	return (
		<div {...stylex.props(styles.typeRole)}>
			<div {...stylex.props(styles.typeMeta)}>
				<strong>{name}</strong>
				<code {...stylex.props(styles.inlineCode)}>{token}</code>
				<span {...stylex.props(styles.usage)}>{description}</span>
			</div>
			<div
				{...stylex.props(styles.typeSample, style)}
				style={sampleFontFamily ? { fontFamily: sampleFontFamily } : undefined}>
				{children}
			</div>
		</div>
	);
}

function TokenName({ name, value }: { name: string; value: string }) {
	return (
		<div {...stylex.props(styles.tokenName)}>
			<code {...stylex.props(styles.inlineCode)}>{name}</code>
			<span {...stylex.props(styles.tokenValue)}>{value}</span>
		</div>
	);
}

function ShadowSpecimen({ name, style, usage }: { name: string; style: stylex.StyleXStyles; usage: string }) {
	return (
		<div {...stylex.props(styles.shadowSpecimen, style)}>
			<TokenName name={name} value={usage} />
		</div>
	);
}

function MotionSpecimens() {
	const [isPlaying, setIsPlaying] = useState(false);

	return (
		<div {...stylex.props(styles.motionPanel)}>
			<div {...stylex.props(styles.motionToolbar)}>
				<p {...stylex.props(styles.motionHint)}>
					{isPlaying ? "The same distance reveals the pacing difference." : "Play all four duration tokens together."}
				</p>
				<button type="button" {...stylex.props(styles.playButton)} onClick={() => setIsPlaying((value) => !value)}>
					{isPlaying ? "Reset" : "Play motion"}
					<ArrowRightIcon aria-hidden size={16} weight="bold" />
				</button>
			</div>
			<div {...stylex.props(styles.motionRows)}>
				<MotionRow
					active={isPlaying}
					name='tokens["--motion-duration-quick"]'
					value="120ms"
					usage="Pressed and hover feedback"
					style={styles.motionQuick}
				/>
				<MotionRow
					active={isPlaying}
					name='tokens["--motion-duration-short"]'
					value="180ms"
					usage="Menus and compact popups"
					style={styles.motionShort}
				/>
				<MotionRow
					active={isPlaying}
					name='tokens["--motion-duration-medium"]'
					value="250ms"
					usage="Standard state transitions"
					style={styles.motionMedium}
				/>
				<MotionRow
					active={isPlaying}
					name='tokens["--motion-duration-content"]'
					value="350ms"
					usage="Content entering or changing"
					style={styles.motionContent}
				/>
			</div>
			<div {...stylex.props(styles.easingNotes)}>
				<TokenName name='tokens["--motion-ease-out"]' value="General interaction · cubic-bezier(0.16, 1, 0.3, 1)" />
				<TokenName
					name='tokens["--motion-ease-smooth-out"]'
					value="Content movement · cubic-bezier(0.22, 1, 0.36, 1)"
				/>
			</div>
		</div>
	);
}

function MotionRow({
	active,
	name,
	style,
	usage,
	value,
}: {
	active: boolean;
	name: string;
	style: stylex.StyleXStyles;
	usage: string;
	value: string;
}) {
	return (
		<div {...stylex.props(styles.motionRow)}>
			<TokenName name={name} value={value} />
			<div {...stylex.props(styles.motionTrack)}>
				<span {...stylex.props(styles.motionDot, style, active && styles.motionDotActive)} />
			</div>
			<span {...stylex.props(styles.usage)}>{usage}</span>
		</div>
	);
}

function TokenSource({ code }: { code: string }) {
	return (
		<FoundationSection
			title="Using the tokens"
			description="Import the typed StyleX variables instead of spelling token values directly in component styles.">
			<Source code={code} language="tsx" />
		</FoundationSection>
	);
}

const spacingTokens = [
	{ name: 'tokens["--space-0"]', value: "0", usage: "Remove token spacing" },
	{ name: 'tokens["--space-1"]', value: "0.25rem", usage: "Fine alignment" },
	{ name: 'tokens["--space-1-5"]', value: "0.375rem", usage: "Optical adjustment" },
	{ name: 'tokens["--space-2"]', value: "0.5rem", usage: "Icon and label" },
	{ name: 'tokens["--space-3"]', value: "0.75rem", usage: "Related controls" },
	{ name: 'tokens["--space-4"]', value: "1rem", usage: "Compact inset" },
	{ name: 'tokens["--space-5"]', value: "1.25rem", usage: "Form rhythm" },
	{ name: 'tokens["--space-6"]', value: "1.5rem", usage: "Card inset" },
	{ name: 'tokens["--space-7"]', value: "1.75rem", usage: "Roomy control rhythm" },
	{ name: 'tokens["--space-8"]', value: "2rem", usage: "Section grouping" },
	{ name: 'tokens["--space-9"]', value: "2.25rem", usage: "Large control rhythm" },
	{ name: 'tokens["--space-10"]', value: "2.5rem", usage: "Panel spacing" },
	{ name: 'tokens["--space-12"]', value: "3rem", usage: "Major separation" },
	{ name: 'tokens["--space-16"]', value: "4rem", usage: "Page sections" },
];

const containerSizeTokens = [
	{ name: 'tokens["--size-container-xs"]', value: "20rem", usage: "Compact panels" },
	{ name: 'tokens["--size-container-sm"]', value: "24rem", usage: "Narrow forms" },
	{ name: 'tokens["--size-container-md"]', value: "28rem", usage: "Dialogs" },
	{ name: 'tokens["--size-container-lg"]', value: "32rem", usage: "Reading panels" },
	{ name: 'tokens["--size-container-xl"]', value: "36rem", usage: "Wide forms" },
	{ name: 'tokens["--size-container-2xl"]', value: "42rem", usage: "Content panels" },
	{ name: 'tokens["--size-container-3xl"]', value: "48rem", usage: "Page sections" },
];

const radiusTokens = [
	{ name: 'tokens["--radius-xxs"]', value: "0.1875rem", usage: "Tiny indicators" },
	{ name: 'tokens["--radius-xs"]', value: "0.3125rem", usage: "Compact controls" },
	{ name: 'tokens["--radius-sm"]', value: "0.4375rem", usage: "Buttons and inputs" },
	{ name: 'tokens["--radius-md"]', value: "0.6875rem", usage: "Cards and popups" },
	{ name: 'tokens["--radius-lg"]', value: "0.9375rem", usage: "Large panels" },
	{ name: 'tokens["--radius-xl"]', value: "1.6875rem", usage: "Hero surfaces" },
	{ name: 'tokens["--radius-full"]', value: "9999rem", usage: "Pills and circles" },
];

const layerTokens = [
	{ name: "zIndex.base", value: "0", usage: "Normal content" },
	{ name: "zIndex.sticky", value: "100", usage: "Sticky navigation" },
	{ name: "zIndex.modalBackdropStyles", value: "200", usage: "Modal scrim" },
	{ name: "zIndex.modal", value: "300", usage: "Modal content" },
	{ name: "zIndex.alertBackdropStyles", value: "400", usage: "Nested alert scrim" },
	{ name: "zIndex.alert", value: "500", usage: "Nested confirmation" },
	{ name: "zIndex.popup", value: "600", usage: "Menus and popovers" },
	{ name: "zIndex.tooltip", value: "700", usage: "Transient labels" },
	{ name: "zIndex.toast", value: "800", usage: "Global feedback" },
];

const styles = stylex.create({
	page: {
		marginInline: "auto",
		maxWidth: "1120px",
	},
	pageHeader: {
		paddingBlockEnd: tokens["--space-8"],
		borderBottomColor: tokens["--border"],
		borderBottomStyle: "solid",
		borderBottomWidth: "1px",
	},
	pageTitle: {
		color: tokens["--fg"],
		fontSize: tokens["--font-size-8"],
		fontWeight: tokens["--font-weight-semibold"],
		letterSpacing: tokens["--letter-spacing-8"],
		lineHeight: tokens["--line-height-8"],
		marginBlockEnd: tokens["--space-3"],
		marginBlockStart: 0,
	},
	pageDescription: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-3"],
		letterSpacing: tokens["--letter-spacing-3"],
		lineHeight: tokens["--line-height-3"],
		maxWidth: "720px",
	},
	category: {
		paddingBlock: tokens["--space-12"],
		borderTopColor: tokens["--border"],
		borderTopStyle: "solid",
		borderTopWidth: {
			default: "1px",
			":first-of-type": 0,
		},
	},
	categoryHeader: {
		marginBlockEnd: tokens["--space-2"],
		maxWidth: "760px",
	},
	categoryTitle: {
		margin: 0,
		color: tokens["--fg"],
		fontSize: tokens["--font-size-7"],
		fontWeight: tokens["--font-weight-semibold"],
		letterSpacing: tokens["--letter-spacing-7"],
		lineHeight: tokens["--line-height-7"],
	},
	categoryDescription: {
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-3"],
		letterSpacing: tokens["--letter-spacing-3"],
		lineHeight: tokens["--line-height-3"],
		marginBlockEnd: 0,
		marginBlockStart: tokens["--space-2"],
	},
	section: {
		paddingBlock: tokens["--space-8"],
	},
	sectionHeader: {
		marginBlockEnd: tokens["--space-5"],
		maxWidth: "760px",
	},
	sectionTitle: {
		margin: 0,
		color: tokens["--fg"],
		fontSize: tokens["--font-size-5"],
		fontWeight: tokens["--font-weight-semibold"],
		letterSpacing: tokens["--letter-spacing-5"],
		lineHeight: tokens["--line-height-5"],
	},
	sectionDescription: {
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
		marginBlockEnd: 0,
		marginBlockStart: tokens["--space-2"],
	},
	themePalettes: {
		gap: tokens["--space-8"],
		display: "grid",
	},
	themePalette: {
		padding: tokens["--space-6"],
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: "1px",
		overflow: "hidden",
		backgroundColor: tokens["--surface"],
	},
	paletteTitle: {
		margin: 0,
		color: tokens["--fg"],
		fontSize: tokens["--font-size-4"],
		fontWeight: tokens["--font-weight-semibold"],
		letterSpacing: tokens["--letter-spacing-4"],
		lineHeight: tokens["--line-height-4"],
	},
	paletteScroller: {
		overflowX: "auto",
	},
	paletteContent: {
		minWidth: "760px",
	},
	typeRoles: {
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: "1px",
		overflow: "hidden",
	},
	typeRole: {
		padding: tokens["--space-5"],
		gap: tokens["--space-8"],
		alignItems: "center",
		backgroundColor: tokens["--surface"],
		display: "grid",
		gridTemplateColumns: {
			default: "minmax(220px, 0.8fr) minmax(0, 1.2fr)",
			"@media (max-width: 700px)": "1fr",
		},
		borderBottomColor: tokens["--border"],
		borderBottomStyle: "solid",
		borderBottomWidth: {
			default: "1px",
			":last-child": "0",
		},
	},
	typeMeta: {
		gap: tokens["--space-1"],
		alignItems: "start",
		display: "flex",
		flexDirection: "column",
	},
	typeSample: {
		margin: 0,
		color: tokens["--fg"],
	},
	typeDisplay: {
		fontSize: tokens["--font-size-5"],
		fontWeight: tokens["--font-weight-semibold"],
		letterSpacing: tokens["--letter-spacing-5"],
		lineHeight: tokens["--line-height-5"],
	},
	typeTitle: {
		fontSize: tokens["--font-size-4"],
		fontWeight: tokens["--font-weight-semibold"],
		letterSpacing: tokens["--letter-spacing-4"],
		lineHeight: tokens["--line-height-4"],
	},
	typeControl: {
		fontSize: tokens["--font-size-3"],
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-3"],
		lineHeight: tokens["--line-height-3"],
	},
	typeBody: {
		fontSize: tokens["--font-size-2"],
		fontWeight: tokens["--font-weight-regular"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	typeSmall: {
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-medium"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	weightGrid: {
		gap: tokens["--space-4"],
		display: "grid",
		gridTemplateColumns: {
			default: "1fr",
			[breakpoints.md]: "repeat(3, minmax(0, 1fr))",
		},
	},
	inlineCode: {
		color: tokens["--fg-accent"],
		fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	tokenRows: {
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: "1px",
		overflow: "hidden",
	},
	tokenRow: {
		gap: tokens["--space-4"],
		paddingBlock: tokens["--space-3"],
		paddingInline: tokens["--space-4"],
		alignItems: "center",
		backgroundColor: tokens["--surface"],
		display: "grid",
		gridTemplateColumns: {
			default: "150px minmax(120px, 1fr) minmax(150px, 0.8fr)",
			"@media (max-width: 650px)": "120px minmax(0, 1fr)",
		},
		borderBottomColor: tokens["--border"],
		borderBottomStyle: "solid",
		borderBottomWidth: {
			default: "1px",
			":last-child": "0",
		},
		minHeight: "56px",
	},
	tokenName: {
		gap: tokens["--space-1"],
		alignItems: "start",
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
	},
	tokenValue: {
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	usage: {
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	measureTrack: {
		borderRadius: tokens["--radius-full"],
		overflow: "hidden",
		paddingInline: tokens["--space-1"],
		alignItems: "center",
		backgroundColor: tokens["--surface-subtle"],
		display: "flex",
		height: "20px",
	},
	measureBar: {
		borderRadius: tokens["--radius-full"],
		backgroundColor: tokens["--bg-primary"],
		display: "block",
		height: "12px",
		minWidth: "4px",
	},
	spacingExample: {
		padding: tokens["--space-8"],
		borderRadius: tokens["--radius-lg"],
		gap: tokens["--space-8"],
		alignItems: "center",
		backgroundColor: tokens["--surface-subtle"],
		display: "grid",
		gridTemplateColumns: {
			default: "minmax(260px, 0.8fr) minmax(0, 1.2fr)",
			"@media (max-width: 700px)": "1fr",
		},
		marginBlockStart: tokens["--space-6"],
	},
	spacingCard: {
		padding: tokens["--space-6"],
		borderRadius: tokens["--radius-md"],
		gap: tokens["--space-3"],
		backgroundColor: tokens["--surface"],
		boxShadow: tokens["--shadow-sm"],
		display: "flex",
		flexDirection: "column",
	},
	exampleEyebrow: {
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-regular"],
		letterSpacing: tokens["--letter-spacing-1"],
		lineHeight: tokens["--line-height-1"],
	},
	exampleTitle: {
		color: tokens["--fg"],
		fontSize: tokens["--font-size-4"],
		letterSpacing: tokens["--letter-spacing-4"],
		lineHeight: tokens["--line-height-4"],
	},
	exampleCopy: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	exampleAnnotation: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-2"],
		letterSpacing: tokens["--letter-spacing-2"],
		lineHeight: tokens["--line-height-2"],
	},
	radiusGrid: {
		gap: tokens["--space-4"],
		display: "grid",
		gridTemplateColumns: {
			default: "repeat(4, minmax(0, 1fr))",
			"@media (max-width: 460px)": "1fr",
			"@media (max-width: 800px)": "repeat(2, minmax(0, 1fr))",
		},
	},
	radiusToken: {
		padding: tokens["--space-4"],
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: "1px",
		gap: tokens["--space-3"],
		backgroundColor: tokens["--surface"],
		display: "flex",
		flexDirection: "column",
	},
	radiusSpecimen: {
		borderColor: tokens["--bg-primary"],
		borderStyle: "solid",
		borderWidth: "1px",
		backgroundColor: tokens["--bg-accent"],
		height: "72px",
		width: "100%",
	},
	shadowGrid: {
		gap: tokens["--space-8"],
		paddingBlock: tokens["--space-6"],
		display: "grid",
		gridTemplateColumns: {
			default: "repeat(3, minmax(0, 1fr))",
			"@media (max-width: 760px)": "1fr",
		},
	},
	shadowSpecimen: {
		padding: tokens["--space-5"],
		borderRadius: tokens["--radius-md"],
		backgroundColor: tokens["--surface"],
		minHeight: "132px",
	},
	shadowSmall: {
		boxShadow: tokens["--shadow-sm"],
	},
	shadowMedium: {
		boxShadow: tokens["--shadow-md"],
	},
	shadowLarge: {
		boxShadow: tokens["--shadow-lg"],
	},
	motionPanel: {
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: "1px",
		overflow: "hidden",
		backgroundColor: tokens["--surface"],
	},
	motionToolbar: {
		padding: tokens["--space-4"],
		gap: tokens["--space-4"],
		alignItems: "center",
		backgroundColor: tokens["--surface-subtle"],
		display: "flex",
		justifyContent: "space-between",
	},
	motionHint: {
		margin: 0,
		color: tokens["--fg-muted"],
		fontSize: tokens["--font-size-1"],
	},
	playButton: {
		borderRadius: tokens["--radius-sm"],
		gap: tokens["--space-2"],
		paddingInline: tokens["--space-3"],
		alignItems: "center",
		backgroundColor: {
			default: tokens["--bg-primary"],
			":hover": tokens["--bg-primary-highlight"],
		},
		color: tokens["--fg-accent-contrast"],
		display: "inline-flex",
		flexShrink: 0,
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-semibold"],
		minHeight: "36px",
	},
	motionRows: {
		display: "flex",
		flexDirection: "column",
	},
	motionRow: {
		padding: tokens["--space-4"],
		gap: tokens["--space-4"],
		alignItems: "center",
		display: "grid",
		gridTemplateColumns: {
			default: "190px minmax(150px, 1fr) minmax(160px, 0.7fr)",
			"@media (max-width: 680px)": "140px minmax(0, 1fr)",
		},
		borderBottomColor: tokens["--border"],
		borderBottomStyle: "solid",
		borderBottomWidth: "1px",
	},
	motionTrack: {
		padding: "3px",
		borderRadius: tokens["--radius-full"],
		backgroundColor: tokens["--surface-subtle"],
		position: "relative",
		height: "20px",
	},
	motionDot: {
		borderRadius: tokens["--radius-full"],
		backgroundColor: tokens["--bg-primary"],
		display: "block",
		insetInlineStart: "0",
		position: "absolute",
		transitionProperty: "inset-inline-start",
		transitionTimingFunction: tokens["--motion-ease-out"],
		height: "14px",
		width: "14px",
	},
	motionDotActive: {
		insetInlineStart: "calc(100% - 14px)",
	},
	motionQuick: {
		transitionDuration: {
			default: tokens["--motion-duration-quick"],
			"@media (prefers-reduced-motion: reduce)": "0.01ms",
		},
	},
	motionShort: {
		transitionDuration: {
			default: tokens["--motion-duration-short"],
			"@media (prefers-reduced-motion: reduce)": "0.01ms",
		},
	},
	motionMedium: {
		transitionDuration: {
			default: tokens["--motion-duration-medium"],
			"@media (prefers-reduced-motion: reduce)": "0.01ms",
		},
	},
	motionContent: {
		transitionDuration: {
			default: tokens["--motion-duration-content"],
			"@media (prefers-reduced-motion: reduce)": "0.01ms",
		},
	},
	easingNotes: {
		padding: tokens["--space-4"],
		gap: tokens["--space-4"],
		display: "grid",
		gridTemplateColumns: {
			default: "repeat(3, minmax(0, 1fr))",
			"@media (max-width: 760px)": "1fr",
		},
	},
	layerLayout: {
		gap: tokens["--space-8"],
		alignItems: "center",
		display: "grid",
		gridTemplateColumns: {
			default: "minmax(300px, 1fr) minmax(260px, 0.8fr)",
			"@media (max-width: 760px)": "1fr",
		},
	},
	layerStage: {
		borderRadius: tokens["--radius-lg"],
		backgroundColor: tokens["--surface-subtle"],
		position: "relative",
		height: "330px",
	},
	layerCard: {
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: "1px",
		alignItems: "center",
		backgroundColor: tokens["--surface"],
		boxShadow: tokens["--shadow-sm"],
		color: tokens["--fg"],
		display: "flex",
		fontSize: tokens["--font-size-1"],
		fontWeight: tokens["--font-weight-semibold"],
		justifyContent: "center",
		position: "absolute",
		height: "92px",
		width: "180px",
	},
	layerModal: {
		insetBlockStart: tokens["--space-5"],
		insetInlineStart: tokens["--space-5"],
		zIndex: zIndex.modal,
	},
	layerPopup: {
		insetBlockStart: tokens["--space-16"],
		insetInlineStart: tokens["--space-16"],
		zIndex: zIndex.popup,
	},
	layerTooltip: {
		insetBlockStart: "124px",
		insetInlineStart: "124px",
		zIndex: zIndex.tooltip,
	},
	layerToast: {
		insetBlockStart: "184px",
		insetInlineStart: "184px",
		zIndex: zIndex.toast,
	},
	layerList: {
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: "1px",
		overflow: "hidden",
	},
	layerRow: {
		padding: tokens["--space-3"],
		gap: tokens["--space-3"],
		backgroundColor: tokens["--surface"],
		display: "grid",
		gridTemplateColumns: "130px minmax(0, 1fr)",
		borderBottomColor: tokens["--border"],
		borderBottomStyle: "solid",
		borderBottomWidth: {
			default: "1px",
			":last-child": "0",
		},
	},
	iconExamples: {
		gap: tokens["--space-4"],
		display: "grid",
		gridTemplateColumns: {
			default: "repeat(3, minmax(0, 1fr))",
			"@media (max-width: 650px)": "1fr",
		},
	},
	iconExample: {
		padding: tokens["--space-4"],
		borderColor: tokens["--border"],
		borderRadius: tokens["--radius-md"],
		borderStyle: "solid",
		borderWidth: "1px",
		gap: tokens["--space-4"],
		alignItems: "center",
		backgroundColor: tokens["--surface"],
		color: tokens["--fg"],
		display: "flex",
	},
});
