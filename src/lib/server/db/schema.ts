import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const flavorsTable = sqliteTable('flavors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  originalName: text('original_name').notNull(),
  family: text('family').notNull(),
  emoji: text('emoji').notNull()
});

export const tastingsTable = sqliteTable('tastings', {
  flavorId: text('flavor_id').primaryKey().references(() => flavorsTable.id, { onDelete: 'cascade' }),
  tried: integer('tried', { mode: 'boolean' }).notNull().default(false),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
});

export const ratingsTable = sqliteTable('ratings', {
  flavorId: text('flavor_id').notNull().references(() => flavorsTable.id, { onDelete: 'cascade' }),
  person: text('person', { enum: ['filip', 'emilia'] }).notNull(),
  tastesGood: integer('tastes_good', { mode: 'boolean' }).notNull().default(false),
  exceptional: integer('exceptional', { mode: 'boolean' }).notNull().default(false),
  awful: integer('awful', { mode: 'boolean' }).notNull().default(false),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
}, (table) => [primaryKey({ columns: [table.flavorId, table.person] })]);
