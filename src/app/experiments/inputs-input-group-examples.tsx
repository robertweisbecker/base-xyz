import { CircleIcon } from "@phosphor-icons/react/dist/csr/Circle";
import { EnvelopeIcon } from "@phosphor-icons/react/dist/csr/Envelope";
import { LockIcon } from "@phosphor-icons/react/dist/csr/Lock";
import { PaperclipIcon } from "@phosphor-icons/react/dist/csr/Paperclip";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/csr/PaperPlaneTilt";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { CopyButton } from "@/blocks";
import {
	Button,
	Grid,
	IconButton,
	InputGroup,
	Kbd,
	KbdGroup,
	Stack,
	Text,
	TextField,
} from "@/components";
import { inputsPageStyles as styles } from "./inputs-page.styles";

export function InputGroupVariations() {
	return (
		<Grid gap={6} xstyle={styles.inputGroupGrid}>
			<InputGroupSpecimen label="Search projects">
				<InputGroup.Root>
					<InputGroup.Addon>
						<CircleIcon aria-hidden />
					</InputGroup.Addon>
					<InputGroup.Input
						aria-label="Search projects"
						placeholder="Search by name…"
						type="search"
					/>
					<InputGroup.Addon position="end">
						<KbdGroup>
							<Kbd size="sm">⌘</Kbd>
							<Kbd size="sm">K</Kbd>
						</KbdGroup>
					</InputGroup.Addon>
				</InputGroup.Root>
			</InputGroupSpecimen>
			<InputGroupSpecimen label="Configure a domain">
				<InputGroup.Root>
					<InputGroup.Addon>https://</InputGroup.Addon>
					<InputGroup.Input aria-label="Project domain" defaultValue="design-system" type="url" />
					<InputGroup.Addon position="end">.example.com</InputGroup.Addon>
				</InputGroup.Root>
			</InputGroupSpecimen>
			<InputGroupSpecimen label="Invite a teammate">
				<InputGroup.Root>
					<InputGroup.Addon>
						<EnvelopeIcon aria-hidden />
					</InputGroup.Addon>
					<InputGroup.Input
						aria-label="Teammate email"
						placeholder="name@company.com"
						type="email"
					/>
					<InputGroup.Actions>
						<Button size="xs" variant="neutral">
							Invite
						</Button>
					</InputGroup.Actions>
				</InputGroup.Root>
			</InputGroupSpecimen>
			<InputGroupSpecimen label="Copy an API token">
				<InputGroup.Root variant="subtle">
					<InputGroup.Addon>
						<LockIcon aria-hidden />
					</InputGroup.Addon>
					<InputGroup.Input aria-label="API token" defaultValue="sk_live_••••••••42" readOnly />
					<InputGroup.Actions>
						<CopyButton
							aria-label="Copy API token"
							size="xs"
							value="sk_live_••••••••42"
							variant="ghost"
						/>
					</InputGroup.Actions>
				</InputGroup.Root>
			</InputGroupSpecimen>
			<InputGroupSpecimen label="Set a monthly limit">
				<InputGroup.Root>
					<InputGroup.Addon>$</InputGroup.Addon>
					<InputGroup.Input
						aria-label="Monthly limit"
						defaultValue="250"
						inputMode="decimal"
						type="number"
					/>
					<InputGroup.Addon position="end">USD</InputGroup.Addon>
				</InputGroup.Root>
			</InputGroupSpecimen>
			<InputGroupSpecimen label="Reply to a review">
				<InputGroup.Root variant="elevated">
					<InputGroup.Header>Design-system review</InputGroup.Header>
					<InputGroup.Textarea aria-label="Review reply" placeholder="Write a reply…" rows={3} />
					<InputGroup.Footer>
						<InputGroup.Actions position="start">
							<IconButton
								icon={<PaperclipIcon aria-hidden />}
								label="Attach a file"
								size="sm"
								variant="ghost"
							/>
						</InputGroup.Actions>
						<InputGroup.Actions>
							<Button size="sm" startSlot={<PaperPlaneTiltIcon aria-hidden weight="fill" />}>
								Send
							</Button>
						</InputGroup.Actions>
					</InputGroup.Footer>
				</InputGroup.Root>
			</InputGroupSpecimen>
		</Grid>
	);
}

function InputGroupSpecimen({ children, label }: { children: ReactNode; label: string }) {
	return (
		<Stack gap={2}>
			<Text color="muted" size="1">
				{label}
			</Text>
			{children}
		</Stack>
	);
}

export function InputPaddingComparison() {
	return (
		<Stack gap={2} maxWidth="36rem">
			<Text color="muted" size="1">
				Standalone input
			</Text>
			<div {...stylex.props(styles.paddingComparison)}>
				<div data-field-label-hidden>
					<TextField defaultValue="design-system" label="Project slug" />
				</div>
				<Text color="muted" size="1">
					Input group
				</Text>
				<InputGroup.Root>
					<InputGroup.Input aria-label="Project domain" defaultValue="design-system.example.com" />
				</InputGroup.Root>
				<div
					aria-hidden
					data-padding-guide="start"
					{...stylex.props(styles.paddingGuide, styles.paddingGuideStart)}
				/>
				<div
					aria-hidden
					data-padding-guide="end"
					{...stylex.props(styles.paddingGuide, styles.paddingGuideEnd)}
				/>
			</div>
		</Stack>
	);
}
