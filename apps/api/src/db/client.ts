import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema.js';

// Load root .env file in local dev if process.env.DATABASE_URL is not set
if (!process.env.DATABASE_URL) {
  try {
    const { config } = await import('dotenv');
    const path = await import('node:path');
    config({ path: path.resolve(process.cwd(), '../../.env') });
    config({ path: path.resolve(process.cwd(), '.env') });
  } catch {
    // dotenv optional in production (env vars provided natively by Vercel)
  }
}

// Fallback connection string prevents top-level module evaluation crashes during build tracing
const connectionString = process.env.DATABASE_URL || 'postgres://placeholder:placeholder@localhost:5432/placeholder';

const client = postgres(connectionString, {
  max: 1,                  // Vercel serverless: single connection per invocation
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,          // Required for Supabase PgBouncer in transaction mode
  ssl: 'require',          // Explicit SSL mode for Supabase pooled cloud connection
});

export const db = drizzle(client, { schema });
export type Database = typeof db;
