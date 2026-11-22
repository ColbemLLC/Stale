"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ContributorInfo } from "@/lib/community-stats";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";

const EMPTY_CONTRIBUTORS: ContributorInfo[] = [];

type CommunityHeroStats = {
	npmDownloads: number;
	npmWeeklyHistory: number[];
	githubStars: number;
	contributors: number;
};

/**
 * Below-the-fold media (contributor avatars, the demo video) never competes
 * with the initial load. Once the page has loaded, a fast connection fetches
 * it right away so it's ready before anyone scrolls to it; slow or
 * data-saver connections wait until it's close to the viewport.
 */
function useBelowFoldMedia() {
	const [state, setState] = useState({ loaded: false, prefetch: false });

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout> | undefined;
		const onLoad = () => {
			const prefetch = !isSlowConnection();
			// Give the browser a beat after `load` before starting any fetches.
			timer = setTimeout(() => setState({ loaded: true, prefetch }), 300);
		};
		if (document.readyState === "complete") onLoad();
		else window.addEventListener("load", onLoad, { once: true });
		return () => {
			window.removeEventListener("load", onLoad);
			clearTimeout(timer);
		};
	}, []);

	return state;
}

function isSlowConnection() {
	// Chromium only; Safari and Firefox don't expose the Network Information API.
	const connection = (
		navigator as Navigator & {
			connection?: { saveData?: boolean; effectiveType?: string };
		}
	).connection;
	if (connection?.saveData) return true;
	if (connection?.effectiveType) {
		return /^(slow-2g|2g|3g)$/.test(connection.effectiveType);
	}
	// Everywhere else, judge by how long this page took to load.
	const [navigation] = performance.getEntriesByType(
		"navigation",
	) as PerformanceNavigationTiming[];
	return (navigation?.loadEventStart || performance.now()) > 4000;
}

function ContributorsSection({
	contributors = EMPTY_CONTRIBUTORS,
	contributorCount,
}: {
	contributors: ContributorInfo[];
	contributorCount: number;
}) {
	const wallRef = useRef<HTMLDivElement>(null);
	const [wallNearViewport, setWallNearViewport] = useState(false);
	const { loaded, prefetch } = useBelowFoldMedia();
	const showAvatars = prefetch || (loaded && wallNearViewport);

	// Hundreds of avatars scroll through the wall; the links always render,
	// but the avatar images are only mounted after the page has loaded: right
	// away on fast connections, or once the wall is about a screen away on
	// slow ones.
	useEffect(() => {
		const wall = wallRef.current;
		if (!wall) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setWallNearViewport(true);
					observer.disconnect();
				}
			},
			// About a screen ahead; the images themselves stay `loading="lazy"`.
			{ rootMargin: "100% 0px" },
		);
		observer.observe(wall);
		return () => observer.disconnect();
	}, []);

	if (contributors.length === 0) return null;

	const colCount = 18;
	const columns = Array.from({ length: colCount }, (_, i) => {
		const perCol = Math.ceil(contributors.length / colCount);
		return contributors.slice(i * perCol, (i + 1) * perCol);
	});

	const speeds = [
		160, 190, 140, 176, 150, 184, 164, 144, 180, 156, 170, 136, 186, 152, 174,
		146, 182, 158,
	];

	return (
		<div className="mt-10 pt-8">
			<div className="flex items-center gap-4 mb-2">
				<span className="text-lg font-medium text-foreground/90 dark:text-foreground/80 tracking-tight shrink-0">
					Contributors
				</span>
				<div className="flex-1 border-t border-foreground/10" />
			</div>
			<p className="text-[13px] text-foreground/50 dark:text-foreground/40 mb-5 leading-relaxed">
				Built by a community of{" "}
				<span className="text-foreground/70 dark:text-foreground/60 font-medium tabular-nums">
					{contributorCount}+
				</span>{" "}
				contributors.
			</p>

			{contributors.length > 0 && (
				<div
					ref={wallRef}
					className="relative overflow-hidden h-[220px] rounded-md"
					style={{
						perspective: "600px",
						maskImage:
							"linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
						WebkitMaskImage:
							"linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
					}}
				>
					<div
						className="absolute inset-0 pointer-events-none"
						style={{
							backgroundImage:
								"radial-gradient(circle, currentColor 0.5px, transparent 0.5px)",
							backgroundSize: "12px 12px",
							opacity: 0.04,
						}}
					/>
					<div
						className="grid h-full relative"
						style={{
							gridTemplateColumns: `repeat(${colCount}, 1fr)`,
							transform: "rotateX(18deg)",
							transformOrigin: "center center",
						}}
					>
						{columns.map((col, i) => (
							<div key={i} className="relative overflow-hidden h-full">
								<div
									className="flex flex-col gap-1 items-center"
									style={{
										animation: `vertical-marquee ${speeds[i]}s linear infinite`,
									}}
								>
									{[...col, ...col].map((c, j) => (
										<a
											key={`${c.login}-${j}`}
											href={c.html_url}
											target="_blank"
											rel="noopener noreferrer"
											title={c.login}
											aria-label={c.login}
											className="relative group shrink-0"
										>
											{showAvatars ? (
												// Eager once prefetching: Safari's native lazy-loading
												// only starts right at the viewport, so avatars would
												// still pop in one by one as the marquee scrolls. Low
												// priority keeps them behind the demo video, and the
												// tile background covers any that land a beat late.
												<img
													src={`${c.avatar_url}&s=64`}
													alt={c.login}
													width={32}
													height={32}
													loading={prefetch ? "eager" : "lazy"}
													fetchPriority="low"
													className="rounded-sm bg-foreground/10 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200 hover:scale-125 hover:z-10 relative"
												/>
											) : (
												<span className="block size-8 rounded-sm bg-foreground/5" />
											)}
											<div className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-foreground text-background text-[8px] font-mono rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
												{c.login}
											</div>
										</a>
									))}
								</div>
							</div>
						))}
					</div>
					<div className="absolute inset-y-0 left-0 w-8 bg-linear-to-r from-background to-transparent pointer-events-none z-10" />
					<div className="absolute inset-y-0 right-0 w-8 bg-linear-to-l from-background to-transparent pointer-events-none z-10" />
				</div>
			)}
		</div>
	);
}

