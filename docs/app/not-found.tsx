import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const links = [
	{
		title: "Docs",
		description: "Guides and references so you always know how things work.",
		href: "/docs",
	},
	{
		title: "Login",
		description: "Sign in to your account and continue where you left off",
		href: "/login",
	},
	{
		title: "Registration",
		description: "Create your account and fire away!",
		href: "/register",
	},
];

export default function NotFound() {
	return (
		<section className="w-full bg-background py-16 md:py-24">
			<div className="mx-auto max-w-7xl px-4 md:px-6">
				<div className="grid gap-12 md:grid-cols-2 md:gap-16">
					<div>
						<span className="inline-flex items-center border border-border bg-foreground/[0.02] px-2 py-0.5 font-mono text-[11px] tracking-wider text-foreground/60">
							Error 404
						</span>
						<h1 className="mt-6 text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
							This page moved, or never existed
						</h1>
						<p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
							The link you followed does not lead anywhere on Colbe. Nothing is
							broken on your side.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<Link
								href="/"
								className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
							>
								Back to home
							</Link>
							<Link
								href="/docs"
								className="inline-flex h-10 items-center rounded-lg border border-border bg-secondary px-5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
							>
								Search the docs
							</Link>
						</div>
					</div>

					<div className="md:pt-2">
						<p className="text-base text-muted-foreground">
							Where people usually go from here
						</p>
						<div className="mt-4 border-t border-border">
							{links.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="group/nf flex items-start justify-between gap-6 border-b border-border py-5"
								>
									<span className="flex flex-col gap-1">
										<span className="text-lg font-medium text-foreground transition-colors group-hover/nf:text-foreground/70">
											{link.title}
										</span>
										<span className="text-base leading-relaxed text-muted-foreground">
											{link.description}
										</span>
									</span>
									<ArrowUpRight
										aria-hidden
										className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform motion-safe:group-hover/nf:-translate-y-0.5 motion-safe:group-hover/nf:translate-x-0.5"
									/>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
