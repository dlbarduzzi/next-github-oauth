import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { z } from "zod"
import { createSelectSchema } from "drizzle-zod"

import { users } from "./users"

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", { mode: "date", withTimezone: true }).notNull(),
})

export const sessionSchema = createSelectSchema(sessions)
export type SessionSchema = z.infer<typeof sessionSchema>
