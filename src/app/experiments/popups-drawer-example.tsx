import { useState } from "react";
import { Button, Checkbox, Drawer, Stack, Text, Textarea, TextField } from "@/components";
import { popupsPageStyles as styles } from "./popups-page.styles";

const drawerSnapPoints: Array<string | number> = ["22rem", "36rem", 1];

export function DrawerExample() {
	const [mode, setMode] = useState<"details" | "activity">("details");
	const [snapPoint, setSnapPoint] = useState<string | number | null>(drawerSnapPoints[0]);

	return (
		<Drawer.Root
			snapPoints={drawerSnapPoints}
			snapPoint={snapPoint}
			onSnapPointChange={setSnapPoint}
			snapToSequentialPoints
		>
			<Drawer.Trigger render={<Button variant="neutral" />}>Drawer</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup layout="snap-points">
						<Drawer.Handle />
						<Drawer.Header>
							<Drawer.Title>Drawer variations</Drawer.Title>
							<Drawer.Description>
								Switch content, change snap points, scroll, and open a nested drawer.
							</Drawer.Description>
						</Drawer.Header>
						<Drawer.Content aria-label="Drawer variation content" role="region" scrollable>
							<Drawer.Body>
								<Stack gap={4}>
									<Stack gap={2} orientation="horizontal" wrap="wrap">
										<Button
											aria-pressed={mode === "details"}
											onClick={() => setMode("details")}
											size="sm"
											variant={mode === "details" ? "primary" : "secondary"}
										>
											Details
										</Button>
										<Button
											aria-pressed={mode === "activity"}
											onClick={() => setMode("activity")}
											size="sm"
											variant={mode === "activity" ? "primary" : "secondary"}
										>
											Activity
										</Button>
										<Button
											aria-pressed={snapPoint === drawerSnapPoints[0]}
											onClick={() => setSnapPoint(drawerSnapPoints[0])}
											size="sm"
											variant="secondary"
										>
											Compact
										</Button>
										<Button
											aria-pressed={snapPoint === drawerSnapPoints[2]}
											onClick={() => setSnapPoint(drawerSnapPoints[2])}
											size="sm"
											variant="secondary"
										>
											Full height
										</Button>
									</Stack>
									{mode === "details" ? <DrawerDetails /> : <DrawerActivity />}
									<NestedDrawer />
								</Stack>
							</Drawer.Body>
						</Drawer.Content>
						<Drawer.Footer>
							<Drawer.Close render={<Button variant="secondary" />}>Close</Drawer.Close>
						</Drawer.Footer>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	);
}

function DrawerDetails() {
	return (
		<Stack gap={4}>
			<TextField label="Project name" defaultValue="BaseX lab" />
			<Checkbox defaultChecked label="Require preview authentication" />
			<Textarea label="Description" rows={4} />
		</Stack>
	);
}

function DrawerActivity() {
	return (
		<Stack gap={3}>
			{Array.from({ length: 14 }, (_, index) => (
				<Stack gap={1} key={index} xstyle={styles.activityRow}>
					<Text fontWeight="medium">Activity {index + 1}</Text>
					<Text color="muted" size="1">
						A teammate updated popup experiment settings.
					</Text>
				</Stack>
			))}
		</Stack>
	);
}

function NestedDrawer() {
	return (
		<Drawer.Root>
			<Drawer.Trigger render={<Button variant="secondary" />}>Open nested drawer</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup>
						<Drawer.Handle />
						<Drawer.Content>
							<Drawer.Header>
								<Drawer.Title>Nested drawer</Drawer.Title>
								<Drawer.Description>
									The parent drawer should scale and remain visible behind this layer.
								</Drawer.Description>
							</Drawer.Header>
							<Drawer.Body>
								Nested focus and swipe dismissal stay scoped to the frontmost drawer.
							</Drawer.Body>
							<Drawer.Footer>
								<Drawer.Close render={<Button variant="secondary" />}>Back</Drawer.Close>
							</Drawer.Footer>
						</Drawer.Content>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	);
}
