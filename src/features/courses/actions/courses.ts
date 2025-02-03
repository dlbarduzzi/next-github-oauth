"use server"

import type { CourseSchema } from "@/db/schema"
import type { DatabaseSuccess, DatabaseFailure } from "@/lib/types"

import { db } from "@/db/conn"
import { courses } from "@/db/schemas/courses"
import { desc, eq } from "drizzle-orm"

type Success = DatabaseSuccess<CourseSchema[]>
type Failure = DatabaseFailure

export async function getCourses(): Promise<Success | Failure> {
  try {
    const data = await db.query.courses.findMany({
      where: eq(courses.status, "published"),
      limit: 10,
      orderBy: desc(courses.createdAt),
    })
    return { ok: true, data }
  } catch (error) {
    console.error(error)
    return { ok: false, error: "database query to select courses failed" }
  }
}
