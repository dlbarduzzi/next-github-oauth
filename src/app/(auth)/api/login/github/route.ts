import { cookies } from "next/headers"
import { generateState } from "arctic"

import { env } from "@/env/server"
import { github } from "@/features/auth/providers"
import { GITHUB_STATE_COOKIE_NAME } from "@/features/auth/constants"

export async function GET() {
  const state = generateState()
  const scopes = ["user:email"]

  const url = github.createAuthorizationURL(state, scopes)

  const cookieStore = await cookies()
  cookieStore.set(GITHUB_STATE_COOKIE_NAME, state, {
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  })

  return new Response(null, {
    status: 302,
    headers: { Location: url.toString() },
  })
}
