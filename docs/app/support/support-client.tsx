"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Bug, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Footer from "@/components/landing/footer";
import { HalftoneBackground } from "@/components/landing/halftone-bg";
import { SignatureMark } from "@/components/landing/signature-mark";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const serif = "font-[family-name:var(--font-instrument-serif)]";

const supportSchema = z.object({
	fullName: z.string().min(1, "Enter your name"),
	email: z.string().email("Enter a valid email"),
	topic: z.string().min(1, "Select a topic"),
	description: z.string().min(10, "Tell us a little more"),
});

const topics = [
	"Account and sign-in",
	"Bug report",
	"Feature request",
	"Safety and reporting",
	"Other",
] as const;

const quickLinks = [
	{
		Icon: BookOpen,
		title: "Docs",
		desc: "Guides and references.",
		href: "/docs",
	},
	{
		Icon: ShieldCheck,
		title: "Community guidelines",
		desc: "What is and is not allowed.",
		href: "/legal/guidelines",
	},
	{
		Icon: Bug,
		title: "Report a bug",
		desc: "Choose Bug report in the form.",
		href: "#contact",
	},
];

function SupportHero() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="relative w-full pt-6 md:pt-10 pb-6 lg:pb-0 flex flex-col justify-center lg:h-full"
		>
			<div className="space-y-6">
				<div className="space-y-2">
					<h1
						className={`${serif} text-4xl md:text-5xl text-foreground tracking-tight leading-[1.05]`}
					>
						We are here
						<br />
						<span className="italic text-foreground/60">to help.</span>
					</h1>
					<p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
						Questions, bugs, or feedback? Send us a message and we will get back
						to you.
					</p>
				</div>

				<div className="flex items-center gap-3 pt-1">
					<Link
						href="/docs"
						className="inline-flex items-center gap-1.5 text-[12px] text-foreground/60 hover:text-foreground/80 font-mono uppercase tracking-wider transition-colors"
					>
						Read the docs
						<ArrowUpRight className="size-2.5 opacity-60" />
					</Link>
				</div>
			</div>
		</motion.div>
	);
}

