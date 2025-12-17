import { getActiveTheme } from '@/core/services/themes.service';

const DEFAULT_THEME = 'base';

interface ThemeModule {
  Layout?: React.ComponentType<any>;
  default?: React.ComponentType<any>;
  [key: string]: unknown;
}

interface ComponentCache {
  [key: string]: ThemeModule;
}

const componentCache: ComponentCache = {};

export async function loadThemeComponent(
  componentName: string,
  themeName?: string
): Promise<ThemeModule> {
  const activeTheme = themeName || (await getActiveTheme());
  const cacheKey = `${activeTheme}:${componentName}`;

  if (componentCache[cacheKey]) {
    return componentCache[cacheKey];
  }

  try {
    const component = await import(`@/themes/${activeTheme}/components/${componentName}`);
    componentCache[cacheKey] = component;
    return component;
  } catch {
    if (activeTheme !== DEFAULT_THEME) {
      try {
        const component = await import(`@/themes/${DEFAULT_THEME}/components/${componentName}`);
        componentCache[`${DEFAULT_THEME}:${componentName}`] = component;
        return component;
      } catch {
        throw new Error(
          `Componente ${componentName} não encontrado no tema ${activeTheme} nem no tema base`
        );
      }
    }
    throw new Error(`Componente ${componentName} não encontrado no tema base`);
  }
}


