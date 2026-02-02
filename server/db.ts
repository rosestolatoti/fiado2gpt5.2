import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

export let db: any = null;
const databaseUrl = process.env.DATABASE_URL?.trim();

if (databaseUrl) {
  const useSsl = databaseUrl.includes("supabase.co");
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
  db = drizzle(pool, { schema });
} else {
  console.warn("⚠️  DATABASE_URL não definida. Usando armazenamento em memória para desenvolvimento.");
}

export const isDatabaseConnected = Boolean(db);
