import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { settings } from '@/db/schema';

export interface ReadingSettings {
  homepageType: 'posts' | 'page';
  homepagePage?: string | null;
  postsPage?: string | null;
}

export async function getSetting(key: string): Promise<unknown | null> {
  const [setting] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key))
    .limit(1);

  return setting?.value || null;
}

export async function setSetting(key: string, value: unknown, userId?: string): Promise<void> {
  const existing = await getSetting(key);

  if (existing !== null) {
    await db
      .update(settings)
      .set({
        value: value as Record<string, unknown>,
        updatedBy: userId || null,
        updatedAt: new Date(),
      })
      .where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({
      key,
      value: value as Record<string, unknown>,
      updatedBy: userId || null,
      updatedAt: new Date(),
    });
  }
}

export async function getReadingSettings(): Promise<ReadingSettings> {
  const homepageType = (await getSetting('reading.homepage_type')) as 'posts' | 'page' | null;
  const homepagePage = (await getSetting('reading.homepage_page')) as string | null;
  const postsPage = (await getSetting('reading.posts_page')) as string | null;

  return {
    homepageType: homepageType || 'posts',
    homepagePage: homepagePage || null,
    postsPage: postsPage || null,
  };
}

export async function setReadingSettings(
  params: ReadingSettings,
  userId?: string
): Promise<void> {
  await setSetting('reading.homepage_type', params.homepageType, userId);
  
  if (params.homepageType === 'page') {
    await setSetting('reading.homepage_page', params.homepagePage || null, userId);
  } else {
    await setSetting('reading.homepage_page', null, userId);
  }

  await setSetting('reading.posts_page', params.postsPage || null, userId);
}

