import { integer, pgTable, varchar,boolean,text} from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

export const websiteTable = pgTable("websites", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    websiteId: varchar({ length: 255 }).notNull().unique(),
    domain: varchar({ length: 255 }).notNull(),
    timeZone: varchar({ length: 255 }).notNull(),
    enableLocahostTracking: boolean().default(false),
    userEmail: varchar({ length: 255 }).notNull()
});

export const pageViewTable = pgTable("pageViews", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  visitorID: varchar({ length: 255 }).notNull(),
  websiteID: varchar({ length: 255 }).notNull(),

  domain: varchar({ length: 255 }),
  url: text(),
  type: varchar({ length: 50 }),

  referrer: text(),

  entryTime: varchar({ length: 255 }),
  exitTime: varchar({ length: 255 }),

  totalActiveTime: integer(),

  urlParams: text(),

  utm_source: varchar({ length: 255 }),
  utm_medium: varchar({ length: 255 }),
  utm_campaign: varchar({ length: 255 }),
  utm_content: varchar({ length: 255 }),
  utm_term: varchar({ length: 255 }),

  device: varchar({ length: 100 }),
  os: varchar({ length: 100 }),
  browser: varchar({ length: 100 }),

  city: varchar({ length: 100 }),
  region: varchar({ length: 100 }),
  country: varchar({ length: 100 }),

  ipAddress: varchar({ length: 100 }),

  refParams: text(),
});