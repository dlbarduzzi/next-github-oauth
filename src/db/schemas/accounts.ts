import type { InferInsertModel, InferSelectModel } from "drizzle-orm"

import { uuid, pgTable, text, pgEnum } from "drizzle-orm/pg-core"

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

export type AccountSchema = InferSelectModel<typeof accounts>
export type CreateAccountSchema = InferInsertModel<typeof accounts>

export type AccountProvider = (typeof accountProviders)[number]
