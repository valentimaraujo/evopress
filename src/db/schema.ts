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

export const settings = pgTable('settings', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  key: text('key').notNull().unique(),
  value: jsonb('value'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index(`idx_${tablePrefix}_settings_key`).on(table.key),
  index(`idx_${tablePrefix}_settings_value`).on(table.value),
]);

// --- MENUS ---
export const menus = pgTable('menus', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  location: text('location'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index(`idx_${tablePrefix}_menus_location`).on(table.location),
  index(`idx_${tablePrefix}_menus_deleted_at`).on(table.deletedAt),
]);

// --- MENU ITEMS ---
export const menuItems = pgTable('menu_items', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  menuUuid: uuid('menu_uuid').notNull().references(() => menus.uuid),
  pageUuid: uuid('page_uuid').notNull().references(() => posts.uuid),
  label: text('label'),
  order: integer('order').notNull().default(0),
  parentUuid: uuid('parent_uuid').references(() => menuItems.uuid),
  url: text('url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
  index(`idx_${tablePrefix}_menu_items_menu_uuid`).on(table.menuUuid),
  index(`idx_${tablePrefix}_menu_items_page_uuid`).on(table.pageUuid),
  index(`idx_${tablePrefix}_menu_items_parent_uuid`).on(table.parentUuid),
  index(`idx_${tablePrefix}_menu_items_order`).on(table.order),
  index(`idx_${tablePrefix}_menu_items_deleted_at`).on(table.deletedAt),
]);
