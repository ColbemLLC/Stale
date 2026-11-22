export interface GitHubRelease {
	id: number;
	tag_name: string;
	name: string;
	body: string;
	html_url: string;
	prerelease: boolean;
	published_at: string;
}

const GITHUB_RELEASES_URL =
	"https://api.github.com/repos/ColbemLLC/formation/releases";

export async function fetchGitHubReleases(): Promise<GitHubRelease[]> {
	const response = await fetch(GITHUB_RELEASES_URL, {
		next: { revalidate: 3600 },
		headers: {
			Accept: "application/vnd.github.v3+json",
			...(process.env.GITHUB_TOKEN && {
				Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
			}),
		},
	});

	if (!response.ok) {
		throw new Error(`GitHub releases request failed: ${response.status}`);
	}

	return response.json();
}
