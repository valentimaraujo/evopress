import { isNull } from 'drizzle-orm';

import { formatJSONResponse } from '@/core/utils/format-json-response';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function GET() {
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
  } catch {
    return formatJSONResponse(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}

