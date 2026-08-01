import { config } from 'dotenv';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema.js';

// Load root .env file if process.env.DATABASE_URL is not set
config({ path: path.resolve(process.cwd(), '../../.env') });
config({ path: path.resolve(process.cwd(), '.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Supabase PostgreSQL connection via postgres.js
// Connection pooling is handled by Supabase's PgBouncer on port 6543
// For serverless (Vercel), disable prepared statements
const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString, {
  max: 1,                  // Vercel serverless: single connection per invocation
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,          // Required for Supabase PgBouncer in transaction mode
});

export const db = drizzle(client, { schema });
export type Database = typeof db;
