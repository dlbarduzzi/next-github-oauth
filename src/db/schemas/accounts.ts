import { uuid, pgTable, text, pgEnum } from "drizzle-orm/pg-core"

import { z } from "zod"
import { createSelectSchema, createInsertSchema } from "drizzle-zod"

import { users } from "./users"

export const accountProviders = ["github", "google"] as const
export const accountProviderEnum = pgEnum("account_provider", accountProviders)

export const accounts = pgTable("accounts", {
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  provider: accountProviderEnum("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull().unique(),
})

export const accountSchema = createSelectSchema(accounts)
export const createAccountSchema = createInsertSchema(accounts)

export type AccountSchema = z.infer<typeof accountSchema>
export type CreateAccountSchema = z.infer<typeof createAccountSchema>

export type AccountProvider = (typeof accountProviders)[number]
