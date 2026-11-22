import { unstable_cache } from "next/cache";

const REPO = "ColbemLLC/Stale";

export interface CommunityStats {
	npmDownloads: number;
	npmWeeklyHistory: number[];
	githubStars: number;
	contributors: number;
	discordMembers: number;
}

export interface ContributorInfo {
	login: string;
	avatar_url: string;
	html_url: string;
}

// Shared headers for GitHub API requests
const githubHeaders = {
	Accept: "application/vnd.github.v3+json",
	...(process.env.GITHUB_TOKEN && {
		Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
	}),
};

// Fetch the contributors list from the repo
async function fetchContributors(): Promise<ContributorInfo[]> {
	try {
		const response = await fetch(
			`https://api.github.com/repos/${REPO}/contributors?per_page=100`,
			{ next: { revalidate: 3600 }, headers: githubHeaders },
		);
		if (!response.ok) {
			console.error("Failed to fetch contributors:", response.status);
			return [];
		}
		const data = (await response.json()) as ContributorInfo[];
		return data.map(({ login, avatar_url, html_url }) => ({
			login,
			avatar_url,
			html_url,
		}));
	} catch (error) {
		console.error("Error fetching contributors:", error);
		return [];
	}
}

// Fetch GitHub repository stats: repo info and contributor count in parallel
async function fetchGitHubStats(): Promise<{
	stars: number;
	contributors: number;
}> {
	try {
		const [repoResponse, contributorsResponse] = await Promise.all([
			fetch(`https://api.github.com/repos/${REPO}`, {
				next: { revalidate: 3600 },
				headers: githubHeaders,
			}),
			fetch(
				`https://api.github.com/repos/${REPO}/contributors?per_page=1&anon=true`,
				{ next: { revalidate: 3600 }, headers: githubHeaders },
			),
		]);

		let stars = 0;
		if (repoResponse.ok) {
			const data = await repoResponse.json();
			stars = data.stargazers_count ?? 0;
		} else {
			console.error("Failed to fetch GitHub repo stats:", repoResponse.status);
		}

		let contributors = 0;
		if (contributorsResponse.ok) {
			const linkHeader = contributorsResponse.headers.get("Link");
			const match = linkHeader?.match(/page=(\d+)>; rel="last"/);
			if (match) {
				contributors = parseInt(match[1], 10);
			} else {
				// No pagination: the response holds every contributor (0 or 1)
				const list = await contributorsResponse.json();
				contributors = Array.isArray(list) ? list.length : 0;
			}
		} else {
			console.error(
				"Failed to fetch contributors:",
				contributorsResponse.status,
			);
		}

		return { stars, contributors };
	} catch (error) {
		console.error("Error fetching GitHub stats:", error);
		return { stars: 0, contributors: 0 };
	}
}

// Cached contributors list
export const getContributors = unstable_cache(
	async (): Promise<ContributorInfo[]> => fetchContributors(),
	["community-contributors", REPO],
	{
		revalidate: 3600, // Revalidate every hour
		tags: ["community-contributors"],
	},
);

// Cached function to get all community stats
export const getCommunityStats = unstable_cache(
	async (): Promise<CommunityStats> => {
		const githubStats = await fetchGitHubStats();

		return {
			// Colbe has no npm package, so these stay empty
			npmDownloads: 0,
			npmWeeklyHistory: [],
			githubStars: githubStats.stars,
			contributors: githubStats.contributors,
			// No Discord member count source yet
			discordMembers: 0,
		};
	},
	["community-stats", REPO],
	{
		revalidate: 3600, // Revalidate every hour
		tags: ["community-stats"],
	},
);
