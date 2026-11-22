import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchGitHubReleases } from "./github-releases";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("fetchGitHubReleases", () => {
	it("requests releases from the repository API endpoint", async () => {
		const response = new Response("[]", {
			headers: { "Content-Type": "application/json" },
		});
		const fetchMock = vi.fn().mockResolvedValue(response);
		vi.stubGlobal("fetch", fetchMock);

		await expect(fetchGitHubReleases()).resolves.toEqual([]);
		expect(fetchMock).toHaveBeenCalledWith(
			"https://api.github.com/repos/ColbemLLC/formation/releases",
			expect.objectContaining({ next: { revalidate: 3600 } }),
		);
	});

	it("reports non-success responses", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
		);

		await expect(fetchGitHubReleases()).rejects.toThrow(
			"GitHub releases request failed: 404",
		);
	});
});
