import { NextRequest } from 'next/server';

import { getReadingSettings, setReadingSettings, type ReadingSettings } from '@/core/services/settings.service';
import { verifyToken } from '@/core/utils/auth';
import { getSessionCookie } from '@/core/utils/cookies';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET() {
  try {
    const settings = await getReadingSettings();
    return formatJSONResponse(settings);
  } catch (error: any) {
    console.error('Erro ao buscar configurações de leitura:', error);
    
    if (error?.message) {
      return formatJSONResponse(
        { error: `Erro ao buscar configurações: ${error.message}` },
        { status: 500 }
      );
    }
    
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

    try {
      await setReadingSettings(body);
      const updatedSettings = await getReadingSettings();
      return formatJSONResponse(updatedSettings);
    } catch (dbError: any) {
      console.error('Erro ao salvar configurações no banco de dados:', dbError);
      
      // Mensagens de erro mais específicas
      if (dbError?.code === '23505') {
        return formatJSONResponse(
          { error: 'Configuração já existe. Tente atualizar ao invés de criar.' },
          { status: 409 }
        );
      }
      
      if (dbError?.code === '23503') {
        return formatJSONResponse(
          { error: 'Referência inválida. Verifique se a página selecionada existe.' },
          { status: 400 }
        );
      }
      
      if (dbError?.message) {
        return formatJSONResponse(
          { error: `Erro no banco de dados: ${dbError.message}` },
          { status: 500 }
        );
      }
      
      return formatJSONResponse(
        { error: 'Erro ao salvar configurações no banco de dados' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Erro geral ao processar requisição de configurações:', error);
    
    if (error instanceof SyntaxError) {
      return formatJSONResponse(
        { error: 'Formato de dados inválido' },
        { status: 400 }
      );
    }
    
    if (error?.message) {
      return formatJSONResponse(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return formatJSONResponse(
      { error: 'Erro ao salvar configurações de leitura' },
      { status: 500 }
    );
  }
}

