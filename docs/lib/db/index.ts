import { Database } from "@tursodatabase/database/compat";
import { drizzle } from "drizzle-orm/sqlite-proxy";

export const client = new Database(process.env.DATABASE_PATH ?? "./auth.db");

export const db = drizzle({
	async run(sql, params) {
		return client.prepare(sql).run(...params);
	},
	async get(sql, params, rowMode) {
		const row = client.prepare(sql).get(...params);
		if (row === undefined) return undefined;
		return rowMode === "array" ? Object.values(row) : row;
	},
	async all(sql, params, rowMode) {
		const rows = client.prepare(sql).all(...params);
		return rowMode === "array" ? rows.map((row) => Object.values(row)) : rows;
	},
});
