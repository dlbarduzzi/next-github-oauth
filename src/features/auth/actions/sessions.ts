"use server"

import type { UserSchema } from "@/db/schemas/users"
import type { CreateSessionSchema, SessionSchema } from "@/db/schemas/sessions"

import { cache } from "react"
import postgres from "postgres"

import { eq } from "drizzle-orm"
import { sha256 } from "@oslojs/crypto/sha2"
import { cookies } from "next/headers"
import { encodeHexLowerCase } from "@oslojs/encoding"

import { db } from "@/db/conn"
import { env } from "@/env/server"
import { users } from "@/db/schemas/users"
import { sessions } from "@/db/schemas/sessions"
import { APP_COOKIE_NAME } from "@/features/auth/constants"

// This is the time when sessions should be extended if active.
const SESSION_TIME_EXTENSION = 1000 * 60 * 60 * 24 * 15 // 15 days

// This is the amount of time given to a session before expiration.
const SESSION_TIME_EXPIRATION = 1000 * 60 * 60 * 24 * 30 // 30 days

type CreateSession = { ok: false } | { ok: true; data: SessionSchema | null }

export async function createSession({
  token,
  userId,
}: {
  token: string
  userId: string
}): Promise<CreateSession> {
  try {
    const sessionId = encodeSessionId(token)
    const expiresAt = new Date(Date.now() + SESSION_TIME_EXPIRATION)

    const session: CreateSessionSchema = { id: sessionId, userId, expiresAt }
    const results = await db.insert(sessions).values(session).returning()

    if (results.length < 1) {
      console.error("ERROR - CreateSession - no results returned")
      return { ok: true, data: null }
    }

    return { ok: true, data: results[0] }
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      console.error("ERROR - CreateSessionQueryError -", error.message)
    } else {
      console.error("ERROR - CreateSessionException -", error)
    }
    return { ok: false }
  }
}

export async function createCookie(token: string, expires: Date) {
  const cookieStore = await cookies()
  cookieStore.set(APP_COOKIE_NAME, token, {
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    expires,
  })
}

export async function deleteCookie() {
  const cookieStore = await cookies()
  cookieStore.set(APP_COOKIE_NAME, "", {
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  })
}

type ValidateSession =
  | { ok: false }
  | { ok: true; isAuthenticated: false }
  | {
      ok: true
      user: UserSchema
      session: SessionSchema
      isAuthenticated: true
    }

export const getCurrentSession = cache(async (): Promise<ValidateSession> => {
  const cookieStore = await cookies()

  const token = cookieStore.get(APP_COOKIE_NAME)?.value ?? null
  if (token === null) {
    return { ok: true, isAuthenticated: false }
  }

  return validateSession(token)
})

// export async function getCurrentSession(): Promise<ValidateSession> {
//   const cookieStore = await cookies()

//   const token = cookieStore.get(APP_COOKIE_NAME)?.value ?? null
//   if (token === null) {
//     return { ok: true, isAuthenticated: false }
//   }

//   return validateSession(token)
// }

async function validateSession(token: string): Promise<ValidateSession> {
  try {
    const sessionId = encodeSessionId(token)

    const results = await db
      .select({ user: users, session: sessions })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId))

    if (results.length < 1) {
      return { ok: true, isAuthenticated: false }
    }

    const { user, session } = results[0]

    // Delete expired session from the database.
    if (Date.now() >= session.expiresAt.getTime()) {
      await invalidateSession(session.id)
      return { ok: true, isAuthenticated: false }
    }

    // Extend session expiration if session is about to expire.
    if (Date.now() >= session.expiresAt.getTime() - SESSION_TIME_EXTENSION) {
      const expiresAt = new Date(Date.now() + SESSION_TIME_EXPIRATION)

      const results = await db
        .update(sessions)
        .set({ expiresAt })
        .where(eq(sessions.id, session.id))
        .returning()

      if (results.length > 0) {
        session.expiresAt = expiresAt
      }
    }

    return { ok: true, user, session, isAuthenticated: true }
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      console.error("ERROR - ValidateSessionQueryError -", error.message)
    } else {
      console.error("ERROR - ValidateSessionException -", error)
    }
    return { ok: false }
  }
}

export async function invalidateSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId))
}

function encodeSessionId(token: string) {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
}
