import type { MetadataRoute } from "next";

const BASE_URL = "https://colbe.cc";

export default function sitemap(): MetadataRoute.Sitemap {
	const pages: {
		path: string;
		changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
		priority: number;
	}[] = [
		{ path: "", changeFrequency: "daily", priority: 1.0 },
		{ path: "/about", changeFrequency: "monthly", priority: 0.8 },
		{ path: "/credits", changeFrequency: "monthly", priority: 0.5 },
		{ path: "/legal/privacy", changeFrequency: "yearly", priority: 0.4 },
		{ path: "/legal/terms", changeFrequency: "yearly", priority: 0.4 },
		{ path: "/legal/guidelines", changeFrequency: "yearly", priority: 0.4 },
	];

	return pages.map(({ path, changeFrequency, priority }) => ({
		url: `${BASE_URL}${path}`,
		lastModified: new Date(),
		changeFrequency,
		priority,
	}));
}
