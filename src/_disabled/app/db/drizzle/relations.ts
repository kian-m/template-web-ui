import { relations } from 'drizzle-orm/relations';
import { account, dashboard, widget } from './schema';

export const dashboardRelations = relations(dashboard, ({ one, many }) => ({
  account: one(account, {
    fields: [dashboard.ownerUserId],
    references: [account.userId],
  }),
  widgets: many(widget),
}));

export const accountRelations = relations(account, ({ many }) => ({
  dashboards: many(dashboard),
}));

export const widgetRelations = relations(widget, ({ one }) => ({
  dashboard: one(dashboard, {
    fields: [widget.dashboardId],
    references: [dashboard.dashboardId],
  }),
}));