export function SupportPageClient() {
	const hpRef = useRef<HTMLInputElement>(null);
	const form = useForm<z.infer<typeof supportSchema>>({
		resolver: zodResolver(supportSchema),
		defaultValues: {
			fullName: "",
			email: "",
			topic: "",
			description: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof supportSchema>) => {
		try {
			const response = await fetch("/api/support/contact", {
				method: "POST",
				body: JSON.stringify({
					...data,
					_hp: hpRef.current?.value,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				const { message } = await response.json();
				if (response.status === 422) {
					form.setError("email", { message });
					return;
				}
				toast.error(message || "Something went wrong. Please try again.");
				return;
			}
			toast.success("Thank you! We will get back to you soon.");
			form.reset();
		} catch {
			toast.error("Something went wrong. Please try again.");
		}
	};

	return (
		<div className="relative min-h-dvh pt-14 lg:pt-0">
			<div className="relative text-foreground">
				<div className="flex flex-col lg:flex-row">
					{/* Left side — Support hero */}
					<div className="hidden lg:block relative w-full shrink-0 lg:w-[40%] lg:h-dvh border-b lg:border-b-0 lg:border-r border-foreground/6 overflow-clip px-5 sm:px-6 lg:px-10 lg:sticky lg:top-0">
						<div className="hidden lg:block">
							<HalftoneBackground />
						</div>
						<SupportHero />
						<div className="absolute left-10 right-6 bottom-4 z-[3]">
							<SignatureMark />
						</div>
					</div>

					{/* Right side — Contact form */}
					<div className="relative w-full lg:w-[60%] overflow-x-hidden no-scrollbar flex flex-col min-h-dvh">
						<div className="px-5 lg:p-8 lg:pt-20 space-y-8">
							{/* Mobile header */}
							<div className="lg:hidden relative border-b border-foreground/6 overflow-hidden -mx-5 sm:-mx-6 px-5 sm:px-6 mb-5">
								<HalftoneBackground />
								<div className="relative space-y-2 py-16">
									<h1
										className={`${serif} text-4xl text-foreground tracking-tight leading-[1.05]`}
									>
										We are here
										<br />
										<span className="italic text-foreground/60">to help.</span>
									</h1>
									<p className="text-sm text-muted-foreground leading-relaxed">
										Questions, bugs, or feedback? Send us a message and we will
										get back to you.
									</p>
								</div>
							</div>

							<h2 className="flex items-center gap-3 text-sm sm:text-[15px] font-mono text-foreground mb-4 sm:mb-5">
								QUICK HELP
								<span className="flex-1 h-px bg-foreground/15" />
							</h2>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
								{quickLinks.map(({ Icon, title, desc, href }) => (
									<Link
										key={title}
										href={href}
										className="group/card bg-background p-4 transition-colors hover:bg-muted/40"
									>
										<Icon className="mb-3 size-4 text-muted-foreground transition-colors group-hover/card:text-foreground" />
										<div className="text-[13px] font-medium text-foreground/90">
											{title}
										</div>
										<div className="text-[13px] leading-relaxed text-muted-foreground">
											{desc}
										</div>
									</Link>
								))}
							</div>

							<h2
								id="contact"
								className="flex items-center gap-3 text-sm sm:text-[15px] font-mono text-foreground mb-4 sm:mb-5"
							>
								CONTACT SUPPORT
								<span className="flex-1 h-px bg-foreground/15" />
							</h2>

							{/* Contact form */}
							<motion.div
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: 0.05 }}
							>
								<div className="relative overflow-hidden max-w-xl">
									<div className="py-4 sm:py-5">
										<Form {...form}>
											<form
												onSubmit={form.handleSubmit(onSubmit)}
												className="space-y-3.5"
											>
												{/* honeypot */}
												<div
													aria-hidden="true"
													className="absolute opacity-0 pointer-events-none h-0 overflow-hidden"
												>
													<input
														ref={hpRef}
														type="text"
														tabIndex={-1}
														autoComplete="off"
													/>
												</div>

												<FormField
													control={form.control}
													name="fullName"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-xs tracking-wider text-foreground/50 font-mono">
																Name
															</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	placeholder="Your name"
																	className="rounded-xl"
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name="email"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-xs tracking-wider text-foreground/50 font-mono">
																Email
															</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	type="email"
																	placeholder="name@email.com"
																	className="rounded-xl"
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name="topic"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-xs tracking-wider text-foreground/50 font-mono">
																Topic
															</FormLabel>
															<Select
																value={field.value}
																onValueChange={field.onChange}
															>
																<FormControl>
																	<SelectTrigger className="rounded-xl">
																		<SelectValue placeholder="Select" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent className="rounded-xl">
																	{topics.map((topic) => (
																		<SelectItem key={topic} value={topic}>
																			{topic}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name="description"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-xs tracking-wider text-foreground/50 font-mono">
																How can we help?
															</FormLabel>
															<FormControl>
																<Textarea
																	{...field}
																	rows={4}
																	placeholder="Describe what happened or what you need..."
																	className="min-h-[100px] rounded-xl"
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<Button
													disabled={form.formState.isSubmitting}
													type="submit"
													className="w-full rounded-xl font-mono uppercase tracking-widest"
												>
													{form.formState.isSubmitting
														? "Sending..."
														: "Send message"}
												</Button>
											</form>
										</Form>

										<p className="mt-4 text-foreground/50 text-xs leading-relaxed">
											By submitting, you agree to our{" "}
											<Link
												href="/legal/terms"
												className="underline hover:text-foreground/55"
											>
												Terms of Service
											</Link>{" "}
											and{" "}
											<Link
												href="/legal/privacy"
												className="underline hover:text-foreground/55"
											>
												Privacy Policy
											</Link>
											.
										</p>
									</div>
								</div>
							</motion.div>
						</div>
						<div className="mt-auto">
							<div className="lg:hidden">
								<Footer />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
