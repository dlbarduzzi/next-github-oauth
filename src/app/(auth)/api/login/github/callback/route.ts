import { z } from "zod"
import { cookies } from "next/headers"
import { ArcticFetchError, OAuth2RequestError } from "arctic"
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding"

import { github } from "@/features/auth/providers"
import { createUser } from "@/features/auth/actions/users"
import { GITHUB_STATE_COOKIE_NAME } from "@/features/auth/constants"
import { createAccount, findUserByAccount } from "@/features/auth/actions/accounts"
import { createSession, createCookie } from "@/features/auth/actions/sessions"

export async function GET(request: Request) {
  const code = await getCodeParam(request)
  if (!code.ok) {
    return new Response(code.error, { status: code.code })
  }

  const token = await getGithubAccessToken(code.data)
  if (!token.ok) {
    return new Response(token.error, { status: token.code })
  }

  const githubUser = await getGithubUser(token.data)
  if (!githubUser.ok) {
    return new Response(githubUser.error, { status: githubUser.code })
  }

  const account = await findUserByAccount({
    provider: "github",
    providerAccountId: githubUser.data.id,
  })

  if (!account.ok) {
    return new Response("Internal server error. Please restart the process.", {
      status: 500,
    })
  }

  if (account.data !== null) {
    // TODO: Create session and cookie tokens!
    console.log("User exists!")
  }

  const githubUserEmail = await getGithubUserEmail(token.data)
  if (!githubUserEmail.ok) {
    return new Response(githubUserEmail.error, { status: githubUserEmail.code })
  }

  if (githubUserEmail.data === null) {
    return new Response("You must validate your GitHub email before proceeding.", {
      status: 400,
    })
  }

  const newUser = await createUser({
    name: githubUser.data.name,
    email: githubUserEmail.data,
    imageUrl: githubUser.data.imageUrl,
  })

  if (!newUser.ok || newUser.data === null) {
    return new Response("Internal server error. Please restart the process.", {
      status: 500,
    })
  }

  const newAccount = await createAccount({
    userId: newUser.data.id,
    provider: "github",
    providerAccountId: githubUser.data.id,
  })

  if (!newAccount.ok || newAccount.data === null) {
    return new Response("Internal server error. Please restart the process.", {
      status: 500,
    })
  }

  const cookieAndSession = await createCookieAndSessionTokens(newUser.data.id)
  if (!cookieAndSession.ok) {
    return new Response(cookieAndSession.error, { status: cookieAndSession.code })
  }

  return new Response(null, { status: 302, headers: { Location: "/" } })
}

type CallbackResponse<T> =
  | { ok: true; data: T }
  | { ok: false; code: number; error: string }

async function getCodeParam(request: Request): Promise<CallbackResponse<string>> {
  const url = new URL(request.url)

  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")

  const cookieStore = await cookies()
  const storedState = cookieStore.get(GITHUB_STATE_COOKIE_NAME)?.value ?? null

  if (code === null || state === null || storedState === null) {
    return {
      ok: false,
      code: 400,
      error: "Invalid request! Please restart the process.",
    }
  }

  if (state !== storedState) {
    return {
      ok: false,
      code: 400,
      error: "Invalid state! Please restart the process.",
    }
  }

  return { ok: true, data: code }
}

async function getGithubAccessToken(code: string): Promise<CallbackResponse<string>> {
  try {
    const tokens = await github.validateAuthorizationCode(code)
    return { ok: true, data: tokens.accessToken() }
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      console.error(`ERROR - github OAuth2RequestError - ${error.code}`)
      return {
        ok: false,
        code: 401,
        error: "Invalid credentials. Please restart the process.",
      }
    }
    if (error instanceof ArcticFetchError) {
      console.error(`ERROR - github ArcticFetchError - ${error.cause}`)
      return {
        ok: false,
        code: 500,
        error: "Authorization request failed. Please restart the process.",
      }
    }
    return {
      ok: false,
      code: 500,
      error: "Internal server error. Please restart the process.",
    }
  }
}

const githubUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  login: z.string(),
  avatar_url: z.string(),
})

async function getGithubUser(
  token: string
): Promise<
  CallbackResponse<{ id: string; name: string; username: string; imageUrl: string }>
> {
  try {
    const req = new Request("https://api.github.com/user")
    req.headers.set("Authorization", `Bearer ${token}`)

    const resp = await fetch(req)
    if (!resp.ok) {
      console.error(`ERROR - github FetchUser - ${resp.status}`)
      return {
        ok: false,
        code: 500,
        error: "Internal server error. Please restart the process.",
      }
    }

    const json = await resp.json()

    const data = githubUserSchema.safeParse(json)
    if (!data.success) {
      const flattenErr = JSON.stringify(data.error.flatten().fieldErrors)
      console.error(`ERROR - github SafeParseUser - ${flattenErr}`)
      return {
        ok: false,
        code: 500,
        error: "Internal server error. Please restart the process.",
      }
    }

    const { id, name, login, avatar_url } = data.data

    return {
      ok: true,
      data: { id: id.toString(), name, username: login, imageUrl: avatar_url },
    }
  } catch (error) {
    console.error(`ERROR - github GetUserException - ${error}`)
    return {
      ok: false,
      code: 500,
      error: "Internal server error. Please restart the process.",
    }
  }
}

const githubUserEmailsSchema = z.array(
  z.object({
    email: z.string(),
    primary: z.boolean(),
    verified: z.boolean(),
    visibility: z.string().nullable(),
  })
)

async function getGithubUserEmail(
  token: string
): Promise<CallbackResponse<string | null>> {
  try {
    const req = new Request("https://api.github.com/user/emails")
    req.headers.set("Authorization", `Bearer ${token}`)

    const resp = await fetch(req)
    if (!resp.ok) {
      console.error(`ERROR - github FetchUserEmails - ${resp.status}`)
      return {
        ok: false,
        code: 500,
        error: "Internal server error. Please restart the process.",
      }
    }

    const json = await resp.json()

    const data = githubUserEmailsSchema.safeParse(json)
    if (!data.success) {
      const flattenErr = JSON.stringify(data.error.flatten().fieldErrors)
      console.error(`ERROR - github SafeParseEmails - ${flattenErr}`)
      return {
        ok: false,
        code: 500,
        error: "Internal server error. Please restart the process.",
      }
    }

    for (const email of data.data) {
      if (email.primary && email.verified) {
        return { ok: true, data: email.email }
      }
    }

    return { ok: true, data: null }
  } catch (error) {
    console.error(`ERROR - github GetUserEmailsException - ${error}`)
    return {
      ok: false,
      code: 500,
      error: "Internal server error. Please restart the process.",
    }
  }
}

async function createCookieAndSessionTokens(
  userId: string
): Promise<CallbackResponse<null>> {
  try {
    const token = generateSessionToken()
    const session = await createSession({ token, userId })

    if (!session.ok || session.data === null) {
      return {
        ok: false,
        code: 500,
        error: "Internal server error. Please restart the process.",
      }
    }

    await createCookie(token, session.data.expiresAt)

    return { ok: true, data: null }
  } catch (error) {
    console.error(`ERROR - CreateCookieAndSessionTokensException - ${error}`)
    return {
      ok: false,
      code: 500,
      error: "Internal server error. Please restart the process.",
    }
  }
}

function generateSessionToken() {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  const token = encodeBase32LowerCaseNoPadding(bytes)
  return token
}
