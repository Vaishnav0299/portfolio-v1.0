/**
 * Vercel Serverless Function Entry Point for the Hono API
 * ─────────────────────────────────────────────────────────
 * This file lives at the repo root /api/index.ts.
 * Vercel treats /api/*.ts as serverless functions automatically.
 *
 * All /api/* requests are rewritten here by vercel.json, and Hono
 * handles the internal routing by its basePath('/api') config.
 */
import { handle } from 'hono/vercel';
import app from '../apps/api/src/index';

export const config = {
  runtime: 'nodejs20.x',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default handle(app as any);
