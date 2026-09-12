# Plan 004: Make form fields composable and preserve Base UI form behavior

> **Executor instructions**: Implementation is authorized after input styling
> issue #54 and related fixes #60/#65 are resolved in the execution baseline.
> Start from merged dependency PR #57 (`c42ce205`, Base UI 1.8).
> Sequence with tooling #59 and overlapping CopyButton #58 work. Then follow
> the steps and their verification gates. Stop
> on the conditions below rather than inventing public APIs or form state.
>
> **Drift check (run first)**:
> `git diff --stat c6d9b8f..HEAD -- src/components src/app src/blocks src/foundations tests CONTEXT.md docs/adr/0011-layout-primitives-common-margins-and-stylex-overrides.md src/styles/README.md docs/plans/004-form-field-primitives.md docs/plans/005-autocomplete-component.md docs/plans/README.md`
> Also inspect local changes. Reconcile changed contracts before execution;
> documentation-only reconciliation is expected. The broad consumer scan does
> not expand Scope below. Preserve concurrent work.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH — control extraction and form registration cross existing APIs
- **Category**: direction / component API
- **Planned at**: commit `bf25e43`, 2026-08-27
- **Strategy reassessed at**: commit `c6d9b8f`, 2026-09-11
- **Issue**: [#19](https://github.com/robertweisbecker/base-xyz/issues/19)
- **Completed prerequisite**: #22 / PR #36 (`26fece7`), independent Checkbox/Radio visual ownership
- **Status**: IN PROGRESS — prerequisites reviewed and verified; combined baseline and API migration
- **Execution baseline**: reviewed input PR #74 plus #70 → #66 → #73 → CopyButton #75;
  combined in `codex/composable-form-fields` before the baseline gate.
- **Execution gate**: the maintainer conditionally resumed work on 2026-09-11.
  Include reviewed and verified #54/#60/#65 fixes in the execution baseline;
  use completed #59 type coverage and serialize overlapping #58/public barrel
  changes. A reviewed dependency stack is allowed; another resumption request
  is unnecessary once these conditions hold.

## Intended outcome and strategy

Consumers need to arrange labels, descriptions, controls, actions, and validation
messages inside a field using ordinary layout primitives. They also need the
underlying Base UI form capabilities without rebuilding field registration,
validation, or accessible relationships. Wrapping Base UI and replacing every
internal import would not establish that outcome while existing controls still
require their own label/wrapper.

Deliver three ordered slices in this plan:

1. Public Form, Fieldset, Field, and Label primitives with Base UI's useful form
   surface intact, including Field.Validity.
2. Make existing input exports render their controls without an implicit
   Field or label wrapper. Keep actual widget state owners, such as Select.Root
   and Combobox.Root, while removing their automatic Field ownership.
3. Migrate affected repository usages to explicit field composition and prove
   standalone controls, custom layouts, and Base UI form behavior. Updating
   existing call sites is authorized; preserving the wrapped shorthand API is
   not a goal.

Do not measure completion by removing every Base UI import. The useful evidence
is a working bare control, composed field, and real form submission/validation.
This is an intentional API migration, not an additive compatibility layer.

## Current state and constraints

- `src/components/text-field/text-field.tsx:13–89` requires `label`, owns a
  private Field.Root/Label, and renders Base Input with shared field chrome.
  Its public style/margin props target the wrapper. There is no bare public
  Input export. Wrapping TextField in another Field creates nested field owners.
- `src/components/textarea/textarea.tsx:13–139` likewise owns its label/root but
  renders a native textarea directly. Moving that node into a registered control
  is necessary for Base UI value/validation participation; changing the outer
  wrapper import alone does not register it. Preserve auto-resize and native
  textarea props.
- `src/components/checkbox/checkbox.tsx` and `radio/radio.tsx` own choice-control
  styles in separate modules established by #22. Their convenience components
  assemble Field.Item/Label and descriptions; group components provide sizing
  and disabled/read-only context. Keep those owners and inheritance rules.
- Checkbox hover/active recipes depend on a private label marker in
  `checkbox.stylex.ts`. Switch track styles consume variables defined on its
  private label root (`switch.tsx:115–192`). Extracted controls must acquire their
  own effective styles; copying only the visible control JSX is insufficient.
- `src/components/input-group/input-group.tsx` already has public Input and
  Textarea parts. Input uses Base Input; Textarea uses Base Field.Control with a
  textarea render target. It is a composition precedent, not permission to wrap
  another Base UI control in Field.Control or duplicate control registration.
- `src/components/field/field.stylex.ts` owns common label, description, error,
  and field-root recipes plus text-control recipes. Root has a small vertical
  default. Keep control chrome in its current owners, never on Field.Control.
- `src/components/layout/layout.tsx` provides Box, Stack, and Grid. They own broad
  layout props; Field does not need `columns`, `orientation`, label-width props,
  Field.Row/Content parts, child inspection, or a layout context.
- `src/app/experiments/inputs-composed-form.tsx` is a real existing composition:
  environment name, region, visibility, description, rollback, defaults, and
  actions. It currently nests whole fields in a Grid and merely prevents native
  submit. Use it to demonstrate a layout _within_ selected fields as well.
- Current compound namespaces are plain objects; convenience controls are
  functions. Keep plain input exports as functions. Do not add callable
  `.Control` namespaces, `label={false}`, a `withField` switch, or implicit
  context detection to preserve the old wrapper mode.
- #54's maintainer decisions preserve one-row Textarea and small Select sizing,
  NumberField's segmented invalid chrome and error icon, and Slider's tap-target
  sizing. Checkbox read-only border treatment aligns with Radio. Carry the
  reviewed style fixes forward; migration must not reopen these choices.

### Base UI behavior to retain

Verified against installed `@base-ui/react@1.8.0` from merged PR #57. These
declarations and behaviors are the implementation baseline; reconcile later
dependency changes before coding:

- `node_modules/@base-ui/react/form/Form.d.ts` and `Form.js`: generic typed values,
  native onSubmit/action props, onFormSubmit, external errors, validationMode,
  actionsRef.validate, and first-invalid focus.
- `field/root/FieldRoot.d.ts`: name, disabled, validate, validationMode,
  validationDebounceTime, invalid/dirty/touched, and actionsRef.validate.
  Inherit validator types, including `void` and `Promise<void>`; returning
  nothing, `null`, `""`, or `[]` means no custom error.
- `field/control/FieldControl.d.ts` and `input/Input.d.ts`: native input semantics,
  controlled/uncontrolled values, event details, registration, and render/ref
  forwarding. Base UI inputs/choices already register; do not double-wrap them.
- `field/error/FieldError.d.ts`: default native/external error output and match
  for specific validity conditions or caller-controlled display.
- `field/validity/FieldValidity.d.ts`: render-only access to validity, errors,
  current/initial value, and transition state. It adds no host or styling surface.
- Field.Label preserves nativeLabel and element/callback render forms. A non-label
  target requires nativeLabel={false}. Field.Item scopes per-option labels and
  descriptions; Fieldset names a related group, not one combined arbitrary value.

Two limits must be documented rather than silently “fixed” in wrappers:

- Base UI 1.8 asynchronous validate functions do not block onSubmit while awaiting
  a promise. Pending submission, server requests, and async orchestration remain
  consumer-owned; do not add a competing submission state machine.
- Form's generic value shape is supplied by the caller. It is not inferred from
  arbitrary JSX field names and is not a runtime schema. Registered Field values
  feed onFormSubmit; native FormData has its own native-control semantics. Do not
  promise arbitrary unregistered controls appear in the typed callback payload.

The [forms handbook](https://base-ui.com/react/handbook/forms),
[Field](https://base-ui.com/react/components/field),
[Form](https://base-ui.com/react/components/form), and
[Fieldset](https://base-ui.com/react/components/fieldset) are behavior references.
Live docs may describe a newer release. Verify the installed declarations if
dependencies change after the reviewed 1.8 baseline; do not downgrade packages.

## Public composition contract

### Form and field structure

```text
Form
Fieldset.Root / Fieldset.Legend
Field.Root / Field.Control / Field.Item / Field.Description / Field.Error / Field.Validity
Label
```

- Form is the native form/validation owner. Keep its default layout neutral
  (only minWidth: 0 if necessary); consumers choose Stack/Grid inside it or
  explicit xstyle. Do not hardcode a whole-form `--space-6` gap.
- Field.Root is one field-value/association owner with the existing small
  vertical default and arbitrary children. Consumers can nest Grid/Stack/Box or
  override the root through xstyle. No direct-child ordering requirement.
- Field.Control is the unstyled Base UI bridge for native/custom controls that
  are not already registered. It is not the library's styled text input.
- Label keeps the planned top-level name and `variant="field" | "item"`;
  preserve Base Field.Label semantics. Do not add a duplicate Field.Label alias
  merely to mirror upstream naming. Use Fieldset.Legend for groups and preserve
  Select/Slider-specific labeling where those primitives own it. Label and
  Field.Item/Description/Error require an explicit Field.Root; Fieldset and
  widget roots do not replace that context. Standalone controls use aria-label,
  aria-labelledby, or a native label/htmlFor relationship, with no Label fallback
  that detects ancestry.
- Field.Description and Field.Error preserve association and default/matched
  messages. Include Field.Validity as a direct typed Base UI alias for custom
  validation presentation; it does not need a wrapper, style props, or margins.
- Preserve all relevant Base UI form/field props and export useful public types:
  FormProps, FormActions, FormValidationMode, FormSubmitEventDetails,
  FieldRootProps, FieldRootActions, FieldValidityProps/State, and part prop types.
  Do not add schema, resolver, registration, or submission abstractions.

### Bare controls are the primary API

| Current public export       | Planned boundary                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| TextField                   | Styled Base Input; no label, description, error, or Field.Root                                             |
| Textarea                    | Styled registered native textarea; no label or Field.Root; retain resizing                                 |
| Checkbox / Radio / Switch   | Actual Base UI control with its internal indicator/thumb; no Field.Root, Field.Item, or label              |
| CheckboxGroup / RadioGroup  | Actual group state/host and size inheritance; no implicit Field/Fieldset, legend, or fixed options wrapper |
| Select.Root / Combobox.Root | Base UI widget controller plus necessary presentation context; no implicit Field host                      |
| NumberField                 | Root/Control/ScrubArea compound described below; no implicit Field or label                                |
| InputGroup                  | Existing chrome and control composition; no Field wrapper added                                            |

Keep TextField's existing name during this change; a rename to Input is a
separate vocabulary decision. Remove label/description/error/info/
visuallyHideLabel convenience props from the affected controls and migrate
callers explicitly. Field.Root owns invalid/dirty/touched/validate, Label owns
label content, and Field.Error owns messages. Preserve native `aria-invalid`
for standalone controls and real Base UI control props. Do not remove a genuine
upstream control prop merely because a wrapper previously reused its name.

Standalone controls work without Form or Field.Root: give them an explicit
accessible name, retain native events/values, and preserve native form behavior.
Base UI components already integrate with Field when it is present. Textarea
uses the public Field.Control bridge, whose default context allows standalone
operation; verify both paths rather than adding an ancestry-dependent mode.
A Radio still requires its actual RadioGroup. Select/Combobox/NumberField still
require their widget state owner. Those owners are not Field wrappers.

Keep Checkbox/Radio indicators and Switch thumbs private. Their control styles
must not depend on a private label ancestor. Move default/hover/active rules into
the respective style owner as necessary; callers must not import markers or add
styling-only label parts. Label activation remains native/Base UI-owned.

### Widget controllers and groups

- Select.Root and Combobox.Root remain the established compound entry points,
  including generic values, controlled state, keyboard/popups, and size context.
  Remove their implicit Field.Root. They become node-less, so remove wrapper
  margins/className/style/xstyle and field-only invalid from their Root types.
  Move those usages to explicit Field.Root or a caller-owned layout. Retain
  native styles on the actual Trigger/InputGroup/Popup parts as appropriate.
- Select.Label retains Base Select's labeling semantics. Combobox.Label retains
  its existing external-input labeling role through public Label; document that
  this composition uses an explicit Field. A standalone Combobox input uses an
  explicit accessible name. Do not change input-inside-popup labeling policy or
  invent a shared Select/Combobox controller.
- CheckboxGroup/RadioGroup keep Base UI group behavior and the small size/state
  context actually needed by their options. Remove label/description props and
  fixed label/options containers. Fieldset.Root/Legend and Field.Item now appear
  at the call site. The `inline` layout convenience moves to consumer Stack/Grid.
  Move CheckboxGroup's synthetic name to Field.Root.name. Its upstream group
  supports disabled, not readOnly; readOnly belongs to individual checkboxes.
  RadioGroup retains upstream name/readOnly. Keep values, keyboard behavior,
  and aggregate validation intact.
- NumberField becomes a closed plain-object compound: Root, Control, ScrubArea.
  Root wraps the actual Base NumberField.Root and carries value/range/step,
  disabled/readOnly/required, name, and size. Root's ref targets its div; upstream
  Root.id identifies the visible input and Root.inputRef targets the hidden input.
  Control derives Base NumberField.Input props and adds inputWidth and accessible
  increment/decrement labels. Its native props, aria-label, ref, render,
  className/style/xstyle all target the visible input. It composes the existing
  Group/stepper chrome privately; do not send input props to the Group or add
  competing value state. ScrubArea preserves
  the existing Base scrub behavior and private cursor around caller content.
  Consumers can place Label inside ScrubArea when an explicit Field.Root owns
  association, or name a standalone Control directly. Root permits consumer
  layout and adds no implicit Field or duplicated NumberField state. Export distinct
  RootProps/ControlProps/ScrubAreaProps; migrate the old callable NumberField and
  NumberFieldProps usages. Do not mirror every Base NumberField part.

Form, Field.Root, and Fieldset.Root expose common margins, resolved once at their
normal-flow owner. Standalone primary controls with a stable public host retain
MarginProps, now targeting that control consistently; never switch the recipient
based on surrounding Field context. Migrate existing wrapper-directed margins
and styles to explicit Field.Root. Node-less controllers and internal parts do
not gain margins. NumberField.Root owns margins on its real widget host;
NumberField.Control/ScrubArea do not. Update ADR 0011's old field-wrapper-only
examples and the existing type tests to reflect the new ownership explicitly.

Preserve Base UI render forms and refs, xstyle, native style, and className interop
at real hosts. Use component styles → named margins → xstyle → native style.
Field.Control remains the unstyled bridge, not a second styled input API.
Do not promise arbitrary same-host Grid/Field render composition resolves atomic
class collisions; nested layouts and Field.Root xstyle are the paths to prove.

### Supported layout example

This is the proposed public API, not an existing component example:

```tsx
<Form>
	<Field.Root name="environmentName">
		<Grid columns="minmax(0, 1fr) minmax(0, 2fr)" gap={4}>
			<Stack gap={1}>
				<Label>Environment name</Label>
				<Field.Description>Used in deployment URLs.</Field.Description>
			</Stack>
			<Stack gap={2}>
				<TextField required minLength={3} />
				<Field.Error />
			</Stack>
		</Grid>
	</Field.Root>
</Form>
```

Use a declared responsive xstyle in real examples to stack the Grid at narrow
widths. Layout wrappers must not break label activation, descriptions, error
association, DOM/focus order, registration, or submitted values. Add a separate
settings-row example with Label/Description on one side and Switch on
the other, plus a grouped option example using Field.Item.

One Field.Root owns one logical field. Multiple independent text values use
separate Fields inside a Fieldset. A checkbox/radio option uses Field.Item under
its group's single explicit Field.Root; Fieldset alone does not supply this
context. For example, `channelsLegendId` below comes from the consumer's useId:

```tsx
<Fieldset.Root>
	<Fieldset.Legend id={channelsLegendId}>Notifications</Fieldset.Legend>
	<Field.Root name="channels">
		<CheckboxGroup aria-labelledby={channelsLegendId}>
			<Stack gap={2}>
				<Field.Item>
					<Label variant="item">
						<Checkbox value="email" /> Email
					</Label>
				</Field.Item>
				<Field.Item>
					<Label variant="item">
						<Checkbox value="sms" /> SMS
					</Label>
				</Field.Item>
			</Stack>
		</CheckboxGroup>
		<Field.Error />
	</Field.Root>
</Fieldset.Root>
```

The separate CheckboxGroup host needs explicit aria-labelledby for the legend;
unlike RadioGroup, Base UI 1.8 does not inherit its Fieldset legend automatically.
Do not represent every option as a competing group Field.Root.

A standalone input needs no Field at all:

```tsx
<TextField aria-label="Search environments" type="search" />
```

NumberField still needs its actual widget root, without a Field wrapper:

```tsx
<NumberField.Root defaultValue={3} min={1}>
	<NumberField.Control aria-label="Replicas" />
</NumberField.Root>
```

Do not wrap table-selection checkboxes, toolbar switches, or similarly complete
standalone controls in Field just to satisfy a component requirement. Use
explicit accessible names. For a labeled/validated field use one Field.Root;
for a related form group add Fieldset/Legend around its one Field.Root and use
per-option Field.Item as needed. Independently named bare groups need no Field
unless using its parts or aggregate registration/validation.

## Scope

**In scope:**

- Form, Fieldset, Field, and Label implementations, local barrels, core stories,
  and genuinely necessary component-owned styles in their matching directories.
- Implementations, public types/barrels, styles, and stories for TextField,
  Textarea, Checkbox/CheckboxGroup, Radio/RadioGroup, Switch, NumberField, Select,
  Combobox, and InputGroup. Preserve canonical style ownership.
- src/components/index.ts and source/MDX consumers of these APIs, solely to
  migrate the changed compositions, accessible names, and style recipients.
  Inventory these before editing with the commands below; aliased imports and
  public prop types must also be checked. Do not rewrite unrelated content.
- Known consumers include gallery and inputs experiments, popup/Dialog/Drawer
  stories, Table's selection-checkbox adapter, PromptComposer's goal toolbar,
  and block stories. Blocks may adopt the resulting component layouts.
- src/app/experiments/inputs-composed-form.tsx and inputs-page.styles.ts for the
  explicit composition example and consumer-owned submission output.
- src/foundations/style-props.verification.stories.tsx,
  style-props.type-test.ts, and tests/style-props/browser.spec.ts for changed
  host/margin/type contracts.
- tests/components/form.spec.ts (new); existing affected component/block/app
  tests only where their public composition/host changes require updates.
- ADR 0011, CONTEXT.md, and src/styles/README.md for field/control/layout ownership.
- This plan, the index, and Plan 005's now-node-less Autocomplete Root strategy.

Run this bounded consumer inventory and inspect matches before implementation:

```sh
rg -l '<(TextField|Textarea|Checkbox|CheckboxGroup|Radio|RadioGroup|Switch|NumberField|Select\.Root|Combobox\.Root)\b' src tests --glob '*.{tsx,ts,mdx}'
rg -n 'TextFieldProps|TextareaProps|CheckboxProps|RadioProps|SwitchProps|NumberFieldProps|SelectRootProps|ComboboxRootProps|CheckboxGroupProps|RadioGroupProps' src tests
rg -n 'text-field|textarea|checkbox|radio|number-field|combobox|/select|/switch' src --glob '*.{ts,tsx,mdx}'
```

The current direct JSX inventory has 25 files, but it is not a quota. Typecheck
and import review catch aliases, adapters, and type-only dependencies. Keep the
final change list explainable by this API migration.

**Out of scope:**

- Unrelated internal Base UI import replacement. PasswordField or another block
  may remain an opinionated explicit Field composition; blocks are allowed to
  assemble fields, while reusable input controls must not require one.
- A compatibility wrapper mode, callable `.Control` aliases, runtime ancestry
  detection, `withField`/`label={false}` props, or a parallel legacy input family.
- React Hook Form/TanStack/schema dependencies, a form-state provider, schema
  builder, dynamic field renderer, async scheduler, or public field registry.
- New tokens, dependencies, global CSS/JSX augmentation, routes, or a gallery
  redesign. Keep style/state fixes limited to the new control boundary.
- Changing widget value/keyboard/selection semantics, removing NumberField
  scrubbing, changing control size domains, or moving Checkbox/Radio styles to
  generic Field ownership.
- Permanent experimental/private-mechanism fixtures or exact paint assertions.

## Commands and baseline

Use the package manager recorded in current package.json. Commands below match
`c6d9b8f`; if Plan 008 lands first, refresh them before execution. Verify the
execution checkout has the current locked dependencies; the original audit
installation was stale. Use `npm ci` in an isolated checkout if needed.
Install matching Chromium with `npx playwright install chromium` if absent or
changed after a Playwright upgrade; Linux may require `--with-deps chromium`.

| Purpose           | Command                                                                                                                                                | Success                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| Checkout          | `git status --short --branch && git rev-parse --short HEAD`                                                                                            | Intended checkout, known local changes                  |
| Quick gate        | `npm run verify:quick`                                                                                                                                 | Types, blocking lint, formatting pass                   |
| Stories           | `npm run build-storybook`                                                                                                                              | Current production Storybook builds                     |
| Composition tests | `npx playwright test tests/components/form.spec.ts tests/components/checkbox.spec.ts tests/components/radio.spec.ts tests/style-props/browser.spec.ts` | Relevant contracts pass with shared diagnostics         |
| Full gate         | `npm run verify:full`                                                                                                                                  | Includes quick, app/Storybook/browser/dev/bundle checks |
| Advisory review   | `npm run doctor`                                                                                                                                       | Compare attributable findings, no score threshold       |
| Live stories      | `npm run storybook -- --ci --port 6206`                                                                                                                | Ready after optimization                                |
| Final diff        | `git diff --check && git status --short`                                                                                                               | No whitespace errors; only scoped changes               |

Use free ports, with PLAYWRIGHT_STORYBOOK_PORT / PLAYWRIGHT_APP_PORT overrides
where needed; do not reuse or stop another task's server. Do not suppress browser
errors. Rebuild changed Storybook source before tests; reuse passing evidence
until a relevant change, failure, or unresolved concern requires rerunning it.

## Implementation steps

### 1. Establish the behavioral baseline after prerequisite fixes

Confirm #54/#60/#65 are fixed in this baseline and related work is reconciled,
inspect the drift, and record the current
signatures/ref targets and field/group ownership. Run the locked
full gate once and advisory Doctor. Capture current label activation,
required/invalid behavior, disabled/read-only choices, controlled input behavior,
and textarea resize in existing stories. Record unsupported Base UI behavior
instead of inventing a compatibility promise.

Check #65 and concurrent work before editing the ref-consuming files; reuse its
landed helper if present and never restore transitive imports after cleanup.
Serialize with Plan 008 and overlapping component changes. Do not commit, push,
or open a PR without separate user authorization.

**Verify:** baseline `npm run verify:full` passes; record Doctor and focused live
observations. Stop on unrelated baseline failures before attributing them to
this implementation.

### 2. Implement the form/field owners

Add the structure namespace above. Derive props directly from Base UI, replacing
only className/style with the established styling channels and adding margins
on the three eligible owners. Keep Form generic without handwritten `any` or
invented child-field inference. Re-export Field.Validity directly and export
public action/event/validity types needed by ordinary consumers.

Reuse fieldStyles.root/label/itemLabel/description/error. Keep Field.Control and
Field.Item free of generic control chrome. Fieldset.Root resets native border/padding;
Legend uses group-label typography. Label retains nativeLabel/render/ref
behavior. Do not make Form an implicit Stack. Document these boundaries in ADR
0011 and the style guide without recreating an eligibility table.

**Verify:** `npm run typecheck && npm run lint` passes. Temporary compile probes
exercise typed onFormSubmit, action refs, render element/callback types, and
Field.Validity callback state; remove probes afterward.

### 3. Make text and choice exports independent controls

Refactor TextField itself to the styled Base Input, preserving its native/ref/
value/render behavior. Refactor Textarea itself to the styled native textarea,
using Field.Control once for optional registration. Pass value/defaultValue and
registration props to the behavior owner, not solely to a render child; retain
native onChange, readOnly, required, rows/minRows/maxRows, and resizing. Do not
overwrite effective Field disabled/name state with raw render-child props.
Standalone behavior must work through Base UI's supported default context.
For controlled Textarea, Field state follows the accepted `value` prop, including
consumer normalization/rejection and programmatic changes. Delegate this to
Field.Control; do not validate a transient event value manually.

Refactor Checkbox, Radio, and Switch themselves to their Base control plus
indicator/thumb. Remove Field.Root/Item/Label and convenience label/error props.
Keep checked/value callbacks, indeterminate/readOnly/disabled behavior, existing
Switch nativeButton behavior, and family size defaults. Make their styles
independent of private label ancestry within the existing component style owners.

Migrate each touched family's stories and ordinary consumers in the same tranche.
Move labels/descriptions/errors and old wrapper margins/styles to explicit Field
composition; keep controls bare where an accessible name suffices. Do not add
Field around Table's selection checkbox just to preserve its old hidden-label
wrapper. Preserve Table's own public API while adapting its private Checkbox
usage. Type errors from the removed convenience props identify required usage
migrations, not reasons to restore a compatibility API.

Update InputGroup's native textarea bridge only as necessary to use the public
Field.Control and retain controlled/uncontrolled registration. Base Input and
other Base UI controls already register and must not be wrapped a second time.

**Verify:** quick gate passes after each complete family tranche; rebuild
Storybook and run the affected existing specs. Live examples prove standalone
controls with aria-label and composed controls under Field. Check current values,
label focus/toggle, constraints, native form submission, resizing, disabled/name
precedence, and no private style imports at new composition sites.

### 4. Remove implicit Field ownership from widget/group roots

Refactor Select.Root and Combobox.Root to Base UI controllers and presentation
context only. Remove wrapper layout/field props from their public Root types;
migrate their consumers to one explicit Field.Root where appropriate, and to
caller layout where no field metadata/validation is needed. Preserve public
parts, generic inference, popup/keyboard behavior, root values, and styling at
actual hosts. Keep Select.Label's own Base UI behavior. Group Field descriptions
and errors around the real value owner without creating nested fields.

Refactor CheckboxGroup/RadioGroup to their actual group host/state with arbitrary
children. Preserve real group behavior and size/state inheritance. Migrate group
labels to Fieldset.Legend, options to Field.Item when needed, and inline/options
layout to Stack/Grid. Use the group composition above: one named Field.Root
supplies option context and aggregate registration; Fieldset supplies the legend.
Move CheckboxGroup.name to Field.Root.name and label its separate group host
explicitly. Do not synthesize a group readOnly API for CheckboxGroup.
Prefer explicit Fieldset containing a real group host;
use same-host render composition only after confirming native group semantics
and deterministic style/margin ownership. Do not flatten a related group into
unrelated fields or reuse one Field.Root for independent text values.

Refactor NumberField to the specified Root/Control/ScrubArea namespace. Preserve
Base UI number state in one Root, retain the current input/stepper chrome inside
Control, and retain ScrubArea/cursor behavior. Migrate each old callable usage to
Root + Control; where the old label was a scrub target, use ScrubArea around its
explicit Label inside Root. Field.Root, if needed, wraps this widget without
creating another NumberField controller. Preserve min/max/step, inputWidth,
readOnly, required, button names, keyboard, form values, and upstream number/null
value types. A standalone Control accepts aria-label and an
input ref without a Field; Root still owns numeric state. Do not add an
alternate callable fallback.

Keep NumberField's segmented invalid styling. Where the existing usage displays
its warning icon, compose that icon explicitly with the message in Field.Error;
do not impose the icon on every field or remove it for cross-field parity.

**Verify:** quick gate and affected existing Select/Combobox/Checkbox/Radio tests
pass after complete tranches. Rebuild and inspect NumberField, Select, and
Combobox stories standalone and in explicit Fields. Scrubbing, keyboard/value
behavior, label association, names, and form submission remain functional.

### 5. Prove composition and Base UI support in core stories

Playground remains the first export in each new core family. Keep fixed
Composition and validation examples with controls disabled. Update existing control stories and gallery specimens to the explicit API;
add no duplicate legacy examples.

Required scenarios, with visible semantic labels and observable output:

- Standalone named text/textarea and boolean controls without Form or Field,
  including native form submission; show NumberField's real Root separately.
- Text field with label/help in one Grid column and control/error in another;
  a responsive layout stacks while preserving DOM/focus order.
- Textarea beside supporting content, plus InputGroup with an addon/action.
- Settings row using Switch opposite rich Label/Description; a checkbox
  or radio group whose Field.Item rows contain consumer Grid/Stack structure.
- Two independently named fields grouped by Fieldset.Legend.
- Form with explicit generic values, required and synchronous cross-field
  validation, field validationMode override, and successful submitted output.
- Native onSubmit/FormData and native action prop forwarding, documented
  separately from typed registered values. Use local callbacks; no backend.
- External named errors and correction; matched Field.Error and custom
  Field.Validity presentation; Form/Field actionsRef.validate.
- A deterministic local async validator example documenting its onSubmit
  limitation; demonstrate consumer-owned pending state without a scheduler.
  Pending validity can be `null`; native failures and prior custom errors outside
  onSubmit can still block synchronously. Do not imply pending means valid.

Do not make every upstream prop a permanent test. Keep render-only API coverage
in type probes or examples where sufficient. For runtime scenarios use roles,
labels, state, and story-owned output; never expose private registration state.

**Verify:** production Storybook builds; its index includes the new families and
Composition/validation scenarios, and each opens without console/page errors.

### 6. Complete usage migration and prove the environment form

Replace the native form with Form. Give environment name a custom layout using
Field.Root, Label, TextField, and Description/Error. Compose description
with Textarea and automatic rollback with Switch; preserve the existing content
and consumer-owned action buttons. Migrate region/visibility and other fields
to the new explicit ownership as well. Group related fields with Fieldset only
where the section has a meaningful label; do not nest all independent values in
one Field.Root.

Use inputs-page.styles.ts for responsive layouts. Show submission feedback via
an accessible output region owned by this example; do not introduce persistence,
a server, or a form-schema layer. Verify Form output includes the named registered values in these explicit compositions. Every logical field
has one owner; layout alone does not require another Field.

Finish the source/MDX inventory, including app-shell switches, Table checkbox
adapters, popup/Dialog/Drawer examples, gallery, block stories, and exported type
uses. Move descriptions, required markers, and InfoTip into caller composition.
Use VisuallyHidden or an explicit accessible name where a visible label was
previously suppressed. Remove obsolete convenience-API documentation. Do not
rewrite unrelated block composition merely to standardize imports.

**Verify:** `npm run build` and quick pass; all inventory matches use the new
contracts, with no legacy convenience props or old callable NumberField. In the
live existing route, label clicks,
Tab order, layout at narrow/wide widths, error feedback, and submitted values
work. Keep this experimental page's visual verification as review evidence;
permanent primitive contracts belong to core stories.

### 7. Add focused permanent composition coverage

Create tests/components/form.spec.ts importing `{ test, expect }` from
`../playwright`. Use the core stories from step 5. Cover the wrapper boundaries
most at risk:

1. Layout wrappers preserve label activation, accessible name/description/error,
   and current submitted values for text/textarea and a boolean control.
   The standalone example also proves these controls operate without a Field
   and retain native callbacks/submission.
2. Required/synchronous custom validation blocks invalid submission, focuses the
   first invalid control, and permits corrected input; field-level validation
   timing overrides Form where demonstrated.
3. External errors are associated by name and clear/revalidate as upstream
   specifies. One matched/custom error presentation exercises Field.Validity;
   assert meaningful state/output, not localized browser error wording.
4. Controlled values and native consumer callbacks survive textarea registration;
   a rejecting or normalizing consumer proves Field state follows the accepted value.
   checkbox/radio groups retain their accessible group/option names, option
   activation/keyboard behavior, and aggregate registered submission values.
5. Imperative validation updates public error state, while native submission
   callbacks and typed registered-value submission retain their distinct paths.

Use existing Checkbox/Radio tests for preserved value/keyboard behavior after
fixture migration. Add a case only for an uncovered supported behavior. Prove render host/ref
forwarding through a meaningful focus or submission outcome, not ref identity.
Use controlled local promises for any required async case; no arbitrary sleeps,
network calls, or exact debounce timing assertions.

Extend the existing style-prop fixture for Form, standalone Field.Root, and
Fieldset.Root margins and override precedence. Confirm primary input styles/margins target the actual control, Field.Root
styles target the explicit wrapper, and node-less Root types reject wrapper
style/margin props. Update the existing type tests alongside browser fixtures. Retain existing fractional
spacing coverage. Exact typography, control paint, label hover, and layout
appearance belong to live review; test geometry only for a documented contract.

**Verify:** rebuild Storybook, then run the composition-tests command above.
All affected cases pass with shared diagnostics. Do not recreate the retired
experimental choice-group fixture or create per-part implementation tests.

### 8. Verify and close the implementation handoff

After final edits run `npm run verify:full` once and compare advisory Doctor.
Inspect the core Composition stories and environment form in live Storybook/app
after optimization, using pointer, keyboard, narrow/wide layouts, and supported
field states. Confirm no new serious/critical accessibility or console errors.
Repeat checks only for changed code, failures, or unresolved evidence.

Review the final diff against Scope. Update #19 with the implementation and
verification record, distill durable ownership rules into the existing guide/ADR,
then retire this plan under docs/agents/planning.md. Keep the number reserved;
move its index row to the retired ledger and optionally retain an ignored scratch
copy. Plan 005 should depend on landed Field/Label code and #19's merge evidence,
not on this temporary file still existing.

**Verify:** full gate and `git diff --check` pass; only scoped files changed.
Report the exact commands, exercised stories, and any remaining limitation.

## Done criteria

- [ ] TextField, Textarea, Checkbox, Radio, and Switch render controls without
      implicit Field/label/item wrappers; standalone named controls work without
      Form or Field. There is no compatibility wrapper mode or `.Control` alias.
- [ ] Select/Combobox widget roots and Checkbox/Radio groups no longer create
      Fields. Actual widget/group state and semantic requirements remain intact.
- [ ] NumberField Root/Control/ScrubArea preserves numeric input, steppers, and
      scrubbing without an implicit Field or label.
- [ ] Consumers can arrange label/help/control/actions/error with public layouts
      and no private styles, hidden ancestry mode, or nested field owners.
- [ ] Form, Fieldset, Field, Label and relevant prop/action/state types are public;
      Field.Validity is available without a duplicate state model.
- [ ] Registered values, constraints, custom/external validation, error matching,
      field timing, action refs, and native/typed submission are demonstrated.
- [ ] Async validation limits and explicit generic typing are documented; wrappers
      do not promise await-on-submit or inference from arbitrary JSX names.
- [ ] Every affected source/MDX/type-test usage is migrated. Old label/description/
      error convenience props and callable NumberField no longer remain.
- [ ] Styles, margins, refs, and DOM hosts match explicit ownership. Bare choice
      controls need no private label styles; Checkbox/Radio keep separate owners.
- [ ] The existing form proves layouts inside fields; standalone table/toolbar
      controls do not acquire unnecessary Fields.
- [ ] Core composition tests, full verification, and live review pass without
      permanent experimental/private-mechanism tests or arbitrary sleeps.
- [ ] Plan 005 adopts the same explicit Field/node-less controller strategy;
      issue evidence, durable documentation, and the plan ledger agree.

## STOP conditions

- The prerequisite styling/focus/ref fixes are absent from this baseline, or
  concurrent work owns the same controls, ref seams, exports, or toolchain.
- Base UI contracts materially changed without reconciling this plan.
- A control requires a new form state machine, private Base UI API, runtime
  ancestry detection, inaccurate types, cloned children, or double registration.
- A standalone control throws without Field or loses native behavior; do not
  restore an implicit Field to hide the defect.
- Migration loses a consumer's accessible name, description/error relationship,
  ref target, value/checked events, disabled/name precedence, resizing, numeric
  scrubbing, or selection/keyboard behavior. The explicit wrapper/API changes
  above are authorized; unrelated behavior loss is not.
- A public external consumer outside this repository requires a staged migration;
  report that evidence before inventing a compatibility layer.
- Bare controls require private markers or duplicated chrome in callers.
- A layout needs new Field layout props instead of children/xstyle.
- Work extends beyond affected APIs/usages or a required check still fails after
  a focused correction and rerun.

## Maintenance notes

Inputs own controls; Field owns the optional field association/validation;
Fieldset groups related controls; layout stays explicit at the consumer. Actual
widget roots remain where Base UI needs them, but do not silently manufacture
Field roots. Blocks can compose those pieces without freezing former layouts.
Keep #65 ref cleanup and Plan 008 package management coordinated and independent.
