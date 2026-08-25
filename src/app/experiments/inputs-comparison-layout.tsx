import type { ReactNode } from "react";
import { Heading, Stack, Text } from "@/components";

export function ExperimentGroup({
	children,
	description,
	title,
}: {
	children: ReactNode;
	description?: string;
	title: string;
}) {
	return (
		<Stack gap={5} render={<section />}>
			<Stack gap={1}>
				<Heading render={<h2 />} size="3">
					{title}
				</Heading>
				{description ? (
					<Text color="muted" size="1" wrap="pretty">
						{description}
					</Text>
				) : null}
			</Stack>
			{children}
		</Stack>
	);
}

export function ComparisonContainer({
	children,
	description,
	id,
	title,
}: {
	children: ReactNode;
	description?: string;
	id: string;
	title: string;
}) {
	return (
		<Stack gap={5} render={<section data-comparison-container={id} />}>
			<Stack gap={1}>
				<Heading render={<h3 />} size="2">
					{title}
				</Heading>
				{description ? (
					<Text color="muted" size="1" wrap="pretty">
						{description}
					</Text>
				) : null}
			</Stack>
			<Stack bg="surfaceSubtle" gap={8} p={4} radius="lg">
				{children}
			</Stack>
		</Stack>
	);
}

export function ComparisonSubsection({
	children,
	description,
	nested = false,
	title,
}: {
	children: ReactNode;
	description?: string;
	nested?: boolean;
	title: string;
}) {
	return (
		<Stack gap={4} render={<section />}>
			<Stack gap={1}>
				<Heading render={nested ? <h4 /> : <h3 />} size={nested ? "1" : "2"}>
					{title}
				</Heading>
				{description ? (
					<Text color="muted" size="1" wrap="pretty">
						{description}
					</Text>
				) : null}
			</Stack>
			{children}
		</Stack>
	);
}
