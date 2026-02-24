import { integer, pgTable, varchar,boolean } from "drizzle-orm/pg-core";
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