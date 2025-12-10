import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Carregar .env.local explicitamente
config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    '❌ DATABASE_URL não encontrada!\n' +
    'Por favor, crie o arquivo .env.local na raiz do projeto com:\n' +
    'DATABASE_URL="postgres://usuario:senha@host:5432/nome_do_banco"'
  );
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});

