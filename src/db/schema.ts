import { pgTableCreator, text, timestamp, uuid, jsonb, integer, index } from 'drizzle-orm/pg-core';

const tablePrefix = process.env.DB_PREFIX || 'evopress';
const pgTable = pgTableCreator((name) => `${tablePrefix}_${name}`);
export const users = pgTable('users', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash'),
  role: text('role', { enum: ['admin', 'editor', 'author', 'subscriber'] }).notNull().default('author'),
  metaData: jsonb('meta_data').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index(`idx_${tablePrefix}_users_email`).on(table.email),
  index(`idx_${tablePrefix}_users_role`).on(table.role),
  index(`idx_${tablePrefix}_users_deleted_at`).on(table.deletedAt),
]);

// --- POSTS ---
export const posts = pgTable('posts', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  authorUuid: uuid('author_uuid').notNull().references(() => users.uuid),
  
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  status: text('status', { enum: ['draft', 'published', 'archived'] }).notNull().default('draft'),
  postType: text('post_type', { enum: ['post', 'page'] }).notNull().default('post'),
  contentBlocks: jsonb('content_blocks').default([]),
  metaData: jsonb('meta_data').default({}),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords').array(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index(`idx_${tablePrefix}_posts_author`).on(table.authorUuid),
  index(`idx_${tablePrefix}_posts_slug`).on(table.slug),
  index(`idx_${tablePrefix}_posts_status`).on(table.status),
  index(`idx_${tablePrefix}_posts_post_type`).on(table.postType),
]);

export const media = pgTable('media', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  uploadedByUuid: uuid('uploaded_by_uuid').notNull().references(() => users.uuid),
  
  filename: text('filename').notNull(),
  originalFilename: text('original_filename').notNull(),
  mimeType: text('mime_type').notNull(),
  fileSize: integer('file_size').notNull(),
  filePath: text('file_path').notNull(),
  
  metaData: jsonb('meta_data').default({}),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index(`idx_${tablePrefix}_media_uploaded_by`).on(table.uploadedByUuid),
  index(`idx_${tablePrefix}_media_deleted_at`).on(table.deletedAt),
]);
