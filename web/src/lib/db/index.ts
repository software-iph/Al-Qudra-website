import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  // Re-use one connection pool across hot reloads in development.
  var __alqudraSql: ReturnType<typeof postgres> | undefined;
}

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url && process.env.NEXT_PHASE !== "phase-production-build") {
    console.error("[alqudra] DATABASE_URL is not set - database queries will fail.");
  }
  // postgres() connects lazily, so importing this during `next build` (no database) is safe.
  return postgres(url ?? "postgres://missing-database-url@127.0.0.1:1/none", {
    max: 10,
    onnotice: () => {}, // hide harmless "already exists, skipping" notices from migrations
  });
}

const sql = globalThis.__alqudraSql ?? createClient();
globalThis.__alqudraSql = sql;

export const db = drizzle(sql, { schema });
export { schema };
