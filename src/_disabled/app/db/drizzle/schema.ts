import { sql } from 'drizzle-orm';
import {
  boolean,
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const widgetSize = pgEnum('widget_size', ['small', 'medium', 'large']);
export const widgetType = pgEnum('widget_type', [
  'line-chart',
  'number-card',
  'bar-chart',
  'data-table',
  'pie-chart',
  'funnel',
]);

export const account = pgTable(
  'account',
  {
    userId: text('user_id').primaryKey().notNull(),
    email: text().notNull(),
    displayName: text('display_name'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true, mode: 'string' }),
    posthogApiKey: text('posthog_api_key'),
    posthogProjectId: text('posthog_project_id'),
    remainingCredits: integer('remaining_credits').default(10).notNull(),
  },
  (table) => [
    unique('users_email_key').on(table.email),
    pgPolicy('users_rw_self', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`(user_id = current_user_id())`,
      withCheck: sql`(user_id = current_user_id())`,
    }),
  ],
);

export const dashboard = pgTable(
  'dashboard',
  {
    dashboardId: uuid('dashboard_id').defaultRandom().primaryKey().notNull(),
    ownerUserId: text('owner_user_id').notNull(),
    name: text().notNull(),
    description: text(),
    position: integer('position').default(0).notNull(),
    isArchived: boolean('is_archived').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('dashboard_owner_idx').using('btree', table.ownerUserId.asc().nullsLast().op('text_ops')),
    foreignKey({
      columns: [table.ownerUserId],
      foreignColumns: [account.userId],
      name: 'dashboard_owner_account_id_fkey',
    }).onDelete('cascade'),
    pgPolicy('dashboard_rw_owner', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`(owner_user_id = current_user_id())`,
      withCheck: sql`(owner_user_id = current_user_id())`,
    }),
  ],
);

export const schemaMigrations = pgTable('schema_migrations', {
  version: varchar().primaryKey().notNull(),
});

export const widget = pgTable(
  'widget',
  {
    widgetId: uuid('widget_id').defaultRandom().primaryKey().notNull(),
    type: widgetType().notNull(),
    title: text().notNull(),
    size: widgetSize().default('medium').notNull(),
    position: integer('position').default(0).notNull(),
    query: text().notNull(),
    config: jsonb().default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    dashboardId: uuid('dashboard_id').notNull(),
  },
  (table) => [
    index('widget_dashboard_idx').using(
      'btree',
      table.dashboardId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.dashboardId],
      foreignColumns: [dashboard.dashboardId],
      name: 'widget_dashboard_id_fkey',
    }).onDelete('cascade'),
    pgPolicy('widget_rw_via_dashboard', {
      as: 'permissive',
      for: 'all',
      to: ['public'],
      using: sql`(EXISTS ( SELECT 1
   FROM dashboard d
  WHERE ((d.dashboard_id = widget.dashboard_id) AND (d.owner_user_id = current_user_id()))))`,
      withCheck: sql`(EXISTS ( SELECT 1
   FROM dashboard d
  WHERE ((d.dashboard_id = widget.dashboard_id) AND (d.owner_user_id = current_user_id()))))`,
    }),
  ],
);
