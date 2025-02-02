import { migrate } from "drizzle-orm/postgres-js/migrator"

import { env } from "@/env/server"
import { db, client } from "./conn"

import config from "@/../drizzle.config"

if (!env.DB_MIGRATING) {
  throw new Error("Environment variable DB_MIGRATING must be set to 'true'")
}

await migrate(db, { migrationsFolder: config.out! })

await client.end()
