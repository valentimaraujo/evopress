import { NextRequest } from 'next/server';

import { formatJSONResponse } from '@/core/utils/format-json-response';
import { getAvailableThemes, getActiveTheme, setActiveTheme, themeExists } from '@/core/services/themes.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';

export async function GET() {
  try {
    const themes = await getAvailableThemes();
    const activeTheme = await getActiveTheme();

    return formatJSONResponse({
      themes,
      activeTheme,
    });
  } catch (error: any) {
    return formatJSONResponse(
      { error: error.message || 'Erro ao listar temas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getSessionCookie();
    if (!token) {
      return formatJSONResponse(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) {
      return formatJSONResponse(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    if (payload.role !== 'admin') {
      return formatJSONResponse(
        { error: 'Acesso negado. Apenas administradores podem ativar temas.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { themeName } = body;

    if (!themeName || typeof themeName !== 'string') {
      return formatJSONResponse(
        { error: 'Nome do tema é obrigatório' },
        { status: 400 }
      );
    }

    const exists = await themeExists(themeName);
    if (!exists) {
      return formatJSONResponse(
        { error: 'Tema não encontrado' },
        { status: 404 }
      );
    }

    await setActiveTheme(themeName);

    return formatJSONResponse({
      message: 'Tema ativado com sucesso',
      activeTheme: themeName,
    });
  } catch (error: any) {
    return formatJSONResponse(
      { error: error.message || 'Erro ao ativar tema' },
      { status: 500 }
    );
  }
}

