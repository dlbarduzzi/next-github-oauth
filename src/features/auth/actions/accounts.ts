"use server"

import type {
  AccountSchema,
  AccountProvider,
  CreateAccountSchema,
} from "@/db/schemas/accounts"

import postgres from "postgres"
import { eq, and } from "drizzle-orm"

import { db } from "@/db/conn"
import { accounts, createAccountSchema } from "@/db/schemas/accounts"

type CreateAccount = { ok: false } | { ok: true; data: AccountSchema | null }

export async function createAccount(acc: CreateAccountSchema): Promise<CreateAccount> {
  try {
    const data = createAccountSchema.safeParse(acc)
    if (!data.success) {
      const flattenErr = JSON.stringify(data.error.flatten().fieldErrors)
      console.error(`ERROR - CreateAccountSafeParse - ${flattenErr}`)
      return { ok: false }
    }

    const results = await db.insert(accounts).values(acc).returning()

    if (results.length < 1) {
      console.error("ERROR - CreateAccount - no results returned")
      return { ok: true, data: null }
    }

    return { ok: true, data: results[0] }
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      console.error("ERROR - CreateAccountQueryError -", error.message)
    } else {
      console.error("ERROR - CreateAccountException -", error)
    }
    return { ok: false }
  }
}

type FindUserByAccount = { ok: false } | { ok: true; data: AccountSchema | null }

export async function findUserByAccount({
  provider,
  providerAccountId,
}: {
  provider: AccountProvider
  providerAccountId: string
}): Promise<FindUserByAccount> {
  try {
    const results = await db
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.provider, provider),
          eq(accounts.providerAccountId, providerAccountId)
        )
      )

    if (results.length < 1) {
      return { ok: true, data: null }
    }

    return { ok: true, data: results[0] }
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      console.error("ERROR - FindUserByAccountQueryError -", error.message)
    } else {
      console.error("ERROR - FindUserByAccountException -", error)
    }
    return { ok: false }
  }
}
