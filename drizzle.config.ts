import { env } from "@/env/server"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/db/schemas/*",
  out: "./src/db/migrations",
  dialect: "postgresql",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
