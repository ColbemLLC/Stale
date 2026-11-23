import { config } from "dotenv";
import { migrate } from "drizzle-orm/libsql/migrator";

config({ path: [".env.local", ".env"] });

const { db } = await import("../lib/db");

await migrate(db, { migrationsFolder: "./drizzle" });
