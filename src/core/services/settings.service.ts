import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { settings } from '@/db/schema';

export async function getSetting(key: string): Promise<unknown> {
  const [setting] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key))
    .limit(1);

  return setting?.value ?? null;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const existing = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(settings)
      .set({
        value: value as any,
        updatedAt: new Date(),
      })
      .where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({
      key,
      value: value as any,
    });
  }
}

export async function deleteSetting(key: string): Promise<void> {
  await db.delete(settings).where(eq(settings.key, key));
}

