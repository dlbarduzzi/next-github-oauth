"use server"

import type { CreateSessionSchema, SessionSchema } from "@/db/schemas/sessions"

import postgres from "postgres"

import { sha256 } from "@oslojs/crypto/sha2"
import { cookies } from "next/headers"
import { encodeHexLowerCase } from "@oslojs/encoding"

import { db } from "@/db/conn"
import { env } from "@/env/server"
import { sessions } from "@/db/schemas/sessions"
import { APP_COOKIE_NAME } from "@/features/auth/constants"

// This is the time when sessions should be extended if active.
// const SESSION_TIME_EXTENSION = 1000 * 60 * 60 * 24 * 15 // 15 days

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

function encodeSessionId(token: string) {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
}
