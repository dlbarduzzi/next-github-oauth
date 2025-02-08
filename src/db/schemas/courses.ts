import type { InferInsertModel, InferSelectModel } from "drizzle-orm"

import { text, pgTable, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core"

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

export type CourseSchema = InferSelectModel<typeof courses>
export type CreateCourseSchema = InferInsertModel<typeof courses>

export type CourseStatus = (typeof courseStatuses)[number]
