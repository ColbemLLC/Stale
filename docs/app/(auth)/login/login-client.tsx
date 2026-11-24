"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { HalftoneBackground } from "@/components/landing/halftone-bg";
import { authClient } from "@/lib/auth-client";
import { APP_BASE_URL } from "@/lib/auth-urls";

const fade = (delay = 0) => ({
	initial: { opacity: 0, y: 8 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.5, delay, ease: [0.25, 1, 0.5, 1] as const },
});

const GoogleIcon = (p: React.SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 24 24" aria-hidden {...p}>
		<path
			fill="currentColor"
			d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
		/>
	</svg>
);

const AppleIcon = (p: React.SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 24 24" aria-hidden {...p}>
		<path
			fill="currentColor"
			d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
		/>
	</svg>
);

const GithubIcon = (p: React.SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 24 24" aria-hidden {...p}>
		<path
			fill="currentColor"
			d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.61-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.13-4.55-5.04 0-1.11.39-2.02 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.04A9.4 9.4 0 0 1 12 7.04c.85 0 1.7.12 2.5.34 1.9-1.31 2.74-1.04 2.74-1.04.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.74 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
		/>
	</svg>
);

const social =
	"flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent disabled:opacity-60";
const field =
	"h-10 w-full rounded-lg border border-border bg-muted/50 px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring";

export default function LoginClient() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const onSocial = (provider: "google" | "apple" | "github") =>
		authClient.signIn.social({ provider, callbackURL: APP_BASE_URL });

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		const res = await authClient.signIn.email({ email, password });
		setLoading(false);
		if (res.error) return setError(res.error.message ?? "Sign in failed");
		window.location.assign(APP_BASE_URL);
	};

	return (
		<section className="relative min-h-svh overflow-hidden bg-background lg:grid lg:grid-cols-[40%_60%]">
			<aside className="relative hidden h-full flex-col overflow-hidden border-e border-border bg-card p-10 lg:flex">
				<div aria-hidden className="absolute inset-0">
					<HalftoneBackground />
				</div>
				<div
					aria-hidden
					className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background"
				/>

				<div className="relative z-10 mt-auto space-y-3">
					<motion.h2
						{...fade(0.15)}
						className="inline-block text-4xl font-medium tracking-tight underline decoration-foreground/30 decoration-4 underline-offset-8 sm:text-5xl"
					>
						Login
					</motion.h2>
					<motion.p
						{...fade(0.25)}
						className="max-w-xs text-[15px] leading-relaxed text-foreground/60"
					>
						Pick up where you left off. Sign in to your guilds, channels and
						messages.
					</motion.p>
				</div>
			</aside>

			<div className="relative flex min-h-svh flex-col justify-center px-8 lg:min-h-0">
				<motion.div {...fade(0)} className="absolute start-5 top-7 z-10">
					<Link
						href="/"
						className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						<ChevronLeft className="size-4" />
						Home
					</Link>
				</motion.div>

				<div className="relative z-10 mx-auto w-full space-y-6 sm:max-w-sm">
					<div className="flex flex-col gap-2">
						<motion.h1
							{...fade(0.1)}
							className="text-2xl font-semibold tracking-tight"
						>
							Sign In or Join Now!
						</motion.h1>
						<motion.p {...fade(0.16)} className="text-sm text-muted-foreground">
							Sign in or create your Colbe account.
						</motion.p>
					</div>

					<motion.div {...fade(0.22)} className="space-y-2">
						<button
							type="button"
							onClick={() => onSocial("google")}
							className={social}
						>
							<GoogleIcon className="size-4" />
							Continue with Google
						</button>
						<button
							type="button"
							onClick={() => onSocial("apple")}
							className={social}
						>
							<AppleIcon className="size-4" />
							Continue with Apple
						</button>
						<button
							type="button"
							onClick={() => onSocial("github")}
							className={social}
						>
							<GithubIcon className="size-4" />
							Continue with GitHub
						</button>
					</motion.div>

					<motion.div
						{...fade(0.28)}
						className="flex items-center gap-3 text-xs text-muted-foreground"
					>
						<span className="flex-1 border-t border-dashed border-foreground/15" />
						or
						<span className="flex-1 border-t border-dashed border-foreground/15" />
					</motion.div>

					<motion.form
						{...fade(0.34)}
						onSubmit={onSubmit}
						className="space-y-3"
					>
						<div className="space-y-1.5">
							<label htmlFor="email" className="text-xs text-muted-foreground">
								Email
							</label>
							<input
								id="email"
								type="email"
								required
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								className={field}
							/>
						</div>
						<div className="space-y-1.5">
							<label
								htmlFor="password"
								className="text-xs text-muted-foreground"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								required
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								className={field}
							/>
						</div>
						{error && (
							<p className="text-xs text-destructive-foreground">{error}</p>
						)}
						<button
							type="submit"
							disabled={loading}
							className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
						>
							{loading && (
								<Loader2 aria-hidden className="size-4 animate-spin" />
							)}
							Continue With Email
						</button>
					</motion.form>

					<motion.p {...fade(0.4)} className="text-xs text-muted-foreground">
						By continuing, you agree to our{" "}
						<Link
							href="/terms"
							className="text-foreground underline-offset-4 hover:underline"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							href="/privacy"
							className="text-foreground underline-offset-4 hover:underline"
						>
							Privacy Policy
						</Link>
						.
					</motion.p>
				</div>
			</div>
		</section>
	);
}
