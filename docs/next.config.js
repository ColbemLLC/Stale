import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
	allowedDevOrigins: ["192.168.8.41"],
	experimental: {
		optimizePackageImports: [
			"lucide-react",
			"framer-motion",
			"@radix-ui/react-tabs",
			"@radix-ui/react-scroll-area",
			"@radix-ui/react-popover",
			"@radix-ui/react-select",
			"@radix-ui/react-checkbox",
		],
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "http",
				hostname: "**",
			},
		],
	},
	async redirects() {
		return [
			// Infrastructure backwards compatibility redirects
			{
				source: "/app/:path*",
				destination: "https://app.colbe.cc",
				permanent: true,
			},
			{
				source: "/docs",
				destination: "/docs/introduction",
				permanent: false,
			},
			{
				source: "/products",
				has: [{ type: "query", key: "tab", value: "pricing" }],
				destination: "/products/pricing",
				permanent: true,
			},
			{
				source: "/terms",
				destination: "/legal/terms",
				permanent: true,
			},
			{
				source: "/privacy",
				destination: "/legal/privacy",
				permanent: true,
			},
			{
				source: "/docs/agent-tools/ask-ai",
				destination: "/docs/ai-resources",
				permanent: true,
			},
			{
				source: "/docs/agent-tools/llms-txt",
				destination: "/llms.txt",
				permanent: true,
			},
			{
				source: "/docs/agent-tools/:path*",
				destination: "/docs/ai-resources/:path*",
				permanent: true,
			},
			{
				source: "/docs/infrastructure/plugins/dash",
				destination: "/docs/infrastructure/plugins/dashboard",
				permanent: true,
			},
			{
				source: "/docs/infrastructure/plugins/dash.md",
				destination: "/docs/infrastructure/plugins/dashboard.md",
				permanent: true,
			},
		];
	},
};

const withMDX = createMDX({
	contentDirBasePath: "/content/docs",
});
export default withMDX(nextConfig);
