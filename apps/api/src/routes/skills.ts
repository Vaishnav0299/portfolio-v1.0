import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { db } from '../db/client';
import { skills } from '../db/schema';
import { skillSchema } from '@portfolio/shared';
import { authMiddleware } from '../middleware/auth';

const skillsRouter = new Hono();

// ── PUBLIC: GET /api/skills ──────────────────────────────────────────────────
skillsRouter.get('/', async (c) => {
  const rows = await db.select().from(skills).orderBy(skills.sortOrder);
  return c.json({ success: true, data: rows });
});

// ── ADMIN: POST /api/admin/skills ────────────────────────────────────────────
skillsRouter.post('/admin', authMiddleware, zValidator('json', skillSchema), async (c) => {
  const body = c.req.valid('json');
  const [created] = await db.insert(skills).values(body).returning();
  return c.json({ success: true, data: created }, 201);
});

// ── ADMIN: PUT /api/admin/skills/:id ─────────────────────────────────────────
skillsRouter.put('/admin/:id', authMiddleware, zValidator('json', skillSchema.partial()), async (c) => {
  const idParam = c.req.param('id');
  const id = parseInt(idParam || '', 10);
  if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);

  const body = c.req.valid('json');
  const [updated] = await db
    .update(skills)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(skills.id, id))
    .returning();

  if (!updated) return c.json({ success: false, error: 'Skill not found' }, 404);
  return c.json({ success: true, data: updated });
});

// ── ADMIN: DELETE /api/admin/skills/:id ──────────────────────────────────────
skillsRouter.delete('/admin/:id', authMiddleware, async (c) => {
  const idParam = c.req.param('id');
  const id = parseInt(idParam || '', 10);
  if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);

  const [deleted] = await db
    .delete(skills)
    .where(eq(skills.id, id))
    .returning({ id: skills.id });

  if (!deleted) return c.json({ success: false, error: 'Skill not found' }, 404);
  return c.json({ success: true, message: `Skill ${id} deleted` });
});

export default skillsRouter;
