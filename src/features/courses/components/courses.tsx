"use client"

import { useGetCourses } from "@/features/courses/hooks/courses"

export function Courses() {
  const courses = useGetCourses({ enabled: true })

  if (courses.isLoading) {
    return <div>Loading...</div>
  }

  if (courses.isError) {
    return <div>An error occurred while getting courses!</div>
  }

  if (!courses.isSuccess || !courses.data.ok) {
    return <div>An error occurred while getting courses!</div>
  }

  return (
    <div className="max-w-3xl rounded-md bg-gray-100 px-5 py-4 text-sm">
      <h1 className="font-bold text-black">Courses</h1>
      <pre className="pt-3">{JSON.stringify(courses.data.data, null, 2)}</pre>
    </div>
  )
}
