import { ArchiveIcon } from "@phosphor-icons/react/dist/csr/Archive";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import { Button, Dialog, IconButton, Menu, Popover, Stack, Text, TextField, Tooltip } from "@/components";
import { ExperimentPage, ExperimentSection } from "./experiment-page";

export function PopupsPage() {
	return (
		<ExperimentPage
			description="Layered interfaces tested in realistic tasks, including focus return, dismissal, positioning, and keyboard access."
			title="Popups">
			<ExperimentSection
				description="Menus keep frequent row actions compact without hiding the selected deployment context."
				title="Deployment actions">
				<Stack align="center" gap={3} orientation="horizontal" wrap="wrap">
					<Menu.Root>
						<Menu.Trigger render={<Button variant="secondary" />}>Open actions</Menu.Trigger>
						<Menu.Popup positionerProps={{ align: "start" }}>
							<Menu.Item>
								<Menu.ItemIcon><CopyIcon aria-hidden /></Menu.ItemIcon>
								<Menu.ItemLabel>Duplicate deployment</Menu.ItemLabel>
								<Menu.ItemShortcut>⌘D</Menu.ItemShortcut>
							</Menu.Item>
							<Menu.Item>
								<Menu.ItemIcon><ArchiveIcon aria-hidden /></Menu.ItemIcon>
								<Menu.ItemLabel>Move to archive</Menu.ItemLabel>
							</Menu.Item>
							<Menu.Separator />
							<Menu.Item variant="error">
								<Menu.ItemIcon><TrashIcon aria-hidden /></Menu.ItemIcon>
								<Menu.ItemLabel>Delete deployment</Menu.ItemLabel>
							</Menu.Item>
						</Menu.Popup>
					</Menu.Root>
					<Tooltip.Root>
						<Tooltip.Trigger
							render={<IconButton icon={<InfoIcon aria-hidden />} label="Deployment status help" variant="ghost" />}
						/>
						<Tooltip.Popup>Production health checks passed 3 minutes ago.</Tooltip.Popup>
					</Tooltip.Root>
				</Stack>
			</ExperimentSection>

			<ExperimentSection
				description="Use a popover for supplemental information that does not require a full task interruption."
				title="Inspect release details">
				<Stack align="start">
					<Popover.Root>
						<Popover.Trigger render={<Button variant="secondary" />}>View release</Popover.Trigger>
						<Popover.Popup showClose positionerProps={{ align: "start", side: "bottom" }}>
							<Popover.Title>Release 2026.08.24</Popover.Title>
							<Popover.Description>
								Includes the experiments router, component examples, and direct route support.
							</Popover.Description>
							<Popover.Footer>
								<Text color="muted" size="1">Published by Maya Chen · 8 minutes ago</Text>
							</Popover.Footer>
						</Popover.Popup>
					</Popover.Root>
				</Stack>
			</ExperimentSection>

			<ExperimentSection
				description="A focused dialog can collect a small edit while preserving the surrounding page context."
				title="Rename a project">
				<Stack align="start">
					<Dialog.Root>
						<Dialog.Trigger render={<Button />}>Rename project</Dialog.Trigger>
						<Dialog.Popup>
							<Dialog.Header>
								<Dialog.Title>Rename project</Dialog.Title>
								<Dialog.Description>The project slug and existing deployment URLs will not change.</Dialog.Description>
							</Dialog.Header>
							<Dialog.Body>
								<TextField autoFocus defaultValue="Design system lab" label="Project name" />
							</Dialog.Body>
							<Dialog.Footer>
								<Dialog.Close render={<Button variant="neutral" />}>Cancel</Dialog.Close>
								<Dialog.Close render={<Button />}>Save name</Dialog.Close>
							</Dialog.Footer>
						</Dialog.Popup>
					</Dialog.Root>
				</Stack>
			</ExperimentSection>
		</ExperimentPage>
	);
}
