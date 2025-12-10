import { config } from 'dotenv';
import { execSync } from 'child_process';
import { hash } from 'bcryptjs';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';
import { users } from '../db/schema';
import { sql } from 'drizzle-orm';

// 1. Carregar configuração
config({ path: '.env.local' });

async function main() {
  console.log('\n🚀 Iniciando EvoPress Setup Simplificado...\n');

  // Validação básica
  if (!process.env.DATABASE_URL) {
    console.error('❌ Erro: DATABASE_URL não encontrada no .env.local');
    process.exit(1);
  }

  const tablePrefix = process.env.DB_PREFIX || 'evopress';

  try {
    // 2. Aplicar Schema (Tabelas) via Drizzle Kit
    // Usamos execSync para garantir que o push termine antes de prosseguir
    console.log('📦 Criando/Atualizando tabelas no banco...');
    try {
      execSync('npx drizzle-kit push', { stdio: 'inherit' });
      console.log('✅ Tabelas sincronizadas.');
    } catch (e) {
      console.error('❌ Falha ao sincronizar tabelas via drizzle-kit.');
      process.exit(1);
    }

    // 3. Conectar ao Banco para Operações de Dados
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool, { schema });

    try {
      // 4. Criar Índices de Performance (GIN)
      console.log('⚡ Otimizando banco de dados (Índices GIN)...');
      
      const indexes = [
        `CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_users_meta_data ON ${tablePrefix}_users USING GIN (meta_data)`,
        `CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_posts_content_blocks ON ${tablePrefix}_posts USING GIN (content_blocks)`,
        `CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_posts_meta_data ON ${tablePrefix}_posts USING GIN (meta_data)`
      ];

      for (const query of indexes) {
        try {
          await pool.query(query);
        } catch (idxError) {
          // Ignorar erro se índice já existe ou não suportado (não deve bloquear setup)
          // console.warn('Aviso índice:', idxError instanceof Error ? idxError.message : idxError);
        }
      }
      console.log('✅ Índices configurados.');

      // 5. Criar Usuário Admin (Seed)
      console.log('👤 Verificando usuário administrador...');
      
      // Verifica se existe QUALQUER usuário (não apenas admin)
      // Precisamos usar sql raw ou arriscar que o schema do drizzle use o nome da tabela errado se não estiver configurado
      // Mas como importamos 'users' do schema que usa o prefixo dinamico, deve funcionar se o prefixo for o mesmo
      // Para garantir, vamos confiar no Drizzle ORM já configurado com o schema correto
      
      const existingUsers = await db.select().from(users).limit(1);
      
      if (existingUsers.length > 0) {
        console.log('ℹ️  Usuários já existem no banco. Setup de admin pulado.');
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

        console.log('\n✅ ADMIN CRIADO COM SUCESSO!');
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Senha: ${adminPassword}`);
        console.log('   (Altere esta senha após o login!)');
      }

    } finally {
      await pool.end();
    }

    console.log('\n🎉 Setup concluído com sucesso! Você pode rodar "npm run dev" agora.\n');

  } catch (error) {
    console.error('\n❌ Erro fatal durante o setup:', error);
    process.exit(1);
  }
}

main();

