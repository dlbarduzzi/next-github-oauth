"use server"

import type { CourseSchema } from "@/db/schemas/courses"

import { db } from "@/db/conn"
import { courses } from "@/db/schemas/courses"
import { desc, eq } from "drizzle-orm"

type GetCoursesResponse =
  | {
      ok: false
      error: string
    }
  | {
      ok: true
      data: CourseSchema[]
    }

export async function getCourses(): Promise<GetCoursesResponse> {
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
