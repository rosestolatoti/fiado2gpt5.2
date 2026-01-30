import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

let db: any = null;

if (process.env.DATABASE_URL) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  db = drizzle(pool, { schema });
} else {
  console.warn("⚠️  DATABASE_URL não definida. Usando armazenamento em memória para desenvolvimento.");
}

export { db };
