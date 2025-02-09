import { GitHub } from "arctic"

import { env } from "@/env/server"
import { env as clientEnv } from "@/env/client"

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
  `${clientEnv.NEXT_PUBLIC_APP_URL}/api/login/github/callback`
)
