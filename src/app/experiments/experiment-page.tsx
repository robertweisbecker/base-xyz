import { useRouterState } from "@tanstack/react-router";
import { Fragment, type ReactNode } from "react";
import { PageHeader } from "@/blocks";
import { Breadcrumbs, Heading, Stack, Text } from "@/components";

export function ExperimentPage({
	children,
	description,
	title,
}: {
	children: ReactNode;
	description: string;
	title: string;
}) {
	const location = useRouterState({ select: (state) => state.location });
	const breadcrumbs = getBreadcrumbs(location.pathname, location.searchStr);

	return (
		<Stack gap={8} pb={10}>
			<PageHeader
				breadcrumbs={
					<Breadcrumbs.Root>
						{breadcrumbs.map((breadcrumb, index) => {
							const current = index === breadcrumbs.length - 1;

							return (
								<Fragment key={JSON.stringify(breadcrumb.label)}>
									{current ? (
										<Breadcrumbs.Current>{breadcrumb.label}</Breadcrumbs.Current>
									) : (
										<>
											<Breadcrumbs.Link href={breadcrumb.href}>{breadcrumb.label}</Breadcrumbs.Link>
											<Breadcrumbs.Separator />
										</>
									)}
								</Fragment>
							);
						})}
					</Breadcrumbs.Root>
				}
				description={description}
				title={title}
			/>
			{children}
		</Stack>
	);
}

function getBreadcrumbs(pathname: string, search: string) {
	const segments = pathname.split("/").filter(Boolean);
	const pathBreadcrumbs = segments.map((segment, index) => ({
		href: `/${segments.slice(0, index + 1).join("/")}${search}`,
		label: getBreadcrumbLabel(segment),
	}));

	if (segments.length === 1 && segments[0] === "experiments") {
		return [{ href: `/${search}`, label: "Gallery" }, ...pathBreadcrumbs];
	}

	return pathBreadcrumbs;
}

const breadcrumbLabels = new Map([
	["agent-blocks", "Agent Blocks"],
	["blocks", "Blocks"],
	["components", "Components"],
	["experiments", "Experiments"],
	["inputs", "Inputs"],
	["popups", "Popups"],
	["tables", "Tables"],
	["utilities", "Utilities"],
]);

function getBreadcrumbLabel(segment: string) {
	return breadcrumbLabels.get(segment) ?? segment;
}

export function ExperimentSection({
	children,
	description,
	id,
	title,
}: {
	children: ReactNode;
	description?: string;
	id?: string;
	title: string;
}) {
	return (
		<Stack aria-labelledby={id} gap={5} render={<section />} my={5}>
			<Stack gap={1}>
				<Heading id={id} size="6" render={<h2 />}>
					{title}
				</Heading>
				{description ? (
					<Text size="1" color="muted" wrap="pretty">
						{description}
					</Text>
				) : null}
			</Stack>
			<Stack bg="grayA1" orientation="vertical" gap={5} radius="md" render={<div />} p={5}>
				{children}
			</Stack>
		</Stack>
	);
}
