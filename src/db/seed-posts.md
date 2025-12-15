# Seed de Posts - SQL de Inserção Manual

Este arquivo contém comandos SQL para inserir 5 posts de teste com todos os campos possíveis preenchidos.

## Como Usar

1. Execute o setup inicial do projeto (`npm run setup`) para criar o usuário admin.
2. Execute os comandos SQL abaixo no seu banco de dados PostgreSQL.
3. Substitua `evopress_posts` pelo valor de `DB_PREFIX` do seu `.env.local` (padrão: `evopress`).

---

## SQL de Inserção

```sql
-- Post 1: Post publicado completo com todos os campos
INSERT INTO evopress_posts (
  uuid,
  author_uuid,
  title,
  slug,
  excerpt,
  status,
  post_type,
  content_blocks,
  meta_data,
  seo_title,
  seo_description,
  seo_keywords,
  created_at,
  updated_at,
  published_at,
  deleted_at
) VALUES (
  gen_random_uuid(),
  (SELECT uuid FROM evopress_users WHERE role = 'admin' LIMIT 1),
  'Bem-vindo ao EvoPress: Um CMS Moderno e Escalável',
  'bem-vindo-ao-evopress',
  'Descubra como o EvoPress combina a facilidade do WordPress com a performance do Next.js.',
  'published',
  'post',
  '[
    {
      "type": "heading",
      "level": 1,
      "content": "Bem-vindo ao EvoPress"
    },
    {
      "type": "paragraph",
      "content": "Este é um exemplo de post completo com todos os campos preenchidos."
    },
    {
      "type": "image",
      "src": "/images/welcome.jpg",
      "alt": "Imagem de boas-vindas",
      "caption": "Imagem ilustrativa"
    }
  ]'::jsonb,
  '{
    "featured_image": "/images/welcome.jpg",
    "reading_time": 5,
    "views": 0,
    "likes": 0
  }'::jsonb,
  'Bem-vindo ao EvoPress - CMS Moderno',
  'Descubra o EvoPress, um CMS moderno construído com Next.js 16 e arquitetura Headless/BFF.',
  ARRAY['cms', 'nextjs', 'headless', 'wordpress-alternative'],
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '5 days',
  NULL
);

-- Post 2: Rascunho com conteúdo mínimo
INSERT INTO evopress_posts (
  uuid,
  author_uuid,
  title,
  slug,
  excerpt,
  status,
  post_type,
  content_blocks,
  meta_data,
  seo_title,
  seo_description,
  seo_keywords,
  created_at,
  updated_at,
  published_at,
  deleted_at
) VALUES (
  gen_random_uuid(),
  (SELECT uuid FROM evopress_users WHERE role = 'admin' LIMIT 1),
  'Rascunho: Artigo em Desenvolvimento',
  'rascunho-artigo-desenvolvimento',
  NULL,
  'draft',
  'post',
  '[
    {
      "type": "paragraph",
      "content": "Este é um rascunho ainda em desenvolvimento."
    }
  ]'::jsonb,
  '{}'::jsonb,
  NULL,
  NULL,
  NULL,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 hour',
  NULL,
  NULL
);

-- Post 3: Página estática completa
INSERT INTO evopress_posts (
  uuid,
  author_uuid,
  title,
  slug,
  excerpt,
  status,
  post_type,
  content_blocks,
  meta_data,
  seo_title,
  seo_description,
  seo_keywords,
  created_at,
  updated_at,
  published_at,
  deleted_at
) VALUES (
  gen_random_uuid(),
  (SELECT uuid FROM evopress_users WHERE role = 'admin' LIMIT 1),
  'Sobre Nós',
  'sobre-nos',
  'Conheça mais sobre nossa empresa e nossa missão.',
  'published',
  'page',
  '[
    {
      "type": "heading",
      "level": 1,
      "content": "Sobre Nós"
    },
    {
      "type": "heading",
      "level": 2,
      "content": "Nossa História"
    },
    {
      "type": "paragraph",
      "content": "Fundada em 2024, nossa empresa tem como missão criar soluções tecnológicas inovadoras."
    },
    {
      "type": "heading",
      "level": 2,
      "content": "Nossa Missão"
    },
    {
      "type": "paragraph",
      "content": "Transformar ideias em realidade através da tecnologia."
    }
  ]'::jsonb,
  '{
    "template": "about",
    "show_sidebar": true,
    "custom_css": null
  }'::jsonb,
  'Sobre Nós - Nossa História e Missão',
  'Conheça nossa empresa, história e valores. Descubra o que nos motiva todos os dias.',
  ARRAY['sobre', 'empresa', 'historia', 'missao'],
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '10 days',
  NULL
);

-- Post 4: Post arquivado com histórico completo
INSERT INTO evopress_posts (
  uuid,
  author_uuid,
  title,
  slug,
  excerpt,
  status,
  post_type,
  content_blocks,
  meta_data,
  seo_title,
  seo_description,
  seo_keywords,
  created_at,
  updated_at,
  published_at,
  deleted_at
) VALUES (
  gen_random_uuid(),
  (SELECT uuid FROM evopress_users WHERE role = 'admin' LIMIT 1),
  'Artigo Antigo - Arquivo de Referência',
  'artigo-antigo-arquivo-referencia',
  'Este artigo foi arquivado mas mantido para referência histórica.',
  'archived',
  'post',
  '[
    {
      "type": "heading",
      "level": 1,
      "content": "Artigo Antigo"
    },
    {
      "type": "paragraph",
      "content": "Este conteúdo foi arquivado para referência histórica."
    }
  ]'::jsonb,
  '{
    "archived_reason": "Conteúdo desatualizado",
    "archived_by": "admin",
    "original_views": 1500
  }'::jsonb,
  'Artigo Antigo - Arquivo de Referência',
  'Artigo arquivado mantido para referência histórica.',
  ARRAY['arquivo', 'referencia', 'historico'],
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '30 days',
  NULL
);

-- Post 5: Post customizado com meta_data extenso
INSERT INTO evopress_posts (
  uuid,
  author_uuid,
  title,
  slug,
  excerpt,
  status,
  post_type,
  content_blocks,
  meta_data,
  seo_title,
  seo_description,
  seo_keywords,
  created_at,
  updated_at,
  published_at,
  deleted_at
) VALUES (
  gen_random_uuid(),
  (SELECT uuid FROM evopress_users WHERE role = 'admin' LIMIT 1),
  'Guia Completo: Configuração Avançada do EvoPress',
  'guia-completo-configuracao-avancada-evopress',
  'Aprenda a configurar recursos avançados do EvoPress incluindo plugins customizados, webhooks e extensões.',
  'published',
  'custom',
  '[
    {
      "type": "heading",
      "level": 1,
      "content": "Guia Completo de Configuração"
    },
    {
      "type": "paragraph",
      "content": "Este guia cobre todas as configurações avançadas disponíveis no EvoPress."
    },
    {
      "type": "heading",
      "level": 2,
      "content": "Plugins Customizados"
    },
    {
      "type": "paragraph",
      "content": "O EvoPress suporta plugins através do sistema de eventos e webhooks."
    },
    {
      "type": "heading",
      "level": 2,
      "content": "Webhooks"
    },
    {
      "type": "paragraph",
      "content": "Configure webhooks para integrar com serviços externos."
    },
    {
      "type": "image",
      "src": "/images/advanced-config.jpg",
      "alt": "Configuração avançada",
      "caption": "Interface de configuração"
    }
  ]'::jsonb,
  '{
    "difficulty": "advanced",
    "estimated_time": "45 minutes",
    "category": "tutorial",
    "tags": ["configuracao", "avancado", "plugins"],
    "related_posts": [],
    "author_notes": "Este guia foi atualizado recentemente",
    "version": "1.0.0",
    "requires_plugins": false
  }'::jsonb,
  'Guia Completo: Configuração Avançada do EvoPress | Tutorial',
  'Aprenda a configurar recursos avançados do EvoPress incluindo plugins, webhooks e extensões. Tutorial completo passo a passo.',
  ARRAY['evopress', 'configuracao', 'avancado', 'tutorial', 'plugins', 'webhooks', 'guia'],
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '7 days',
  NULL
);
```

