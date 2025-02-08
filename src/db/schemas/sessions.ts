import type { InferInsertModel, InferSelectModel } from "drizzle-orm"

import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { users } from "./users"

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", { mode: "date", withTimezone: true }).notNull(),
})

export type SessionSchema = InferSelectModel<typeof sessions>
export type CreateSessionSchema = InferInsertModel<typeof sessions>
