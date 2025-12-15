import { hash } from 'bcryptjs';
import { config } from 'dotenv';

import { db, pool } from './index';
import { users } from './schema';

config({ path: '.env.local' });

async function setup() {
  console.log('Iniciando Setup do EvoPress...');

  if (!process.env.DATABASE_URL) {
    console.error('Erro: DATABASE_URL não encontrada no arquivo .env.local');
    process.exit(1);
  }

  const tablePrefix = process.env.DB_PREFIX || 'evopress';

  try {
    console.log('Configurando índices de performance...');
    
    const indexes = [
      `CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_users_meta_data ON ${tablePrefix}_users USING GIN (meta_data)`,
      `CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_posts_content_blocks ON ${tablePrefix}_posts USING GIN (content_blocks)`, // eslint-disable-line max-len
      `CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_posts_meta_data ON ${tablePrefix}_posts USING GIN (meta_data)`
    ];

    for (const query of indexes) {
      try {
        await pool.query(query);
      } catch {
        // Ignora erro se índice já existe
      }
    }
    console.log('Índices configurados.');

    console.log('Verificando usuário administrador...');
    
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log('Usuários já existem. Pula criação de admin.');
    } else {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@evopress.local';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const adminName = process.env.ADMIN_NAME || 'Admin User';
      const passwordHash = await hash(adminPassword, 10);

      await db.insert(users).values({
        name: adminName,
        email: adminEmail,
        passwordHash: passwordHash,
        role: 'admin',
        metaData: { bio: 'Super Admin do Sistema' },
      });

      console.log('Usuário Admin criado com sucesso:');
      console.log(`Email: ${adminEmail}`);
      console.log('(Altere a senha após o primeiro login!)');
    }

    console.log('Setup concluído com sucesso.');

  } catch (error) {
    console.error('Erro durante o setup:', error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

setup();