function formatCount(num: number | null | undefined): string {
	if (num == null) return "—";
	if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
	if (num >= 1_000) return `${(num / 1_000).toFixed(num >= 10_000 ? 0 : 1)}k`;
	return num.toString();
}

function ReadmeFooter({ stats }: { stats: CommunityHeroStats }) {
	return (
		<div className="relative mt-10 pt-8 pb-16 overflow-hidden">
			{/* Watermark logo */}
			<div
				className="absolute -right-10 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.03] dark:opacity-[0.04]"
				aria-hidden="true"
			>
				<svg
					width="300"
					height="225"
					viewBox="0 0 60 45"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M0 0H15V15H30V30H15V45H0V30V15V0ZM45 30V15H30V0H45H60V15V30V45H45H30V30H45Z"
						className="fill-foreground"
					/>
				</svg>
			</div>

			{/* Dot grid */}
			<div
				className="absolute inset-0 pointer-events-none select-none"
				aria-hidden="true"
				style={{
					backgroundImage:
						"radial-gradient(circle, currentColor 0.5px, transparent 0.5px)",
					backgroundSize: "24px 24px",
					opacity: 0.03,
				}}
			/>

			{/* CTA */}
			<div className="relative space-y-6">
				<p className="text-center text-lg text-balance text-foreground/60 dark:text-foreground/50 tracking-tight">
					Colbe is a community platform built by{"Colbem Inc"}
				</p>

				<div className="flex items-center justify-center gap-2">
					{stats.npmDownloads > 0 && (
						<a
							href="https://www.npmjs.com/package/better-auth"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div className="flex items-center gap-1.5 px-2.5 hover:bg-foreground/4 rounded-sm transition-colors text-foreground/50 dark:text-foreground/50">
								<Icons.npm className="size-[11px] -translate-y-px" />
								<span className="text-xs font-mono">
									{formatCount(stats.npmDownloads)} / week
								</span>
							</div>
						</a>
					)}
					{stats.githubStars > 0 && (
						<a
							href="https://github.com/better-auth/better-auth"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div className="flex items-center gap-1.5 px-2.5 hover:bg-foreground/4 rounded-sm transition-colors text-foreground/50 dark:text-foreground/50">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="11"
									height="11"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="size-[11px] -translate-y-px"
								>
									<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
								</svg>
								<span className="text-xs font-mono">
									{formatCount(stats.githubStars)} stars
								</span>
							</div>
						</a>
					)}
				</div>

				<div className="flex flex-wrap items-center justify-center gap-4 pt-1">
					<Link
						href="/docs/installation"
						className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 text-xs sm:text-sm font-medium hover:opacity-90 transition-colors"
					>
						Get Started
					</Link>
					<Link
						href="/login"
						className="relative inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm font-medium transition-colors group"
					>
						<span
							className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity"
							style={{
								backgroundImage: `repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 4px,
                  currentColor 4px,
                  currentColor 5px
                )`,
							}}
						/>
						<span className="absolute top-0 -left-[6px] -right-[6px] h-px bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
						<span className="absolute bottom-0 -left-[6px] -right-[6px] h-px bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
						<span className="absolute left-0 -top-[6px] -bottom-[6px] w-px bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
						<span className="absolute right-0 -top-[6px] -bottom-[6px] w-px bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
						<span className="absolute -bottom-[6px] -right-[6px] font-mono text-[8px] text-foreground/40 dark:text-foreground/50 leading-none select-none translate-x-1/2 translate-y-1/2">
							+
						</span>
						<span className="relative">Login </span>
					</Link>
				</div>
			</div>
		</div>
	);
}

