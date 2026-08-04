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
import { motion } from "@/styles/tokens.stylex";
import { color, radius, shadow, space } from "@/styles/tokens.stylex";
import { textFamilyStyles, textSizeStyles } from "@/components/text/text.stylex";
import { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } from "@/styles/tokens.stylex";

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
					<ThemePalette name="Light" theme="light" />
					<ThemePalette name="Dark" theme="dark" />
				</div>
			</FoundationSection>

			<FoundationSection
				title="Primitive ramps"
				description="Primitive values support the semantic layer. Prefer semantic tokens in product UI so themes can evolve independently.">
				<div {...stylex.props(styles.paletteScroller)}>
					<div {...stylex.props(styles.paletteContent)}>
						<ColorPalette>
							<ColorItem
								title="Accent / lighter steps"
								subtitle="Backgrounds, selected rows, and quiet emphasis"
								colors={{
									"25": "var(--color-accent-25)",
									"50": "var(--color-accent-50)",
									"100": "var(--color-accent-100)",
									"200": "var(--color-accent-200)",
									"300": "var(--color-accent-300)",
									"400": "var(--color-accent-400)",
								}}
							/>
							<ColorItem
								title="Accent / stronger steps"
								subtitle="Controls, text, and high-emphasis states"
								colors={{
									"500": "var(--color-accent-500)",
									"600": "var(--color-accent-600)",
									"700": "var(--color-accent-700)",
									"800": "var(--color-accent-800)",
									"900": "var(--color-accent-900)",
									"950": "var(--color-accent-950)",
									"975": "var(--color-accent-975)",
								}}
							/>
							<ColorItem
								title="Neutral / lighter steps"
								subtitle="Canvas, surfaces, borders, and disabled states"
								colors={{
									"25": "var(--color-neutral-25)",
									"50": "var(--color-neutral-50)",
									"100": "var(--color-neutral-100)",
									"200": "var(--color-neutral-200)",
									"300": "var(--color-neutral-300)",
									"400": "var(--color-neutral-400)",
								}}
							/>
							<ColorItem
								title="Neutral / stronger steps"
								subtitle="Secondary text through highest-contrast content"
								colors={{
									"500": "var(--color-neutral-500)",
									"600": "var(--color-neutral-600)",
									"700": "var(--color-neutral-700)",
									"800": "var(--color-neutral-800)",
									"900": "var(--color-neutral-900)",
									"950": "var(--color-neutral-950)",
									"975": "var(--color-neutral-975)",
								}}
							/>
						</ColorPalette>
					</div>
				</div>
			</FoundationSection>

			<TokenSource
				code={`import * as stylex from "@stylexjs/stylex";
import { color } from "@/styles/tokens.stylex";

const styles = stylex.create({
  card: {
    backgroundColor: color.surface,
    borderColor: color.border,
    color: color.fg,
  },
  action: {
    backgroundColor: color.bgAccent,
    color: color.fgAccentContrast,
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
					fontFamily={fontFamily.sans}
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
						token="textFamilyStyles.sans · textSizeStyles.3"
						description="Default interface and reading typography."
						sampleFontFamily={fontFamily.sans}
						style={[textFamilyStyles.sans, textSizeStyles["3"]]}>
						Clear tools make complex work feel lighter.
					</TypeRole>
					<TypeRole
						name="Serif 3"
						token="textFamilyStyles.serif · textSizeStyles.3"
						description="Editorial or expressive supporting content."
						sampleFontFamily={fontFamily.serif}
						style={[textFamilyStyles.serif, textSizeStyles["3"]]}>
						Clear tools make complex work feel lighter.
					</TypeRole>
					<TypeRole
						name="Mono 3"
						token="textFamilyStyles.mono · textSizeStyles.3"
						description="Code, identifiers, and tabular technical values."
						sampleFontFamily={fontFamily.mono}
						style={[textFamilyStyles.mono, textSizeStyles["3"]]}>
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
						token="fontSize.x5 · lineHeight.x5 · letterSpacing.x5 · fontWeight.semibold"
						description="Short, high-emphasis page or empty-state titles."
						style={styles.typeDisplay}>
						Design systems, clearly expressed.
					</TypeRole>
					<TypeRole
						name="Title"
						token="fontSize.x4 · lineHeight.x4 · letterSpacing.x4 · fontWeight.semibold"
						description="Section headings, dialog titles, and card titles."
						style={styles.typeTitle}>
						Workspace activity
					</TypeRole>
					<TypeRole
						name="Control"
						token="fontSize.x3 · lineHeight.x3 · letterSpacing.x3 · fontWeight.medium"
						description="Prominent labels in buttons, inputs, and menu items."
						style={styles.typeControl}>
						Create workspace
					</TypeRole>
					<TypeRole
						name="Body"
						token="fontSize.x2 · lineHeight.x2 · letterSpacing.x2 · fontWeight.regular"
						description="Default reading size for descriptions and content."
						style={styles.typeBody}>
						Invite collaborators and keep project decisions in one place.
					</TypeRole>
					<TypeRole
						name="Small"
						token="fontSize.x1 · lineHeight.x1 · letterSpacing.x1 · fontWeight.medium"
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
						fontFamily={fontFamily.sans}
						fontSizes={["1.125rem"]}
						fontWeight={400}
						sampleText="Regular 400 · Long-form copy"
					/>
					<Typeset
						fontFamily={fontFamily.sans}
						fontSizes={["1.125rem"]}
						fontWeight={500}
						sampleText="Medium 500 · Controls and labels"
					/>
					<Typeset
						fontFamily={fontFamily.sans}
						fontSizes={["1.125rem"]}
						fontWeight={600}
						sampleText="Semibold 600 · Titles and emphasis"
					/>
				</div>
			</FoundationSection>

			<TokenSource
				code={`import * as stylex from "@stylexjs/stylex";
import { textFamilyStyles, textSizeStyles, textWeightStyles } from "@/components/text/text.stylex";

<h2 {...stylex.props(textSizeStyles["4"], textWeightStyles.semibold)}>Workspace activity</h2>
<code {...stylex.props(textFamilyStyles.mono, textSizeStyles["2"])}>npm run build</code>`}
			/>
		</FoundationCategory>
	);
}

function SpacingAndShapeSection() {
	return (
		<FoundationCategory
			title="Spacing & shape"
			description="A 0.25rem-based spacing scale and a restrained radius family create consistent rhythm from compact controls to large surfaces.">
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
						<span {...stylex.props(styles.exampleEyebrow)}>space[3] gap</span>
						<strong {...stylex.props(styles.exampleTitle)}>A composed card</strong>
						<p {...stylex.props(styles.exampleCopy)}>
							The x6 inset gives content room to breathe while x3 keeps related text together.
						</p>
					</div>
					<p {...stylex.props(styles.exampleAnnotation)}>
						This specimen uses <code>space[6]</code> for card padding, <code>space[3]</code> between related items, and{" "}
						<code>space[8]</code> around the example.
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
import { radius, space } from "@/styles/tokens.stylex";

const styles = stylex.create({
  card: {
    borderRadius: radius.md,
    padding: space[6],
  },
  controlRow: {
    display: "flex",
    gap: space[3],
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
					<ShadowSpecimen name="shadow.sm" usage="Raised controls and compact cards" style={styles.shadowSmall} />
					<ShadowSpecimen name="shadow.md" usage="Menus, popovers, and floating panels" style={styles.shadowMedium} />
					<ShadowSpecimen name="shadow.lg" usage="Prominent previews and large overlays" style={styles.shadowLarge} />
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
import { motion, shadow } from "@/styles/tokens.stylex";

const styles = stylex.create({
  popup: {
    boxShadow: shadow.md,
    transitionDuration: motion.durationShort,
    transitionTimingFunction: motion.easeOut,
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
		<article data-theme="light" {...stylex.props(styles.page)}>
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

function ThemePalette({ name, theme }: { name: string; theme: "light" | "dark" }) {
	return (
		<div {...stylex.props(styles.themePalette)}>
			<h4 {...stylex.props(styles.paletteTitle)}>{name} theme</h4>
			<div data-theme={theme} {...stylex.props(styles.paletteScroller)}>
				<div {...stylex.props(styles.paletteContent)}>
					<ColorPalette>
						<ColorItem
							title="Surfaces"
							subtitle="Page and container elevation"
							colors={{
								canvas: "var(--color-canvas)",
								surface: "var(--color-surface)",
								raised: "var(--color-elevated)",
								subtle: "var(--color-surface-subtle)",
							}}
						/>
						<ColorItem
							title="Content"
							subtitle="Default, quiet, and emphasized text"
							colors={{
								text: "var(--color-text)",
								muted: "var(--color-text-muted)",
								accent: "var(--color-text-accent)",
								inverse: "var(--color-inverse-text)",
							}}
						/>
						<ColorItem
							title="Boundaries"
							subtitle="Dividers, control borders, and focus"
							colors={{
								border: "var(--color-border)",
								strong: "var(--color-border-strong)",
								focus: "var(--color-focus)",
							}}
						/>
						<ColorItem
							title="Interaction"
							subtitle="Primary actions and hover feedback"
							colors={{
								accent: "var(--color-accent)",
								hover: "var(--color-accent-hover)",
								soft: "var(--color-accent-soft)",
								contrast: "var(--color-accent-contrast)",
							}}
						/>
						<ColorItem
							title="Feedback"
							subtitle="Destructive and successful outcomes"
							colors={{
								danger: "var(--color-danger)",
								"danger soft": "var(--color-danger-subtle)",
								success: "var(--color-success)",
								"success soft": "var(--color-success-subtle)",
							}}
						/>
					</ColorPalette>
				</div>
			</div>
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
					name="motion.durationQuick"
					value="120ms"
					usage="Pressed and hover feedback"
					style={styles.motionQuick}
				/>
				<MotionRow
					active={isPlaying}
					name="motion.durationShort"
					value="180ms"
					usage="Menus and compact popups"
					style={styles.motionShort}
				/>
				<MotionRow
					active={isPlaying}
					name="motion.durationMedium"
					value="250ms"
					usage="Standard state transitions"
					style={styles.motionMedium}
				/>
				<MotionRow
					active={isPlaying}
					name="motion.durationContent"
					value="350ms"
					usage="Content entering or changing"
					style={styles.motionContent}
				/>
			</div>
			<div {...stylex.props(styles.easingNotes)}>
				<TokenName name="motion.easeOut" value="General interaction · cubic-bezier(0.16, 1, 0.3, 1)" />
				<TokenName name="motion.easeSmoothOut" value="Content movement · cubic-bezier(0.22, 1, 0.36, 1)" />
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
	{ name: "space[0]", value: "0", usage: "Remove token spacing" },
	{ name: "space[1]", value: "0.25rem", usage: "Fine alignment" },
	{ name: "space[1.5]", value: "0.375rem", usage: "Optical adjustment" },
	{ name: "space[2]", value: "0.5rem", usage: "Icon and label" },
	{ name: "space[3]", value: "0.75rem", usage: "Related controls" },
	{ name: "space[4]", value: "1rem", usage: "Compact inset" },
	{ name: "space[5]", value: "1.25rem", usage: "Form rhythm" },
	{ name: "space[6]", value: "1.5rem", usage: "Card inset" },
	{ name: "space[7]", value: "1.75rem", usage: "Roomy control rhythm" },
	{ name: "space[8]", value: "2rem", usage: "Section grouping" },
	{ name: "space[9]", value: "2.25rem", usage: "Large control rhythm" },
	{ name: "space[10]", value: "2.5rem", usage: "Panel spacing" },
	{ name: "space[12]", value: "3rem", usage: "Major separation" },
	{ name: "space[16]", value: "4rem", usage: "Page sections" },
];

const containerSizeTokens = [
	{ name: 'size["container.xs"]', value: "20rem", usage: "Compact panels" },
	{ name: 'size["container.sm"]', value: "24rem", usage: "Narrow forms" },
	{ name: 'size["container.md"]', value: "28rem", usage: "Dialogs" },
	{ name: 'size["container.lg"]', value: "32rem", usage: "Reading panels" },
	{ name: 'size["container.xl"]', value: "36rem", usage: "Wide forms" },
	{ name: 'size["container.2xl"]', value: "42rem", usage: "Content panels" },
	{ name: 'size["container.3xl"]', value: "48rem", usage: "Page sections" },
];

const radiusTokens = [
	{ name: "radius.xxs", value: "0.1875rem", usage: "Tiny indicators" },
	{ name: "radius.xs", value: "0.3125rem", usage: "Compact controls" },
	{ name: "radius.sm", value: "0.4375rem", usage: "Buttons and inputs" },
	{ name: "radius.md", value: "0.6875rem", usage: "Cards and popups" },
	{ name: "radius.lg", value: "0.9375rem", usage: "Large panels" },
	{ name: "radius.xl", value: "1.6875rem", usage: "Hero surfaces" },
	{ name: "radius.full", value: "9999rem", usage: "Pills and circles" },
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
		paddingBlockEnd: space[8],
		borderBottomColor: color.border,
		borderBottomStyle: "solid",
		borderBottomWidth: "1px",
	},
	pageTitle: {
		color: color.fg,
		fontSize: fontSize.x8,
		fontWeight: fontWeight.semibold,
		letterSpacing: letterSpacing.x8,
		lineHeight: lineHeight.x8,
		marginBlockEnd: space[3],
		marginBlockStart: 0,
	},
	pageDescription: {
		margin: 0,
		color: color.fgMuted,
		fontSize: fontSize.x3,
		letterSpacing: letterSpacing.x3,
		lineHeight: lineHeight.x3,
		maxWidth: "720px",
	},
	category: {
		paddingBlock: space[12],
		borderTopColor: color.border,
		borderTopStyle: "solid",
		borderTopWidth: {
			default: "1px",
			":first-of-type": 0,
		},
	},
	categoryHeader: {
		marginBlockEnd: space[2],
		maxWidth: "760px",
	},
	categoryTitle: {
		margin: 0,
		color: color.fg,
		fontSize: fontSize.x7,
		fontWeight: fontWeight.semibold,
		letterSpacing: letterSpacing.x7,
		lineHeight: lineHeight.x7,
	},
	categoryDescription: {
		color: color.fgMuted,
		fontSize: fontSize.x3,
		letterSpacing: letterSpacing.x3,
		lineHeight: lineHeight.x3,
		marginBlockEnd: 0,
		marginBlockStart: space[2],
	},
	section: {
		paddingBlock: space[8],
	},
	sectionHeader: {
		marginBlockEnd: space[5],
		maxWidth: "760px",
	},
	sectionTitle: {
		margin: 0,
		color: color.fg,
		fontSize: fontSize.x5,
		fontWeight: fontWeight.semibold,
		letterSpacing: letterSpacing.x5,
		lineHeight: lineHeight.x5,
	},
	sectionDescription: {
		color: color.fgMuted,
		fontSize: fontSize.x2,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
		marginBlockEnd: 0,
		marginBlockStart: space[2],
	},
	themePalettes: {
		gap: space[8],
		display: "grid",
	},
	themePalette: {
		padding: space[6],
		borderColor: color.border,
		borderRadius: radius.md,
		borderStyle: "solid",
		borderWidth: "1px",
		overflow: "hidden",
		backgroundColor: color.surface,
	},
	paletteTitle: {
		margin: 0,
		color: "var(--color-text)",
		fontSize: fontSize.x4,
		fontWeight: fontWeight.semibold,
		letterSpacing: letterSpacing.x4,
		lineHeight: lineHeight.x4,
	},
	paletteScroller: {
		overflowX: "auto",
	},
	paletteContent: {
		minWidth: "760px",
	},
	typeRoles: {
		borderColor: color.border,
		borderRadius: radius.md,
		borderStyle: "solid",
		borderWidth: "1px",
		overflow: "hidden",
	},
	typeRole: {
		padding: space[5],
		gap: space[8],
		alignItems: "center",
		backgroundColor: color.surface,
		display: "grid",
		gridTemplateColumns: {
			default: "minmax(220px, 0.8fr) minmax(0, 1.2fr)",
			"@media (max-width: 700px)": "1fr",
		},
		borderBottomColor: color.border,
		borderBottomStyle: "solid",
		borderBottomWidth: {
			default: "1px",
			":last-child": "0",
		},
	},
	typeMeta: {
		gap: space[1],
		alignItems: "start",
		display: "flex",
		flexDirection: "column",
	},
	typeSample: {
		margin: 0,
		color: color.fg,
	},
	typeDisplay: {
		fontSize: fontSize.x5,
		fontWeight: fontWeight.semibold,
		letterSpacing: letterSpacing.x5,
		lineHeight: lineHeight.x5,
	},
	typeTitle: {
		fontSize: fontSize.x4,
		fontWeight: fontWeight.semibold,
		letterSpacing: letterSpacing.x4,
		lineHeight: lineHeight.x4,
	},
	typeControl: {
		fontSize: fontSize.x3,
		fontWeight: fontWeight.medium,
		letterSpacing: letterSpacing.x3,
		lineHeight: lineHeight.x3,
	},
	typeBody: {
		fontSize: fontSize.x2,
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
	},
	typeSmall: {
		fontSize: fontSize.x1,
		fontWeight: fontWeight.medium,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	weightGrid: {
		gap: space[4],
		display: "grid",
		gridTemplateColumns: {
			default: "1fr",
			[breakpoints.md]: "repeat(3, minmax(0, 1fr))",
		},
	},
	inlineCode: {
		color: color.fgAccent,
		fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	tokenRows: {
		borderColor: color.border,
		borderRadius: radius.md,
		borderStyle: "solid",
		borderWidth: "1px",
		overflow: "hidden",
	},
	tokenRow: {
		gap: space[4],
		paddingBlock: space[3],
		paddingInline: space[4],
		alignItems: "center",
		backgroundColor: color.surface,
		display: "grid",
		gridTemplateColumns: {
			default: "150px minmax(120px, 1fr) minmax(150px, 0.8fr)",
			"@media (max-width: 650px)": "120px minmax(0, 1fr)",
		},
		borderBottomColor: color.border,
		borderBottomStyle: "solid",
		borderBottomWidth: {
			default: "1px",
			":last-child": "0",
		},
		minHeight: "56px",
	},
	tokenName: {
		gap: space[1],
		alignItems: "start",
		display: "flex",
		flexDirection: "column",
		minWidth: 0,
	},
	tokenValue: {
		color: color.fgMuted,
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	usage: {
		color: color.fgMuted,
		fontSize: fontSize.x1,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	measureTrack: {
		borderRadius: radius.full,
		overflow: "hidden",
		paddingInline: space[1],
		alignItems: "center",
		backgroundColor: color.surfaceSubtle,
		display: "flex",
		height: "20px",
	},
	measureBar: {
		borderRadius: radius.full,
		backgroundColor: color.bgAccent,
		display: "block",
		height: "12px",
		minWidth: "4px",
	},
	spacingExample: {
		padding: space[8],
		borderRadius: radius.lg,
		gap: space[8],
		alignItems: "center",
		backgroundColor: color.surfaceSubtle,
		display: "grid",
		gridTemplateColumns: {
			default: "minmax(260px, 0.8fr) minmax(0, 1.2fr)",
			"@media (max-width: 700px)": "1fr",
		},
		marginBlockStart: space[6],
	},
	spacingCard: {
		padding: space[6],
		borderRadius: radius.md,
		gap: space[3],
		backgroundColor: color.surface,
		boxShadow: shadow.sm,
		display: "flex",
		flexDirection: "column",
	},
	exampleEyebrow: {
		color: color.fgMuted,
		fontSize: fontSize.x1,
		fontWeight: fontWeight.regular,
		letterSpacing: letterSpacing.x1,
		lineHeight: lineHeight.x1,
	},
	exampleTitle: {
		color: color.fg,
		fontSize: fontSize.x4,
		letterSpacing: letterSpacing.x4,
		lineHeight: lineHeight.x4,
	},
	exampleCopy: {
		margin: 0,
		color: color.fgMuted,
		fontSize: fontSize.x2,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
	},
	exampleAnnotation: {
		margin: 0,
		color: color.fgMuted,
		fontSize: fontSize.x2,
		letterSpacing: letterSpacing.x2,
		lineHeight: lineHeight.x2,
	},
	radiusGrid: {
		gap: space[4],
		display: "grid",
		gridTemplateColumns: {
			default: "repeat(4, minmax(0, 1fr))",
			"@media (max-width: 460px)": "1fr",
			"@media (max-width: 800px)": "repeat(2, minmax(0, 1fr))",
		},
	},
	radiusToken: {
		padding: space[4],
		borderColor: color.border,
		borderRadius: radius.md,
		borderStyle: "solid",
		borderWidth: "1px",
		gap: space[3],
		backgroundColor: color.surface,
		display: "flex",
		flexDirection: "column",
	},
	radiusSpecimen: {
		borderColor: color.bgAccent,
		borderStyle: "solid",
		borderWidth: "1px",
		backgroundColor: color.bgAccentSoft,
		height: "72px",
		width: "100%",
	},
	shadowGrid: {
		gap: space[8],
		paddingBlock: space[6],
		display: "grid",
		gridTemplateColumns: {
			default: "repeat(3, minmax(0, 1fr))",
			"@media (max-width: 760px)": "1fr",
		},
	},
	shadowSpecimen: {
		padding: space[5],
		borderRadius: radius.md,
		backgroundColor: color.surface,
		minHeight: "132px",
	},
	shadowSmall: {
		boxShadow: shadow.sm,
	},
	shadowMedium: {
		boxShadow: shadow.md,
	},
	shadowLarge: {
		boxShadow: shadow.lg,
	},
	motionPanel: {
		borderColor: color.border,
		borderRadius: radius.md,
		borderStyle: "solid",
		borderWidth: "1px",
		overflow: "hidden",
		backgroundColor: color.surface,
	},
	motionToolbar: {
		padding: space[4],
		gap: space[4],
		alignItems: "center",
		backgroundColor: color.surfaceSubtle,
		display: "flex",
		justifyContent: "space-between",
	},
	motionHint: {
		margin: 0,
		color: color.fgMuted,
		fontSize: fontSize.x1,
	},
	playButton: {
		borderRadius: radius.sm,
		gap: space[2],
		paddingInline: space[3],
		alignItems: "center",
		backgroundColor: {
			default: color.bgAccent,
			":hover": color.bgAccentHover,
		},
		color: color.fgAccentContrast,
		display: "inline-flex",
		flexShrink: 0,
		fontSize: fontSize.x1,
		fontWeight: fontWeight.semibold,
		minHeight: "36px",
	},
	motionRows: {
		display: "flex",
		flexDirection: "column",
	},
	motionRow: {
		padding: space[4],
		gap: space[4],
		alignItems: "center",
		display: "grid",
		gridTemplateColumns: {
			default: "190px minmax(150px, 1fr) minmax(160px, 0.7fr)",
			"@media (max-width: 680px)": "140px minmax(0, 1fr)",
		},
		borderBottomColor: color.border,
		borderBottomStyle: "solid",
		borderBottomWidth: "1px",
	},
	motionTrack: {
		padding: "3px",
		borderRadius: radius.full,
		backgroundColor: color.surfaceSubtle,
		position: "relative",
		height: "20px",
	},
	motionDot: {
		borderRadius: radius.full,
		backgroundColor: color.bgAccent,
		display: "block",
		insetInlineStart: "0",
		position: "absolute",
		transitionProperty: "inset-inline-start",
		transitionTimingFunction: motion.easeOut,
		height: "14px",
		width: "14px",
	},
	motionDotActive: {
		insetInlineStart: "calc(100% - 14px)",
	},
	motionQuick: {
		transitionDuration: {
			default: motion.durationQuick,
			"@media (prefers-reduced-motion: reduce)": "0.01ms",
		},
	},
	motionShort: {
		transitionDuration: {
			default: motion.durationShort,
			"@media (prefers-reduced-motion: reduce)": "0.01ms",
		},
	},
	motionMedium: {
		transitionDuration: {
			default: motion.durationMedium,
			"@media (prefers-reduced-motion: reduce)": "0.01ms",
		},
	},
	motionContent: {
		transitionDuration: {
			default: motion.durationContent,
			"@media (prefers-reduced-motion: reduce)": "0.01ms",
		},
	},
	easingNotes: {
		padding: space[4],
		gap: space[4],
		display: "grid",
		gridTemplateColumns: {
			default: "repeat(3, minmax(0, 1fr))",
			"@media (max-width: 760px)": "1fr",
		},
	},
	layerLayout: {
		gap: space[8],
		alignItems: "center",
		display: "grid",
		gridTemplateColumns: {
			default: "minmax(300px, 1fr) minmax(260px, 0.8fr)",
			"@media (max-width: 760px)": "1fr",
		},
	},
	layerStage: {
		borderRadius: radius.lg,
		backgroundColor: color.surfaceSubtle,
		position: "relative",
		height: "330px",
	},
	layerCard: {
		borderColor: color.border,
		borderRadius: radius.md,
		borderStyle: "solid",
		borderWidth: "1px",
		alignItems: "center",
		backgroundColor: color.surface,
		boxShadow: shadow.sm,
		color: color.fg,
		display: "flex",
		fontSize: fontSize.x1,
		fontWeight: fontWeight.semibold,
		justifyContent: "center",
		position: "absolute",
		height: "92px",
		width: "180px",
	},
	layerModal: {
		insetBlockStart: space[5],
		insetInlineStart: space[5],
		zIndex: zIndex.modal,
	},
	layerPopup: {
		insetBlockStart: space[16],
		insetInlineStart: space[16],
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
		borderColor: color.border,
		borderRadius: radius.md,
		borderStyle: "solid",
		borderWidth: "1px",
		overflow: "hidden",
	},
	layerRow: {
		padding: space[3],
		gap: space[3],
		backgroundColor: color.surface,
		display: "grid",
		gridTemplateColumns: "130px minmax(0, 1fr)",
		borderBottomColor: color.border,
		borderBottomStyle: "solid",
		borderBottomWidth: {
			default: "1px",
			":last-child": "0",
		},
	},
	iconExamples: {
		gap: space[4],
		display: "grid",
		gridTemplateColumns: {
			default: "repeat(3, minmax(0, 1fr))",
			"@media (max-width: 650px)": "1fr",
		},
	},
	iconExample: {
		padding: space[4],
		borderColor: color.border,
		borderRadius: radius.md,
		borderStyle: "solid",
		borderWidth: "1px",
		gap: space[4],
		alignItems: "center",
		backgroundColor: color.surface,
		color: color.fg,
		display: "flex",
	},
});
