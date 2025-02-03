import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const userRoles = ["user", "admin"] as const
export const userRoleEnum = pgEnum("user_role", userRoles)

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  role: userRoleEnum().notNull().default("user"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
})
