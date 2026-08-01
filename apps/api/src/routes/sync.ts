import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { syncBatchSchema } from '@portfolio/shared';
import { authMiddleware } from '../middleware/auth';
import { checkIdempotency, recordOperation } from '../lib/idempotency';
import { db } from '../db/client';
import { projects, skills, timeline } from '../db/schema';
import { eq } from 'drizzle-orm';

const sync = new Hono();

/**
 * POST /api/sync
 * Batch endpoint for flushing the offline sync queue.
 * Each operation is checked for idempotency before processing.
 * Safe to call multiple times — duplicate operation_ids are skipped.
 */
sync.post('/', authMiddleware, zValidator('json', syncBatchSchema), async (c) => {
  const { operations } = c.req.valid('json');
  const results: Array<{ operationId: string; status: 'applied' | 'skipped' | 'error'; error?: string }> = [];

  for (const op of operations) {
    // Check idempotency: skip if already applied
    const alreadyApplied = await checkIdempotency(op.operationId);
    if (alreadyApplied) {
      results.push({ operationId: op.operationId, status: 'skipped' });
      continue;
    }

    try {
      await applyOperation(op.method, op.url, op.body);
      await recordOperation(op.operationId, op.url, op.method);
      results.push({ operationId: op.operationId, status: 'applied' });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error(`[Sync] Operation ${op.operationId} failed:`, errMsg);
      results.push({ operationId: op.operationId, status: 'error', error: errMsg });
    }
  }

  const applied = results.filter(r => r.status === 'applied').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const errors  = results.filter(r => r.status === 'error').length;

  return c.json({
    success: true,
    summary: { total: operations.length, applied, skipped, errors },
    results,
  });
});

/**
 * Applies a queued write operation by dispatching on URL pattern + HTTP method.
 * Mirrors the logic in individual route handlers.
 */
async function applyOperation(method: string, url: string, body: unknown) {
  const urlObj = new URL(`http://localhost${url}`);
  const pathname = urlObj.pathname;

  // /api/admin/projects[/:id]
  const projectMatch = pathname.match(/^\/api\/admin\/projects(?:\/(\d+))?$/);
  if (projectMatch) {
    const id = projectMatch[1] ? parseInt(projectMatch[1], 10) : null;
    if (method === 'POST')   { await db.insert(projects).values(body as any); return; }
    if (method === 'PUT' && id)    { await db.update(projects).set(body as any).where(eq(projects.id, id)); return; }
    if (method === 'DELETE' && id) { await db.delete(projects).where(eq(projects.id, id)); return; }
  }

  // /api/admin/skills[/:id]
  const skillMatch = pathname.match(/^\/api\/admin\/skills(?:\/(\d+))?$/);
  if (skillMatch) {
    const id = skillMatch[1] ? parseInt(skillMatch[1], 10) : null;
    if (method === 'POST')   { await db.insert(skills).values(body as any); return; }
    if (method === 'PUT' && id)    { await db.update(skills).set(body as any).where(eq(skills.id, id)); return; }
    if (method === 'DELETE' && id) { await db.delete(skills).where(eq(skills.id, id)); return; }
  }

  // /api/admin/timeline[/:id]
  const timelineMatch = pathname.match(/^\/api\/admin\/timeline(?:\/(\d+))?$/);
  if (timelineMatch) {
    const id = timelineMatch[1] ? parseInt(timelineMatch[1], 10) : null;
    if (method === 'POST')   { await db.insert(timeline).values(body as any); return; }
    if (method === 'PUT' && id)    { await db.update(timeline).set(body as any).where(eq(timeline.id, id)); return; }
    if (method === 'DELETE' && id) { await db.delete(timeline).where(eq(timeline.id, id)); return; }
  }

  throw new Error(`Unsupported sync operation: ${method} ${pathname}`);
}

export default sync;
