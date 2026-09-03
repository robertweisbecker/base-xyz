# Plan 004: Add composable form and field structure primitives

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan in
> `docs/plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 1569440..HEAD -- docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md src/styles/README.md src/components/form src/components/fieldset src/components/field src/components/label src/components/index.ts src/components/text-field/text-field.tsx src/components/textarea/textarea.tsx src/components/number-field/number-field.tsx src/components/select/select.tsx src/components/combobox/combobox-field.tsx src/components/checkbox src/components/radio src/components/switch/switch.tsx src/components/input-group src/components/slider/slider.stories.tsx src/blocks/password-field/password-field.tsx src/blocks/prompt-composer/prompt-composer.tsx src/experimental/math-expression-field/math-expression-field.tsx src/experimental/inline-edit/inline-edit.stories.tsx src/app/experiments/inputs-composed-form.tsx src/foundations/style-props.verification.stories.tsx tests/components/form.spec.ts tests/components/checkbox.spec.ts tests/components/radio.spec.ts tests/style-props/browser.spec.ts docs/plans/004-form-field-primitives.md docs/plans/README.md`
> Before implementation edits, expect only the post-merge plan/index
> reconciliation after `1569440`. Compare any other change against the current
> state below; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Completed prerequisite**: [#22](https://github.com/robertweisbecker/base-xyz/issues/22) / [PR #36](https://github.com/robertweisbecker/base-xyz/pull/36), merged as `26fece7`
- **Category**: migration
- **Planned at**: commit `bf25e43`, 2026-08-27
- **Reconciled at**: commit `1569440`, 2026-09-03
- **Issue**: [#19](https://github.com/robertweisbecker/base-xyz/issues/19)
- **Status**: IN PROGRESS

## Why this matters

The repository already has one shared field style owner, but each text field,
choice group, block, and story directly assembles Base UI's `Field`, `Fieldset`,
or `Form` parts. That duplicates structural styling, makes accessibility
relationships easy to drift, and prevents consumers from composing the same
structure without importing Base UI or private style maps. Add thin public
`Form`, `Fieldset`, `Field`, and `Label` wrappers that preserve Base UI's
semantics and `render` prop while owning the repository's standard structure,
StyleX seams, and margin boundary. Then migrate existing field implementations
to prove the wrappers with native and current Base UI controls without changing
those higher-level components' public contracts.

## Current state

### Repository intent and ownership rules

- `CONTEXT.md:3-11` defines a **normal-flow component root** as one stable
  public HTML node, **internal layout** as component-owned padding/gap/flow, and
  the **field wrapper** as the public root around label, control, description,
  and error. It says common margins style that wrapper, never inner chrome.
- `docs/adr/0004-component-block-and-compound-ownership.md` requires reusable,
  product-agnostic structures under `src/components/`, favors compact/closed
  compound surfaces, and keeps Base UI semantics authoritative.
- `docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md:36-55`
  says stable normal-flow roots may expose `MarginProps`, compound parts do not
  inherit that surface, and field margins belong on the wrapper. Its table does
  not yet name `Form`, `Field.Root`, or `Fieldset.Root`.
- `src/styles/README.md:14-34` requires eligible roots to call
  `extractMarginProps` once, apply named margins immediately before `xstyle`,
  and merge native `style` after StyleX output.
- `src/components/index.ts` is the public component source of truth.

### Existing shared field styles

`src/components/field/field.stylex.ts` declares itself the canonical generic
field-style owner and supplies:

```text
Field.Root                 fieldStyles.root
Field.Label                fieldStyles.label
group labels               fieldStyles.groupLabel
item labels                fieldStyles.itemLabel
Field.Description          fieldStyles.description
Field.Error                fieldStyles.error
```

The root is already a column with `--space-1` gap and `minWidth: 0`. Keep that
module as the owner of generic Field recipes; do not copy those recipes into
each wrapper. Checkbox and Radio are an explicit boundary: their visual
recipes belong to separate component-owned StyleX modules, not to Field.
[#22](https://github.com/robertweisbecker/base-xyz/issues/22) and PR #36
established that boundary in separate `checkbox.stylex.ts` and
`radio.stylex.ts` modules. This plan migrates their semantic
Field/Fieldset/Label structure without reopening or relocating those visual
styles.

### Duplicated Base UI assembly

`src/components/text-field/text-field.tsx:41-80` resolves margins and directly
renders `FieldBase.Root`, `FieldBase.Label`, `InputBase`,
`FieldBase.Description`, and `FieldBase.Error`. `Textarea` and the experimental
math field repeat the same shape.

`src/components/number-field/number-field.tsx:73-99` demonstrates a
load-bearing no-extra-node composition:

```tsx
<Field.Root
	disabled={disabled}
	name={name}
	render={<BaseNumberField.Root id={id} disabled={disabled} {...rest} />}
>
	<BaseNumberField.ScrubArea>
		<Field.Label htmlFor={id}>...</Field.Label>
	</BaseNumberField.ScrubArea>
</Field.Root>
```

`CheckboxGroup` and `RadioGroup` compose three Base UI roots onto one fieldset
host:

```tsx
<Field.Root
	name={name}
	render={
		<Fieldset.Root
			disabled={isDisabled}
			render={<BaseCheckboxGroup disabled={isDisabled} {...rest} />}
		/>
	}
>
	<Fieldset.Legend>{label}</Fieldset.Legend>
</Field.Root>
```

Preserve that same-host composition. Repository and caller styles must merge
through Base UI's `render` contract, not through added wrapper elements.

`src/blocks/prompt-composer/prompt-composer.tsx` imports Base UI `Form`
directly. Its root deliberately overrides form spacing with
`gap: --space-0` and owns `maxWidth: 42rem`; the public Form must accept that
style as caller `xstyle` merged after its default form structure.

The direct-import inventory at the planned commit is:

```text
src/blocks/password-field/password-field.tsx
src/blocks/prompt-composer/prompt-composer.tsx
src/components/checkbox/checkbox.tsx
src/components/combobox/combobox-field.tsx
src/components/input-group/input-group.stories.tsx
src/components/input-group/input-group.tsx
src/components/number-field/number-field.tsx
src/components/radio/radio.tsx
src/components/select/select.tsx
src/components/slider/slider.stories.tsx
src/components/text-field/text-field.tsx
src/components/textarea/textarea.tsx
src/experimental/inline-edit/inline-edit.stories.tsx
src/experimental/math-expression-field/math-expression-field.tsx
```

After migration, direct imports from `@base-ui/react/field`,
`@base-ui/react/fieldset`, and `@base-ui/react/form` should exist only inside
the four new wrapper implementations.

PR #49, merged as `9751025`, stabilized provider values and callbacks in
PasswordField, PromptComposer, and Combobox. Their semantic migrations must
preserve those `useMemo`/`useCallback` boundaries and dependency sets; replacing
Base UI structure is not a reason to regress context identity.

`src/components/switch/switch.tsx:64-105` is the remaining hand-built field
shape: a `<div>`, native `<label>`, Base UI Switch, and description `<p>`.
Migrate it while preserving the single public root, label placement,
`nativeButton`, description ID, and current `SwitchProps`.

### Base UI contracts to preserve

The installed dependency is `@base-ui/react@1.7.0`:

- `node_modules/@base-ui/react/form/Form.d.ts:7-59` — native `<form>`, generic
  values, `errors`, `validationMode`, `onFormSubmit`, `actionsRef`, and render.
- `node_modules/@base-ui/react/field/root/FieldRoot.d.ts:5-10,59-108` — default
  `<div>`, field name/state/validation, and render composition.
- `node_modules/@base-ui/react/field/label/FieldLabel.d.ts:4-20` — automatic
  control association. A non-label render target requires
  `nativeLabel={false}`.
- `node_modules/@base-ui/react/fieldset/root/FieldsetRoot.d.ts:3-16` and
  `fieldset/legend/FieldsetLegend.d.ts:3-16` — default `<fieldset>` root and a
  Base UI-associated legend part.
- Official references:
  [Form](https://base-ui.com/react/components/form),
  [Field](https://base-ui.com/react/components/field),
  [Fieldset](https://base-ui.com/react/components/fieldset), and the
  [forms handbook](https://base-ui.com/react/handbook/forms).

Do not add `as` or a second polymorphism mechanism. Preserve Base UI's inherited
render element and callback forms.

### Existing implementation and test patterns

- Model prop types and merge order after
  `src/components/button/button.tsx:54-72` and
  `src/styles/README.md:66-88`: omit Base UI `className`/`style` plus
  `MarginProps`, intersect `BaseStyleProps`, resolve margins once, then use
  `stylex.props(base, ...marginStyles, xstyle)`, `attrJoin`, and `mergeStyle`.
- Keep Base UI's own render type; do not narrow it. Heading's
  `src/components/heading/heading.tsx:22-75` shows the repository's element and
  callback render convention.
- Storybook: `Playground` is first, story-only controls begin with `_`, fixed
  comparison stories disable controls, and titles are sentence case.
- Model browser console capture and role assertions after
  `tests/components/stepper.spec.ts` and
  `tests/style-props/browser.spec.ts:1-24`; also capture `pageerror`.
- `src/foundations/style-props.verification.stories.tsx:85-188` and
  `tests/style-props/browser.spec.ts:98-118` are the current margin and
  field-wrapper contract fixtures.

## Commands you will need

| Purpose          | Command                                                                                                       | Expected on success                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Inspect base     | `git status --short --branch && git rev-parse --short HEAD`                                                   | starts from `main`; no unrelated implementation changes |
| Import inventory | `rg -n -e 'from "@base-ui/react/field' -e 'from "@base-ui/react/fieldset' -e 'from "@base-ui/react/form' src` | after migration: only four wrapper files                |
| Typecheck        | `npm run typecheck`                                                                                           | exit 0, no errors                                       |
| Standard gate    | `npm run verify:quick`                                                                                        | typecheck, lint, and formatting pass                    |
| Build stories    | `npm run build-storybook`                                                                                     | exit 0                                                  |
| Focused browser  | `npx playwright test tests/components/form.spec.ts tests/style-props/browser.spec.ts`                         | all pass; no console/page errors                        |
| Full gate        | `npm run verify:full`                                                                                         | app, Storybook, browser, and bundle gates pass          |

If another checkout owns the default Storybook port, leave it running and use
an unused port, for example:

```sh
PLAYWRIGHT_STORYBOOK_PORT=6116 npx playwright test tests/components/form.spec.ts
```

## Suggested executor toolkit

- Before StyleX edits, read `.agents/resources/stylex-authoring.md`,
  ADRs 0003, 0004, and 0011, plus `src/styles/README.md`.
- Use the official Base UI references above when render or validation is
  unclear. The installed 1.7 declarations win if live docs describe a newer
  version.
- If available, use `vercel:react-best-practices` after the TSX migration as a
  review pass. It must not broaden the API or override repository ADRs.

## Scope

**In scope** (the only files you should modify):

- `docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md`
- `src/styles/README.md`
- `src/components/form/form.tsx` (create)
- `src/components/form/form.stylex.ts` (create)
- `src/components/form/form.stories.tsx` (create)
- `src/components/form/index.ts` (create)
- `src/components/fieldset/fieldset.tsx` (create)
- `src/components/fieldset/fieldset.stylex.ts` (create)
- `src/components/fieldset/fieldset.stories.tsx` (create)
- `src/components/fieldset/index.ts` (create)
- `src/components/field/field.tsx` (create)
- `src/components/field/field.stories.tsx` (create)
- `src/components/field/field.stylex.ts`
- `src/components/field/index.ts`
- `src/components/label/label.tsx` (create)
- `src/components/label/label.stories.tsx` (create)
- `src/components/label/index.ts` (create)
- `src/components/index.ts`
- `src/components/text-field/text-field.tsx`
- `src/components/textarea/textarea.tsx`
- `src/components/number-field/number-field.tsx`
- `src/components/select/select.tsx`
- `src/components/combobox/combobox-field.tsx`
- `src/components/checkbox/checkbox.tsx`
- `src/components/radio/radio.tsx`
- `src/components/switch/switch.tsx`
- `src/components/input-group/input-group.tsx`
- `src/components/input-group/input-group.stories.tsx`
- `src/components/slider/slider.stories.tsx`
- `src/blocks/password-field/password-field.tsx`
- `src/blocks/prompt-composer/prompt-composer.tsx`
- `src/experimental/math-expression-field/math-expression-field.tsx`
- `src/experimental/inline-edit/inline-edit.stories.tsx`
- `src/app/experiments/inputs-composed-form.tsx`
- `src/foundations/style-props.verification.stories.tsx`
- `tests/components/form.spec.ts` (create)
- `tests/style-props/browser.spec.ts`
- `docs/plans/README.md`

**Out of scope**:

- React Hook Form, TanStack Form, schema libraries, or a new form-state
  provider. Base UI remains the behavioral owner.
- Public prop or behavior changes to current fields, controls, or blocks.
- Replacing `Select.Label` with the new Label; Base Select owns trigger-label
  behavior and avoids native-label button hover/click coupling.
- Generic input chrome on `Field.Control`; each control retains its style owner.
- `Field.Validity` or an exhaustive Base UI mirror without a current consumer.
- `as`, `asChild`, slot cloning, a second render API, or added DOM wrappers.
- Four isolated Gallery specimens or Gallery/routing redesign.
- Token removal, control-chrome redesign, commits, pushes, or PR creation.
- Changes to `src/components/checkbox/checkbox.stylex.ts` or
  `src/components/radio/radio.stylex.ts`; these are completed visual owners and
  prerequisite evidence, not migration targets.

## Git workflow

- Baseline evidence was refreshed against `main` at `1569440`. Start the
  implementation branch from current `main`, including this reconciliation.
- If the operator wants an implementation branch, create
  `codex/form-field-primitives` from current main; otherwise remain in the
  checkout they designate.
- Prefer one implementation commit after all gates pass:
  `[codex] Add form field structure primitives`.
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Record the public ownership boundary

Update ADR 0011 and `src/styles/README.md` before code:

1. Classify `Form`, `Field.Root`, and `Fieldset.Root` as stable normal-flow
   roots with common margins.
2. State that `Field.Root` remains the sole margin owner when render-composed
   onto Fieldset, NumberField, or another host; margins are never resolved by
   both layers.
3. Keep `Field.Control`, `Field.Item`, `Field.Description`, `Field.Error`,
   `Fieldset.Legend`, and `Label` outside common margins.
4. Record Base UI `render` as the one polymorphic seam and require one host node.
5. Document ownership: Form owns whole-form column flow/gap; Field.Root owns
   label/control/description/error flow; Fieldset owns only native reset and
   legend association; Label owns field/item typography.

This extends ADR 0011; do not add a new ADR.

**Verify**:
`npx prettier --check docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md src/styles/README.md`
→ exit 0.

### Step 2: Add the public Form wrapper

Create `form.stylex.ts` with `formStyles.root`:

```ts
root: {
	display: "flex",
	flexDirection: "column",
	gap: tokens["--space-6"],
	minWidth: 0,
}
```

Create generic `FormProps<FormValues>` over `BaseForm.Props<FormValues>`. Omit
Base UI `className`/`style` and `keyof MarginProps`, then add `MarginProps`,
`BaseStyleProps`, and `className?: string`. Resolve margins once and apply:

```tsx
const { marginStyles, rest } = extractMarginProps(props);
const sx = stylex.props(formStyles.root, ...marginStyles, xstyle);

return (
	<BaseForm<FormValues>
		className={attrJoin(sx.className, className)}
		style={mergeStyle(sx.style, style)}
		{...rest}
	/>
);
```

Preserve inference for `onFormSubmit` values plus `errors`, `validationMode`,
`actionsRef`, ref/native props, and both render forms. Adjust the generic
constraint only for exact Base UI compatibility; never erase it with `any`.
Create the local barrel and public exports.

**Verify**: `npm run typecheck` → exit 0. Use and then remove a temporary
type-only probe to prove a named values shape reaches `onFormSubmit`.

### Step 3: Add Fieldset, Field, and Label

Create `fieldset.stylex.ts`. Root resets `borderWidth: 0`, `margin: 0`,
`padding: 0`, and `minInlineSize: 0`. Legend resets padding and composes
`fieldStyles.groupLabel`. Do not add a default gap: render-composed Field and
consumer use-case styles own it.

Expose only:

```text
Fieldset.Root       MarginProps + BaseStyleProps
Fieldset.Legend     BaseStyleProps only
```

Both parts inherit their Base UI props, refs, state callback props, and render.

Create a closed Field compound:

```text
Field.Root
Field.Control
Field.Item
Field.Description
Field.Error
```

- Root adds margins/BaseStyleProps and applies `fieldStyles.root`.
- Description/Error apply the matching field recipes.
- Control/Item get no generic chrome or layout.
- Parts add BaseStyleProps but no MarginProps and preserve Base UI render.
- Do not include `Field.Label` or `Field.Validity`.

Create top-level Label over `BaseField.Label` with:

```ts
export type LabelVariant = "field" | "item";
```

Default to field. Apply `fieldStyles.label` or `fieldStyles.itemLabel`. Ensure
both variants include `labelMarker`; update the item recipe if needed. Preserve
`nativeLabel` and render, document `nativeLabel={false}` for non-label targets,
and do not add margins. Add local and public barrels/types for all components.

Every wrapper uses component base → named margins on eligible roots → `xstyle`,
then native `style`; `className` is joined as interop.

**Verify**: `npm run typecheck && npm run lint` → exit 0 with no lost render
state, ref, or native prop types.

### Step 4: Prove the low-level APIs in Storybook

Create core stories:

- `form.stories.tsx`, title `Components/Form`: Playground first; native/typed
  submit, validation mode, and story-only `_externalError` mapped to `errors`.
  A fixed Render prop story covers element and callback forms.
- `fieldset.stories.tsx`, title `Components/Fieldset`: Playground first with
  related controls, Legend, and disabled. Render prop proves one accessible
  fieldset host.
- `field.stories.tsx`, title `Components/Field`: Playground first with Root,
  Label, `Field.Control render={<input />}`, Description, Error, name, required,
  disabled, and invalid. Add consolidated States and fixed Render prop stories.
- `label.stories.tsx`, title `Components/Label`: Playground inside a real Field;
  Variants in real field/item contexts; fixed Render prop with a non-label
  target explicitly setting `nativeLabel={false}`.

Prefix story-only args with `_`. Do not expose render/style escape hatches as
controls. Fixed comparisons disable controls. Use realistic content and no
decorative wells/cards.

**Verify**: `npm run build-storybook` → exit 0; all four stories index.

### Step 5: Migrate existing components without changing contracts

Replace direct imports with the new wrappers. Remove duplicated standard
root/label/description/error style application, but preserve local structural
styles as caller `xstyle` so they merge last.

- TextField/Textarea: public Field/Label/Description/Error; preserve IDs,
  `aria-describedby`, validation, InfoTip, input styles, and public props.
- NumberField: retain
  `Field.Root render={<BaseNumberField.Root ... />}` and one host; use Label.
- Select: migrate surrounding Field parts only; keep Base Select's label.
- Combobox: migrate Field/Label without changing input/trigger/chips/popup.
- Checkbox/Radio: retain same-host Field → Fieldset → Group composition. Move
  only shared semantic/reset ownership to the public Fieldset and Label
  wrappers. Preserve the choice-specific label, description, group layout,
  control, indicator, size, and state styles already established in separate
  Checkbox- and Radio-owned StyleX modules by
  [#22](https://github.com/robertweisbecker/base-xyz/issues/22). Neither
  component may regain a private Field style-map dependency for visual
  treatment during migration.
- Switch: use Field.Root, item Label, and Description while preserving one root,
  justify-between label layout, visually hidden label, required marker,
  description ID, nativeButton, and keyboard/pointer behavior.
- InputGroup: replace only its private Base Field import; preserve textarea
  registration and auto-resize.
- PasswordField: remove duplicated Base Field structure/styles; preserve its
  compound API and DOM.
- PromptComposer: use public Form and pass `parts.root` through `xstyle`;
  preserve submit behavior, zero gap, max width, and caller override order.
- MathExpressionField: migrate structure only.
- InputGroup and Slider stories: use public Field/Label, not Base UI/private
  field recipes.
- InlineEdit's `FieldInlineEditDemo` story: replace its direct Base UI Field
  and private field-style imports with public Field, Label, Description, and
  Error parts while preserving the demo behavior and content.
- PasswordField, PromptComposer, and Combobox: preserve the provider-value and
  callback stabilization landed in PR #49; structure migration must not
  recreate inline context objects or stale callback dependencies.

Keep current explicit ID and described-by wiring. After migration:

```sh
rg -n -e 'from "@base-ui/react/field' -e 'from "@base-ui/react/fieldset' -e 'from "@base-ui/react/form' src
```

Expected matches only:

```text
src/components/form/form.tsx
src/components/fieldset/fieldset.tsx
src/components/field/field.tsx
src/components/label/label.tsx
```

**Verify**: `npm run verify:quick` → exit 0.

### Step 6: Exercise the public API in the composed-form experiment

Update `src/app/experiments/inputs-composed-form.tsx` through public
`@/components` exports:

- Replace native form plus layout-only Stack with Form if `--space-6` matches.
- Add one semantically meaningful Fieldset/Legend around genuinely related
  controls. Do not nest the existing Radio/Checkbox group fieldsets
  incorrectly.
- Use low-level Field/Label only for a custom/native control not already covered
  by a high-level component; do not decompose high-level fields for coverage.
- Preserve submission and existing content.

Do not add four Gallery cells. If the experiment is no longer reachable without
routing changes, STOP.

**Verify**: `npm run build` → exit 0 with public exports only.

### Step 7: Add durable browser contracts

Create `tests/components/form.spec.ts` against stable story IDs. Capture both
console errors and page errors. Assert:

1. one native form, typed values, required blocking, successful submission;
2. external errors keyed by Field name, association, and first-invalid focus;
3. accessible Label plus Description/Error relationships;
4. Legend accessible name and disabled fieldset propagation;
5. element/callback render forms preserve host, props, ref/state, no wrapper;
6. non-label Label render with `nativeLabel={false}` has no native click claim;
7. NumberField and Checkbox/Radio same-host compositions remain keyboard usable.

Add Form, standalone Field.Root, and standalone Fieldset.Root margin fixtures to
`style-props.verification.stories.tsx`. Extend
`tests/style-props/browser.spec.ts` to prove margins land on roots, custom props
do not leak, `xstyle` beats named margins, and native `style` remains last.
Retain the fractional `2.5` and `-2.5` spacing expectations added by PR #51;
do not narrow the shared margin domain while extending these fixtures.
Avoid screenshots, generated classes, and incidental paint/geometry.

**Verify**:

```sh
npm run build-storybook && npx playwright test tests/components/form.spec.ts tests/style-props/browser.spec.ts
```

→ all pass with no console/page errors.

### Step 8: Run all gates and live interaction QA

Run:

```sh
npm run verify:quick
npm run verify:full
```

Both must exit 0. Then run `npm run storybook` and inspect:

| Surface           | Mouse                   | Keyboard/focus       | Contract                                  |
| ----------------- | ----------------------- | -------------------- | ----------------------------------------- |
| Field             | click label/control     | Tab, type, blur      | name, description/error, required/invalid |
| Fieldset          | click controls          | Tab/Space/arrows     | legend name, disabled propagation         |
| Form              | blank then valid submit | Tab/Enter            | timing, first-invalid focus, values       |
| Render examples   | click host/control      | Tab through          | one host, forwarded props/ref/state       |
| Migrated controls | exercise each           | native keyboard path | unchanged behavior/DOM                    |

Use Storybook accessibility on all four Playgrounds. Require no new
serious/critical violation, console error, or nested form/fieldset mistake.
Rerun focused Playwright tests after live inspection.

### Step 9: Reconcile docs and plan status

Confirm public exports, stories, ADR/style docs, and import allowlist match the
implementation. Mark this plan DONE in `docs/plans/README.md` only after all
gates and manual checks pass.

**Verify**:

```sh
git diff --check
git status --short
rg -n -e 'from "@base-ui/react/field' -e 'from "@base-ui/react/fieldset' -e 'from "@base-ui/react/form' src
```

→ no whitespace errors, only in-scope files changed, exactly four wrapper
imports.

## Test plan

- New: `tests/components/form.spec.ts`.
- Pattern: `tests/components/stepper.spec.ts` for story navigation/error capture.
- Margin pattern: `tests/style-props/browser.spec.ts` plus its verification
  story.
- Cases: native/typed submit; required/external validation and focus;
  label-description-error relationships; legend/disabled; all render forms;
  one-host composition; NumberField and Checkbox/Radio integration; non-label
  Label behavior; margin filtering/precedence; zero console/page errors.
- Focused:
  `npm run build-storybook && npx playwright test tests/components/form.spec.ts tests/style-props/browser.spec.ts`.
- Full: `npm run verify:full`.

## Done criteria

- [ ] Form, Fieldset, Field, Label and named prop types are public exports.
- [ ] All preserve Base UI element/callback render, refs, native/state props,
      and one host node.
- [ ] Form preserves generic values, external errors, validation, and actions.
- [ ] Form, Field.Root, and Fieldset.Root expose margins; parts do not; no prop
      leakage.
- [ ] Base → margins → xstyle → native style precedence is tested.
- [ ] Generic Field recipes remain Field-owned; Checkbox and Radio own their
      separate visual recipes; controls retain their chrome.
- [ ] Fieldset owns reset without a competing generic gap.
- [ ] Existing high-level component/block APIs and behavior are unchanged.
- [ ] Select.Label remains Base Select-owned.
- [ ] Direct Base UI import search returns only four wrapper files.
- [ ] `npm run verify:quick` and focused browser tests pass.
- [ ] `npm run verify:full` passes.
- [ ] Live Storybook mouse, keyboard/focus, validation, relationships, render,
      and migrated-control checks pass.
- [ ] Only in-scope files are modified; plan index is updated.

## STOP conditions

Stop and report; do not improvise if:

- In-scope drift invalidates a current-state excerpt or ownership assumption.
- The branch does not contain completed PR #36 (`26fece7`), or Checkbox/Radio
  no longer own their visual treatment in separate component StyleX modules.
- The migration regresses the provider-value/callback stabilization from PR #49
  in PasswordField, PromptComposer, or Combobox.
- Installed Base UI is no longer 1.7.x or the cited contracts materially differ.
- Render typing requires `any`, cloning, `as`/`asChild`, or lost state/ref types.
- Field/Fieldset/NumberField composition creates multiple hosts or
  nondeterministic style ownership.
- Select migration requires replacing BaseSelect.Label or changes trigger
  label hover/click behavior.
- Switch loses its name, description, label click, native-button behavior, or
  single root.
- A high-level component needs a public prop change.
- The composed-form experiment requires routing work.
- A verification fails twice after one reasonable in-scope correction.
- Completion requires an out-of-scope file.

## Maintenance notes

- Keep compounds closed; add `Field.Validity` only for a real consumer.
- Do not reopen the Checkbox/Radio state refactor in this migration. It is a
  completed prerequisite tracked by
  [#22](https://github.com/robertweisbecker/base-xyz/issues/22) and PR #36; this
  plan only composes that visual ownership with the new public semantic
  primitives.
- Label is Field-context structure, not a generic typography label. Use Legend
  for groups and Base Select's label for select triggers.
- Base UI-compatible controls register directly; use
  `Field.Control render={...}` for native/custom controls needing registration.
- Never move control chrome into Field.Control.
- Use Form `xstyle` for one-off density; add a variant only after repeated use.
- Review generic inference, render callback types, host count, accessibility
  relationships, disabled behavior, and StyleX precedence closely.