const features = [
	{
		label: "Guilds",
		headline: "Spaces for your people.",
		desc: "Create a guild, invite members, and run it with owners and admins.",
		roles: true,
		href: "/docs",
	},
	{
		label: "Channels",
		headline: "Organized conversation.",
		desc: "Keep every topic in its own place so nothing gets lost.",
		href: "/docs",
	},
	{
		label: "Direct messages",
		headline: "One-on-one, off the record.",
		desc: "Talk privately with anyone, away from the main channels.",
		href: "/docs",
	},
	{
		label: "Community page",
		headline: "Announcements that get seen.",
		desc: "Owners and admins post updates right on the community page.",
		href: "/docs",
	},
	{
		label: "Quick start",
		headline: "Sign up with an email.",
		desc: "Register with just your email, then finish setup in onboarding.",
		href: "/docs",
	},
	{
		label: "Docs",
		headline: "Written down.",
		desc: "Guides and references so you always know how things work.",
		href: "/docs",
	},
];

export function HeroReadMe({
	contributors,
	stats,
}: {
	contributors: ContributorInfo[];
	stats: CommunityHeroStats;
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
			className="flex flex-col w-full"
		>
			{/* Markdown content */}
			<div className="flex-1 overflow-x-hidden no-scrollbar">
				<div className="p-5 lg:px-8 lg:pt-20">
					<motion.article
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.4, delay: 0.3 }}
						className="no-scrollbar pb-0"
					>
						<h1 className="flex items-center gap-3 text-sm sm:text-[15px] font-mono text-neutral-900 dark:text-neutral-100 mb-4 sm:mb-5">
							README
							<span className="flex-1 h-px bg-foreground/15" />
						</h1>

						<p className="text-sm sm:text-[15px] text-foreground/80 mb-6 sm:mb-8 leading-relaxed">
							Colbe is a community-based platform. Chat with your friends and
							colleagues together.{" "}
							<span className="font-medium text-foreground/90 dark:text-foreground/80">
								Secure you chats, build a community
							</span>{" "}
							All in one place.
						</p>

						<div className="flex items-center gap-4 my-4">
							<span className="text-lg font-medium text-foreground/90 dark:text-foreground/80 tracking-tight shrink-0">
								Features
							</span>
							<div className="flex-1 border-t border-foreground/10" />
						</div>

						<div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-2 border border-foreground/[0.08] overflow-hidden">
							{features.map((feature, i) => (
								<Link
									key={feature.label}
									href={feature.href}
									className="contents"
								>
									<motion.div
										whileHover={{
											y: -2,
											transition: { duration: 0.2, ease: "easeOut" },
										}}
										className={cn(
											"group/card relative p-4 lg:p-5 border-foreground/[0.08] min-h-[100px] transition-all duration-200 hover:bg-foreground/[0.02] hover:shadow-[inset_0_1px_0_0_rgba(128,128,128,0.1)] hover:z-10",
											// Bottom border: all except last
											i < 5 && "border-b",
											// 2-col: last row has no bottom border
											i >= 4 && "sm:border-b-0",
											// 3-col: only the first row has a bottom border
											i < 3 ? "md:border-b" : "md:border-b-0",
											// 2-col: left column gets a right border
											i % 2 === 0 && "sm:border-r",
											// 3-col: no right border on the 3rd column, add on the others
											i % 3 === 2 && "md:border-r-0",
											i % 2 !== 0 && i % 3 !== 2 && "md:border-r",
										)}
									>
										{/* Arrow icon — top right, visible on hover */}
										<span className="absolute top-3 right-3 lg:top-4 lg:right-4 opacity-0 -translate-y-0.5 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-200">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="text-foreground/40 dark:text-foreground/50"
											>
												<line x1="7" y1="17" x2="17" y2="7" />
												<polyline points="7 7 17 7 17 17" />
											</svg>
										</span>
										<div className="mb-1">
											<div className="text-[11px] font-mono text-foreground/45 dark:text-foreground/30 tracking-wider transition-colors duration-200 group-hover/card:text-foreground/60 dark:group-hover/card:text-foreground/40">
												{String(i + 1).padStart(2, "0")}
											</div>
											<div className="text-[13px] font-medium text-foreground/80 dark:text-neutral-100 transition-colors duration-200">
												{feature.headline}
											</div>
										</div>
										<div className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed transition-colors duration-200 group-hover/card:text-neutral-400 dark:group-hover/card:text-neutral-300">
											{feature.desc}
										</div>
										{"roles" in feature && feature.roles && (
											<div className="mt-3 flex items-center gap-2.5">
												{/* Overlapping member avatars */}
												<div className="flex -space-x-1.5">
													<div className="relative size-5 rounded-full border border-foreground/[0.08] bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center z-[3]">
														<span className="text-[8px] font-mono text-foreground/55 dark:text-foreground/35 leading-none">
															A
														</span>
													</div>
													<div className="relative size-5 rounded-full border border-foreground/[0.08] bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center z-[2]">
														<span className="text-[8px] font-mono text-foreground/50 dark:text-foreground/30 leading-none">
															B
														</span>
													</div>
													<div className="relative size-5 rounded-full border border-foreground/[0.08] bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center z-[1]">
														<span className="text-[8px] font-mono text-foreground/40 dark:text-foreground/50 leading-none">
															C
														</span>
													</div>
													<div className="relative size-5 rounded-full border border-dashed border-foreground/[0.1] bg-background flex items-center justify-center z-[0]">
														<span className="text-[8px] font-mono text-foreground/35 dark:text-foreground/20 leading-none">
															+
														</span>
													</div>
												</div>
												{/* Role badges */}
												<div className="flex items-center gap-1">
													<span className="text-[8px] font-mono text-foreground/50 dark:text-foreground/30 px-1.5 py-0.5 border border-foreground/[0.08] bg-foreground/[0.015]">
														owner
													</span>
													<span className="text-[8px] font-mono text-foreground/35 dark:text-foreground/20 px-1.5 py-0.5 border border-foreground/[0.06] bg-foreground/[0.015]">
														admin
													</span>
													<span className="text-[8px] font-mono text-foreground/30  px-1.5 py-0.5 border border-dashed border-foreground/[0.08]">
														member
													</span>
												</div>
											</div>
										)}
									</motion.div>
								</Link>
							))}
							{/* + marks at grid intersections */}
							<span className="hidden md:block absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 font-mono -mt-[1px] -ml-[.5px] text-[10px] text-foreground/35 dark:text-foreground/20 select-none z-10">
								+
							</span>
							<span className="hidden md:block absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 font-mono -mt-[1px] -ml-[.5px] text-[10px] text-foreground/35 dark:text-foreground/20 select-none z-10">
								+
							</span>
						</div>

						<ContributorsSection
							contributors={contributors}
							contributorCount={stats.contributors}
						/>

						<ReadmeFooter stats={stats} />
					</motion.article>
				</div>
			</div>
		</motion.div>
	);
}
