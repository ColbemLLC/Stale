import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: [".env.local", ".env"] });

export default defineConfig({
	dialect: "sqlite",
	schema: "./lib/db/schema.ts",
	out: "./drizzle",
	dbCredentials: {
		url: process.env.DATABASE_PATH ?? "./auth.db",
	},
});
