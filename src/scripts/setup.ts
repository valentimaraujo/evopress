import { hash } from 'bcryptjs';
import { execSync } from 'child_process';
import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '../db/schema';
import { users, settings } from '../db/schema';

// 1. Carregar configuração
config({ path: '.env.local' });

async function main() {
  console.log('\nIniciando EvoPress Setup Simplificado...\n');

  // Validação básica
  if (!process.env.DATABASE_URL) {
    console.error('Erro: DATABASE_URL não encontrada no .env.local');
    process.exit(1);
  }

  const tablePrefix = process.env.DB_PREFIX || 'evopress';

  try {
    // 2. Aplicar Schema (Tabelas) via Drizzle Kit
    // Usamos execSync para garantir que o push termine antes de prosseguir
    // Cria/atualiza todas as tabelas definidas no schema:
    // - users, posts, media (tabelas base)
    // - menus, menu_items (sistema de menus)
    // - settings (configurações do sistema)
    console.log('Criando/Atualizando tabelas no banco...');
    console.log('   Tabelas a serem criadas/atualizadas:');
    console.log('   - evopress_users');
    console.log('   - evopress_posts');
    console.log('   - evopress_media');
    console.log('   - evopress_menus (nova)');
    console.log('   - evopress_menu_items (nova)');
    console.log('   - evopress_settings (nova)');
    try {
      execSync('npx drizzle-kit push', { stdio: 'inherit' });
      console.log('Tabelas sincronizadas com sucesso.');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Falha ao sincronizar tabelas via drizzle-kit.');
      console.error('   Erro:', errorMessage);
      console.error('   Verifique se o DATABASE_URL está correto no .env.local');
      console.error('   Se as dependências já estão instaladas, tente: npm run setup:skip-install');
      process.exit(1);
    }

    // 3. Conectar ao Banco para Operações de Dados
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool, { schema });

    try {
      // 4. Criar Índices de Performance (GIN)
      // Índices GIN são otimizados para busca em campos JSONB
      console.log('Otimizando banco de dados (Índices GIN)...');
      
      const indexes = [
        // Índices para campos JSONB
        `CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_users_meta_data ON ${tablePrefix}_users USING GIN (meta_data)`,
        `CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_posts_content_blocks ON ${tablePrefix}_posts USING GIN (content_blocks)`, // eslint-disable-line max-len
        `CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_posts_meta_data ON ${tablePrefix}_posts USING GIN (meta_data)`,
        `CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_settings_value ON ${tablePrefix}_settings USING GIN (value)`
      ];

      for (const query of indexes) {
        try {
          await pool.query(query);
        } catch {
          // Ignorar erro se índice já existe ou não suportado (não deve bloquear setup)
        }
      }
      console.log('Índices configurados.');

      // 5. Criar Usuário Admin (Seed)
      console.log('Verificando usuário administrador...');
      
      // Verifica se existe QUALQUER usuário (não apenas admin)
      // Precisamos usar sql raw ou arriscar que o schema do drizzle use o nome da tabela errado
      // se não estiver configurado. Mas como importamos 'users' do schema que usa o prefixo
      // dinamico, deve funcionar se o prefixo for o mesmo. Para garantir, vamos confiar no
      // Drizzle ORM já configurado com o schema correto
      
      const existingUsers = await db.select().from(users).limit(1);
      
      if (existingUsers.length > 0) {
        console.log('Usuários já existem no banco. Setup de admin pulado.');
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

        console.log('\nADMIN CRIADO COM SUCESSO!');
        console.log(`   Email: ${adminEmail}`);
        console.log('   (Altere a senha após o primeiro login!)');
      }

      // 6. Inicializar Tema Ativo
      console.log('Verificando tema ativo...');
      const existingTheme = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'active_theme'))
        .limit(1);

      if (existingTheme.length === 0) {
        await db.insert(settings).values({
          key: 'active_theme',
          value: 'base',
        });
        console.log('Tema ativo inicializado: base');
      } else {
        console.log('Tema ativo já configurado.');
      }

    } finally {
      await pool.end();
    }

    console.log('\nSetup concluído com sucesso! Você pode rodar "npm run dev" agora.\n');

  } catch (error) {
    console.error('\nErro fatal durante o setup:', error);
    process.exit(1);
  }
}

main();

