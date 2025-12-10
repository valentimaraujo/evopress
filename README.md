# EvoPress

EvoPress é um CMS moderno, construído com Next.js 16, Drizzle ORM e arquitetura Headless/BFF, desenhado para ser uma alternativa robusta e escalável ao WordPress.

## 🚀 Como Começar (Instalação Rápida)

Siga os passos abaixo para rodar o projeto localmente.

### 1. Pré-requisitos
- Node.js 18+
- Banco de Dados PostgreSQL (Supabase, Neon, Docker ou Local)

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/evopress.git
cd evopress
npm install
```

### 3. Configuração do Banco de Dados

Crie um arquivo `.env.local` na raiz do projeto e adicione a URL de conexão do seu Postgres:

```env
# Conexão com o Banco de Dados (OBRIGATÓRIO)
DATABASE_URL="postgres://usuario:senha@localhost:5432/nome_do_banco"

# Opcional: Prefixo das tabelas (Padrão: evopress)
DB_PREFIX="evopress"

# Opcional: Credenciais do Admin Inicial (Padrão: admin@evopress.local / admin123)
ADMIN_EMAIL="admin@evopress.local"
ADMIN_PASSWORD="admin123"
ADMIN_NAME="Admin User"
```

### 4. Setup Completo (Instalação Automática)

Execute o comando de setup que faz **tudo automaticamente**:
- Cria as tabelas no banco de dados
- Adiciona índices de performance (GIN)
- Cria o usuário admin inicial

```bash
npm run setup
```

**Usuário Admin criado:**
- Email: Configurado via `ADMIN_EMAIL` (padrão: `admin@evopress.local`)
- Senha: Configurado via `ADMIN_PASSWORD` (padrão: `admin123`)

> ⚠️ **Importante:** Configure `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `.env.local` antes do setup, ou altere a senha após o primeiro login!

### 5. Rodar o Projeto

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse **http://localhost:3000**.

---

## 🛠️ Comandos Úteis

- `npm run setup`: **Setup completo** (instala deps + cria banco + seed inicial)
- `npm run db:push`: Sincroniza o schema com o banco (cria/atualiza tabelas)
- `npm run db:seed`: Cria usuário admin e índices GIN
- `npm run db:generate`: Gera arquivos SQL de migration baseados no schema
- `npm run db:migrate`: Aplica as migrations pendentes
- `npm run db:studio`: Abre o Drizzle Studio para visualizar/editar o banco
- `npm run lint`: Verifica a qualidade do código

## 🏗️ Arquitetura

O projeto segue uma arquitetura Modular Monolith:

- `src/core`: Lógica de negócio, serviços e tipos compartilhados.
- `src/admin`: Interface administrativa.
- `src/theme`: Componentes de renderização do site público.
- `src/db`: Schema e configuração do banco de dados (Drizzle).

## 📄 Licença

MIT