---

## Variantes de Campos Demonstradas

### Status
- `published` - Post publicado e visível
- `draft` - Rascunho em desenvolvimento
- `archived` - Post arquivado mas mantido

### Tipos de Post
- `post` - Artigo/blog padrão
- `page` - Página estática
- `custom` - Tipo customizado

### Content Blocks (JSONB)
- Blocos de heading (níveis 1 e 2)
- Blocos de parágrafo
- Blocos de imagem com caption

### Meta Data (JSONB)
- Dados simples (featured_image, reading_time)
- Dados complexos (template, show_sidebar)
- Dados de arquivamento (archived_reason, archived_by)
- Dados extensos (difficulty, category, tags, version)

### SEO Fields
- `seo_title` - Título otimizado para SEO
- `seo_description` - Descrição meta
- `seo_keywords` - Array de palavras-chave

### Datas
- `created_at` - Data de criação (variada)
- `updated_at` - Data de atualização (variada)
- `published_at` - Data de publicação (NULL para drafts)
- `deleted_at` - Soft delete (NULL para posts ativos)

---

## Notas Importantes

1. **Substitua `evopress_posts`** pelo valor real do seu `DB_PREFIX` (padrão: `evopress`).
2. **UUID do Autor**: Os comandos usam uma subquery para buscar automaticamente o UUID do usuário admin.
3. **Datas**: As datas são relativas usando `NOW() - INTERVAL`, garantindo que funcionem independente de quando forem executados.
4. **JSONB**: Os campos `content_blocks` e `meta_data` são inseridos como JSONB válido.
5. **Arrays**: O campo `seo_keywords` usa a sintaxe `ARRAY[...]` do PostgreSQL.

