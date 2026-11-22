import { afterEach, describe, expect, it, vi } from "vitest";

const cacheKeys = vi.hoisted(() => [] as string[][]);

vi.mock("next/cache", () => ({
	unstable_cache: (
		callback: () => Promise<unknown>,
		keyParts: string[] = [],
	) => {
		cacheKeys.push(keyParts);
		return callback;
	},
}));

import { getCommunityStats } from "./community-stats";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("getCommunityStats", () => {
	it("keys cached stats by repository and fetches that repository's stars", async () => {
		const requests: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: RequestInfo | URL) => {
				const url = String(input);
				requests.push(url);

				if (url.endsWith("/contributors?per_page=1&anon=true")) {
					return new Response("[]", {
						headers: { "Content-Type": "application/json" },
					});
				}

				return new Response(JSON.stringify({ stargazers_count: 1 }), {
					headers: { "Content-Type": "application/json" },
				});
			}),
		);

		await expect(getCommunityStats()).resolves.toMatchObject({
			githubStars: 1,
		});
		expect(requests).toContain("https://api.github.com/repos/ColbemLLC/Stale");
		expect(cacheKeys).toContainEqual(["community-stats", "ColbemLLC/Stale"]);
	});
});
