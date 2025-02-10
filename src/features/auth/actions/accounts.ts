"use server"

import type { AccountProvider, AccountSchema } from "@/db/schemas/accounts"

import { eq, and } from "drizzle-orm"

import { db } from "@/db/conn"
import { accounts } from "@/db/schemas/accounts"

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
    console.error("ERROR - FindUserByAccount -", error)
    return { ok: false }
  }
}
