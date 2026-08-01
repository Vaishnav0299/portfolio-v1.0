import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { db } from '../db/client.js';
import { timeline } from '../db/schema.js';
import { timelineSchema } from '@portfolio/shared';
import { authMiddleware } from '../middleware/auth.js';

const timelineRouter = new Hono();

// ── PUBLIC: GET /api/timeline ────────────────────────────────────────────────
timelineRouter.get('/', async (c) => {
  const rows = await db.select().from(timeline).orderBy(timeline.sortOrder);
  return c.json({ success: true, data: rows });
});

// ── ADMIN: POST ──────────────────────────────────────────────────────────────
timelineRouter.post('/admin', authMiddleware, zValidator('json', timelineSchema), async (c) => {
  const body = c.req.valid('json');
  const [created] = await db.insert(timeline).values(body).returning();
  return c.json({ success: true, data: created }, 201);
});

// ── ADMIN: PUT ───────────────────────────────────────────────────────────────
timelineRouter.put('/admin/:id', authMiddleware, zValidator('json', timelineSchema.partial()), async (c) => {
  const idParam = c.req.param('id');
  const id = parseInt(idParam || '', 10);
  if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);

  const body = c.req.valid('json');
  const [updated] = await db
    .update(timeline)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(timeline.id, id))
    .returning();

  if (!updated) return c.json({ success: false, error: 'Timeline entry not found' }, 404);
  return c.json({ success: true, data: updated });
});

// ── ADMIN: DELETE ─────────────────────────────────────────────────────────────
timelineRouter.delete('/admin/:id', authMiddleware, async (c) => {
  const idParam = c.req.param('id');
  const id = parseInt(idParam || '', 10);
  if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);

  const [deleted] = await db
    .delete(timeline)
    .where(eq(timeline.id, id))
    .returning({ id: timeline.id });

  if (!deleted) return c.json({ success: false, error: 'Timeline entry not found' }, 404);
  return c.json({ success: true, message: `Timeline entry ${id} deleted` });
});

export default timelineRouter;
