# Plan 001: Add a presentational Stepper component

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: Base UI Tabs
- **Category**: component
- **Status**: IN REVIEW

## Goal

Add a product-agnostic Stepper presentation for a fixed set of related Tabs.
The component supplies marker, text, state, connector, and panel layout while
Base UI Tabs remains the sole owner of selection, keyboard navigation, disabled
tabs, tab/panel relationships, and panel visibility.

This is deliberately a thin component. It does not own workflow progression,
validation policy, dynamic step topology, or focus transfer.

## Decisions

- Build directly on Base UI Tabs Root, List, Tab, Indicator, and Panel.
- Forward `value`, `defaultValue`, and `onValueChange` without adding a second
  requested/effective value model. Root values remain nullable because Base UI
  reports `null` when no enabled Tab is available; Step values remain strings.
- Use manual tab activation and non-looping focus. Base UI owns arrow keys,
  Enter/Space activation, roving focus, roles, `aria-selected`, `aria-controls`,
  and panel `aria-labelledby`.
- `disabled` on a Step is the locking mechanism. Consumers decide when a step
  becomes locked or unlocked.
- The marker always receives an explicit number or icon child. Stepper does not
  register steps or derive ordinals.
- `status="completed" | "invalid"` changes presentation and adds a short hidden
  text label to the tab's normal accessible name. It does not create custom ID or
  `aria-describedby` relationships.
- Base UI Tabs Indicator supplies the fill from the first marker center to the
  current marker center. Step-owned CSS segments supply the neutral connector.
- `orientation="vertical"` is responsive: it uses vertical Tabs at the `md`
  breakpoint and above, then switches the actual Base UI orientation to
  horizontal below `md`. Layout and arrow-key behavior therefore change
  together. `orientation="horizontal"` remains horizontal at every width.
- Horizontal steps share available width and truncate text. Active-step
  scrolling is deferred.
- The repository is LTR-only for now. Do not add a Stepper-specific RTL bridge.
  Adopt Base UI's future localization/logical-direction extension in one
  library-wide pass.

## Public API

```tsx
export type StepperOrientation = "horizontal" | "vertical";
export type StepperStatus = "incomplete" | "completed" | "invalid";
export type StepperValue = string;

export const Stepper = {
	Root,
	List,
	Step,
	Marker,
	Heading,
	Title,
	Description,
	Content,
	Panel,
} as const;
```

Supported composition:

```tsx
<Stepper.Root value={value} onValueChange={setValue}>
	<Stepper.List aria-label="Account setup progress">
		<Stepper.Step value="profile" status="completed">
			<Stepper.Marker>1</Stepper.Marker>
			<Stepper.Heading>
				<Stepper.Title>Profile</Stepper.Title>
				<Stepper.Description>Add your personal details.</Stepper.Description>
			</Stepper.Heading>
		</Stepper.Step>
		<Stepper.Step value="security" disabled>
			<Stepper.Marker><SecurityIcon aria-hidden /></Stepper.Marker>
			<Stepper.Heading>
				<Stepper.Title>Security</Stepper.Title>
				<Stepper.Description>Choose authentication options.</Stepper.Description>
			</Stepper.Heading>
		</Stepper.Step>
	</Stepper.List>
	<Stepper.Content>
		<Stepper.Panel value="profile">Profile form</Stepper.Panel>
		<Stepper.Panel value="security">Security form</Stepper.Panel>
	</Stepper.Content>
</Stepper.Root>
```

Only Root receives common MarginProps. Every part keeps the repository's
`className`, native `style`, and `xstyle` precedence. List does not expose
`activateOnFocus`, `loopFocus`, or `render`; Step does not expose `render`, so
connector geometry can rely on native tab buttons.

## Explicitly out of scope

- `Stepper.Previous`, `Stepper.Next`, inferred adjacency, or automatic lock
  skipping. Consumers use ordinary Buttons and update controlled `value`.
- Custom panel focus after value changes.
- Custom title/description IDs or ARIA relationship management.
- Dynamic insertion, removal, reordering, duplicate-value recovery, or silent
  domain normalization. The original plan included these without a demonstrated
  product use case; they are not v1 contracts.
- Horizontal overflow scrolling or active-step scroll management.
- RTL-specific connector calculations before the library-wide Base UI
  localization migration.
- Validation, completion, routing, persistence, analytics, or panel transitions.

Pagination remains a possible follow-up only after real consumers establish a
shared behavior contract; see [Stepper pagination](./stepper-pagination.md).

## Verification

Run each gate independently:

```sh
npx tsc -b --pretty false
npm run lint
npm run build
npm run build-storybook
npx playwright test tests/components/stepper.spec.ts --workers=1
```

The focused browser spec covers:

- Base UI tablist/tab/tabpanel semantics without custom naming IDs.
- Manual keyboard selection in horizontal and vertical orientations, including
  the responsive switch from vertical arrows to horizontal arrows below `md`.
- Consumer-controlled value changes and locked Steps.
- Horizontal and vertical marker/text placement.
- Responsive vertical-to-horizontal layout and Base UI orientation switching.
- Connector fill ending at the current marker center.
- An empty browser-console error list.

## Done criteria

- [x] The public namespace contains only the nine parts listed above.
- [x] Root forwards Base UI controlled and uncontrolled selection props directly.
- [x] No step registry, value-normalization state, synthetic event details,
  generated accessible IDs, or panel-focus state remains.
- [x] Number and icon marker children render unchanged and remain decorative.
- [x] Incomplete/current/locked/completed/invalid states are distinguishable.
- [x] Horizontal and vertical connector fill ends at the current marker center.
- [x] Gallery and Storybook consume the public API.
- [x] Every verification command passes independently.

After the PR merges, remove this completed plan and its index row. Git history is
the archive.
