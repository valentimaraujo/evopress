import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { getSetting, setSetting } from './settings.service';

export interface ThemeMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
}

const THEMES_DIR = join(process.cwd(), 'src', 'themes');
const DEFAULT_THEME = 'base';

export async function getActiveTheme(): Promise<string> {
  try {
    const theme = await getSetting('active_theme');
    if (theme && typeof theme === 'string') {
      return theme;
    }
  } catch {
    // Se não encontrar, retorna tema padrão
  }
  return DEFAULT_THEME;
}

export async function setActiveTheme(themeName: string): Promise<void> {
  await setSetting('active_theme', themeName);
}

export async function getThemePath(themeName: string): Promise<string> {
  return join(THEMES_DIR, themeName);
}

export async function getThemeMetadata(themeName: string): Promise<ThemeMetadata | null> {
  try {
    const themePath = await getThemePath(themeName);
    const themeJsonPath = join(themePath, 'theme.json');
    
    const fileContent = await readFile(themeJsonPath, 'utf-8');
    const metadata = JSON.parse(fileContent) as ThemeMetadata;
    
    return metadata;
  } catch {
    return null;
  }
}

export async function getAvailableThemes(): Promise<Array<{ name: string; metadata: ThemeMetadata | null }>> {
  try {
    const themesDir = THEMES_DIR;
    const entries = await readdir(themesDir, { withFileTypes: true });
    
    const themes = await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const metadata = await getThemeMetadata(entry.name);
          return {
            name: entry.name,
            metadata,
          };
        })
    );
    
    return themes;
  } catch {
    return [{ name: DEFAULT_THEME, metadata: await getThemeMetadata(DEFAULT_THEME) }];
  }
}

export async function themeExists(themeName: string): Promise<boolean> {
  try {
    const themes = await getAvailableThemes();
    return themes.some((theme) => theme.name === themeName);
  } catch {
    return false;
  }
}

