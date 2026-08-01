import { Hono } from 'hono';
import { db } from '../db/client';
import { sql } from 'drizzle-orm';

const health = new Hono();

health.get('/', async (c) => {
  const start = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    const latencyMs = Date.now() - start;
    return c.json({
      ok: true,
      latencyMs,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const latencyMs = Date.now() - start;
    return c.json({
      ok: false,
      latencyMs,
      timestamp: new Date().toISOString(),
      error: 'Database unreachable',
    }, 503);
  }
});

export default health;
