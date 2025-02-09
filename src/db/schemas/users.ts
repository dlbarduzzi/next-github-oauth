import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

import { lower } from "@/db/helpers"

import { z } from "zod"
import { createSelectSchema } from "drizzle-zod"

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: text("email").notNull().unique(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
  },
  table => [uniqueIndex("email_index").on(lower(table.email))]
)

export const userSchema = createSelectSchema(users)
export type UserSchema = z.infer<typeof userSchema>
