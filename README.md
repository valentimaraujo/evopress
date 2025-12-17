# EvoPress

**Versão:** 1.0.0

EvoPress é um CMS moderno, construído com Next.js 16, Drizzle ORM e arquitetura Headless/BFF, desenhado para ser uma alternativa robusta e escalável ao WordPress.

## Características Principais

- **Sistema de Posts e Páginas**: Gerenciamento completo de conteúdo com posts e páginas estáticas
- **Editor Visual com Blocos**: Editor de blocos (block builder) para criar layouts ricos e flexíveis
- **Sistema de Menus Dinâmico**: Criação e gerenciamento de menus com hierarquia e arrastar-e-soltar
- **Gerenciamento de Mídia**: Upload e organização de arquivos de mídia
- **Sistema de Temas Personalizáveis**: Suporte a múltiplos temas com fácil customização
- **Configurações de Leitura**: Defina página inicial estática ou lista de posts recentes
- **Autenticação JWT**: Sistema de autenticação seguro com tokens JWT
- **SEO Integrado**: Campos dedicados para título, descrição e palavras-chave SEO em cada conteúdo

## Stack Tecnológica

- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Drizzle ORM** - ORM type-safe para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **TailwindCSS 4** - Framework de estilização
- **Formik + Yup** - Gerenciamento e validação de formulários
- **Tiptap** - Editor de texto rico (WYSIWYG)
- **DND Kit** - Biblioteca para drag and drop
- **SweetAlert2** - Notificações e diálogos elegantes

## Como Começar (Instalação Rápida)

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

# Autenticação JWT (OBRIGATÓRIO para produção)
JWT_SECRET="seu-secret-jwt-super-seguro-aqui"

# Opcional: URL base do site (para produção)
NEXT_PUBLIC_SITE_URL="https://seusite.com.br"
```

### 4. Setup do Projeto

Execute o comando de setup para configurar o banco de dados:
- Cria/atualiza todas as tabelas no banco de dados
- Adiciona índices de performance (GIN) para campos JSONB
- Cria o usuário admin inicial

```bash
npm run setup
```

**Nota:** O comando `npm run setup` assume que as dependências já estão instaladas. Para instalação completa incluindo dependências, use:

```bash
npm run setup:init
```

**Tabelas criadas:**
- `evopress_users` - Usuários do sistema
- `evopress_posts` - Posts e páginas
- `evopress_media` - Arquivos de mídia
- `evopress_menus` - Menus do sistema
- `evopress_menu_items` - Itens dos menus
- `evopress_settings` - Configurações do sistema

**Usuário Admin criado:**
- Email: Configurado via `ADMIN_EMAIL` (padrão: `admin@evopress.local`)
- Senha: Configurado via `ADMIN_PASSWORD` (padrão: `admin123`)

> **Importante:** Configure `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `.env.local` antes do setup, ou altere a senha após o primeiro login!

### 5. Rodar o Projeto

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse **http://localhost:3000**.

### 6. Acessar o Admin

Após o setup, acesse o painel administrativo:

- **URL:** `http://localhost:3000/admin/login`
- **Credenciais:** Use o email e senha configurados no `.env.local` (ou os padrões)

## Rotas Disponíveis

### Rotas Públicas
- `/` - Página inicial (renderiza conforme configurações de leitura)
- `/post/[slug]` - Visualização de post individual
- `/page/[slug]` - Visualização de página estática

### Rotas Administrativas (Protegidas)
- `/admin/login` - Login do administrador
- `/admin` - Dashboard administrativo
- `/admin/posts` - Gerenciamento de posts
- `/admin/pages` - Gerenciamento de páginas
- `/admin/menus` - Gerenciamento de menus
- `/admin/settings/themes` - Configurações de temas
- `/admin/settings/reading` - Configurações de leitura (homepage, página de posts)

## Sistema de Temas

O EvoPress suporta múltiplos temas que podem ser instalados e ativados através do painel administrativo.

### Estrutura de Temas

Os temas são armazenados em `src/themes/[nome-do-tema]/` e devem conter:

- `components/` - Componentes React do tema (Layout, Menu, Footer, etc.)
- Arquivos de configuração específicos do tema

### Tema Base

O projeto inclui um tema base (`base`) que serve como referência e fallback. Este tema contém todos os componentes necessários para funcionamento básico do sistema.

### Gerenciar Temas

- Acesse `/admin/settings/themes` para ver todos os temas disponíveis
- Clique em "Ativar Tema" para definir um tema como ativo
- O tema ativo é usado para renderizar todas as páginas públicas do site

---

## Comandos Úteis

### Setup e Instalação
- `npm run setup:init`: **Instalação completa** (instala dependências + cria banco + seed inicial)
- `npm run setup`: Setup do banco de dados apenas (assume que dependências já estão instaladas)
- `npm run setup:db-only`: Alias para `setup` (apenas banco de dados)

### Banco de Dados
- `npm run db:push`: Sincroniza o schema com o banco (cria/atualiza tabelas)
- `npm run db:generate`: Gera arquivos SQL de migration baseados no schema
- `npm run db:migrate`: Aplica as migrations pendentes
- `npm run db:studio`: Abre o Drizzle Studio para visualizar/editar o banco

### Desenvolvimento
- `npm run dev`: Inicia servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm run start`: Inicia servidor de produção
- `npm run lint`: Verifica a qualidade do código
- `npm run lint:fix`: Corrige automaticamente problemas de lint

## Arquitetura

O projeto segue uma arquitetura Modular Monolith organizada em diretórios específicos:

- **`src/core/`** - Núcleo da aplicação
  - `services/` - Serviços de negócio (posts, menus, settings, themes)
  - `validations/` - Schemas Yup para validação de formulários
  - `utils/` - Utilitários compartilhados (auth, cookies, helpers)
  - `types/` - Tipos TypeScript compartilhados
  - `hooks/` - Custom React hooks

- **`src/admin/`** - Interface administrativa
  - `components/` - Componentes React do painel admin
  - Componentes principais: PostEditor, MenuEditor, ReadingSettings, etc.

- **`src/app/`** - Rotas Next.js (App Router)
  - Rotas públicas e administrativas
  - API routes (`/api/`)
  - Layouts e páginas

- **`src/theme/`** - Componentes compartilhados de tema
  - Componentes reutilizáveis entre temas
  - Block renderer para blocos do editor

- **`src/themes/`** - Temas instalados
  - Cada tema em sua própria pasta (`base/`, etc.)
  - Componentes específicos de cada tema

- **`src/db/`** - Banco de dados
  - `schema.ts` - Schema Drizzle ORM
  - `index.ts` - Configuração da conexão com PostgreSQL

## Licença

MIT
