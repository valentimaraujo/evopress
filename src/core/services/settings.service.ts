import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { settings } from '@/db/schema';

export interface ReadingSettings {
  homepageType: 'posts' | 'page';
  homepagePage: string | null;
  postsPage: string | null;
}

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

export async function getReadingSettings(): Promise<ReadingSettings> {
  const homepageType = (await getSetting('homepage_type')) as 'posts' | 'page' | null;
  const homepagePage = (await getSetting('homepage_page')) as string | null;
  const postsPage = (await getSetting('posts_page')) as string | null;

  return {
    homepageType: homepageType || 'posts',
    homepagePage: homepagePage || null,
    postsPage: postsPage || null,
  };
}

export async function setReadingSettings(
  readingSettings: ReadingSettings
): Promise<void> {
  await setSetting('homepage_type', readingSettings.homepageType);
  await setSetting('homepage_page', readingSettings.homepagePage);
  await setSetting('posts_page', readingSettings.postsPage);
}

