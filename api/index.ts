/**
 * Vercel Serverless Function Entry Point for the Hono API
 * ─────────────────────────────────────────────────────────
 * This file lives at the repo root /api/index.ts.
 * Vercel treats /api/*.ts as serverless functions automatically.
 *
 * All /api/* requests are rewritten here by vercel.json, and Hono
 * handles the internal routing by its basePath('/api') config.
 *
 * Runtime: Node.js (Edge compatible — swap 'hono/vercel' for 'hono/cloudflare-workers' if needed)
 */
import { handle } from 'hono/vercel';
import app from '../apps/api/src/index';

export const config = {
  runtime: 'nodejs20.x',
};

export default handle(app);
