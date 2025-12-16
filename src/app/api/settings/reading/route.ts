import { NextRequest } from 'next/server';

import { getReadingSettings, setReadingSettings, type ReadingSettings } from '@/core/services/settings.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET() {
  try {
    const settings = await getReadingSettings();
    return formatJSONResponse(settings);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao buscar configurações de leitura' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getSessionCookie();
    if (!token) {
      return formatJSONResponse({ error: 'Não autorizado' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.sub) {
      return formatJSONResponse({ error: 'Token inválido' }, { status: 401 });
    }

    const body = await request.json() as ReadingSettings;

    if (!body.homepageType || !['posts', 'page'].includes(body.homepageType)) {
      return formatJSONResponse(
        { error: 'Tipo de homepage inválido' },
        { status: 400 }
      );
    }

    if (body.homepageType === 'page' && !body.homepagePage) {
      return formatJSONResponse(
        { error: 'Página inicial é obrigatória quando o tipo é "página estática"' },
        { status: 400 }
      );
    }

    await setReadingSettings(body, payload.sub);
    const updatedSettings = await getReadingSettings();

    return formatJSONResponse(updatedSettings);
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao salvar configurações de leitura' },
      { status: 500 }
    );
  }
}

