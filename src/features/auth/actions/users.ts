"use server"

import type { CreateUserSchema, UserSchema } from "@/db/schemas/users"

import postgres from "postgres"

import { db } from "@/db/conn"
import { createUserSchema, users } from "@/db/schemas/users"

import { getCurrentSession, invalidateSession, deleteCookie } from "./sessions"

type CreateUser = { ok: false } | { ok: true; data: UserSchema | null }

export async function createUser(user: CreateUserSchema): Promise<CreateUser> {
  try {
    const data = createUserSchema.safeParse(user)
    if (!data.success) {
      const flattenErr = JSON.stringify(data.error.flatten().fieldErrors)
      console.error(`ERROR - CreateUserSafeParse - ${flattenErr}`)
      return { ok: false }
    }

    const results = await db.insert(users).values(user).returning()

    if (results.length < 1) {
      console.error("ERROR - CreateUser - no results returned")
      return { ok: true, data: null }
    }

    return { ok: true, data: results[0] }
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      console.error("ERROR - CreateUserQueryError -", error.message)
    } else {
      console.error("ERROR - CreateUserException -", error)
    }
    return { ok: false }
  }
}

type Logout = { ok: false; error: string } | { ok: true }

export async function logout(): Promise<Logout> {
  const session = await getCurrentSession()
  if (!session.ok) {
    return { ok: false, error: "Unauthorized" }
  }

  if (!session.isAuthenticated) {
    return { ok: false, error: "Unauthorized" }
  }

  await invalidateSession(session.session.id)
  await deleteCookie()

  return { ok: true }
}
