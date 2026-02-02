import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../shared/schema.js";

export let db: any = null;
const resolveEnv = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) {
      return value.trim();
    }
  }
  return "";
};
const databaseUrl = resolveEnv("DATABASE_URL", "URL_DO_BANCO_DE_DADOS", "DATABASEURL");

if (databaseUrl) {
  const useSsl = databaseUrl.includes("supabase.co");
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
  db = drizzle(pool, { schema });
} else {
  console.warn("⚠️  DATABASE_URL não definida. Usando armazenamento em memória para desenvolvimento.");
}

export const isDatabaseConnected = Boolean(db);
