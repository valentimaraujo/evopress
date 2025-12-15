import { NextRequest } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { isNull } from 'drizzle-orm';
import { formatJSONResponse } from '@/core/utils/format-json-response';

export async function GET(request: NextRequest) {
  try {
    const usersList = await db
      .select({
        uuid: users.uuid,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(isNull(users.deletedAt))
      .orderBy(users.name);

    return formatJSONResponse(usersList);
  } catch (error) {
    return formatJSONResponse(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}

