import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { db } from '../db/client';
import { projects } from '../db/schema';
import { projectSchema } from '@portfolio/shared';
import { authMiddleware } from '../middleware/auth';

const projectsRouter = new Hono();

// ── PUBLIC: GET /api/projects ────────────────────────────────────────────────
projectsRouter.get('/', async (c) => {
  const rows = await db
    .select()
    .from(projects)
    .orderBy(projects.sortOrder);

  return c.json({ success: true, data: rows });
});

// ── PUBLIC: GET /api/projects/:id ───────────────────────────────────────────
projectsRouter.get('/:id', async (c) => {
  const idParam = c.req.param('id');
  const id = parseInt(idParam || '', 10);
  if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);

  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  if (!project) return c.json({ success: false, error: 'Project not found' }, 404);

  return c.json({ success: true, data: project });
});

// ── ADMIN: POST /api/admin/projects ─────────────────────────────────────────
projectsRouter.post('/admin', authMiddleware, zValidator('json', projectSchema), async (c) => {
  const body = c.req.valid('json');
  const [created] = await db.insert(projects).values(body).returning();
  return c.json({ success: true, data: created }, 201);
});

// ── ADMIN: PUT /api/admin/projects/:id ──────────────────────────────────────
projectsRouter.put('/admin/:id', authMiddleware, zValidator('json', projectSchema.partial()), async (c) => {
  const idParam = c.req.param('id');
  const id = parseInt(idParam || '', 10);
  if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);

  const body = c.req.valid('json');
  const [updated] = await db
    .update(projects)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();

  if (!updated) return c.json({ success: false, error: 'Project not found' }, 404);
  return c.json({ success: true, data: updated });
});

// ── ADMIN: DELETE /api/admin/projects/:id ───────────────────────────────────
projectsRouter.delete('/admin/:id', authMiddleware, async (c) => {
  const idParam = c.req.param('id');
  const id = parseInt(idParam || '', 10);
  if (isNaN(id)) return c.json({ success: false, error: 'Invalid ID' }, 400);

  const [deleted] = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning({ id: projects.id });

  if (!deleted) return c.json({ success: false, error: 'Project not found' }, 404);
  return c.json({ success: true, message: `Project ${id} deleted` });
});

export default projectsRouter;
