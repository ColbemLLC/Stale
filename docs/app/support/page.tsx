import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { SupportPageClient } from "./support-client";

export const metadata: Metadata = createMetadata({
	title: "Support",
	description:
		"Get help with Colbe. Contact support, read the docs, or report a bug.",
});

export default function SupportPage() {
	return <SupportPageClient />;
}
