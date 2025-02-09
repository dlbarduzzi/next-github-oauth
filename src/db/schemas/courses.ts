import { text, pgTable, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core"

import { z } from "zod"
import { createSelectSchema } from "drizzle-zod"

export const courseStatuses = ["draft", "published"] as const
export const courseStatusEnum = pgEnum("course_status", courseStatuses)

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text().notNull(),
  description: text().notNull(),
  status: courseStatusEnum().notNull().default("draft"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const courseSchema = createSelectSchema(courses)
export type CourseSchema = z.infer<typeof courseSchema>
export type CourseStatus = (typeof courseStatuses)[number]
