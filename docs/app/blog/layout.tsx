import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

const description = "Latest updates, articles, and insights about Colbe";

export const metadata: Metadata = createMetadata({
	title: "Blog",
	description,
	openGraph: {
		url: "/blog",
		title: "Blog - Colbe",
		description,
		images: ["/api/og-blog?title=Colbe%20Blog"],
	},
	twitter: {
		images: ["/api/og-blog?title=Colbe%20Blog"],
		title: "Blog - Colbe",
		description,
	},
	alternates: {
		types: {
			"application/rss+xml": [
				{
					title: "Colbe - Blog",
					url: "https://colbe.cc/blog/rss.xml",
				},
			],
		},
	},
});

export default function BlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<RootProvider theme={{ enabled: false }}>
			<div className="relative flex min-h-screen flex-col">
				<main className="flex-1">{children}</main>
			</div>
		</RootProvider>
	);
}
