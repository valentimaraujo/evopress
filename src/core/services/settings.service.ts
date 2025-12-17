import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { settings } from '@/db/schema';

export interface ReadingSettings {
  homepageType: 'posts' | 'page';
  homepagePage: string | null;
  postsPage: string | null;
}

export async function getSetting(key: string): Promise<unknown> {
  try {
    const [setting] = await db
      .select({
        uuid: settings.uuid,
        key: settings.key,
        value: settings.value,
        createdAt: settings.createdAt,
        updatedAt: settings.updatedAt,
      })
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    return setting?.value ?? null;
  } catch (error) {
    console.error(`Erro ao buscar setting "${key}":`, error);
    throw error;
  }
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const existing = await db
    .select({
      uuid: settings.uuid,
      key: settings.key,
      value: settings.value,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    })
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export async function deleteSetting(key: string): Promise<void> {
  await db.delete(settings).where(eq(settings.key, key));
}

export async function getReadingSettings(): Promise<ReadingSettings> {
  try {
    const homepageType = (await getSetting('homepage_type')) as 'posts' | 'page' | null;
    const homepagePage = (await getSetting('homepage_page')) as string | null;
    const postsPage = (await getSetting('posts_page')) as string | null;

    return {
      homepageType: homepageType || 'posts',
      homepagePage: homepagePage || null,
      postsPage: postsPage || null,
    };
  } catch (error) {
    console.error('Erro ao buscar configurações de leitura:', error);
    // Retorna valores padrão em caso de erro
    return {
      homepageType: 'posts',
      homepagePage: null,
      postsPage: null,
    };
  }
}

export async function setReadingSettings(
  readingSettings: ReadingSettings
): Promise<void> {
  try {
    await setSetting('homepage_type', readingSettings.homepageType);
  } catch (error) {
    console.error('Erro ao salvar homepage_type:', error);
    throw new Error('Erro ao salvar tipo de homepage');
  }

  try {
    await setSetting('homepage_page', readingSettings.homepagePage);
  } catch (error) {
    console.error('Erro ao salvar homepage_page:', error);
    throw new Error('Erro ao salvar página inicial');
  }

  try {
    await setSetting('posts_page', readingSettings.postsPage);
  } catch (error) {
    console.error('Erro ao salvar posts_page:', error);
    throw new Error('Erro ao salvar página de posts');
  }
}

