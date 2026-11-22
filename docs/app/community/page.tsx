import type { Metadata } from "next";
import { getCommunityStats } from "@/lib/community-stats";
import { createMetadata } from "@/lib/metadata";
import { CommunityPageClient } from "./community-client";

export const metadata: Metadata = createMetadata({
	title: "Community",
	description:
		"Join the Colbe community: contributors, GitHub stats, and where to find us.",
});

export const revalidate = 21600; // Revalidate every 6 hours

export default async function CommunityPage() {
	const stats = await getCommunityStats();

	return <CommunityPageClient stats={stats} />;
}
