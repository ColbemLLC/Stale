import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

const socialProviders: NonNullable<BetterAuthOptions["socialProviders"]> = {};
const disableSignUp = process.env.DISABLE_SIGN_UP === "true";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (googleClientId && googleClientSecret) {
	socialProviders.google = {
		clientId: googleClientId,
		clientSecret: googleClientSecret,
		disableSignUp,
	};
}

const appleClientId = process.env.APPLE_CLIENT_ID;
const appleClientSecret = process.env.APPLE_CLIENT_SECRET;
if (appleClientId && appleClientSecret) {
	socialProviders.apple = {
		clientId: appleClientId,
		clientSecret: appleClientSecret,
		disableSignUp,
	};
}

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
if (githubClientId && githubClientSecret) {
	socialProviders.github = {
		clientId: githubClientId,
		clientSecret: githubClientSecret,
		disableSignUp,
	};
}

export const auth = betterAuth({
	baseURL:
		process.env.BETTER_AUTH_URL ??
		process.env.NEXT_PUBLIC_URL ??
		"http://192.168.8.41:4000/",
	secret: process.env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
		disableSignUp,
	},
	socialProviders,
});
