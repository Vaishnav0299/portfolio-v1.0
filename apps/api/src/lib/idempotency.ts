import { db } from '../db/client';
import { syncLog } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Checks if an operation has already been applied.
 * Returns true if the operation_id exists in sync_log (already processed).
 *
 * This is the core of the idempotency system:
 * - Client assigns a UUID v4 to every write operation
 * - Before processing, we check if that UUID is in sync_log
 * - After processing, we insert the UUID into sync_log
 * - On retry, the duplicate is skipped automatically
 */
export async function checkIdempotency(operationId: string): Promise<boolean> {
  const [existing] = await db
    .select({ operationId: syncLog.operationId })
    .from(syncLog)
    .where(eq(syncLog.operationId, operationId))
    .limit(1);

  return !!existing;
}

/**
 * Records a successfully applied operation to prevent future duplicates.
 */
export async function recordOperation(
  operationId: string,
  url: string,
  method: string
): Promise<void> {
  await db.insert(syncLog).values({ operationId, url, method });
}
