import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db } from '../db/client';
import { bio } from '../db/schema';
import { bioSchema } from '@portfolio/shared';
import { authMiddleware } from '../middleware/auth';
import { sql } from 'drizzle-orm';

const bioRouter = new Hono();

// ── PUBLIC: GET /api/bio ─────────────────────────────────────────────────────
bioRouter.get('/', async (c) => {
  const [row] = await db.select().from(bio).limit(1);
  if (!row) return c.json({ success: false, error: 'Bio not found' }, 404);
  return c.json({ success: true, data: row });
});

// ── ADMIN: PUT /api/admin/bio ─────────────────────────────────────────────────
bioRouter.put('/admin', authMiddleware, zValidator('json', bioSchema), async (c) => {
  const body = c.req.valid('json');

  // Bio is a single row — upsert pattern
  await db.execute(sql`TRUNCATE TABLE bio RESTART IDENTITY`);
  const [updated] = await db.insert(bio).values(body).returning();

  return c.json({ success: true, data: updated });
});

export default bioRouter;
