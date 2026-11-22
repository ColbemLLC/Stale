import { config } from "dotenv";
import { migrate } from "drizzle-orm/sqlite-proxy/migrator";

config({ path: [".env.local", ".env"] });

const { client, db } = await import("../lib/db");

await migrate(
	db,
	async (queries) => {
		for (const query of queries) {
			client.exec(query);
		}
	},
	{
		migrationsFolder: "./drizzle",
	},
);
