import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"

import { env } from "@/env/server"

import { users } from "./schemas/users"
import { courses } from "./schemas/courses"
import { accounts } from "./schemas/accounts"
import { sessions } from "./schemas/sessions"

export const client = postgres(env.DATABASE_URL, {
  max: env.DB_MIGRATING ? 1 : undefined,
})

export const db = drizzle({
  client,
  schema: {
    users,
    courses,
    accounts,
    sessions,
  },
})
