import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { PricingContent } from "./_components/pricing-content";

export const metadata: Metadata = createMetadata({
	title: "Pricing — Colbe",
	description:
		"Colbe's pricing —  A bundle of subscriptions with different benefits awaits your arrival.",
});

export default function PricingPage() {
	return <PricingContent />;
}
