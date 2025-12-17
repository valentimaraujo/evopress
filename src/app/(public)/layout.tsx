import React from 'react';

import { getActiveTheme } from '@/core/services/themes.service';
import { loadThemeComponent } from '@/core/utils/theme-loader';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const activeTheme = await getActiveTheme();
  const themeModule = await loadThemeComponent('Layout', activeTheme);
  const Layout = themeModule.Layout || themeModule.default;

  if (!Layout) {
    throw new Error(`Componente Layout não encontrado no tema ${activeTheme}`);
  }

  return <Layout>{children}</Layout>;
}

